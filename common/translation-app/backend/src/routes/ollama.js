const { ollamaConfig } = require("../config/config");
const fsUtils = require("../utils/fsUtils");
const { Ollama } = require("ollama");
const { verifyOllamaConnection, withTimeout } = require("../utils/ollamaUtils");

// Add debugger to help diagnose connection issues
const DEBUG = true;
function debug(...args) {
  if (DEBUG) console.log("[OLLAMA DEBUG]", ...args);
}

// Active project translation jobs: jobId -> { cancelled: boolean }
const activeJobs = new Map();

/**
 * Ollama integration route handler
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Route options
 */
async function routes(fastify, options) {
  // Get available models from Ollama
  fastify.get("/models", async (request, reply) => {
    try {
      debug(`Attempting to connect to Ollama API at: ${ollamaConfig.apiUrl}`);

      // First verify connection using standard fetch
      const isConnected = await verifyOllamaConnection();
      if (!isConnected) {
        return reply.code(503).send({
          success: false,
          error: "Ollama service is unavailable",
          details: "Connection to Ollama API failed",
        });
      }

      debug("Creating ollama client");

      // Create a new Ollama client instance
      const ollamaClient = new Ollama({ host: ollamaConfig.apiUrl });

      debug("Ollama client created, requesting models list");
      // Get models using ollama client with error handling
      try {
        const { models } = await ollamaClient.list();
        debug(`Successfully retrieved ${models?.length || 0} models`);
        return { success: true, data: models || [] };
      } catch (clientError) {
        debug(`Ollama client error: ${clientError.message}`);

        // Fallback to direct fetch if client fails
        debug("Falling back to direct fetch API call");
        const response = await fetch(`${ollamaConfig.apiUrl}/api/tags`);
        const data = await response.json();
        return { success: true, data: data.models || [] };
      }
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        success: false,
        error: "Failed to connect to Ollama API",
        details: error.message,
      });
    }
  });

  // Validate translations using LLM
  fastify.post("/validate/translation", async (request, reply) => {
    try {
      const {
        projectName,
        sourceLanguage,
        targetLanguage,
        namespace,
        key,
        sourceText,
        targetText,
        model,
      } = request.body;

      if (!model) {
        return reply
          .code(400)
          .send({ success: false, error: "Model is required" });
      }

      if (!sourceText || !targetText) {
        return reply.code(400).send({
          success: false,
          error: "Source and target texts are required",
        });
      }

      // Send notification that validation is starting
      fastify.io.emit("validation:started", {
        projectName,
        targetLanguage,
        namespace,
        key,
      });

      // Validate with Ollama
      const result = await validateTranslation(
        sourceText,
        targetText,
        sourceLanguage,
        targetLanguage,
        model,
      );

      // Send notification that validation is completed
      fastify.io.emit("validation:completed", {
        projectName,
        targetLanguage,
        namespace,
        key,
        result,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        success: false,
        error: "Failed to validate translation",
        details: error.message,
      });
    }
  });

  // Validate multiple translations in a namespace
  fastify.post("/validate/namespace", async (request, reply) => {
    try {
      const {
        projectName,
        sourceLanguage,
        targetLanguage,
        namespace,
        model,
        maxKeys = 10, // Limit the number of keys to validate to avoid overloading
      } = request.body;

      if (!model) {
        return reply
          .code(400)
          .send({ success: false, error: "Model is required" });
      }

      // Get source and target translations
      const sourceTranslations = await fsUtils.readTranslationFile(
        projectName,
        sourceLanguage,
        namespace,
      );

      const targetTranslations = await fsUtils.readTranslationFile(
        projectName,
        targetLanguage,
        namespace,
      );

      if (!sourceTranslations) {
        return reply.code(404).send({
          success: false,
          error: "Source translation file not found",
        });
      }

      if (!targetTranslations) {
        return reply.code(404).send({
          success: false,
          error: "Target translation file not found",
        });
      }

      // Flatten the translations for easier processing
      const flattenedSource = flattenObject(sourceTranslations);
      const flattenedTarget = flattenObject(targetTranslations);

      // Select keys that exist in both source and target
      const keysToValidate = Object.keys(flattenedSource)
        .filter(
          (key) =>
            key in flattenedTarget &&
            typeof flattenedSource[key] === "string" &&
            typeof flattenedTarget[key] === "string" &&
            flattenedSource[key] &&
            flattenedTarget[key],
        )
        .slice(0, maxKeys);

      // Track overall progress
      const totalKeys = keysToValidate.length;
      let completedKeys = 0;

      // Send notification that validation is starting
      fastify.io.emit("validation:batch:started", {
        projectName,
        namespace,
        sourceLanguage,
        targetLanguage,
        total: totalKeys,
      });

      // Create a promise for each key validation
      const results = {};

      // Process keys sequentially to avoid overwhelming the LLM service
      for (const key of keysToValidate) {
        try {
          const sourceText = flattenedSource[key];
          const targetText = flattenedTarget[key];

          // Validate the translation
          const validationResult = await validateTranslation(
            sourceText,
            targetText,
            sourceLanguage,
            targetLanguage,
            model,
          );

          results[key] = validationResult;

          // Update progress
          completedKeys++;
          fastify.io.emit("validation:batch:progress", {
            projectName,
            namespace,
            sourceLanguage,
            targetLanguage,
            progress: completedKeys,
            total: totalKeys,
            currentKey: key,
          });
        } catch (error) {
          console.error(`Error validating ${key}:`, error);
          results[key] = {
            isValid: false,
            errors: [{ message: `Validation failed: ${error.message}` }],
            suggestions: [],
          };

          // Update progress even when error occurs
          completedKeys++;
          fastify.io.emit("validation:batch:progress", {
            projectName,
            namespace,
            sourceLanguage,
            targetLanguage,
            progress: completedKeys,
            total: totalKeys,
            currentKey: key,
            error: error.message,
          });
        }
      }

      // Send notification that validation is completed
      fastify.io.emit("validation:batch:completed", {
        projectName,
        namespace,
        sourceLanguage,
        targetLanguage,
        total: totalKeys,
        completed: completedKeys,
      });

      return {
        success: true,
        data: {
          results,
          stats: {
            total: totalKeys,
            completed: completedKeys,
            valid: Object.values(results).filter((r) => r.isValid).length,
            invalid: Object.values(results).filter((r) => !r.isValid).length,
          },
        },
      };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        success: false,
        error: "Failed to validate namespace translations",
        details: error.message,
      });
    }
  });

  // Translate a single key
  fastify.post("/translate/key", async (request, reply) => {
    try {
      const {
        projectName,
        sourceLanguage,
        targetLanguage,
        namespace,
        key,
        model,
      } = request.body;

      if (!model) {
        return reply
          .code(400)
          .send({ success: false, error: "Model is required" });
      }

      // Get source text from the source language file
      const sourceTranslations = await fsUtils.readTranslationFile(
        projectName,
        sourceLanguage,
        namespace,
      );

      if (!sourceTranslations) {
        return reply
          .code(404)
          .send({ success: false, error: "Source translation file not found" });
      }

      // Extract source text from the key path
      const keyParts = key.split(".");
      let sourceText = sourceTranslations;
      for (const part of keyParts) {
        if (!sourceText[part]) {
          return reply.code(404).send({
            success: false,
            error: `Key "${key}" not found in source`,
          });
        }
        sourceText = sourceText[part];
      }

      if (typeof sourceText !== "string") {
        return reply
          .code(400)
          .send({ success: false, error: "Source text is not a string" });
      }

      // Send notification that translation is starting
      fastify.io.emit("translation:started", {
        projectName,
        targetLanguage,
        namespace,
        key,
      });

      // Translate with Ollama
      const keyContext = await readKeyContext(projectName, namespace, key);
      const debugEmit = (event, data) =>
        fastify.io.emit(event, { namespace, key, targetLanguage, ...data });
      const translatedText = await translateText(
        sourceText,
        sourceLanguage,
        targetLanguage,
        model,
        keyContext,
        debugEmit,
      );

      // Model declined to translate (NO_TRANSLATION) — fall back to source text
      const finalText = translatedText ?? sourceText;

      // Update the translation file
      const targetTranslations =
        (await fsUtils.readTranslationFile(
          projectName,
          targetLanguage,
          namespace,
        )) || {};

      // Update the key in the target translations
      let current = targetTranslations;
      for (let i = 0; i < keyParts.length - 1; i++) {
        const part = keyParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }

      const finalKey = keyParts[keyParts.length - 1];
      current[finalKey] = finalText;

      // Save the updated translation file
      const success = await fsUtils.writeTranslationFile(
        projectName,
        targetLanguage,
        namespace,
        targetTranslations,
      );

      if (!success) {
        return reply
          .code(500)
          .send({ success: false, error: "Failed to update translation file" });
      }

      // Send notification that translation is completed
      fastify.io.emit("translation:completed", {
        projectName,
        targetLanguage,
        namespace,
        key,
        value: finalText,
      });

      return {
        success: true,
        data: {
          sourceText,
          translatedText: finalText,
        },
      };
    } catch (error) {
      request.log.error(error);

      return reply.code(500).send({
        success: false,
        error: "Translation failed",
        details: error.message,
      });
    }
  });

  // Batch translate all keys in a namespace
  fastify.post("/translate/namespace", async (request, reply) => {
    try {
      const { projectName, sourceLanguage, targetLanguage, namespace, model } =
        request.body;

      if (!model) {
        return reply
          .code(400)
          .send({ success: false, error: "Model is required" });
      }

      // Get source translations
      const sourceTranslations = await fsUtils.readTranslationFile(
        projectName,
        sourceLanguage,
        namespace,
      );

      if (!sourceTranslations) {
        return reply
          .code(404)
          .send({ success: false, error: "Source translation file not found" });
      }

      // Get or create target translations
      let targetTranslations =
        (await fsUtils.readTranslationFile(
          projectName,
          targetLanguage,
          namespace,
        )) || {};

      // Start translation process asynchronously
      reply.send({
        success: true,
        message: "Batch translation started",
        data: {
          totalKeys: countStringValues(sourceTranslations),
        },
      });

      // Notify clients that batch translation started
      fastify.io.emit("batch-translation:started", {
        projectName,
        targetLanguage,
        namespace,
        totalKeys: countStringValues(sourceTranslations),
      });

      // Use a helper function to translate nested keys
      await translateNestedKeys(
        fastify,
        projectName,
        sourceLanguage,
        targetLanguage,
        namespace,
        sourceTranslations,
        targetTranslations,
        model,
        "", // Start with empty key prefix
        0, // Start counter at 0
      );

      // Save the final translations
      let ok = await fsUtils.writeTranslationFile(
        projectName,
        targetLanguage,
        namespace,
        targetTranslations,
      );

      if (!ok) {
        throw new Error("Failed to save translated namespace file");
      }

      // Notify clients that batch translation is completed
      fastify.io.emit("batch-translation:completed", {
        projectName,
        targetLanguage,
        namespace,
      });
    } catch (error) {
      request.log.error(error);
      fastify.io.emit("batch-translation:error", {
        error: "Batch translation failed",
        details: error.message,
      });
    }
  });

  // Translate all untranslated keys in every namespace of a project
  fastify.post("/translate/project", async (request, reply) => {
    const { projectName, sourceLanguage, targetLanguage, model, jobId } =
      request.body;

    if (!model || !jobId) {
      return reply
        .code(400)
        .send({ success: false, error: "model and jobId are required" });
    }

    // Resolve target languages: "all" expands to every non-source language
    let targetLanguages;
    if (targetLanguage === "all") {
      try {
        const allLangs = await fsUtils.getAvailableLanguages(projectName);
        targetLanguages = allLangs.filter((l) => l !== sourceLanguage);
      } catch (err) {
        return reply
          .code(404)
          .send({ success: false, error: "Project not found" });
      }
    } else {
      targetLanguages = [targetLanguage];
    }

    // Get all namespaces for the source language
    let namespaces;
    try {
      namespaces = await fsUtils.getNamespaces(projectName, sourceLanguage);
    } catch (err) {
      return reply
        .code(404)
        .send({ success: false, error: "Project or language not found" });
    }

    if (!namespaces || namespaces.length === 0) {
      return reply
        .code(404)
        .send({
          success: false,
          error: "No namespaces found for this project",
        });
    }

    // Pre-load source translations once, then build per-language queues
    const sourceByNamespace = {};
    for (const namespace of namespaces) {
      const src = await fsUtils.readTranslationFile(
        projectName,
        sourceLanguage,
        namespace,
      );
      if (src) sourceByNamespace[namespace] = src;
    }

    // Count total keys across all languages
    let totalKeys = 0;
    const langQueues = {};
    for (const lang of targetLanguages) {
      const queue = [];
      for (const namespace of namespaces) {
        const src = sourceByNamespace[namespace];
        if (!src) continue;

        const tgt =
          (await fsUtils.readTranslationFile(projectName, lang, namespace)) ||
          {};
        const flatSrc = flattenObject(src);
        const flatTgt = flattenObject(tgt);
        const missingKeys = Object.keys(flatSrc).filter(
          (k) => typeof flatSrc[k] === "string" && !flatTgt[k],
        );

        if (missingKeys.length > 0) {
          queue.push({
            namespace,
            sourceTranslations: src,
            targetTranslations: tgt,
            missingKeys,
          });
          totalKeys += missingKeys.length;
        }
      }
      langQueues[lang] = queue;
    }

    // Register job and respond immediately
    activeJobs.set(jobId, { cancelled: false });

    reply.send({
      success: true,
      message: "Project translation started",
      data: { jobId, totalKeys, languageCount: targetLanguages.length },
    });

    fastify.io.emit("project-translation:started", {
      jobId,
      projectName,
      targetLanguage,
      targetLanguages,
      totalKeys,
      languageCount: targetLanguages.length,
    });

    let completedKeys = 0;

    try {
      for (const lang of targetLanguages) {
        if (activeJobs.get(jobId)?.cancelled) break;

        fastify.io.emit("project-translation:language-start", {
          jobId,
          projectName,
          currentLanguage: lang,
          totalKeys,
        });

        for (const {
          namespace,
          sourceTranslations,
          targetTranslations,
          missingKeys,
        } of langQueues[lang]) {
          if (activeJobs.get(jobId)?.cancelled) break;

          fastify.io.emit("project-translation:namespace-start", {
            jobId,
            projectName,
            currentLanguage: lang,
            namespace,
            namespaceKeys: missingKeys.length,
          });

          for (const keyPath of missingKeys) {
            if (activeJobs.get(jobId)?.cancelled) break;

            const keyParts = keyPath.split(".");
            let sourceText = sourceTranslations;
            for (const part of keyParts) {
              sourceText = sourceText?.[part];
            }
            if (typeof sourceText !== "string") continue;

            try {
              const keyContext = await readKeyContext(projectName, namespace, keyPath);
              const debugEmit = (event, data) =>
                fastify.io.emit(event, { jobId, namespace, key: keyPath, targetLanguage: lang, ...data });
              const translatedText = await translateText(
                sourceText,
                sourceLanguage,
                lang,
                model,
                keyContext,
                debugEmit,
              );

              let cursor = targetTranslations;
              for (let i = 0; i < keyParts.length - 1; i++) {
                if (!cursor[keyParts[i]]) cursor[keyParts[i]] = {};
                cursor = cursor[keyParts[i]];
              }
              cursor[keyParts[keyParts.length - 1]] = translatedText;

              completedKeys++;
              fastify.io.emit("project-translation:progress", {
                jobId,
                projectName,
                currentLanguage: lang,
                namespace,
                currentKey: keyPath,
                completedKeys,
                totalKeys,
              });
            } catch (err) {
              fastify.log.error(
                `project-translation: failed on ${lang}/${namespace}/${keyPath}: ${err.message}`,
              );
            }
          }

          await fsUtils.writeTranslationFile(
            projectName,
            lang,
            namespace,
            targetTranslations,
          );
        }
      }

      const wasCancelled = activeJobs.get(jobId)?.cancelled;
      activeJobs.delete(jobId);

      if (wasCancelled) {
        fastify.io.emit("project-translation:stopped", {
          jobId,
          projectName,
          completedKeys,
          totalKeys,
        });
      } else {
        fastify.io.emit("project-translation:completed", {
          jobId,
          projectName,
          completedKeys,
          totalKeys,
        });
      }
    } catch (error) {
      activeJobs.delete(jobId);
      fastify.log.error(error);
      fastify.io.emit("project-translation:error", {
        jobId,
        projectName,
        error: error.message,
      });
    }
  });

  // Stop an active project translation
  fastify.post("/translate/project/stop", async (request, reply) => {
    const { jobId } = request.body;

    if (!jobId) {
      return reply
        .code(400)
        .send({ success: false, error: "jobId is required" });
    }

    const job = activeJobs.get(jobId);
    if (job) {
      job.cancelled = true;
    }

    return { success: true };
  });
}

