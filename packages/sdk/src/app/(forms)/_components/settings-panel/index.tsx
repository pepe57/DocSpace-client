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

"use client";

import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import {
  ModalDialog,
  ModalDialogType,
} from "@docspace/ui-kit/components/modal-dialog";
import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import { toastr } from "@docspace/ui-kit/components/toast";

import { useFormsDbSettingsStore } from "../../_store/FormsDbSettingsStore";
import { useFormsSettingsStore } from "../../_store/FormsSettingsStore";
import { useFormsAiAgentStore } from "../../_store/FormsAiAgentStore";
import { saveDbConfig, setRoomExternalDb } from "../../_api/dbSettings";
import {
  saveAgentSettings,
  clearAgentSettings,
  getKnowledgeFolderId,
} from "../../_api/aiAgentSettings";

import SettingsCategoryList from "./SettingsCategoryList";
import ConnectDatabaseForm from "./ConnectDatabaseForm";
import AIAgentForm from "./AIAgentForm";

const SettingsPanel = () => {
  const { t } = useTranslation(["Common"]);
  const store = useFormsDbSettingsStore();
  const { roomId } = useFormsSettingsStore();
  const aiAgentStore = useFormsAiAgentStore();

  const isConnectDatabase = store.currentLevel === "ConnectDatabase";
  const isAIAgent = store.currentLevel === "AIAgent";
  const isSubLevel = isConnectDatabase || isAIAgent;

  const onClose = React.useCallback(() => {
    store.closePanel();
  }, [store]);

  const onBack = React.useCallback(() => {
    if (store.isAgentSelectorVisible) {
      store.closeAgentSelector();
      return;
    }
    store.setCurrentLevel("CategoryList");
  }, [store]);

  const onSave = React.useCallback(async () => {
    store.setIsSaving(true);
    try {
      if (isConnectDatabase) {
        if (store.sendToDb) {
          const result = await saveDbConfig(store.formData);
          if (!result) {
            toastr.error(t("Common:ErrorOccurred"));
            return;
          }
        }
        await setRoomExternalDb(roomId, store.sendToDb);
      } else if (isAIAgent) {
        if (store.aiAgentEnabled && store.aiAgentId) {
          // Get KB folder ID inside agent room
          const kbFolderId = await getKnowledgeFolderId(store.aiAgentId);

          saveAgentSettings(roomId, {
            ...store.aiAgentFormData,
            knowledgeFolderId: kbFolderId,
          });
          aiAgentStore.setSelectedAgent(store.aiAgentId, kbFolderId);
          await aiAgentStore.fetchAgentChatSettings(store.aiAgentId);
        } else {
          clearAgentSettings(roomId);
          aiAgentStore.setSelectedAgent(null);
        }
      }
      store.closePanel();
    } catch {
      toastr.error(t("Common:ErrorOccurred"));
    } finally {
      store.setIsSaving(false);
    }
  }, [store, roomId, t, isConnectDatabase, isAIAgent, aiAgentStore]);

  const onCancel = React.useCallback(() => {
    store.closePanel();
  }, [store]);

  const showAgentSelector = isAIAgent && store.isAgentSelectorVisible;

  const headerTitle = isConnectDatabase
    ? t("Common:ConnectDatabase")
    : isAIAgent
      ? t("Common:AIAgent")
      : t("Common:Settings");

  const showFooter = isSubLevel && !showAgentSelector;

  return (
    <ModalDialog
      visible={store.isPanelVisible}
      isCloseable
      onClose={onClose}
      displayType={ModalDialogType.aside}
      withFooterBorder={showFooter}
      withBodyScroll={!showAgentSelector}
      withoutPadding
      isBackButton={isSubLevel}
      onBackClick={onBack}
    >
      {!showAgentSelector ? (
        <ModalDialog.Header>{headerTitle}</ModalDialog.Header>
      ) : null}
      <ModalDialog.Body>
        {isConnectDatabase ? (
          <ConnectDatabaseForm />
        ) : isAIAgent ? (
          <AIAgentForm />
        ) : (
          <SettingsCategoryList />
        )}
      </ModalDialog.Body>
      {showFooter ? (
        <ModalDialog.Footer>
          <Button
            label={t("Common:SaveButton")}
            size={ButtonSize.normal}
            primary
            scale
            onClick={onSave}
            isLoading={store.isSaving}
          />
          <Button
            label={t("Common:CancelButton")}
            size={ButtonSize.normal}
            scale
            onClick={onCancel}
            isDisabled={store.isSaving}
          />
        </ModalDialog.Footer>
      ) : null}
    </ModalDialog>
  );
};

export default observer(SettingsPanel);
