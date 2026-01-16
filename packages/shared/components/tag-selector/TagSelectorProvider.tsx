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

import unionBy from "lodash/unionBy";
import React, {
  createContext,
  useOptimistic,
  useState,
  useMemo,
  useDeferredValue,
  useCallback,
  startTransition,
  use,
} from "react";

import { getTags, editRoom } from "../../api/rooms";

import type {
  TTag,
  TagSelectorContextValue,
  TagSelectorProviderProps,
} from "./TagSelector.types";

export function createTagsResource() {
  const tagsPromise = getTags();
  return tagsPromise || Promise.resolve([]);
}

const TagSelectorContext = createContext<TagSelectorContextValue | null>(null);

export const TagSelectorProvider: React.FC<TagSelectorProviderProps> = ({
  children,
  initialTags,
  roomId,
  tagsResource,
}) => {
  const fetchedTags = tagsResource ? use(tagsResource) : [];

  const [tags, setTags] = useState<TTag[]>(() => {
    const initial = initialTags.map((tag) => ({
      name: typeof tag === "string" ? tag : tag.label,
      checked: true,
    }));

    if (fetchedTags && fetchedTags.length > 0) {
      return unionBy(
        initial,
        fetchedTags.map((tag: string) => ({ name: tag, checked: false })),
        "name",
      );
    }

    return initial;
  });

  const [optimisticTags, addOptimisticTag] = useOptimistic(
    tags,
    (state, newTag: TTag) => [...state, newTag],
  );

  const [searchValue, setSearchValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const deferredSearchValue = useDeferredValue(searchValue);

  const filteredTags = useMemo(() => {
    const search = deferredSearchValue.toLowerCase().trim();
    return optimisticTags.filter((tag) =>
      tag.name.toLowerCase().includes(search),
    );
  }, [optimisticTags, deferredSearchValue]);

  const showCreateTag = useMemo(() => {
    const trimmedValue = deferredSearchValue.trim();
    return (
      trimmedValue.length > 0 &&
      filteredTags.every((tag) => tag.name !== trimmedValue)
    );
  }, [deferredSearchValue, filteredTags]);

  const toggleChecked = useCallback((index: number) => {
    setTags((prev) => {
      const newTags = [...prev];
      newTags[index].checked = !newTags[index].checked;
      return newTags;
    });
  }, []);

  const handleEdit = useCallback(
    (index: number) => {
      setEditingIndex(index);
      setEditValue(tags[index].name);
    },
    [tags],
  );

  const confirmEdit = useCallback(() => {
    if (editingIndex === null) return;
    startTransition(() => {
      setTags((prev) => {
        const newTags = [...prev];
        newTags[editingIndex].name = editValue.trim();
        return newTags;
      });
      setEditingIndex(null);
      setEditValue("");
    });
  }, [editingIndex, editValue]);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditValue("");
  }, []);

  const deleteTag = useCallback((index: number) => {
    startTransition(() => {
      setTags((prev) => {
        const newTags = [...prev];
        newTags.splice(index, 1);
        return newTags;
      });
    });
  }, []);

  const handleCreateTag = useCallback(async () => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue.length === 0) return;

    const newTag: TTag = { name: trimmedValue, checked: true };
    addOptimisticTag(newTag);

    try {
      const newTags = [...initialTags, trimmedValue];
      await editRoom(roomId, { tags: newTags });
      setTags((prev) => [...prev, newTag]);
      setSearchValue("");
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  }, [searchValue, roomId, initialTags, addOptimisticTag]);

  const value = useMemo<TagSelectorContextValue>(
    () => ({
      tags,
      optimisticTags,
      searchValue,
      deferredSearchValue,
      editingIndex,
      editValue,
      filteredTags,
      showCreateTag,
      roomId,
      setSearchValue,
      setEditingIndex,
      setEditValue,
      toggleChecked,
      handleEdit,
      confirmEdit,
      cancelEdit,
      deleteTag,
      handleCreateTag,
      addOptimisticTag,
    }),
    [
      tags,
      optimisticTags,
      searchValue,
      deferredSearchValue,
      editingIndex,
      editValue,
      filteredTags,
      showCreateTag,
      roomId,
      toggleChecked,
      handleEdit,
      confirmEdit,
      cancelEdit,
      deleteTag,
      handleCreateTag,
      addOptimisticTag,
    ],
  );

  return (
    <TagSelectorContext.Provider value={value}>
      {children}
    </TagSelectorContext.Provider>
  );
};

export const useTagSelector = () => {
  const context = React.use(TagSelectorContext);
  if (!context) {
    throw new Error("useTagSelector must be used within TagSelectorProvider");
  }
  return context;
};
