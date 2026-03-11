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

import { request } from "@docspace/shared/api/client";
import { getProgress } from "@docspace/shared/api/files";
import type { TOperation } from "@docspace/shared/api/files/types";
import { FolderType } from "@docspace/shared/enums";

const AGENT_STORAGE_KEY = "forms_ai_agent";
const FOLDER_AGENTS_STORAGE_KEY = "forms_folder_agents";
const AI_ENABLED_STORAGE_KEY = "forms_ai_enabled";

/** Simple non-crypto hash to turn a long token into a short key. */
export const tokenToHash = (token: string): string => {
  let h = 0;
  for (let i = 0; i < token.length; i++) {
    h = (Math.imul(31, h) + token.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
};

export type AgentSettings = {
  agentId: number | null;
  agentName: string;
  autoSyncKnowledge: boolean;
  knowledgeFolderId: number | null;
};

export type FolderAgentEntry = {
  agentId: number;
  knowledgeFolderId: number | null;
};

export type FolderAgentsMap = Record<number, FolderAgentEntry>;

/**
 * Build a per-user storage key so that switching accounts on the
 * same browser does not leak agent configuration to another user.
 * `userHash` should be a stable, non-sensitive user identifier
 * (e.g. a short hash of the auth token or the numeric user ID).
 */
const storageKey = (roomId: string | number, userHash?: string) =>
  userHash
    ? `${AGENT_STORAGE_KEY}_${userHash}_${roomId}`
    : `${AGENT_STORAGE_KEY}_${roomId}`;

const folderAgentsKey = (roomId: string | number, userHash?: string) =>
  userHash
    ? `${FOLDER_AGENTS_STORAGE_KEY}_${userHash}_${roomId}`
    : `${FOLDER_AGENTS_STORAGE_KEY}_${roomId}`;

export const saveAgentSettings = (
  roomId: string | number,
  settings: AgentSettings,
  userHash?: string,
) => {
  localStorage.setItem(storageKey(roomId, userHash), JSON.stringify(settings));
};

export const loadAgentSettings = (
  roomId: string | number,
  userHash?: string,
): AgentSettings | null => {
  try {
    const val = localStorage.getItem(storageKey(roomId, userHash));
    return val ? (JSON.parse(val) as AgentSettings) : null;
  } catch {
    return null;
  }
};

export const clearAgentSettings = (
  roomId: string | number,
  userHash?: string,
) => {
  localStorage.removeItem(storageKey(roomId, userHash));
};

// --- Per-folder agent mappings ---

export const saveFolderAgentsMap = (
  roomId: string | number,
  map: FolderAgentsMap,
  userHash?: string,
) => {
  localStorage.setItem(
    folderAgentsKey(roomId, userHash),
    JSON.stringify(map),
  );
};

export const loadFolderAgentsMap = (
  roomId: string | number,
  userHash?: string,
): FolderAgentsMap => {
  try {
    const val = localStorage.getItem(folderAgentsKey(roomId, userHash));
    return val ? (JSON.parse(val) as FolderAgentsMap) : {};
  } catch {
    return {};
  }
};

export const clearFolderAgentsMap = (
  roomId: string | number,
  userHash?: string,
) => {
  localStorage.removeItem(folderAgentsKey(roomId, userHash));
};

// --- AI enabled toggle persistence ---

const aiEnabledKey = (roomId: string | number, userHash?: string) =>
  userHash
    ? `${AI_ENABLED_STORAGE_KEY}_${userHash}_${roomId}`
    : `${AI_ENABLED_STORAGE_KEY}_${roomId}`;

export const saveAiEnabled = (
  roomId: string | number,
  enabled: boolean,
  userHash?: string,
) => {
  localStorage.setItem(aiEnabledKey(roomId, userHash), String(enabled));
};

export const loadAiEnabled = (
  roomId: string | number,
  userHash?: string,
): boolean => {
  return localStorage.getItem(aiEnabledKey(roomId, userHash)) === "true";
};

// --- Knowledge base helpers ---

export const getKnowledgeFolderId = async (
  agentId: number,
): Promise<number | null> => {
  const res = (await request({
    method: "get",
    url: `/files/${agentId}`,
  })) as {
    folders?: { id: number; type: number; title: string }[];
    current?: { id: number; security?: Record<string, boolean> };
  };

  console.log(
    "[FormsAI] getKnowledgeFolderId for agent",
    agentId,
    "folders:",
    res?.folders?.map((f) => ({ id: f.id, type: f.type, title: f.title })),
    "room security:",
    res?.current?.security,
  );

  const kbFolder = res?.folders?.find((f) => f.type === FolderType.Knowledge);

  if (kbFolder) {
    console.log(
      "[FormsAI] Found Knowledge folder:",
      kbFolder.id,
      "title:",
      kbFolder.title,
    );
  } else {
    console.warn(
      "[FormsAI] No Knowledge folder (type=32) found in agent room",
      agentId,
    );
  }

  return kbFolder?.id ?? null;
};

const pollOperation = async (opId: string, maxAttempts = 30) => {
  let misses = 0;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const ops = await getProgress(opId);
    const op = ops?.find((o: TOperation) => o.id === opId);
    if (!op) {
      // Operation may not appear immediately; allow a few misses,
      // then treat as error.
      misses++;
      if (misses > 3) {
        throw new Error("Copy operation not found");
      }
      continue;
    }
    if (op.error) throw new Error(op.error);
    if (op.finished) return op;
  }
  throw new Error("Copy operation timed out");
};

export const copyFilesToAgentRoom = async (
  destFolderId: number,
  fileIds: number[],
) => {
  console.log(
    "[FormsAI] copyFilesToAgentRoom: destFolderId =",
    destFolderId,
    "fileIds =",
    fileIds,
  );

  const ops = (await request({
    method: "put",
    url: "/files/fileops/copy",
    data: {
      destFolderId,
      folderIds: [],
      fileIds,
      conflictResolveType: 0, // Skip if already exists
      deleteAfter: false,
      content: false,
    },
  })) as TOperation[];

  // Wait for copy to finish
  if (ops?.[0]?.id && !ops[0].finished) {
    await pollOperation(ops[0].id);
  }
};

export const vectorizeFiles = async (fileIds: number[]) => {
  return request({
    method: "post",
    url: "/ai/vectorization/tasks",
    data: { files: fileIds },
  });
};

type KnowledgeFile = { id: number; title: string };

export const getKnowledgeFiles = async (
  knowledgeFolderId: number,
): Promise<KnowledgeFile[]> => {
  const res = (await request({
    method: "get",
    url: `/files/${knowledgeFolderId}`,
  })) as { files?: KnowledgeFile[] };
  return res?.files ?? [];
};