/**
 * Recursive function to translate all nested keys
 */
async function translateNestedKeys(
  fastify,
  projectName,
  sourceLanguage,
  targetLanguage,
  namespace,
  sourceObj,
  targetObj,
  model,
  prefix,
  counter,
) {
  for (const [key, value] of Object.entries(sourceObj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string" && value.trim()) {
      // Update counter and notify clients of progress
      counter++;
      fastify.io.emit("batch-translation:progress", {
        projectName,
        targetLanguage,
        namespace,
        currentKey: fullKey,
        counter,
      });

      try {
        // Translate the text
        const keyContext = await readKeyContext(projectName, namespace, fullKey);
        const translatedText = await translateText(
          value,
          sourceLanguage,
          targetLanguage,
          model,
          keyContext,
        );

        // Set the translated text in the target object
        let current = targetObj;
        const keyParts = fullKey.split(".");

        for (let i = 0; i < keyParts.length - 1; i++) {
          const part = keyParts[i];
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }

        const finalKey = keyParts[keyParts.length - 1];
        current[finalKey] = translatedText;
      } catch (error) {
        fastify.log.error(
          `Failed to translate key ${fullKey}: ${error.message}`,
        );
        // Continue with other keys even if one fails
      }
    } else if (typeof value === "object" && value !== null) {
      // Ensure target has this key as an object
      if (!targetObj[key] || typeof targetObj[key] !== "object") {
        targetObj[key] = {};
      }

      // Recursively translate nested object
      counter = await translateNestedKeys(
        fastify,
        projectName,
        sourceLanguage,
        targetLanguage,
        namespace,
        value,
        targetObj[key],
        model,
        fullKey,
        counter,
      );
    }
  }

  return counter;
}

