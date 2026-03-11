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
import { MemoryRouter } from "react-router";

import { Text } from "@docspace/ui-kit/components/text";
import { IconButton } from "@docspace/ui-kit/components/icon-button";

import Chat from "@docspace/shared/components/chat";
import useInitChats from "@docspace/shared/components/chat/hooks/useInitChats";
import useToolsSettings from "@docspace/shared/components/chat/hooks/useToolsSettings";

import { useFormsAiAgentStore } from "../../_store/FormsAiAgentStore";
import { useFormsSettingsStore } from "../../_store/FormsSettingsStore";
import useInitMessagesSDK from "../../_hooks/useInitMessagesSDK";
import useItemIcon from "@/app/(docspace)/_hooks/useItemIcon";

import CrossReactSvgUrl from "PUBLIC_DIR/images/icons/17/cross.react.svg?url";

import styles from "./AiChatPanel.module.scss";

const FOLDER_FORM_VALIDATION = /[\\/:*?"<>|]/;

const AiChatPanel = () => {
  const { t } = useTranslation(["Common"]);
  const aiAgentStore = useFormsAiAgentStore();
  const {
    isPanelVisible,
    closePanel,
    isSyncing,
    selectedAgentId,
    agentChatSettings,
  } = aiAgentStore;
  const { filesSettings } = useFormsSettingsStore();

  // Use agent ID as roomId for chat — agents ARE rooms (TAgent = TRoom)
  const agentRoomId = selectedAgentId ?? 0;

  const initChats = useInitChats({ roomId: agentRoomId });
  const { initMessages, ...messagesSettings } = useInitMessagesSDK(agentRoomId);

  const toolsSettings = useToolsSettings({
    roomId: agentRoomId,
    aiConfig: null,
    chatSettings: agentChatSettings,
  });

  const { getIcon: getIconRaw } = useItemIcon({
    filesSettings: filesSettings!,
  });

  const getIcon = React.useCallback(
    (size: number, fileExst: string) =>
      getIconRaw(fileExst, size as 24 | 32 | 64 | 96),
    [getIconRaw],
  );

  const [attachmentFile, setAttachmentFile] = React.useState(null);

  const clearAttachmentFile = React.useCallback(() => {
    setAttachmentFile(null);
  }, []);

  const getResultStorageId = React.useCallback(() => null, []);

  // Re-init chat data only when panel opens or agent changes.
  // Init functions are intentionally omitted from deps to avoid
  // re-fetching on every render (they are not referentially stable).
  React.useEffect(() => {
    if (isPanelVisible && agentRoomId) {
      initChats.fetchChats();
      initMessages();
      toolsSettings.initTools();
    }
  }, [isPanelVisible, agentRoomId]);

  if (!isPanelVisible) return null;

  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        <div className={styles.headerTitle}>
          <Text fontSize="16px" fontWeight={700}>
            {t("Common:AIAgent")}
          </Text>
        </div>
        <div className={styles.headerActions}>
          <IconButton
            iconName={CrossReactSvgUrl}
            size={17}
            onClick={closePanel}
          />
        </div>
      </div>

      {isSyncing ? (
        <div className={styles.syncBanner}>
          <Text fontSize="12px" className={styles.syncText}>
            {t("Common:SyncingKnowledgeBase")}
          </Text>
        </div>
      ) : null}

      <div className={styles.chatBody}>
        <MemoryRouter>
          <Chat
            roomId={agentRoomId}
            userAvatar=""
            selectedModel={agentChatSettings?.modelId ?? ""}
            getIcon={getIcon}
            isLoading={false}
            attachmentFile={attachmentFile}
            clearAttachmentFile={clearAttachmentFile}
            toolsSettings={toolsSettings}
            initChats={initChats}
            messagesSettings={messagesSettings}
            aiReady
            standalone
            getResultStorageId={getResultStorageId}
            folderFormValidation={FOLDER_FORM_VALIDATION}
          />
        </MemoryRouter>
      </div>
    </div>
  );
};

export default observer(AiChatPanel);
