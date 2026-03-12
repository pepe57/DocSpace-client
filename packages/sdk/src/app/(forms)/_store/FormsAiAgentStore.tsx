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
import type {
  TAIConfig,
  TDefaultProvider,
} from "@docspace/shared/api/ai/types";
import type { TFolder } from "@docspace/shared/api/files/types";
import {
  getAIAgent,
  getProviders,
  getAIConfig,
  createAIAgent,
  deleteAIAgent,
} from "@docspace/shared/api/ai";

import {
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
  folderAgentsMap: FolderAgentsMap = {};
  currentFolderId: number | null = null;
  agentChatSettings: TAIRoomChatSettings | undefined = undefined;
  aiAgentEnabled = false;
  aiProvidersAvailable = false;
  isCheckingProviders = false;
  vectorizationEnabled = false;
  aiConfig: TAIConfig | null = null;
  defaultProvider: TDefaultProvider | null = null;
  isSyncingKB = false;
  isCreatingAgents = false;

  private _folderVersion = 0;
  private _roomId: string | number = "";
  private _userKey: string | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setDefaultProvider = (provider: TDefaultProvider) => {
    this.defaultProvider = provider;
  };

  setAiAgentEnabled = (value: boolean) => {
    this.aiAgentEnabled = value;
    saveAiEnabled(this._roomId, value, this._userKey);
  };

  disableAiAgents = async () => {
    const agentIds = Object.values(this.folderAgentsMap).map(
      (e) => e.agentId,
    );

    runInAction(() => {
      this.aiAgentEnabled = false;
      this.isPanelVisible = false;
      this.currentFolderId = null;
      this.agentChatSettings = undefined;
      this.folderAgentsMap = {};
      this.isSyncingKB = false;
      this.isCreatingAgents = false;
    });

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
      const surviving: FolderAgentsMap = {};
      for (const [folderId, entry] of Object.entries(
        loadFolderAgentsMap(this._roomId, this._userKey),
      )) {
        if (failedIds.includes(entry.agentId)) {
          surviving[Number(folderId)] = entry;
        }
      }

      runInAction(() => {
        this.folderAgentsMap = surviving;
      });
      saveFolderAgentsMap(this._roomId, surviving, this._userKey);
    } else {
      clearFolderAgentsMap(this._roomId, this._userKey);
    }

    saveAiEnabled(this._roomId, false, this._userKey);
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
        this.aiConfig = aiConfig ?? null;
        this.vectorizationEnabled = aiConfig?.vectorizationEnabled ?? false;
        this.isCheckingProviders = false;
      });
    } catch {
      runInAction(() => {
        this.aiProvidersAvailable = false;
        this.aiConfig = null;
        this.vectorizationEnabled = false;
        this.isCheckingProviders = false;
      });
    }
  };

  initForRoom = (
    roomId: string | number,
    userId?: string | number,
  ) => {
    this._roomId = roomId;
    this._userKey = userId ? String(userId) : undefined;
    this.folderAgentsMap = loadFolderAgentsMap(roomId, this._userKey);
    this.aiAgentEnabled = loadAiEnabled(roomId, this._userKey);
  };

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

  setCurrentFolder = async (folderId: number | null) => {
    const version = ++this._folderVersion;
    this.currentFolderId = folderId;
    this.agentChatSettings = undefined;

    if (folderId) {
      const entry = this.folderAgentsMap[folderId];
      if (entry?.agentId) {
        this.isPanelVisible = true;
        await this.fetchAgentChatSettings(entry.agentId, version);
      }
    } else {
      this.isPanelVisible = false;
    }
  };

  private persistMap = () => {
    if (this._roomId) {
      saveFolderAgentsMap(this._roomId, this.folderAgentsMap, this._userKey);
    }
  };

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
        // best-effort
      }
    }

    return entry;
  };

  private validateAgent = async (agentId: number): Promise<boolean> => {
    try {
      await getAIAgent(agentId);
      return true;
    } catch {
      return false;
    }
  };

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
        if (!this.aiAgentEnabled) break;

        const existing = this.folderAgentsMap[folder.id];

        if (existing) {
          const valid = await this.validateAgent(existing.agentId);
          if (valid) continue;

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

  fetchAgentChatSettings = async (
    agentId: number,
    version?: number,
  ) => {
    try {
      const agent = await getAIAgent(agentId);
      runInAction(() => {
        if (version !== undefined && version !== this._folderVersion) return;
        this.agentChatSettings = agent.chatSettings;
      });
    } catch {
      // ignore
    }
  };

  syncCompletedForms = async (files: { id: number; title: string }[]) => {
    const agentId = this.currentAgentId;
    const kbFolderId = this.currentKnowledgeFolderId;
    const version = this._folderVersion;

    if (!agentId || !kbFolderId) return;
    if (files.length === 0) return;
    if (this.isSyncingKB) return;

    const isStale = () => version !== this._folderVersion;

    try {
      runInAction(() => {
        this.isSyncingKB = true;
      });

      const kbFiles = await getKnowledgeFiles(kbFolderId);
      if (isStale()) return;

      const kbTitles = new Set(kbFiles.map((f) => f.title));
      const newFiles = files.filter((f) => !kbTitles.has(f.title));

      if (newFiles.length > 0) {
        await copyFilesToAgentRoom(
          kbFolderId,
          newFiles.map((f) => f.id),
        );
        if (isStale()) return;

        const updatedKbFiles = await getKnowledgeFiles(kbFolderId);
        if (isStale()) return;

        const allKbFileIds = updatedKbFiles.map((f) => f.id);

        if (allKbFileIds.length > 0) {
          await vectorizeFiles(allKbFileIds).catch(() => {});
        }
      }
    } catch {
      // ignore
    } finally {
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