/**
 * Count string values in a nested object
 */
function countStringValues(obj) {
  let count = 0;

  for (const [, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      count++;
    } else if (typeof value === "object" && value !== null) {
      count += countStringValues(value);
    }
  }

  return count;
}

/**
 * Get a human-readable language name from language code
 */
function getLanguageName(code) {
  // Language mapping based on DocSpace translations
  const languageMap = {
    en: "English",
    "en-GB": "English (United Kingdom)",
    "en-US": "English (United States)",
    fr: "French",
    de: "German",
    "de-CH": "German (Switzerland)",
    es: "Spanish",
    "es-MX": "Spanish (Mexico)",
    it: "Italian",
    pt: "Portuguese",
    "pt-BR": "Portuguese (Brazil)",
    ru: "Russian",
    zh: "Chinese",
    "zh-CN": "Chinese (Simplified)",
    ja: "Japanese",
    "ja-JP": "Japanese",
    ko: "Korean",
    "ko-KR": "Korean",
    ar: "Arabic",
    "ar-SA": "Arabic (Saudi Arabia)",
    tr: "Turkish",
    pl: "Polish",
    nl: "Dutch",
    cs: "Czech",
    sk: "Slovak",
    bg: "Bulgarian",
    az: "Azerbaijani",
    "el-GR": "Greek",
    fi: "Finnish",
    "hy-AM": "Armenian",
    "lo-LA": "Lao",
    lv: "Latvian",
    ro: "Romanian",
    si: "Sinhala",
    sl: "Slovenian",
    "sq-AL": "Albanian",
    "sr-Cyrl-RS": "Serbian (Cyrillic)",
    "sr-Latn-RS": "Serbian (Latin)",
    "uk-UA": "Ukrainian",
    vi: "Vietnamese",
  };

  return languageMap[code] || code.toUpperCase();
}

