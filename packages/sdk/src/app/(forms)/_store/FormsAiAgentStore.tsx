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
import { makeAutoObservable, runInAction } from "mobx";

import type { TAIRoomChatSettings } from "@docspace/shared/api/rooms/types";
import { getAIAgent } from "@docspace/shared/api/ai";

import {
  loadAgentSettings,
  copyFilesToAgentRoom,
  vectorizeFiles,
  getKnowledgeFiles,
} from "../_api/aiAgentSettings";

class FormsAiAgentStore {
  isPanelVisible = false;

  // Selected agent
  selectedAgentId: number | null = null;
  knowledgeFolderId: number | null = null;
  agentChatSettings: TAIRoomChatSettings | undefined = undefined;

  // Knowledge base sync
  isSyncingKB = false;

  constructor() {
    makeAutoObservable(this);
  }

  openPanel = () => {
    this.isPanelVisible = true;
  };

  closePanel = () => {
    this.isPanelVisible = false;
  };

  togglePanel = () => {
    this.isPanelVisible = !this.isPanelVisible;
  };

  // Load saved agent settings for a room
  loadAgentForRoom = async (roomId: string | number) => {
    const settings = loadAgentSettings(roomId);
    if (settings?.agentId) {
      this.selectedAgentId = settings.agentId;
      this.knowledgeFolderId = settings.knowledgeFolderId ?? null;
      try {
        const agent = await getAIAgent(settings.agentId);
        runInAction(() => {
          this.agentChatSettings = agent.chatSettings;
        });
      } catch {
        // Agent might have been deleted
      }
    }
  };

  setSelectedAgent = (
    agentId: number | null,
    knowledgeFolderId?: number | null,
  ) => {
    this.selectedAgentId = agentId;
    this.knowledgeFolderId = knowledgeFolderId ?? null;
    if (!agentId) {
      this.agentChatSettings = undefined;
    }
  };

  fetchAgentChatSettings = async (agentId: number) => {
    try {
      const agent = await getAIAgent(agentId);
      runInAction(() => {
        this.agentChatSettings = agent.chatSettings;
      });
    } catch {
      // ignore
    }
  };

  // --- Knowledge base sync ---

  syncCompletedForms = async (
    files: { id: number; title: string }[],
  ) => {
    if (!this.selectedAgentId || !this.knowledgeFolderId) return;
    if (files.length === 0) return;
    if (this.isSyncingKB) return;

    try {
      runInAction(() => {
        this.isSyncingKB = true;
      });

      // 1. Get existing files in KB to avoid duplicates
      const kbFiles = await getKnowledgeFiles(this.knowledgeFolderId);
      const kbTitles = new Set(kbFiles.map((f) => f.title));

      // 2. Filter out files that are already in KB (by title)
      const newFiles = files.filter((f) => !kbTitles.has(f.title));

      if (newFiles.length > 0) {
        // 3. Copy new forms to KB folder (waits for completion)
        await copyFilesToAgentRoom(
          this.knowledgeFolderId,
          newFiles.map((f) => f.id),
        );

        // 4. Re-fetch KB files to get IDs of newly copied files
        const updatedKbFiles = await getKnowledgeFiles(this.knowledgeFolderId);
        const allKbFileIds = updatedKbFiles.map((f) => f.id);

        // 5. Trigger vectorization for all KB files
        if (allKbFileIds.length > 0) {
          await vectorizeFiles(allKbFileIds).catch((e) => console.warn("[FormsAI] vectorization failed:", e));
        }
      }

      runInAction(() => {
        this.isSyncingKB = false;
      });
    } catch (e) {
      console.error("[FormsAI] syncCompletedForms failed:", e);
      runInAction(() => {
        this.isSyncingKB = false;
      });
    }
  };

  get isSyncing() {
    return this.isSyncingKB;
  }
}

export const FormsAiAgentStoreContext = React.createContext<FormsAiAgentStore>(
  new FormsAiAgentStore(),
);

export const FormsAiAgentStoreContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const store = React.useMemo(() => new FormsAiAgentStore(), []);
  return (
    <FormsAiAgentStoreContext.Provider value={store}>
      {children}
    </FormsAiAgentStoreContext.Provider>
  );
};

export const useFormsAiAgentStore = () => {
  return React.useContext(FormsAiAgentStoreContext);
};
