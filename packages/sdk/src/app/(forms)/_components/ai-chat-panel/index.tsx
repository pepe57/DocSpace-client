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

import { Text } from "@docspace/ui-kit/components/text";
import { IconButton } from "@docspace/ui-kit/components/icon-button";

import Chat from "@docspace/ui-kit/ai-agent/chat";

import { useFormsAiAgentStore } from "../../_store/FormsAiAgentStore";
import { useFormsSettingsStore } from "../../_store/FormsSettingsStore";
import useItemIcon from "@/app/(docspace)/_hooks/useItemIcon";

import CrossReactSvgUrl from "PUBLIC_DIR/images/icons/17/cross.react.svg?url";

import styles from "./AiChatPanel.module.scss";

const AiChatPanel = () => {
  const { t } = useTranslation(["Common"]);
  const aiAgentStore = useFormsAiAgentStore();
  const {
    isPanelVisible,
    closePanel,
    isSyncing,
    currentAgentId,
    pendingAttachmentFile,
  } = aiAgentStore;
  const { filesSettings, hasManagementAccess } = useFormsSettingsStore();

  const agentRoomId = currentAgentId ?? 0;

  const { getIcon: getIconRaw } = useItemIcon({
    filesSettings: filesSettings!,
  });

  const getIcon = React.useCallback(
    (size: number, fileExst: string) =>
      getIconRaw(fileExst, size as 24 | 32 | 64 | 96),
    [getIconRaw],
  );

  const [attachmentFile, setAttachmentFile] = React.useState<Partial<
    import("@docspace/ui-kit/types").TFile
  > | null>(null);

  React.useEffect(() => {
    if (pendingAttachmentFile) {
      setAttachmentFile(
        pendingAttachmentFile as Partial<
          import("@docspace/ui-kit/types").TFile
        >,
      );
    }
  }, [pendingAttachmentFile]);

  const clearAttachmentFile = React.useCallback(() => {
    setAttachmentFile(null);
  }, []);

  const getResultStorageId = React.useCallback(() => null, []);

  const isAskFromDB = !!pendingAttachmentFile;

  const emptyScreenText = React.useMemo(() => {
    if (!pendingAttachmentFile?.title) return undefined;
    const name = pendingAttachmentFile.title.replace(/\.[^.]+$/, "");
    return `Ask anything about "${name}" using the submitted data`;
  }, [pendingAttachmentFile?.title]);

  const askFromDBSamples = React.useMemo(
    () =>
      pendingAttachmentFile?.title
        ? [
            {
              title: "Total submissions",
              prompt: `How many times has the form "${pendingAttachmentFile.title}" been submitted?`,
            },
            {
              title: "Recent responses",
              prompt: `Show me the most recent submissions for "${pendingAttachmentFile.title}"`,
            },
            {
              title: "Who filled it out",
              prompt: `List all people who have filled out the form "${pendingAttachmentFile.title}"`,
            },
            {
              title: "Summary",
              prompt: `Give me a brief summary of all collected data from "${pendingAttachmentFile.title}"`,
            },
          ]
        : undefined,
    [pendingAttachmentFile?.title],
  );

  if (!isPanelVisible || !agentRoomId || !hasManagementAccess) return null;

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
        <Chat
          agentId={agentRoomId}
          selectedModel=""
          getIcon={getIcon}
          attachmentFile={attachmentFile}
          clearAttachmentFile={clearAttachmentFile}
          hideAttachments={isAskFromDB}
          emptyScreenText={emptyScreenText}
          withSamples={isAskFromDB}
          samples={askFromDBSamples}
          standalone
          getResultStorageId={getResultStorageId}
        />
      </div>
    </div>
  );
};

export default observer(AiChatPanel);
