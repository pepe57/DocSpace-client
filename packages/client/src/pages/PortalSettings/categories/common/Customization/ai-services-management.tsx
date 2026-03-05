// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";
import { useNavigate, useLocation } from "react-router";

import withLoading from "SRC_DIR/HOCs/withLoading";

import { Text } from "@docspace/ui-kit/components/text";
import { RadioButtonGroup } from "@docspace/ui-kit/components/radio-button-group";
import { SaveCancelButtons } from "@docspace/shared/components/save-cancel-buttons";
import { Link, LinkTarget } from "@docspace/ui-kit/components/link";
import { toastr } from "@docspace/ui-kit/components/toast";
import { DeviceType } from "@docspace/shared/enums";
import { saveAiServicesSettings } from "@docspace/shared/api/settings";
import { saveToSessionStorage } from "@docspace/shared/utils/saveToSessionStorage";
import { getFromSessionStorage } from "@docspace/shared/utils/getFromSessionStorage";
import { SettingsStore } from "@docspace/shared/store/SettingsStore";
import CommonStore from "SRC_DIR/store/CommonStore";

import styles from "./customization.module.scss";
import LoaderCustomization from "../sub-components/loaderCustomization";
import { createDefaultHookSettingsProps } from "../../../utils/createDefaultHookSettingsProps";
import useCommon from "../useCommon";
import DisableAiServicesDialog from "SRC_DIR/components/dialogs/DisableAiServicesDialog";

interface AiServicesManagementProps {
  isMobileView: boolean;
  aiServicesEnabled: boolean;
  setAiServicesEnabled: (value: boolean) => void;
  isLoaded: boolean;
  loadBaseInfo: (page: string) => Promise<void>;
  common: CommonStore;
  settingsStore: SettingsStore;
  isLoadedPage: boolean;
  setIsLoadedAiServicesManagement: (value: boolean) => void;
  aiServicesManagementUrl?: string;
}

