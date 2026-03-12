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
import type { TDefaultProvider } from "@docspace/shared/api/ai/types";
import type { TFolder } from "@docspace/shared/api/files/types";
import {
  getAIAgent,
  getProviders,
  getAIConfig,
  createAIAgent,
  deleteAIAgent,
} from "@docspace/shared/api/ai";

import {
  tokenToHash,
  copyFilesToAgentRoom,
  vectorizeFiles,
  getKnowledgeFiles,
  getKnowledgeFolderId,
  loadFolderAgentsMap,
  saveFolderAgentsMap,
  clearFolderAgentsMap,
  saveAiEnabled,
  loadAiEnabled,
  type FolderAgentsMap,
  type FolderAgentEntry,
} from "../_api/aiAgentSettings";

class FormsAiAgentStore {
  isPanelVisible = false;

  // Per-folder agent mapping: completedFolderId → { agentId, knowledgeFolderId }
  folderAgentsMap: FolderAgentsMap = {};

  // Current active folder agent (set when entering a completed subfolder)
  currentFolderId: number | null = null;
  agentChatSettings: TAIRoomChatSettings | undefined = undefined;

  // AI agent toggle
  aiAgentEnabled = false;

  // AI providers availability
  aiProvidersAvailable = false;
  isCheckingProviders = false;

  // Knowledge base (vectorization) availability
  vectorizationEnabled = false;

  // Default AI provider (fetched server-side)
  defaultProvider: TDefaultProvider | null = null;

  // Knowledge base sync
  isSyncingKB = false;

  // Bulk agent creation progress
  isCreatingAgents = false;

  // Room context
  private _roomId: string | number = "";
  private _userHash: string | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setDefaultProvider = (provider: TDefaultProvider) => {
    this.defaultProvider = provider;
  };

  setAiAgentEnabled = (value: boolean) => {
    this.aiAgentEnabled = value;
    saveAiEnabled(this._roomId, value, this._userHash);
  };

