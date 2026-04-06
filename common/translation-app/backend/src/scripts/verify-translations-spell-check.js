#!/usr/bin/env node
/**
 * Verify Language Translations and Update Spell Check Issues Metadata
 *
 * This script scans the locales directories, compares non-English translations with English ones,
 * and updates the ai_spell_check_issues field in the metadata files with issues found by Ollama.
 */
const fs = require("fs-extra");
const { writeJsonWithConsistentEol } = require("../utils/fsUtils");
const path = require("path");
const glob = require("glob");
const {
  appRootPath,
  projectLocalesMap,
  ollamaConfig,
} = require("../config/config");
const { Ollama } = require("ollama");
const { verifyOllamaConnection } = require("../utils/ollamaUtils");

const MODEL = process.env.OLLAMA_SPELLCHECK_MODEL || "gemma4:latest";
const LANGUAGES_TO_CHECK = process.argv[2] ? process.argv[2].split(",") : null;
const CHECKPOINT_FILE = path.join(appRootPath, "verification-checkpoint.json");

// Checkpoint data
let checkpoint = {
  lastProject: null,
  lastMetadataFile: null,
  lastLanguage: null,
  tsvFilename: null,
  processedKeys: new Set(),
};

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

/**
 * Load checkpoint from file
 * @returns {Object} Checkpoint data
 */
function loadCheckpoint() {
  try {
    if (fs.existsSync(CHECKPOINT_FILE)) {
      const data = fs.readFileSync(CHECKPOINT_FILE, "utf8");
      const loaded = JSON.parse(data);
      console.log(`📍 Loaded checkpoint from file`);
      console.log(`   Last project: ${loaded.lastProject || "none"}`);
      console.log(`   Last file: ${loaded.lastMetadataFile || "none"}`);
      console.log(`   Last language: ${loaded.lastLanguage || "none"}`);
      console.log(`   Processed keys: ${loaded.processedKeys?.length || 0}`);
      return {
        lastProject: loaded.lastProject,
        lastMetadataFile: loaded.lastMetadataFile,
        lastLanguage: loaded.lastLanguage,
        tsvFilename: loaded.tsvFilename,
        processedKeys: new Set(loaded.processedKeys || []),
      };
    }
  } catch (error) {
    console.warn(`⚠️  Failed to load checkpoint: ${error.message}`);
  }
  return {
    lastProject: null,
    lastMetadataFile: null,
    lastLanguage: null,
    tsvFilename: null,
    processedKeys: new Set(),
  };
}

/**
 * Save checkpoint to file
 */
function saveCheckpoint() {
  try {
    const data = {
      lastProject: checkpoint.lastProject,
      lastMetadataFile: checkpoint.lastMetadataFile,
      lastLanguage: checkpoint.lastLanguage,
      tsvFilename: checkpoint.tsvFilename,
      processedKeys: Array.from(checkpoint.processedKeys),
      timestamp: new Date().toISOString(),
    };
    fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error(`❌ Failed to save checkpoint: ${error.message}`);
  }
}

/**
 * Clear checkpoint file
 */
function clearCheckpoint() {
  try {
    if (fs.existsSync(CHECKPOINT_FILE)) {
      fs.unlinkSync(CHECKPOINT_FILE);
      console.log(`🗑️  Cleared checkpoint file`);
    }
  } catch (error) {
    console.error(`❌ Failed to clear checkpoint: ${error.message}`);
  }
}

/**
 * Verifies a translation against the English version using Ollama with retry mechanism
 * @param {string} keyPath - The key path
 * @param {string} englishContent - The English content
 * @param {string} translatedContent - The translated content
 * @param {string} language - The language code
 * @param {Object} progress - Progress tracking object with current, total, keyIndex, totalKeys
 * @returns {Promise<Array>} Array of identified issues
 */