const AiServicesManagementComponent = ({
  isMobileView,
  aiServicesEnabled,
  setAiServicesEnabled,
  isLoaded,
  loadBaseInfo,
  common,
  settingsStore,
  isLoadedPage,
  setIsLoadedAiServicesManagement,
  aiServicesManagementUrl,
}: AiServicesManagementProps) => {
  const { t, ready } = useTranslation(["Settings", "Common", "AISettings"]);
  const navigate = useNavigate();
  const location = useLocation();

  const [type, setType] = useState(1);
  const [showReminder, setShowReminder] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);

  const isLoadedSetting = isLoaded && ready;

  const defaultProps = createDefaultHookSettingsProps({
    loadBaseInfo,
    isMobileView,
    settingsStore,
    common,
  });

  const { getCommonInitialValue } = useCommon(defaultProps.common);

  const getSettings = () => {
    const currentSettings = getFromSessionStorage("currentAiServicesEnabled");
    const defaultValue =
      aiServicesEnabled !== null && aiServicesEnabled !== undefined
        ? Number(aiServicesEnabled)
        : 1;
    saveToSessionStorage("defaultAiServicesEnabled", defaultValue);

    if (currentSettings !== null) {
      setType(currentSettings);
    } else {
      setType(defaultValue);
    }
  };

  const checkWidth = () => {
    if (!isMobileView && location.pathname.includes("ai-services-management")) {
      navigate("/portal-settings/customization/general");
    }
  };

  useEffect(() => {
    if (isMobileView) getCommonInitialValue();
  }, [isMobileView]);

  useEffect(() => {
    if (isLoadedSetting) setIsLoadedAiServicesManagement(isLoadedSetting);
  }, [isLoadedSetting]);

  useEffect(() => {
    const defaultSettings = getFromSessionStorage("defaultAiServicesEnabled");

    if (defaultSettings === type) {
      setShowReminder(false);
    } else {
      setShowReminder(true);
    }
  }, [type]);

  useEffect(() => {
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    if (aiServicesEnabled === null || aiServicesEnabled === undefined) return;
    getSettings();
  }, [aiServicesEnabled]);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type !== Number(e.target.value)) {
      saveToSessionStorage("currentAiServicesEnabled", Number(e.target.value));
      setType(Number(e.target.value));
    }
  };

  const onSave = async () => {
    // Если пытаемся отключить AI (type === 0), показываем модалку
    if (type === 0) {
      setShowDisableDialog(true);
      return;
    }

    // Если включаем AI (type === 1), сохраняем сразу
    try {
      setIsSaving(true);
      await saveAiServicesSettings(Boolean(type));
      setAiServicesEnabled(Boolean(type));
      setShowReminder(false);
      saveToSessionStorage("defaultAiServicesEnabled", type);
      saveToSessionStorage("currentAiServicesEnabled", type);
      toastr.success(t("Common:SuccessfullySaveSettingsMessage"));
    } catch (e) {
      toastr.error(e as string);
    } finally {
      setIsSaving(false);
    }
  };

  const onConfirmDisable = async () => {
    try {
      setIsSaving(true);
      await saveAiServicesSettings(false);
      setAiServicesEnabled(false);
      setShowReminder(false);
      saveToSessionStorage("defaultAiServicesEnabled", 0);
      saveToSessionStorage("currentAiServicesEnabled", 0);
      setShowDisableDialog(false);
      toastr.success(t("Common:SuccessfullySaveSettingsMessage"));
    } catch (e) {
      toastr.error(e as string);
    } finally {
      setIsSaving(false);
    }
  };

  const onCancelDisable = () => {
    // Возвращаем radio на Enable
    setType(1);
    saveToSessionStorage("currentAiServicesEnabled", 1);
    setShowDisableDialog(false);
    setShowReminder(false);
  };

  const onCancel = () => {
    const defaultSettings = getFromSessionStorage("defaultAiServicesEnabled");
    const defaultType = defaultSettings !== null ? defaultSettings : 1;
    setType(Number(defaultType));
    saveToSessionStorage("currentAiServicesEnabled", defaultType);
    setShowReminder(false);
  };

  if (!isLoadedPage) return <LoaderCustomization aiServicesManagement />;

  return (
    <div className={styles.wrapper}>
      {!isMobileView ? (
        <Text fontSize="16px" fontWeight={700}>
          {t("AiServicesManagement")}
        </Text>
      ) : null}
      <Text className="category-item-description" fontSize="13px">
        {t("AiServicesManagementDescription", {
          productName: t("Common:ProductName"),
          aiAgents: t("Common:AIAgents"),
          aiSettings: t("AISettings"),
        })}
      </Text>
      {aiServicesManagementUrl ? (
        <Link
          className="link-learn-more"
          color={settingsStore.currentColorScheme?.main?.accent ?? undefined}
          target={LinkTarget.blank}
          isHovered
          href={aiServicesManagementUrl}
          fontWeight={600}
          dataTestId="ai_services_management_learn_more"
        >
          {t("Common:LearnMore")}
        </Link>
      ) : null}
      <RadioButtonGroup
        className={styles.radioButtonGroup}
        fontSize="13px"
        fontWeight={400}
        orientation="vertical"
        spacing="8px"
        dataTestId="ai_services_management_radio_button_group"
        options={[
          {
            id: "enable",
            label: t("Common:Enable"),
            value: 1,
            dataTestId: "ai_services_management_enable",
          },
          {
            id: "disabled",
            label: t("Common:Disable"),
            value: 0,
            dataTestId: "ai_services_management_disabled",
          },
        ]}
        selected={type}
        onClick={onSelect}
      />
      <SaveCancelButtons
        className={styles.saveCancelButtons}
        onSaveClick={onSave}
        onCancelClick={onCancel}
        showReminder={showReminder}
        reminderText={t("Common:YouHaveUnsavedChanges")}
        saveButtonLabel={t("Common:SaveButton")}
        cancelButtonLabel={t("Common:CancelButton")}
        displaySettings
        hasScroll={false}
        isSaving={isSaving}
        saveButtonDataTestId="ai_services_management_save_button"
        cancelButtonDataTestId="ai_services_management_cancel_button"
      />
      <DisableAiServicesDialog
        visible={showDisableDialog}
        onClose={onCancelDisable}
        onContinue={onConfirmDisable}
        isLoading={isSaving}
      />
    </div>
  );
};

export const AiServicesManagement = inject<TStore>(
  ({ settingsStore, common }) => {
    const { aiServicesEnabled, setAiServicesEnabled, deviceType } =
      settingsStore;
    const { isLoaded, initSettings, setIsLoadedAiServicesManagement } = common;
    const isMobileView = deviceType === DeviceType.mobile;
    return {
      isMobileView,
      aiServicesEnabled,
      setAiServicesEnabled,
      isLoaded,
      setIsLoadedAiServicesManagement,
      aiServicesManagementUrl: settingsStore.aiServicesManagementUrl,
      loadBaseInfo: async (page: string) => {
        await initSettings(page);
      },
      common,
      settingsStore,
    };
  },
)(withLoading(observer(AiServicesManagementComponent)));