/**
 * Get language information for translation context
 */
function getLanguageInfo(code) {
  // List of RTL languages
  const rtlLanguages = ["ar", "he", "fa", "ur"];
  const isRtl = rtlLanguages.some((rtlCode) => code.startsWith(rtlCode));

  // Languages that require explicit script enforcement in the prompt.
  // Without this, LLMs tend to produce the wrong writing system
  // (e.g. translating sr-Cyrl-RS into Serbian Latin instead of Cyrillic).
  const scriptWarnings = {
    "sr-Cyrl-RS":
      "Use CYRILLIC script exclusively. Every Serbian word MUST be written in Cyrillic letters (А, Б, В, Г, Д, Е...). " +
      "NEVER use Latin Serbian characters: š, č, ć, ž, đ or any Latin letters for Serbian words. " +
      "The only Latin characters allowed are: brand names, technical abbreviations (URL, API, SDK, etc.), and {{variables}}. " +
      "Example — correct: «Жао нам је», wrong: «Žao nam je».",
  };

  return {
    code,
    name: getLanguageName(code),
    isRightToLeft: isRtl,
    scriptWarning: scriptWarnings[code] || null,
  };
}

/**
 * Read the AI comment and usage context for a key from its .meta file.
 * Returns null if no metadata exists.
 */
