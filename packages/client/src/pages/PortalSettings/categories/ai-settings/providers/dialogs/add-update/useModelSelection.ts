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

import { useState, useCallback, useRef, useMemo, useEffect } from "react";

import { ProviderType } from "@docspace/shared/api/ai/enums";
import type {
  TModelCapabilities,
  TProviderModelInfo,
} from "@docspace/shared/api/ai/types";

import {
  fetchModelsForProviderByKey,
  getRecommendedModelIds,
} from "./mockModelData";

type TModelOverride = {
  displayName: string;
  capabilities: TModelCapabilities;
};

export type TModelSelectionState = {
  selectedIds: string[];
  overrides: Record<string, TModelOverride>;
};

const sortSelectedFirst = (
  models: TProviderModelInfo[],
  selectedIds: Set<string>,
) => {
  return [...models].sort((a, b) => {
    const aSelected = selectedIds.has(a.modelId) ? 0 : 1;
    const bSelected = selectedIds.has(b.modelId) ? 0 : 1;
    return aSelected - bSelected;
  });
};

const DEBOUNCE_MS = 500;

export const useModelSelection = (
  providerType: ProviderType,
  providerKey: string,
) => {
  const [availableModels, setAvailableModels] = useState<TProviderModelInfo[]>(
    [],
  );
  const [selectedModelIds, setSelectedModelIds] = useState<Set<string>>(
    new Set(),
  );
  const [hasError, setHasError] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [settingsModelId, setSettingsModelId] = useState<string | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const frozenSortIds = useRef<Set<string> | null>(null);
  const modelOverrides = useRef<Record<string, TModelOverride>>({});

  useEffect(() => {
    if (!providerKey) return;

    const timer = setTimeout(async () => {
      setIsLoadingModels(true);
      try {
        const models = await fetchModelsForProviderByKey(
          providerType,
          providerKey,
        );
        setAvailableModels(models);

        const recommendedIds = getRecommendedModelIds(providerType);
        setSelectedModelIds((prev) =>
          prev.size > 0 ? prev : new Set(recommendedIds),
        );

        setModelsLoaded(true);
      } finally {
        setIsLoadingModels(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [providerType, providerKey]);

  const loadModelsForProvider = useCallback(
    (savedState?: TModelSelectionState) => {
      if (savedState) {
        setSelectedModelIds(new Set(savedState.selectedIds));
        modelOverrides.current = { ...savedState.overrides };
        if (savedState.selectedIds.length > 0) {
          setModelsLoaded(true);
        }
      } else {
        setSelectedModelIds(new Set());
        modelOverrides.current = {};
      }

      setAvailableModels([]);
      setModelsLoaded(false);
      setHasError(false);
    },
    [],
  );

  const toggleModel = useCallback((modelId: string) => {
    setSelectedModelIds((prev) => {
      const next = new Set(prev);
      if (next.has(modelId)) {
        next.delete(modelId);
      } else {
        next.add(modelId);
      }
      return next;
    });
    setHasError(false);
  }, []);

  const updateModelSettings = useCallback(
    (
      modelId: string,
      displayName: string,
      capabilities: TModelCapabilities,
    ) => {
      modelOverrides.current[modelId] = { displayName, capabilities };

      setAvailableModels((prev) =>
        prev.map((m) =>
          m.modelId === modelId ? { ...m, displayName, capabilities } : m,
        ),
      );
    },
    [],
  );

  const orderedModels = useMemo(() => {
    const sortIds = frozenSortIds.current ?? selectedModelIds;
    const recommended = availableModels.filter((m) => m.isRecommended);
    const other = availableModels.filter((m) => !m.isRecommended);

    return {
      recommended: sortSelectedFirst(recommended, sortIds),
      other: sortSelectedFirst(other, sortIds),
    };
  }, [availableModels, selectedModelIds, isPopupOpen]);

  const selectedModels = useMemo(() => {
    return availableModels.filter((m) => selectedModelIds.has(m.modelId));
  }, [availableModels, selectedModelIds]);

  const getState = useCallback((): TModelSelectionState => {
    return {
      selectedIds: Array.from(selectedModelIds),
      overrides: { ...modelOverrides.current },
    };
  }, [selectedModelIds]);

  const togglePopup = useCallback(() => {
    setIsPopupOpen((prev) => {
      if (prev) {
        frozenSortIds.current = null;
        if (selectedModelIds.size === 0) {
          setHasError(true);
        }
        return false;
      }
      frozenSortIds.current = new Set(selectedModelIds);
      return true;
    });
  }, [selectedModelIds]);

  const closePopup = useCallback(() => {
    frozenSortIds.current = null;
    setIsPopupOpen(false);
    if (selectedModelIds.size === 0) {
      setHasError(true);
    }
  }, [selectedModelIds]);

  const openSettings = useCallback((modelId: string) => {
    setSettingsModelId(modelId);
    setIsPopupOpen(false);
  }, []);

  const closeSettings = useCallback(() => {
    setSettingsModelId(null);
  }, []);

  const getModelForSettings = useCallback(() => {
    if (!settingsModelId) return null;
    return availableModels.find((m) => m.modelId === settingsModelId) ?? null;
  }, [settingsModelId, availableModels]);

  return {
    availableModels,
    selectedModelIds,
    hasError,
    isPopupOpen,
    settingsModelId,
    isLoadingModels,
    modelsLoaded,

    orderedModels,
    selectedModels,

    loadModelsForProvider,
    toggleModel,
    updateModelSettings,
    getState,

    togglePopup,
    closePopup,
    openSettings,
    closeSettings,
    getModelForSettings,
  };
};