  /** Disable AI agents: reset local state and delete agents on server. */
  disableAiAgents = async () => {
    const agentIds = Object.values(this.folderAgentsMap).map(
      (e) => e.agentId,
    );

    // Reset UI state immediately so the user sees the toggle off
    runInAction(() => {
      this.aiAgentEnabled = false;
      this.isPanelVisible = false;
      this.currentFolderId = null;
      this.agentChatSettings = undefined;
      this.folderAgentsMap = {};
      this.isSyncingKB = false;
      this.isCreatingAgents = false;
    });

    // Delete agents on the server first, then persist to localStorage
    const results = await Promise.allSettled(
      agentIds.map((id) => deleteAIAgent(id)),
    );

    const failedIds: number[] = [];
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        failedIds.push(agentIds[i]);
      }
    });

    if (failedIds.length > 0) {
      // Keep entries for agents that failed to delete so they can be
      // retried on the next disable attempt instead of becoming orphans.
      const surviving: FolderAgentsMap = {};
      for (const [folderId, entry] of Object.entries(
        loadFolderAgentsMap(this._roomId, this._userHash),
      )) {
        if (failedIds.includes(entry.agentId)) {
          surviving[Number(folderId)] = entry;
        }
      }

      runInAction(() => {
        this.folderAgentsMap = surviving;
      });
      saveFolderAgentsMap(this._roomId, surviving, this._userHash);
    } else {
      clearFolderAgentsMap(this._roomId, this._userHash);
    }

    saveAiEnabled(this._roomId, false, this._userHash);
  };

  openPanel = () => {
    this.isPanelVisible = true;
  };

  closePanel = () => {
    this.isPanelVisible = false;
  };

  togglePanel = () => {
    this.isPanelVisible = !this.isPanelVisible;
  };

  // --- AI Provider availability check ---

  checkAiAvailability = async () => {
    if (this.isCheckingProviders) return;

    this.isCheckingProviders = true;
    try {
      const [providers, aiConfig] = await Promise.all([
        getProviders().catch(() => []),
        getAIConfig().catch(() => null),
      ]);

      runInAction(() => {
        this.aiProvidersAvailable = providers.length > 0;
        this.vectorizationEnabled = aiConfig?.vectorizationEnabled ?? false;
        this.isCheckingProviders = false;
      });
    } catch {
      runInAction(() => {
        this.aiProvidersAvailable = false;
        this.vectorizationEnabled = false;
        this.isCheckingProviders = false;
      });
    }
  };

  // --- Room initialization ---

  initForRoom = (roomId: string | number, requestToken?: string) => {
    this._roomId = roomId;
    this._userHash = requestToken ? tokenToHash(requestToken) : undefined;
    this.folderAgentsMap = loadFolderAgentsMap(roomId, this._userHash);
    this.aiAgentEnabled = loadAiEnabled(roomId, this._userHash);
  };

  // --- Per-folder agent management ---

  get currentAgentId(): number | null {
    if (!this.currentFolderId) return null;
    return this.folderAgentsMap[this.currentFolderId]?.agentId ?? null;
  }

  get currentKnowledgeFolderId(): number | null {
    if (!this.currentFolderId) return null;
    return (
      this.folderAgentsMap[this.currentFolderId]?.knowledgeFolderId ?? null
    );
  }

  /** Set the currently active completed folder and load its agent chat settings. */
  setCurrentFolder = async (folderId: number | null) => {
    this.currentFolderId = folderId;
    this.agentChatSettings = undefined;

    if (folderId) {
      const entry = this.folderAgentsMap[folderId];
      if (entry?.agentId) {
        // Auto-open panel when entering a completed folder with an agent
        this.isPanelVisible = true;
        await this.fetchAgentChatSettings(entry.agentId);
      }
    } else {
      this.isPanelVisible = false;
    }
  };

  private persistMap = () => {
    if (this._roomId) {
      saveFolderAgentsMap(this._roomId, this.folderAgentsMap, this._userHash);
    }
  };

  /** Create an AI agent for a single completed folder and copy its files to the KB. */
  createAgentForFolder = async (
    folder: TFolder,
    files: { id: number; title: string }[],
  ): Promise<FolderAgentEntry | null> => {
    let agent;
    try {
      agent = await createAIAgent({
        title: folder.title,
        attachDefaultTools: true,
        ...(this.defaultProvider && {
          chatSettings: {
            providerId: this.defaultProvider.providerId,
            modelId: this.defaultProvider.defaultModel,
          },
        }),
      });
    } catch {
      return null;
    }

    const kbFolderId = await getKnowledgeFolderId(agent.id).catch(() => null);

    const entry: FolderAgentEntry = {
      agentId: agent.id,
      knowledgeFolderId: kbFolderId,
    };

    runInAction(() => {
      this.folderAgentsMap = { ...this.folderAgentsMap, [folder.id]: entry };
      this.persistMap();
    });

    // Copy files to KB — best-effort, agent is already saved
    if (kbFolderId && files.length > 0) {
      try {
        await copyFilesToAgentRoom(
          kbFolderId,
          files.map((f) => f.id),
        );

        const kbFiles = await getKnowledgeFiles(kbFolderId);
        if (kbFiles.length > 0) {
          await vectorizeFiles(kbFiles.map((f) => f.id));
        }
      } catch {
        // KB sync failed — agent is still saved, will retry on next sync
      }
    }

    return entry;
  };

  /** Check if an agent in the map still exists on the server. */
  private validateAgent = async (agentId: number): Promise<boolean> => {
    try {
      await getAIAgent(agentId);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Create agents for all completed folders that don't have one yet.
   * Called when the "Enable AI Agent" toggle is turned on.
   * `foldersWithFiles` is an array of { folder, files } for each completed subfolder.
   */
  ensureAgentsForFolders = async (
    foldersWithFiles: {
      folder: TFolder;
      files: { id: number; title: string }[];
    }[],
  ) => {
    if (this.isCreatingAgents) return;

    runInAction(() => {
      this.isCreatingAgents = true;
    });

    try {
      for (const { folder, files } of foldersWithFiles) {
        // Stop if disabled mid-creation
        if (!this.aiAgentEnabled) break;

        const existing = this.folderAgentsMap[folder.id];

        if (existing) {
          // Validate the agent still exists on the server
          const valid = await this.validateAgent(existing.agentId);
          if (valid) continue;

          // Agent was deleted externally — remove stale entry
          runInAction(() => {
            const { [folder.id]: _, ...rest } = this.folderAgentsMap;
            this.folderAgentsMap = rest;
            this.persistMap();
          });
        }

        await this.createAgentForFolder(folder, files);
      }
    } finally {
      runInAction(() => {
        this.isCreatingAgents = false;
      });
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

  // --- Knowledge base sync for current folder ---

  syncCompletedForms = async (files: { id: number; title: string }[]) => {
    const agentId = this.currentAgentId;
    const kbFolderId = this.currentKnowledgeFolderId;

    if (!agentId || !kbFolderId) return;
    if (files.length === 0) return;
    if (this.isSyncingKB) return;

    try {
      runInAction(() => {
        this.isSyncingKB = true;
      });

      // 1. Get existing files in KB to avoid duplicates
      const kbFiles = await getKnowledgeFiles(kbFolderId);
      const kbTitles = new Set(kbFiles.map((f) => f.title));

      // 2. Filter out files that are already in KB (by title)
      const newFiles = files.filter((f) => !kbTitles.has(f.title));

      if (newFiles.length > 0) {
        // 3. Copy new forms to KB folder (waits for completion)
        await copyFilesToAgentRoom(
          kbFolderId,
          newFiles.map((f) => f.id),
        );

        // 4. Re-fetch KB files to get IDs of newly copied files
        const updatedKbFiles = await getKnowledgeFiles(kbFolderId);
        const allKbFileIds = updatedKbFiles.map((f) => f.id);

        // 5. Trigger vectorization for all KB files
        if (allKbFileIds.length > 0) {
          await vectorizeFiles(allKbFileIds).catch(() => {});
        }
      }

      runInAction(() => {
        this.isSyncingKB = false;
      });
    } catch {
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
