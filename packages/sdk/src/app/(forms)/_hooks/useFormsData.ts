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

import { useCallback, useRef } from "react";

import api from "@docspace/shared/api";
import FilesFilter from "@docspace/shared/api/files/filter";
import type { TFile } from "@docspace/shared/api/files/types";
import { FilterType } from "@docspace/shared/enums";

import { PAGE_COUNT } from "@/utils/constants";
import { FormsSection } from "@/types/forms";

import { useFormsSettingsStore } from "../_store/FormsSettingsStore";
import { useFormsListStore } from "../_store/FormsListStore";
import { useFormsNavigationStore } from "../_store/FormsNavigationStore";

export default function useFormsData() {
  const formsSettingsStore = useFormsSettingsStore();
  const formsListStore = useFormsListStore();
  const { activeSection } = useFormsNavigationStore();
  const requestRunning = useRef(false);
  const currentPage = useRef(0);

  const getFolderId = useCallback(
    (section?: FormsSection) => {
      const sec = section ?? activeSection;
      switch (sec) {
        case FormsSection.MyForms:
          return formsSettingsStore.myFormsFolderId;
        case FormsSection.FormsToFill:
          return formsSettingsStore.formsToFillFolderId;
        case FormsSection.CompletedForms:
          return formsSettingsStore.completedFormsFolderId;
        default:
          return formsSettingsStore.myFormsFolderId;
      }
    },
    [activeSection, formsSettingsStore],
  );

  const filterByFolder = (
    files: TFile[],
    folderId: string | number,
    section: FormsSection,
  ) => {
    if (section === FormsSection.CompletedForms) return files;
    const id = Number(folderId);
    return files.filter((f) => f.folderId === id);
  };

  const fetchSection = useCallback(
    async (section?: FormsSection) => {
      if (requestRunning.current) return;
      requestRunning.current = true;

      const folderId = getFolderId(section);
      if (!folderId) {
        requestRunning.current = false;
        return;
      }

      formsListStore.setIsLoading(true);

      const sec = section ?? activeSection;

      try {
        const filter = FilesFilter.getDefault();
        filter.page = 0;
        filter.pageCount = PAGE_COUNT;
        filter.filterType = FilterType.PDFForm;

        const res = await api.files.getFolder(
          folderId,
          filter,
          new AbortController().signal,
          formsSettingsStore.requestToken || undefined,
        );

        const files = filterByFolder(res.files, folderId, sec);
        formsListStore.setItems(files, files.length);
        currentPage.current = 0;
      } catch {
        formsListStore.setItems([], 0);
        currentPage.current = 0;
      } finally {
        formsListStore.setIsLoading(false);
        requestRunning.current = false;
      }
    },
    [getFolderId, formsListStore, formsSettingsStore.requestToken],
  );

  const fetchMore = useCallback(async () => {
    if (!formsListStore.hasMore || requestRunning.current) return;
    requestRunning.current = true;

    const folderId = getFolderId();
    if (!folderId) {
      requestRunning.current = false;
      return;
    }

    try {
      const filter = FilesFilter.getDefault();
      filter.page = currentPage.current + 1;
      filter.pageCount = PAGE_COUNT;
      filter.filterType = FilterType.PDFForm;

      const res = await api.files.getFolder(
        folderId,
        filter,
        new AbortController().signal,
        formsSettingsStore.requestToken || undefined,
      );

      const files = filterByFolder(res.files, folderId, activeSection);
      formsListStore.appendItems(files, formsListStore.items.length + files.length);
      currentPage.current += 1;
    } finally {
      requestRunning.current = false;
    }
  }, [getFolderId, formsListStore, formsSettingsStore.requestToken, activeSection]);

  return { fetchSection, fetchMore };
}
