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

import { useState, useEffect, useRef, useCallback } from "react";
import { getUserPhoto } from "@docspace/shared/api/people";
import type {
  EditorUser,
  UserPhoto,
  UseEditorsDataProps,
  UseEditorsDataReturn,
} from "../EditorsTooltip.types";

const createEditorsArray = (
  activeEditors: Record<string, string> | undefined,
  editingBy: Record<string, string> | undefined,
  currentUserId?: string,
): EditorUser[] => {
  const currentEditingBy = activeEditors || editingBy;

  if (!currentEditingBy) return [];

  return Object.entries(currentEditingBy).map(([id, name]) => ({
    id,
    name: currentUserId && id === currentUserId ? "Me" : name,
    photo: null,
  }));
};

const loadEditorsPhotos = async (
  editors: EditorUser[],
): Promise<EditorUser[]> => {
  if (editors.length === 0) return editors;

  const editorsNeedingPhotos = editors.filter(
    (editor) => editor.photo === null,
  );

  if (editorsNeedingPhotos.length === 0) return editors;

  try {
    const photoResults = await Promise.allSettled(
      editorsNeedingPhotos.map((editor) => getUserPhoto(editor.id)),
    );

    const photoMap = new Map<string, UserPhoto>();
    editorsNeedingPhotos.forEach((editor, index) => {
      const result = photoResults[index];
      if (result.status === "fulfilled") {
        photoMap.set(editor.id, result.value as UserPhoto);
      }
    });

    const editorsWithPhotos = editors.map((editor) => {
      if (editor.photo !== null) return editor;

      return {
        ...editor,
        photo: photoMap.get(editor.id) || null,
      };
    });

    return editorsWithPhotos;
  } catch (e) {
    console.error("Failed to load editors photos:", e);
    return editors;
  }
};

export const useEditorsData = ({
  activeEditors,
  editingBy,
  currentUserId,
}: UseEditorsDataProps): UseEditorsDataReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [editors, setEditors] = useState<EditorUser[]>(() =>
    createEditorsArray(activeEditors, editingBy, currentUserId),
  );
  const photosLoadedRef = useRef(false);

  // Update editors array when source data changes
  useEffect(() => {
    setEditors(createEditorsArray(activeEditors, editingBy, currentUserId));
    photosLoadedRef.current = false;
  }, [editingBy, activeEditors, currentUserId]);

  // Load photos when tooltip opens
  useEffect(() => {
    if (isOpen && editors.length > 0 && !photosLoadedRef.current) {
      photosLoadedRef.current = true;
      loadEditorsPhotos(editors).then((editorsWithLoadedPhotos) => {
        setEditors(editorsWithLoadedPhotos);
      });
    }

    if (!isOpen) {
      photosLoadedRef.current = false;
    }
  }, [isOpen, editors]);

  const openTooltip = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeTooltip = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    editors,
    isOpen,
    openTooltip,
    closeTooltip,
    setIsOpen,
  };
};
