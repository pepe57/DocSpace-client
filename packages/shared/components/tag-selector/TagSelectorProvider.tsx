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

import React, {
  createContext,
  useMemo,
  useState,
  useDeferredValue,
  useCallback,
} from "react";

import type {
  TTag,
  TagSelectorContextValue,
  TagSelectorProviderProps,
} from "./TagSelector.types";

type TagSelectorStateContext = {
  tags: TTag[];
  searchValue: string;
  deferredSearchValue: string;
  filteredTags: TTag[];
  showCreateTag: boolean;
  setSearchValue: (value: string) => void;
  clearSearch: () => void;
};

const TagSelectorStateContext = createContext<TagSelectorStateContext | null>(
  null,
);

export const TagSelectorProvider: React.FC<TagSelectorProviderProps> = ({
  children,
  fetchedTags,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const deferredSearchValue = useDeferredValue(searchValue);

  const filteredTags = useMemo(() => {
    const search = deferredSearchValue.toLowerCase().trim();
    if (!search) return fetchedTags;
    return fetchedTags.filter((tag) => tag.name.toLowerCase().includes(search));
  }, [fetchedTags, deferredSearchValue]);

  const showCreateTag = useMemo(() => {
    const trimmedValue = deferredSearchValue.trim();
    return (
      trimmedValue.length > 0 &&
      filteredTags.every((tag) => tag.name.trim() !== trimmedValue)
    );
  }, [deferredSearchValue, filteredTags]);

  console.log({ filteredTags, showCreateTag, deferredSearchValue });

  const clearSearch = useCallback(() => {
    setSearchValue("");
  }, []);

  const value = useMemo<TagSelectorStateContext>(
    () => ({
      tags: fetchedTags,
      searchValue,
      deferredSearchValue,
      filteredTags,
      showCreateTag,
      setSearchValue,
      clearSearch,
    }),
    [
      fetchedTags,
      searchValue,
      deferredSearchValue,
      filteredTags,
      showCreateTag,
      clearSearch,
    ],
  );

  return (
    <TagSelectorStateContext.Provider value={value}>
      {children}
    </TagSelectorStateContext.Provider>
  );
};

export const useTagSelector = (): TagSelectorContextValue => {
  const context = React.use(TagSelectorStateContext);
  if (!context) {
    throw new Error("useTagSelector must be used within TagSelectorProvider");
  }
  return context;
};
