"use client";

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

import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { getFileInfo } from "@docspace/shared/api/files";
import type { TFile } from "@docspace/ui-kit/types";
import { frameCallEvent, getFrameId } from "@docspace/shared/utils/common";
import { useSDKConfig } from "@/providers/SDKConfigProvider";

const Chat = dynamic(() => import("@docspace/ui-kit/ai-agent/chat"), {
  ssr: false,
});

type ChatPageProps = {
  agentId: string;
  fileId: string;
  chatId: string;
};

const ChatPageClient = ({ agentId, fileId, chatId }: ChatPageProps) => {
  useSDKConfig();

  const [attachmentFile, setAttachmentFile] = useState<Partial<TFile> | null>(
    null,
  );
  const [isFileLoading, setIsFileLoading] = useState(!!fileId);

  useEffect(() => {
    if (!agentId) {
      frameCallEvent({
        event: "onAppError",
        data: { message: "agentId is required" },
      });
      return;
    }

    frameCallEvent({ event: "onAppReady", data: { frameId: getFrameId() } });
  }, [agentId]);

  useEffect(() => {
    if (!fileId) return;

    let cancelled = false;

    setIsFileLoading(true);

    getFileInfo(fileId)
      .then((file) => {
        if (!cancelled) setAttachmentFile(file as unknown as Partial<TFile>);
      })
      .catch((err) => {
        console.error("Failed to fetch file info:", err);
        frameCallEvent({
          event: "onAppError",
          data: { message: String(err) },
        });
      })
      .finally(() => {
        if (!cancelled) setIsFileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fileId]);

  const clearAttachmentFile = useCallback(() => setAttachmentFile(null), []);

  if (!agentId) {
    return null;
  }

  return (
    <Chat
      agentId={agentId}
      selectedModel=""
      standalone
      attachmentFile={attachmentFile}
      clearAttachmentFile={clearAttachmentFile}
      allowAttachFiles
      allowSelectChat
      isLoading={isFileLoading}
      width="100%"
      height="100%"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default ChatPageClient;
