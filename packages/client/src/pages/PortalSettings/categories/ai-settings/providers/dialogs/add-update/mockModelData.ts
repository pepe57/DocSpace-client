/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

// TODO: Replace with API calls when backend is ready.
// This file provides mock model data for each provider type.
// When the backend endpoint for provider models is available,
// replace getModelsForProvider() with a real API call.

import { ProviderType } from "@docspace/shared/api/ai/enums";
import type { TProviderModelInfo } from "@docspace/shared/api/ai/types";

const DEFAULT_CAPABILITIES = {
  vision: false,
  toolCalling: false,
  extendedThinking: false,
};

const FULL_CAPABILITIES = {
  vision: true,
  toolCalling: true,
  extendedThinking: true,
};

const model = (
  modelId: string,
  displayName: string,
  isRecommended: boolean,
  capabilities = DEFAULT_CAPABILITIES,
): TProviderModelInfo => ({
  modelId,
  displayName,
  isRecommended,
  capabilities,
});

const ANTHROPIC_MODELS: TProviderModelInfo[] = [
  model(
    "claude-sonnet-4-6-20250514",
    "Claude Sonnet 4.6",
    true,
    FULL_CAPABILITIES,
  ),
  model(
    "claude-opus-4-6-20250514",
    "Claude Opus 4.6",
    true,
    FULL_CAPABILITIES,
  ),
  model(
    "claude-haiku-4-5-20251001",
    "Claude Haiku 4.5",
    true,
    FULL_CAPABILITIES,
  ),
  model("claude-3-haiku-20240307", "claude-3-haiku-20240307", false),
  model("claude-opus-4-1-20250805", "claude-opus-4-1-20250805", false),
  model("claude-opus-4-20250514", "claude-opus-4-20250514", false),
  model("claude-opus-4-5-20251101", "claude-opus-4-5-20251101", false),
  model("claude-sonnet-4-20250514", "claude-sonnet-4-20250514", false),
];

const OPENAI_MODELS: TProviderModelInfo[] = [
  model("gpt-4.1", "GPT-4.1", true, FULL_CAPABILITIES),
  model("gpt-4.1-mini", "GPT-4.1 Mini", true, {
    vision: true,
    toolCalling: true,
    extendedThinking: false,
  }),
  model("gpt-4.1-nano", "GPT-4.1 Nano", true, {
    vision: true,
    toolCalling: true,
    extendedThinking: false,
  }),
  model("o3", "o3", false),
  model("o4-mini", "o4-mini", false),
  model("gpt-4o", "gpt-4o", false),
  model("gpt-4o-mini", "gpt-4o-mini", false),
];

const TOGETHER_AI_MODELS: TProviderModelInfo[] = [
  model(
    "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
    "Llama 4 Maverick",
    true,
    { vision: true, toolCalling: true, extendedThinking: false },
  ),
  model(
    "deepseek-ai/DeepSeek-V3-0324",
    "DeepSeek V3",
    true,
    { vision: false, toolCalling: true, extendedThinking: false },
  ),
  model(
    "Qwen/Qwen3-235B-A22B-fp8-tput",
    "Qwen3-235B-A22B-fp8-tput",
    false,
  ),
  model(
    "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    false,
  ),
];

const OPENROUTER_MODELS: TProviderModelInfo[] = [
  model(
    "anthropic/claude-sonnet-4.6",
    "Claude Sonnet 4.6",
    true,
    FULL_CAPABILITIES,
  ),
  model("openai/gpt-4.1", "GPT-4.1", true, FULL_CAPABILITIES),
  model(
    "google/gemini-2.5-pro",
    "Gemini 2.5 Pro",
    true,
    FULL_CAPABILITIES,
  ),
  model(
    "anthropic/claude-opus-4.5",
    "anthropic/claude-opus-4.5",
    false,
  ),
  model(
    "anthropic/claude-haiku-4.5",
    "anthropic/claude-haiku-4.5",
    false,
  ),
  model("openai/gpt-5.1", "openai/gpt-5.1", false),
  model("qwen/qwen3-max", "qwen/qwen3-max", false),
  model(
    "deepseek/deepseek-v3.1-terminus",
    "deepseek/deepseek-v3.1-terminus",
    false,
  ),
  model("x-ai/grok-4", "x-ai/grok-4", false),
];

const DEEPSEEK_MODELS: TProviderModelInfo[] = [
  model("deepseek-chat", "DeepSeek V3", true, {
    vision: false,
    toolCalling: true,
    extendedThinking: false,
  }),
  model("deepseek-reasoner", "DeepSeek R1", true, {
    vision: false,
    toolCalling: false,
    extendedThinking: true,
  }),
];

const XAI_MODELS: TProviderModelInfo[] = [
  model("grok-3", "Grok 3", true, {
    vision: true,
    toolCalling: true,
    extendedThinking: false,
  }),
  model("grok-3-mini", "Grok 3 Mini", true, {
    vision: false,
    toolCalling: true,
    extendedThinking: true,
  }),
  model("grok-2-vision-1212", "grok-2-vision-1212", false),
  model("grok-2-1212", "grok-2-1212", false),
];

const GOOGLE_MODELS: TProviderModelInfo[] = [
  model("gemini-2.5-pro", "Gemini 2.5 Pro", true, FULL_CAPABILITIES),
  model("gemini-2.5-flash", "Gemini 2.5 Flash", true, {
    vision: true,
    toolCalling: true,
    extendedThinking: true,
  }),
  model("gemini-2.0-flash", "gemini-2.0-flash", false),
  model("gemini-2.0-flash-lite", "gemini-2.0-flash-lite", false),
];

const MODELS_BY_PROVIDER: Partial<
  Record<ProviderType, TProviderModelInfo[]>
> = {
  [ProviderType.Anthropic]: ANTHROPIC_MODELS,
  [ProviderType.OpenAi]: OPENAI_MODELS,
  [ProviderType.TogetherAi]: TOGETHER_AI_MODELS,
  [ProviderType.OpenRouter]: OPENROUTER_MODELS,
  [ProviderType.DeepSeek]: DEEPSEEK_MODELS,
  [ProviderType.XAi]: XAI_MODELS,
  [ProviderType.Google]: GOOGLE_MODELS,
};

const OPENAI_COMPATIBLE_MODELS: TProviderModelInfo[] = [
  model(
    "custom-model-1",
    "Custom Model 1",
    true,
    { vision: true, toolCalling: true, extendedThinking: false },
  ),
  model("custom-model-2", "Custom Model 2", true, DEFAULT_CAPABILITIES),
  model("custom-model-3", "custom-model-3", false),
];

/**
 * Returns mock model list for a given provider type.
 * TODO: Replace with real API call (getModels) when backend is ready.
 */
export const getModelsForProvider = (
  type: ProviderType,
): TProviderModelInfo[] => {
  if (type === ProviderType.OpenAiCompatible) return OPENAI_COMPATIBLE_MODELS;
  return MODELS_BY_PROVIDER[type] ?? [];
};

/**
 * Mock API method that simulates fetching models from the backend after key validation.
 * TODO: Replace with real API call when backend endpoint is available.
 */
export const fetchModelsForProviderByKey = (
  type: ProviderType,
  _key: string,
): Promise<TProviderModelInfo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getModelsForProvider(type));
    }, 500);
  });
};

/**
 * Returns recommended model IDs for a given provider type.
 */
export const getRecommendedModelIds = (type: ProviderType): string[] => {
  const models = getModelsForProvider(type);
  return models.filter((m) => m.isRecommended).map((m) => m.modelId);
};