async function readKeyContext(projectName, namespace, keyPath) {
  try {
    const metadata = await fsUtils.findMetadataFile(projectName, namespace, keyPath);
    if (!metadata?.data) return null;

    const comment = metadata.data.comment?.text || null;
    const usages = (metadata.data.usage || [])
      .slice(0, 3) // limit to 3 usage examples to keep prompt concise
      .map((u) => u.context?.trim())
      .filter(Boolean);

    if (!comment && usages.length === 0) return null;
    return { comment, usages };
  } catch {
    return null;
  }
}

/**
 * Translate text using Ollama API
 * @param {string} text - Source text to translate
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @param {string} model - Ollama model name
 * @param {object|null} keyContext - Optional key metadata (comment, usages)
 * @param {function|null} debugEmit - Optional callback(event, data) for real-time debug streaming
 */
async function translateText(text, sourceLanguage, targetLanguage, model, keyContext = null, debugEmit = null) {
  // Get language information for better translation context
  const sourceInfo = getLanguageInfo(sourceLanguage);
  const targetInfo = getLanguageInfo(targetLanguage);

  // Create a more detailed prompt with language information
  //     const prompt = `Translate the following text from ${sourceInfo.name} to ${targetInfo.name}.
  // ${targetInfo.isRightToLeft ? 'Note that the target language is written right-to-left.' : ''}
  // Please maintain any formatting, placeholders (like {{variable}}), and HTML tags if present.
  // Return only the translated text without any commentary or explanations.\n\n${text}`;

  const systemPrompt = `You are a professional software localization specialist for ONLYOFFICE DocSpace, a document collaboration platform.
Your task is to translate UI strings from ${sourceInfo.name} to ${targetInfo.name}.
${targetInfo.isRightToLeft ? "The target language is written right-to-left (RTL).\n" : ""}${targetInfo.scriptWarning ? `CRITICAL SCRIPT REQUIREMENT: ${targetInfo.scriptWarning}\n` : ""}
Rules:

## i18next interpolation variables {{...}}
- CRITICAL: Every {{variable}} from the source MUST appear in the translation. Count them — the translation must contain exactly the same number of {{...}} tokens as the source.
- Copy each {{variable}} token verbatim — same spelling, same case, same braces. NEVER translate the name inside the braces. NEVER convert to a different format.
  ✓ Correct:   {{webSearch}}   {{productName}}   {{currency}}
  ✗ Wrong:     <webSearch>     {$productName}     {{valūta}}   (translated name — forbidden)
- When a {{variable}} starts the sentence in the source, keep it at the start of the translation too. Do NOT drop it or absorb it into the translated text.
  ✓ Source:  "{{webSearch}} successfully enabled"
  ✓ Translation must begin with {{webSearch}}, e.g. "{{webSearch}} pomyślnie włączony"
  ✗ Wrong:   "pomyślnie włączony"  (variable dropped — forbidden)
- Modifiers after comma are part of the token and must be preserved: {{count, number}} stays as {{count, number}}.

## Numbered React Trans tags <N> </N>
- Numbered tags like <0>, <1>, </0>, </1> are React component slots. Every opening tag <N> from the source must have a matching closing tag </N> in the translation, and vice versa.
- Translate only the text between opening and closing tags. Place </N> right after the translated content for that slot — do not extend the tag to cover more of the sentence.
  ✓ "Click <1>here</1> to continue" → "Klicken Sie <1>hier</1>, um fortzufahren"
  ✗ "Klicken Sie <1>hier, um fortzufahren</1>"  (closing tag moved — forbidden)
  ✗ "Klicken Sie hier, um fortzufahren"          (tags dropped — forbidden)
- Never drop, merge, reorder, or add numbered tags.

## Other HTML tags
- Copy all HTML tags character-for-character — exact tag name, exact attributes (including their order and values), exact punctuation. Do NOT add, remove, or alter any attribute. Do NOT change the spelling of a tag name.
  ✓ <strong>text</strong>  →  <strong>переведённый текст</strong>
  ✗ <strongs>text</strongs>         (typo in tag name — forbidden)
  ✗ <strong id="foo">text</strong>  (added attribute — forbidden)
- Never replace a tag with whitespace or punctuation.
  ✓ "First line.<br/>Second line." → "Первая строка.<br/>Вторая строка."
  ✗ "Первая строка. Вторая строка."  (tag removed — forbidden)

## General
- Use formal/professional tone appropriate for business software UI.
- Preserve line breaks and whitespace structure.
- Respond with the translation only — no explanations, notes, or alternatives.
- If the string is a proper noun, brand name, or technical term with no equivalent, keep it in the original language.
- If translation is impossible, respond with exactly: NO_TRANSLATION`;

  let userPrompt = text;
  if (keyContext?.comment) {
    userPrompt = `Context: ${keyContext.comment}\n\nTranslate:\n${text}`;
  }

  try {
    // First verify Ollama connection
    const isConnected = await verifyOllamaConnection();
    if (!isConnected) {
      throw new Error("Ollama service is unavailable");
    }

    // Configure Ollama API settings
    debug(
      `Connecting to Ollama API at: ${ollamaConfig.apiUrl} for translation`,
    );
    debug(`Using model: ${model}`);
    debug(
      `Translating text of length ${text.length} from ${sourceInfo.name} (${sourceLanguage}) to ${targetInfo.name} (${targetLanguage})`,
    );

    // Generate translation using streaming with two-phase timeouts:
    //   Phase 1 — "first token": reasoning models (gemma4, qwen3, deepseek-r1) think silently
    //             for minutes before emitting any output. We wait up to firstTokenTimeout.
    //   Phase 2 — "inactivity": once tokens are flowing, a short gap means a stall/disconnect.
    debug(`System prompt:\n${systemPrompt}\n\nUser prompt:\n${userPrompt}\n`);
    debug("Sending translation request (streaming)...");

    // Emit prompts to UI debug panel before streaming starts
    debugEmit?.("translation:debug:prompt", { systemPrompt, userPrompt, targetLanguage, sourceLanguage });

    // Use raw fetch → /api/chat to completely bypass the Ollama JS library.
    // Gives us full control over timeouts via AbortController.
    debug("Step 1: sending fetch to /api/chat...");
    const abortController = new AbortController();
    let activeTimeout = setTimeout(
      () => abortController.abort(new Error(`First-token timeout after ${ollamaConfig.firstTokenTimeout}ms — model may still be loading or thinking`)),
      ollamaConfig.firstTokenTimeout,
    );
    const resetInactivityTimer = () => {
      clearTimeout(activeTimeout);
      activeTimeout = setTimeout(
        () => abortController.abort(new Error(`Inactivity timeout after ${ollamaConfig.inactivityTimeout}ms`)),
        ollamaConfig.inactivityTimeout,
      );
    };

    let fullResponse = "";
    let fullThinking = ""; // collects native message.thinking tokens
    try {
      const httpResponse = await fetch(`${ollamaConfig.apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          stream: true,
          think: true, // Enable native Ollama thinking output (supported by gemma4, qwen3, deepseek-r1, etc.)
          options: {
            temperature: 0.1, // 0 causes infinite thinking loops in reasoning models
          },
        }),
        signal: abortController.signal,
      });

      debug(`Step 2: HTTP ${httpResponse.status}, reading stream...`);

      if (!httpResponse.ok) {
        throw new Error(`Ollama HTTP error: ${httpResponse.status} ${httpResponse.statusText}`);
      }

      const reader = httpResponse.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let tokenCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);

            // Ollama native thinking field (gemma4, qwen3, deepseek-r1 with think:true).
            // Present only during the thinking phase; content is empty at the same time.
            const thinkingToken = data.message?.thinking ?? "";
            if (thinkingToken) {
              if (tokenCount === 0) debug("Step 3: first thinking token received");
              tokenCount++;
              fullThinking += thinkingToken;
              resetInactivityTimer();
              debugEmit?.("translation:debug:token", { token: thinkingToken, isThinking: true });
            }

            const token = data.message?.content ?? "";
            if (token) {
              if (tokenCount === 0) debug("Step 3: first token received");
              tokenCount++;
              fullResponse += token;
              resetInactivityTimer(); // got a token — extend the deadline

              // Also handle <think> tags for models that inline thinking in content
              const isInlineThinking = (() => {
                const openCount = (fullResponse.match(/<think>/gi) || []).length;
                const closeCount = (fullResponse.match(/<\/think>/gi) || []).length;
                return openCount > closeCount;
              })();
              debugEmit?.("translation:debug:token", { token, isThinking: isInlineThinking });
            }
          } catch {
            // skip malformed NDJSON lines
          }
        }
      }
      debug(`Step 4: stream done, ${tokenCount} tokens collected`);
    } finally {
      clearTimeout(activeTimeout);
    }

    debug(`Raw model response:\n${fullResponse}\n`);

    // Collect thinking from both native field and inline <think> tags
    const thinkMatch = fullResponse.match(/<think>([\s\S]*?)<\/think>/i);
    const thinkingText = fullThinking || (thinkMatch ? thinkMatch[1].trim() : null);
    if (thinkingText) {
      debug(`Model thinking:\n${thinkingText}`);
    }

    // Strip thinking tokens — both complete blocks and truncated ones (hit num_predict limit)
    const cleanedResponse = fullResponse
      .replace(/<think>[\s\S]*?<\/think>/gi, "") // complete: <think>...</think>
      .replace(/<think>[\s\S]*/gi, "")            // incomplete: <think>... (no closing tag)
      .trim();

    debug(`Cleaned response:\n${cleanedResponse}\n`);

    // Emit final result to UI debug panel
    debugEmit?.("translation:debug:result", {
      result: cleanedResponse,
      thinkingText: thinkingText ?? null,
    });

    if (cleanedResponse === "NO_TRANSLATION") {
      return null; // model explicitly declined — caller should fall back to source text
    }

    if (!cleanedResponse) {
      throw new Error("Model returned empty response");
    }

    // Post-translation script validation for languages with strict script requirements.
    // Some models ignore the system prompt and produce the wrong writing system.
    // When that happens we issue one correction request before giving up.
    if (targetInfo.scriptWarning) {
      const corrected = await correctScriptIfNeeded(
        cleanedResponse,
        text,
        targetInfo,
        model,
      );
      return corrected;
    }

    return cleanedResponse;
  } catch (error) {
    debug("Translation error details:", {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,
      systemPrompt,
      userPrompt,
    });

    console.error("Translation error:", error);
    throw error;
  }
}

/**
 * Script validators: return true if the translation looks correct for the language.
 * Used after translation to decide whether a correction pass is needed.
 */
const scriptValidators = {
  "sr-Cyrl-RS": (text) => {
    // Strip {{variables}}, HTML tags, brand-name words (all-caps), and numbers
    // to focus only on the Serbian prose.
    const stripped = text
      .replace(/\{\{[^}]+\}\}/g, "")  // {{variables}}
      .replace(/<[^>]+>/g, "")         // HTML / React tags
      .replace(/\b[A-Z]{2,}\b/g, "")  // ALL-CAPS acronyms (URL, SDK, API…)
      .replace(/[0-9%.,]/g, "");

    // Latin Serbian diacritics are a sure sign of wrong script
    if (/[šŠčČćĆžŽđĐ]/.test(stripped)) return false;

    // If there are Latin letters in what remains, that's also wrong
    // (allow a–z only inside obvious loanwords — but for safety flag any Latin run ≥ 3 chars)
    if (/[a-zA-Z]{3,}/.test(stripped)) return false;

    return true;
  },
};

/**
 * After getting a translation, verify it uses the correct writing system.
 * If not, send one correction request to the model before giving up.
 */
async function correctScriptIfNeeded(translation, sourceText, targetInfo, model) {
  const validator = scriptValidators[targetInfo.code];
  if (!validator || validator(translation)) {
    return translation; // looks fine
  }

  debug(`[script-check] ${targetInfo.code}: wrong script detected, requesting correction`);

  const correctionPrompt = `The following text was supposed to be translated into ${targetInfo.name} but was written in the WRONG script (Latin instead of Cyrillic).

CRITICAL: ${targetInfo.scriptWarning}

Original source text:
${sourceText}

Wrong translation (DO NOT return this):
${translation}

Provide the corrected translation using ONLY the correct script. Return the translation text only — no explanations.`;

  const abortController = new AbortController();
  let inactivityTimer = setTimeout(
    () => abortController.abort(new Error(`Correction inactivity timeout`)),
    ollamaConfig.requestTimeout,
  );
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(
      () => abortController.abort(new Error(`Correction inactivity timeout`)),
      ollamaConfig.requestTimeout,
    );
  };

  let fullResponse = "";
  try {
    const httpResponse = await fetch(`${ollamaConfig.apiUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: correctionPrompt }],
        stream: true,
        options: { temperature: 0.1 },
      }),
      signal: abortController.signal,
    });

    if (!httpResponse.ok) {
      throw new Error(`Ollama HTTP error during correction: ${httpResponse.status}`);
    }

    const reader = httpResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          const token = data.message?.content ?? "";
          if (token) {
            fullResponse += token;
            resetInactivityTimer();
          }
        } catch {
          // skip malformed lines
        }
      }
    }
  } finally {
    clearTimeout(inactivityTimer);
  }

  const corrected = fullResponse
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<think>[\s\S]*/gi, "")
    .trim();

  debug(`[script-check] correction response:\n${corrected}`);

  if (!corrected || corrected === "NO_TRANSLATION") {
    debug(`[script-check] correction failed, returning null`);
    return null; // will stay untranslated — better than wrong-script text
  }

  if (!validator(corrected)) {
    debug(`[script-check] correction still wrong script, returning null`);
    return null;
  }

  return corrected;
}

