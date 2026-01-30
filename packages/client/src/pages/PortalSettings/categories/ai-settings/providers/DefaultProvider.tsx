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

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Text } from "@docspace/shared/components/text";
import { Button, ButtonSize } from "@docspace/shared/components/button";
import { Heading } from "@docspace/shared/components/heading";
import { FieldContainer } from "@docspace/shared/components/field-container";
import { ComboBox, TOption } from "@docspace/shared/components/combobox";

import {
  TAiProvider,
  TDefaultProvider,
  TModel,
} from "@docspace/shared/api/ai/types";
import { getAiModelName } from "@docspace/shared/utils/ai";

import styles from "../AISettings.module.scss";
import { inject, observer } from "mobx-react";
import AISettingsStore from "SRC_DIR/store/portal-settings/AISettingsStore";

type DefaultProviderProps = {
  aiProviders: TAiProvider[];
  defaultProviderModels?: AISettingsStore["defaultProviderModels"];
  defaultProvider?: AISettingsStore["defaultProvider"];
  setDefaultProvider?: AISettingsStore["setDefaultProvider"];
  fetchDefaultProviderModels?: AISettingsStore["fetchDefaultProviderModels"];
  isDefaultProviderModelsLoading?: AISettingsStore["isDefaultProviderModelsLoading"];
  changeDefaultProvider?: AISettingsStore["changeDefaultProvider"];
};

const getSelectedProvider = (
  aiProviders?: TAiProvider[],
  defaultProvider?: TDefaultProvider | null,
): TOption => {
  if (!aiProviders || !defaultProvider) return { key: "", label: "" };

  const provider =
    aiProviders.find((p) => p.id === defaultProvider.providerId) ||
    aiProviders[0];
  return { key: provider?.id, label: provider.title };
};

const getSelectedModel = (
  models?: TModel[] | null,
  defaultProvider?: TDefaultProvider | null,
): TOption => {
  if (!models || !defaultProvider) return { key: "", label: "" };

  const model =
    models.find((m) => m.modelId === defaultProvider.defaultModel) || models[0];

  return { key: model.modelId, label: model.name };
};

const DefaultProviderComponent = ({
  aiProviders,
  defaultProviderModels,
  defaultProvider,
  fetchDefaultProviderModels,
  isDefaultProviderModelsLoading,
  changeDefaultProvider,
}: DefaultProviderProps) => {
  const { t } = useTranslation(["Common", "AISettings"]);
  const [selectedProvider, setSelectedProvider] = useState<TOption | null>(() =>
    getSelectedProvider(aiProviders, defaultProvider),
  );
  const [selectedModel, setSelectedModel] = useState<TOption | null>(() =>
    getSelectedModel(defaultProviderModels, defaultProvider),
  );
  const [isSaveRequestRunning, setIsSaveRequestRunning] = useState(false);

  const isProviderChanged =
    selectedProvider?.key !== defaultProvider?.providerId;
  const isModelChanged = selectedModel?.key !== defaultProvider?.defaultModel;

  const getProviderOptions = () => {
    return aiProviders.map((p) => ({
      key: p.id,
      label: p.title,
    }));
  };

  const getModelOptions = () => {
    return (
      defaultProviderModels?.map((m) => ({ key: m.modelId, label: m.name })) ||
      []
    );
  };

  const onSave = async () => {
    if (!selectedProvider || !selectedModel) return;

    setIsSaveRequestRunning(true);
    const data = {
      providerId: selectedProvider.key as number,
      defaultModel: selectedModel.key as string,
    };

    await changeDefaultProvider?.(data);

    setIsSaveRequestRunning(false);
  };

  const onCancel = () => {
    if (!defaultProvider) return;

    setSelectedProvider({
      key: defaultProvider.providerId,
      label: defaultProvider.providerTitle,
    });

    setSelectedModel({
      key: defaultProvider.defaultModel,
      label: getAiModelName(defaultProvider.defaultModel),
    });

    if (isProviderChanged) {
      fetchDefaultProviderModels?.(defaultProvider.providerId);
    }
  };

  const onSelectProvider = (option: TOption) => {
    if (option.key === selectedProvider?.key) return;

    setSelectedProvider(option);
    fetchDefaultProviderModels?.(option.key as number);
  };

  const onSelectModel = (option: TOption) => {
    if (option.key === selectedModel?.key) return;

    setSelectedModel(option);
  };

  const isSaveDisabled =
    (!isProviderChanged && !isModelChanged) || isDefaultProviderModelsLoading;
  const isCancelDisabled =
    (!isProviderChanged && !isModelChanged) || isDefaultProviderModelsLoading;

  if (!selectedProvider || !selectedModel) {
    return null;
  }

  return (
    <div className={styles.defaultProvider}>
      <Heading
        className={styles.heading}
        level={3}
        fontWeight={700}
        lineHeight="22px"
        fontSize="16px"
      >
        {t("AISettings:DefaultProviderTitle")}
      </Heading>
      <Text className={styles.description} lineHeight="20px">
        {t("AISettings:DefaultProviderDescription", {
          aiProvider: t("Common:AIProvider"),
          aiAgents: t("Common:AIAgents"),
          productName: t("Common:ProductName"),
        })}
      </Text>

      <div className={styles.defaultProviderForm}>
        <FieldContainer
          labelVisible
          isVertical
          labelText={t("AISettings:Provider")}
          removeMargin
        >
          <ComboBox
            options={getProviderOptions()}
            selectedOption={selectedProvider}
            displayArrow
            onSelect={onSelectProvider}
            displaySelectedOption
            dataTestId="default-provider-combobox"
            dropDownTestId="default-provider-dropdown"
          />
        </FieldContainer>
        <FieldContainer
          labelVisible
          isVertical
          labelText={t("AISettings:Model")}
          removeMargin
        >
          <ComboBox
            options={getModelOptions()}
            selectedOption={selectedModel}
            displayArrow
            onSelect={onSelectModel}
            displaySelectedOption
            dataTestId="default-model-combobox"
            dropDownTestId="default-model-dropdown"
            isLoading={isDefaultProviderModelsLoading}
          />
        </FieldContainer>

        <div className={styles.defaultProviderFormButtons}>
          <Button
            primary
            size={ButtonSize.small}
            label={t("Common:SaveButton")}
            scale={false}
            onClick={onSave}
            isLoading={isSaveRequestRunning}
            isDisabled={isSaveDisabled}
            testId="default-provider-save-button"
          />
          <Button
            size={ButtonSize.small}
            label={t("Common:CancelButton")}
            scale={false}
            onClick={onCancel}
            isDisabled={isCancelDisabled}
            testId="default-provider-cancel-button"
          />
        </div>
      </div>
    </div>
  );
};

export const DefaultProvider = inject(({ aiSettingsStore }: TStore) => {
  return {
    defaultProviderModels: aiSettingsStore.defaultProviderModels,
    defaultProvider: aiSettingsStore.defaultProvider,
    setDefaultProvider: aiSettingsStore.setDefaultProvider,
    aiProviders: aiSettingsStore.aiProviders,
    fetchDefaultProviderModels: aiSettingsStore.fetchDefaultProviderModels,
    isDefaultProviderModelsLoading:
      aiSettingsStore.isDefaultProviderModelsLoading,
    changeDefaultProvider: aiSettingsStore.changeDefaultProvider,
  };
})(observer(DefaultProviderComponent));