async function verifyTranslation(
  keyPath,
  englishContent,
  translatedContent,
  language,
  progress = null,
) {
  // Skip if content is empty
  if (!englishContent || !translatedContent) {
    console.log(
      `Skipping verification for ${keyPath} in ${language}: insufficient data`,
    );
    return [];
  }

  const languageName = languageMap[language] || language;

  // Create prompt for Ollama
  const prompt = `
# Translation Verification Task

You are a translation quality checker for ONLYOFFICE DocSpace UI strings. Your ONLY task is to find CRITICAL translation errors.

## Content to verify:
- **English:** "${englishContent}"
- **${languageName}:** "${translatedContent}"

## Your task:
Check if the ${languageName} translation accurately conveys the SAME MEANING as the English text AND preserves all technical markup.

## Report ONLY these CRITICAL issues:
1. **incorrect_translation** - Translation has completely wrong or opposite meaning
2. **missing_content** - Important words or information are missing from the translation
3. **wrong_language** - Text is in the wrong language or wrong script (e.g. Latin used where Cyrillic is required)
4. **missing_variable** - One or more {{variable}} tokens from the English are absent or renamed in the translation
5. **missing_tag** - One or more React Trans tags (<0>, </0>, <1>, </1>, etc.) or HTML tags (<br/>, <strong>, etc.) are dropped, added, or altered

## Variable and tag rules (CRITICAL):
- Every {{variable}} in the English MUST appear in the translation with identical spelling and braces. Count them — the translation must contain exactly the same number.
- Every numbered React tag <N> / </N> must be present and matched in the translation.
- All HTML tags must be copied character-for-character (tag name, attributes, order).

## DO NOT report:
- Minor grammar improvements
- Style preferences
- Alternative wording that means the same thing
- Punctuation differences
- Capitalization differences
- Formal vs informal tone

## Response format:
Return a JSON array. Each issue must have:
- "type": One of: incorrect_translation, missing_content, wrong_language, missing_variable, missing_tag
- "description": Brief explanation of the critical error
- "suggestion": Corrected translation

If the translation correctly conveys the meaning and preserves all markup, return an empty array [].

**IMPORTANT:**
- Respond with ONLY the JSON array
- Be strict: only report CRITICAL errors that change meaning or break markup
- Do not escape [ ] brackets in strings
  `;

  // Retry configuration
  const maxRetries = 3;
  let retries = 0;
  let lastError = null;

  while (retries < maxRetries) {
    try {
      const keyProgressStr =
        progress && progress.keyIndex && progress.totalKeys
          ? `[${progress.keyIndex}/${progress.totalKeys}] `
          : "";
      const langProgressStr = progress
        ? ` [${progress.current}/${progress.total}]`
        : "";
      const retryStr =
        retries > 0 ? ` (attempt ${retries + 1}/${maxRetries})` : "";
      console.log(
        `${keyProgressStr}Verifying translation for ${keyPath} in ${language}${langProgressStr}${retryStr}`,
      );

      // Call Ollama API with streaming + thinking output
      const ollamaClient = new Ollama({ host: ollamaConfig.apiUrl });
      let activeTimeout = null;
      const resetInactivityTimer = (stream) => {
        clearTimeout(activeTimeout);
        activeTimeout = setTimeout(() => {
          stream.abort();
        }, ollamaConfig.inactivityTimeout);
      };

      let fullResponse = "";
      let fullThinking = "";
      let tokenCount = 0;

      const stream = await ollamaClient.generate({
        model: MODEL,
        prompt: prompt,
        stream: true,
        think: true,
        options: {
          temperature: 0.1,
          num_predict: 8192,
        },
      });

      // First-token timeout: abort if model doesn't respond at all
      activeTimeout = setTimeout(() => {
        stream.abort();
      }, ollamaConfig.firstTokenTimeout);

      let thinkingStarted = false;
      let responseStarted = false;

      try {
        for await (const chunk of stream) {
          const thinkingToken = chunk.thinking ?? "";
          if (thinkingToken) {
            if (!thinkingStarted) {
              process.stdout.write("  [think] ");
              thinkingStarted = true;
            }
            tokenCount++;
            fullThinking += thinkingToken;
            process.stdout.write(thinkingToken);
            resetInactivityTimer(stream);
          }

          const token = chunk.response ?? "";
          if (token) {
            if (!responseStarted) {
              if (thinkingStarted) process.stdout.write("\n");
              process.stdout.write("  [response] ");
              responseStarted = true;
            }
            tokenCount++;
            fullResponse += token;
            process.stdout.write(token);
            resetInactivityTimer(stream);
          }
        }
        if (thinkingStarted || responseStarted) process.stdout.write("\n");
      } finally {
        clearTimeout(activeTimeout);
      }

      // Parse the response
      if (fullResponse) {
        const responseText = fullResponse.trim();
        try {
          // Check if response is wrapped in markdown code blocks and extract the JSON
          let jsonText = responseText;

          // Remove markdown code blocks if present
          // Handle both ```json and ``` variants
          if (jsonText.startsWith("```")) {
            // Find the first newline after opening ```
            const firstNewline = jsonText.indexOf("\n");
            if (firstNewline !== -1) {
              jsonText = jsonText.substring(firstNewline + 1);
            }
            // Remove closing ```
            const lastBackticks = jsonText.lastIndexOf("```");
            if (lastBackticks !== -1) {
              jsonText = jsonText.substring(0, lastBackticks);
            }
            jsonText = jsonText.trim();
          }

          // Check if response is truncated or corrupted
          if (jsonText.includes(">]>]>]>]") || jsonText.length > 10000) {
            console.warn(
              `Corrupted or truncated response for ${keyPath} in ${language}, skipping`,
            );
            return [];
          }

          // Clean up common JSON issues from LLM responses
          // Fix improperly escaped brackets in strings
          jsonText = jsonText.replace(/\\\[/g, "[").replace(/\\\]/g, "]");

          // Try to parse as JSON
          const issues = JSON.parse(jsonText);
          if (Array.isArray(issues)) {
            if (issues.length === 0) {
              console.log(`  ✓ OK`);
            } else {
              console.log(`  ✗ ${issues.length} issue(s): ${issues.map((i) => i.type).join(", ")}`);
            }
            return issues;
          } else {
            console.warn(
              `Unexpected response format for ${keyPath} in ${language}: not an array`,
            );
            return [];
          }
        } catch (parseError) {
          console.warn(
            `Failed to parse Ollama response as JSON for ${keyPath} in ${language}: ${parseError.message}`,
          );
          console.warn(`Response was: ${responseText.substring(0, 500)}...`);
          return [];
        }
      } else {
        throw new Error(
          `Unexpected Ollama response format: ${JSON.stringify(response)}`,
        );
      }
    } catch (error) {
      lastError = error;
      retries++;

      // Log the error
      console.error(
        `Error calling Ollama (attempt ${retries}/${maxRetries}):`,
        error.message,
      );

      // If it's a socket hang up or timeout, wait before retrying
      if (
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT" ||
        error.message.includes("socket hang up") ||
        error.message.includes("timeout")
      ) {
        console.log(
          `Network error detected. Waiting before retry... ${error.message}`,
        );
        console.log(
          `ollama api url: '${ollamaConfig.apiUrl}' model: '${MODEL}'`,
        );
        // Wait for a few seconds before retrying (increasing with each retry)
        await new Promise((resolve) => setTimeout(resolve, 2000 * retries));
      } else if (retries < maxRetries) {
        // For other errors, wait a shorter time
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  console.error(
    `Failed to verify translation for ${keyPath} in ${language} after ${maxRetries} attempts:`,
    lastError ? lastError.message : "Unknown error",
  );
  return [];
}

/**
 * Gets all available languages from the locales directory
 * @param {string} projectPath - Path to the project locales directory
 * @returns {Array<string>} Array of language codes
 */
async function getAvailableLanguages(projectPath) {
  const items = await fs.readdir(projectPath);

  return items.filter((item) => {
    const itemPath = path.join(projectPath, item);
    return fs.statSync(itemPath).isDirectory() && item !== ".meta";
  });
}

/**
 * Gets translation content from the in-memory cache
 * @param {Object} translations - The translations cache
 * @param {string} namespace - Namespace of the translation
 * @param {string} key - Key of the translation
 * @param {string} language - Language code
 * @returns {string|null} Translation content or null if not found
 */
function getTranslationContent(translations, namespace, key, language) {
  try {
    return translations[language]?.[namespace]?.[key] || null;
  } catch (error) {
    console.error(
      `Error reading translation for ${key} in ${language} from cache: ${error.message}`,
    );
    return null;
  }
}

/**
 * Loads all translation files for a project into memory
 * @param {string} projectPath - Path to the project locales directory
 * @param {Array<string>} languages - Array of languages to load
 * @returns {Promise<Object>} A map of translations: { [lang]: { [ns]: { [key]: val } } }
 */
async function loadAllTranslations(projectPath, languages) {
  const translations = {};
  const allLangs = ["en", ...languages]; // Also load English

  for (const lang of allLangs) {
    translations[lang] = {};
    const langPath = path.join(projectPath, lang);
    if (!(await fs.pathExists(langPath))) continue;

    const nsFiles = await fs.readdir(langPath);
    for (const nsFile of nsFiles) {
      if (path.extname(nsFile) === ".json") {
        const namespace = path.basename(nsFile, ".json");
        const filePath = path.join(langPath, nsFile);
        try {
          translations[lang][namespace] = await fs.readJson(filePath);
        } catch (error) {
          console.error(
            `Error reading JSON file ${filePath}: ${error.message}`,
          );
        }
      }
    }
  }
  return translations;
}

/**
 * Verifies translations and updates metadata for a project
 * @param {string} projectName - Project name
 * @param {string} tsvFilename - TSV filename for incremental writing
 * @param {Object} counters - Object to track totalIssuesFound
 * @returns {Promise<Object>} Statistics
 */
async function verifyTranslationsSpellCheck(project, tsvFilename, counters) {
  const resuming =
    checkpoint.lastProject === project && checkpoint.lastMetadataFile !== null;
  console.log(`Verifying translations for project: ${project}`);

  const stats = {
    totalProjects: 1,
    totalNamespaces: 0,
    totalFiles: 0,
    totalKeys: 0,
    processedKeys: 0,
    updatedIssues: 0,
    skippedKeys: 0,
    errors: [],
    languages: {},
    startTime: new Date(),
  };

  try {
    const localesPath = projectLocalesMap[project];
    if (!localesPath) {
      throw new Error(`No locales path defined for project: ${project}`);
    }

    const projectPath = path.join(appRootPath, localesPath);
    console.log(`Project path: ${projectPath}`);

    const allLanguages = await getAvailableLanguages(projectPath);
    console.log(
      `Found ${allLanguages.length} languages: ${allLanguages.join(", ")}`,
    );

    const languages = LANGUAGES_TO_CHECK
      ? allLanguages.filter((lang) => LANGUAGES_TO_CHECK.includes(lang))
      : allLanguages.filter((lang) => lang !== "en");

    console.log(
      `Will check ${languages.length} languages: ${languages.join(", ")}`,
    );

    languages.forEach((lang) => {
      stats.languages[lang] = { processed: 0, updated: 0, issues: 0 };
    });

    // Pre-load all translation files
    console.log("Loading all translation files into memory...");
    const translations = await loadAllTranslations(projectPath, languages);
    console.log("Translation files loaded.");

    const metaPattern = path
      .join(projectPath, ".meta", "**", "*.json")
      .replace(/\\/g, "/");
    const metadataFiles = glob.sync(metaPattern);
    console.log(`Found ${metadataFiles.length} metadata files`);

    // Skip files until we reach checkpoint if resuming
    let skipUntilFile = resuming ? checkpoint.lastMetadataFile : null;

    for (const metadataFile of metadataFiles) {
      // Skip files until checkpoint
      if (skipUntilFile && metadataFile !== skipUntilFile) {
        continue;
      }
      if (skipUntilFile && metadataFile === skipUntilFile) {
        console.log(` Resuming from file: ${path.basename(metadataFile)}`);
        skipUntilFile = null; // Found checkpoint, process from here
      }

      try {
        const metaPathParts = metadataFile.split(path.sep);
        const key = path.basename(metadataFile, ".json");
        const namespace = metaPathParts[metaPathParts.length - 2];
        const keyPath = `${namespace}:${key}`;

        const metadata = await fs.readJson(metadataFile);

        const englishContent = getTranslationContent(
          translations,
          namespace,
          key,
          "en",
        );
        if (!englishContent) {
          console.log(`Skipping ${keyPath}: English content not found`);
          stats.skippedKeys++;
          continue;
        }

        stats.totalKeys++;
        stats.totalFiles++;

        let metadataUpdated = false;

        for (let langIndex = 0; langIndex < languages.length; langIndex++) {
          const language = languages[langIndex];

          // Save checkpoint when starting new language
          if (checkpoint.lastLanguage !== language) {
            checkpoint.lastProject = project;
            checkpoint.lastMetadataFile = metadataFile;
            checkpoint.lastLanguage = language;
            saveCheckpoint();
          }

          try {
            const translatedContent = getTranslationContent(
              translations,
              namespace,
              key,
              language,
            );
            if (!translatedContent) {
              continue;
            }

            const progress = {
              current: langIndex + 1,
              total: languages.length,
              keyIndex: stats.totalKeys,
              totalKeys: metadataFiles.length,
            };

            const issues = await verifyTranslation(
              keyPath,
              englishContent,
              translatedContent,
              language,
              progress,
            );

            if (!metadata.languages) metadata.languages = {};
            if (!metadata.languages[language]) {
              metadata.languages[language] = {
                ai_translated: false,
                ai_model: null,
                ai_spell_check_issues: [],
                approved_at: null,
              };
            }

            metadata.languages[language].ai_spell_check_issues = issues;
            metadataUpdated = true;

            stats.processedKeys++;
            stats.languages[language].processed++;

            if (issues.length > 0) {
              stats.updatedIssues++;
              stats.languages[language].updated++;
              stats.languages[language].issues += issues.length;
              console.log(
                `Found ${issues.length} issues for ${keyPath} in ${language}`,
              );

              // Save issues to CSV immediately
              for (const issue of issues) {
                appendIssueToTSV(
                  tsvFilename,
                  project,
                  metadataFile,
                  keyPath,
                  language,
                  englishContent,
                  translatedContent,
                  issue,
                );
                counters.totalIssuesFound++;
              }
            }
          } catch (langError) {
            console.error(
              `Error processing ${keyPath} for ${language}: ${langError.message}`,
            );
            stats.errors.push({
              file: metadataFile,
              key: keyPath,
              language,
              error: langError.message,
            });
            // Save checkpoint on error
            saveCheckpoint();
          }
        }

        if (metadataUpdated) {
          metadata.updated_at = new Date().toISOString();
          await writeJsonWithConsistentEol(metadataFile, metadata);
        }
      } catch (fileError) {
        console.error(
          `Error processing metadata file ${metadataFile}: ${fileError.message}`,
        );
        stats.errors.push({ file: metadataFile, error: fileError.message });
        // Save checkpoint on error
        saveCheckpoint();
      }
    }

    stats.endTime = new Date();
    stats.duration = (stats.endTime - stats.startTime) / 1000;

    return stats;
  } catch (error) {
    console.error(
      `Error verifying translations for project ${project}: ${error.message}`,
    );
    stats.errors.push({ project: project, error: error.message });
    stats.endTime = new Date();
    stats.duration = (stats.endTime - stats.startTime) / 1000;
    return stats;
  }
}

/**
 * Escape TSV field by replacing tabs and newlines
 * @param {any} field - Field to escape
 * @returns {string} Escaped field
 */
function escapeTsvField(field) {
  if (field == null) return "";
  const str = String(field);
  // Replace tabs with spaces and newlines with spaces
  return str.replace(/\t/g, " ").replace(/\n/g, " ").replace(/\r/g, "");
}

/**
 * Appends issue to TSV file
 * @param {string} tsvFilename - TSV filename
 * @param {string} project - Project name
 * @param {string} metadataFile - Metadata file path
 * @param {string} keyPath - Translation key path
 * @param {string} language - Language code
 * @param {string} englishContent - English content
 * @param {string} translatedContent - Translated content
 * @param {Object} issue - Issue object
 */
function appendIssueToTSV( // sync — no async needed
  tsvFilename,
  project,
  metadataFile,
  keyPath,
  language,
  englishContent,
  translatedContent,
  issue,
) {
  const tsvPath = path.join(appRootPath, tsvFilename);
  const row = [
    project,
    metadataFile,
    keyPath,
    language,
    escapeTsvField(englishContent),
    escapeTsvField(translatedContent),
    issue.type || "",
    escapeTsvField(issue.description || ""),
    escapeTsvField(issue.suggestion || ""),
  ].join("\t");

  fs.appendFileSync(tsvPath, row + "\n", "utf8");

  // Update checkpoint (will be saved when language changes)
  checkpoint.lastProject = project;
  checkpoint.lastMetadataFile = metadataFile;
  checkpoint.lastLanguage = language;
  checkpoint.processedKeys.add(
    `${project}:${metadataFile}:${keyPath}:${language}`,
  );
}

/**
 * Verifies translations for all projects
 * @returns {Promise<Object>} Overall statistics
 */
async function verifyAllTranslationsSpellCheck() {
  console.log("Starting translation verification process...");

  // Load checkpoint
  checkpoint = loadCheckpoint();
  const resuming = checkpoint.lastProject !== null;

  console.log("OLLAMA_MODEL: ", MODEL);

  console.log("LANGUAGES_TO_CHECK: ", LANGUAGES_TO_CHECK);
  console.log("CHECKPOINT_FILE: ", CHECKPOINT_FILE);
  console.log("RESUMING: ", resuming ? "yes" : "no");

  const ollamaRunning = await verifyOllamaConnection();
  if (!ollamaRunning) {
    console.error("Ollama is not running. Aborting verification process.");
    process.exit(1);
  }

  // Use existing TSV file if resuming, otherwise create new one
  let tsvFilename;
  if (resuming && checkpoint.tsvFilename) {
    tsvFilename = checkpoint.tsvFilename;
    console.log(` Resuming with existing TSV file: ${tsvFilename}`);
  } else {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    tsvFilename = `spell-check-issues-${timestamp}.tsv`;
    checkpoint.tsvFilename = tsvFilename;
    saveCheckpoint();
  }
  const tsvPath = path.join(appRootPath, tsvFilename);

  // Only write header if file doesn't exist (new run)
  if (!fs.existsSync(tsvPath)) {
    const tsvHeader =
      "Project\tMetadata File\tKey\tLanguage\tEnglish Content\tTranslated Content\tIssue Type\tDescription\tSuggestion\n";
    fs.writeFileSync(tsvPath, tsvHeader, "utf8");
    console.log(` Created TSV file: ${tsvPath}`);
  } else {
    console.log(` Continuing with existing TSV file: ${tsvPath}`);
  }
  console.log("Issues will be saved incrementally as they are found.\n");

  const counters = { totalIssuesFound: 0 };

  const overallStats = {
    projects: {},
    totalProjects: 0,
    totalNamespaces: 0,
    totalFiles: 0,
    totalKeys: 0,
    processedKeys: 0,
    updatedIssues: 0,
    skippedKeys: 0,
    errors: [],
    languages: {},
    startTime: new Date(),
  };

  const projects = Object.keys(projectLocalesMap);
  overallStats.totalProjects = projects.length;

  // Skip to the checkpoint project if resuming
  let skipUntilProject = resuming ? checkpoint.lastProject : null;
  let foundCheckpoint = !resuming;

  for (const project of projects) {
    // Skip projects until we reach the checkpoint
    if (skipUntilProject && project !== skipUntilProject) {
      console.log(` Skipping project: ${project} (already processed)`);
      continue;
    }
    if (skipUntilProject && project === skipUntilProject) {
      foundCheckpoint = true;
      skipUntilProject = null; // clear so subsequent projects are not skipped
      console.log(` Resuming from project: ${project}`);
    }

    try {
      console.log(` Processing project: ${project}`);
      const projectStats = await verifyTranslationsSpellCheck(
        project,
        tsvFilename,
        counters,
      );

      overallStats.projects[project] = projectStats;
      overallStats.totalNamespaces += projectStats.totalNamespaces || 0;
      overallStats.totalFiles += projectStats.totalFiles || 0;
      overallStats.totalKeys += projectStats.totalKeys || 0;
      overallStats.processedKeys += projectStats.processedKeys || 0;
      overallStats.updatedIssues += projectStats.updatedIssues || 0;
      overallStats.skippedKeys += projectStats.skippedKeys || 0;

      Object.entries(projectStats.languages || {}).forEach(
        ([lang, langStats]) => {
          if (!overallStats.languages[lang]) {
            overallStats.languages[lang] = {
              processed: 0,
              updated: 0,
              issues: 0,
            };
          }
          overallStats.languages[lang].processed += langStats.processed || 0;
          overallStats.languages[lang].updated += langStats.updated || 0;
          overallStats.languages[lang].issues += langStats.issues || 0;
        },
      );

      overallStats.errors = overallStats.errors.concat(
        projectStats.errors || [],
      );
    } catch (error) {
      console.error(`Error processing project ${project}: ${error.message}`);
      overallStats.errors.push({ project, error: error.message });
    }
  }

  overallStats.endTime = new Date();
  overallStats.duration =
    (overallStats.endTime - overallStats.startTime) / 1000; // in seconds

  // Report final TSV status
  if (counters.totalIssuesFound > 0) {
    console.log(` Total issues saved to TSV: ${counters.totalIssuesFound}`);
    console.log(` TSV file location: ${tsvPath}`);
  } else {
    // Remove empty TSV file if no issues found
    await fs.unlink(tsvPath).catch(() => {});
    console.log("\nNo issues found - TSV file not created.");
  }

  // Clear checkpoint on successful completion
  clearCheckpoint();

  return overallStats;
}

// Run the script if executed directly
verifyAllTranslationsSpellCheck()
  .then((stats) => {
    console.log("\n=== Verification Complete ===");
    console.log(`Total issues found: ${stats.updatedIssues}`);
    if (checkpoint.tsvFilename) {
      console.log(
        `Results saved to: ${path.join(appRootPath, checkpoint.tsvFilename)}`,
      );
    }
    console.log("\nThank you for using the translation verification tool!");

    console.log("\n=== Translation Verification Complete ===\n");

    // Print summary statistics
    console.log("Summary:");
    console.log(`- Total projects: ${stats.totalProjects}`);
    console.log(`- Total files: ${stats.totalFiles}`);
    console.log(`- Total keys: ${stats.totalKeys}`);
    console.log(`- Processed keys: ${stats.processedKeys}`);
    console.log(`- Updated with issues: ${stats.updatedIssues}`);
    console.log(`- Skipped keys: ${stats.skippedKeys}`);
    console.log(`- Errors: ${stats.errors.length}`);
    console.log(`- Duration: ${stats.duration.toFixed(2)} seconds`);

    // Print language statistics
    console.log("\nLanguage Statistics:");
    Object.entries(stats.languages).forEach(([lang, langStats]) => {
      console.log(
        `- ${lang}: Processed ${langStats.processed}, Updated ${langStats.updated}, Total Issues ${langStats.issues}`,
      );
    });

    // Print errors if any
    if (stats.errors.length > 0) {
      console.log("\nErrors:");
      stats.errors.slice(0, 10).forEach((error, index) => {
        console.log(
          `${index + 1}. ${error.file || error.project}: ${error.error}`,
        );
      });

      if (stats.errors.length > 10) {
        console.log(`... and ${stats.errors.length - 10} more errors`);
      }
    }

    console.log("\nDone!");
  })
  .catch((error) => {
    console.error("\n=== Error During Verification ===");
    console.error(error);
    console.log(
      "\n Checkpoint saved. You can resume by running the script again.",
    );
    saveCheckpoint();
    process.exit(1);
  });