/**
 * Helper to flatten a nested object with dot notation
 */
function flattenObject(obj, prefix = "", result = {}) {
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      flattenObject(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}

/**
 * Validate a translation using Ollama LLM
 */
async function validateTranslation(
  sourceText,
  targetText,
  sourceLanguage,
  targetLanguage,
  model,
) {
  try {
    // Get language information for better context
    const sourceInfo = getLanguageInfo(sourceLanguage);
    const targetInfo = getLanguageInfo(targetLanguage);

    // Verify Ollama connection
    const isConnected = await verifyOllamaConnection();
    if (!isConnected) {
      throw new Error("Ollama service is unavailable");
    }

    // Configure Ollama API
    debug(`Connecting to Ollama API at: ${ollamaConfig.apiUrl} for validation`);
    debug(`Using model: ${model}`);

    // Create Ollama client
    const ollamaClient = new Ollama({ host: ollamaConfig.apiUrl });

    // Generate validation using chat API with system role for better instruction following
    debug("Sending validation request...");

    const { message } = await withTimeout(
      ollamaClient.chat({
        model,
        messages: [
          {
            role: "system",
            content: `You are a professional software localization validator for ONLYOFFICE DocSpace UI strings.
Respond only with valid JSON. Never add markdown, explanations, or text outside the JSON object.`,
          },
          {
            role: "user",
            content: `Validate this UI string translation.

Source (${sourceInfo.name}): "${sourceText}"
Translation (${targetInfo.name}): "${targetText}"

Rules for validation:
- i18next patterns like {{variable}}, <N>text</N> must be preserved unchanged
- Proper nouns and brand names may remain untranslated — this is acceptable
- Evaluate meaning accuracy, grammar, and UI appropriateness

Respond with this JSON only:
{
  "isValid": true or false,
  "errors": [{ "type": "missing_content|mistranslation|grammar|style|cultural_context|placeholder_mismatch", "message": "description" }],
  "suggestions": ["corrected text if needed"],
  "rating": 1 to 5
}`,
          },
        ],
        stream: false,
        options: {
          temperature: 0, // Lower temperature for more consistent analysis
          num_ctx: 8192,
        },
      }),
      ollamaConfig.requestTimeout,
    );

    const response = message.content;

    // Parse the JSON response
    try {
      // Strip markdown code fences if present, then extract JSON object
      const cleaned = response
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid JSON format in response");
      }

      const jsonStr = jsonMatch[0];
      const result = JSON.parse(jsonStr);

      // Ensure the result has the expected structure
      return {
        isValid: Boolean(result.isValid),
        errors: Array.isArray(result.errors) ? result.errors : [],
        suggestions: Array.isArray(result.suggestions)
          ? result.suggestions
          : [],
        rating: Number(result.rating) || 0,
      };
    } catch (jsonError) {
      debug("Failed to parse LLM response as JSON:", jsonError);
      debug("Raw response:", response);

      // Fallback: create a structured response based on the text
      return {
        isValid: false,
        errors: [
          {
            type: "validation_error",
            message: "Failed to analyze translation",
          },
        ],
        suggestions: [],
        rating: 0,
        rawResponse: response.trim(),
      };
    }
  } catch (error) {
    debug("Validation error details:", {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,
    });
    console.error("Translation validation error:", error);
    throw error;
  }
}

module.exports = routes;

