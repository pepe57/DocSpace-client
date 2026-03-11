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
import { createThumbnails } from "@docspace/shared/api/files";
import FilesFilter from "@docspace/shared/api/files/filter";
import type { TFile } from "@docspace/shared/api/files/types";
import { thumbnailStatuses } from "@docspace/shared/constants";
import { FilterType } from "@docspace/shared/enums";

import { PAGE_COUNT } from "@/utils/constants";
import { FormsSection } from "@/types/forms";

import { useFormsListStore } from "../_store/FormsListStore";
import { useFormsNavigationStore } from "../_store/FormsNavigationStore";
import { useFormsSettingsStore } from "../_store/FormsSettingsStore";

const requestThumbnails = (files: TFile[]) => {
  const ids = files
    .filter(
      (f) =>
        typeof f.id !== "string" &&
        f.thumbnailStatus === thumbnailStatuses.WAITING,
    )
    .map((f) => f.id);

  if (ids.length) {
    createThumbnails(ids).catch(() => {});
  }
};

const filterByFolder = (
  files: TFile[],
  folderId: string | number,
  section: FormsSection,
) => {
  if (section === FormsSection.CompletedForms) return files;
  const id = Number(folderId);
  return files.filter((f) => f.folderId === id);
};

export default function useFormsData() {
  const formsSettingsStore = useFormsSettingsStore();
  const formsListStore = useFormsListStore();
  const { activeSection } = useFormsNavigationStore();
  const currentPage = useRef(0);
  const apiExhausted = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

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

  const fetchSection = useCallback(
    async (section?: FormsSection) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const folderId = getFolderId(section);
      if (!folderId) return;

      formsListStore.setIsLoading(true);
      apiExhausted.current = false;

      const sec = section ?? activeSection;

      try {
        const filter = FilesFilter.getDefault();
        filter.page = 0;
        filter.pageCount = PAGE_COUNT;
        filter.filterType = FilterType.PDFForm;

        const res = await api.files.getFolder(
          folderId,
          filter,
          controller.signal,
        );

        if (controller.signal.aborted) return;

        const files = filterByFolder(res.files, folderId, sec);
        apiExhausted.current = res.files.length < PAGE_COUNT;
        const total = apiExhausted.current ? files.length : files.length + 1;
        formsListStore.setItems(files, total);
        currentPage.current = 0;
        requestThumbnails(files);

        if (res.current?.security) {
          formsSettingsStore.setFolderSecurity(res.current.security);
        }
      } catch {
        if (controller.signal.aborted) return;
        formsListStore.setItems([], 0);
        currentPage.current = 0;
        apiExhausted.current = true;
      } finally {
        if (!controller.signal.aborted) {
          formsListStore.setIsLoading(false);
        }
      }
    },
    [activeSection, getFolderId, formsListStore, formsSettingsStore],
  );

  const fetchMore = useCallback(async () => {
    if (apiExhausted.current || abortRef.current?.signal.aborted) return;

    const controller = new AbortController();
    abortRef.current = controller;

    const folderId = getFolderId();
    if (!folderId) return;

    try {
      let fetched: TFile[] = [];

      while (!apiExhausted.current && fetched.length === 0) {
        currentPage.current += 1;

        const filter = FilesFilter.getDefault();
        filter.page = currentPage.current;
        filter.pageCount = PAGE_COUNT;
        filter.filterType = FilterType.PDFForm;

        const res = await api.files.getFolder(
          folderId,
          filter,
          controller.signal,
        );

        if (controller.signal.aborted) return;

        fetched = filterByFolder(res.files, folderId, activeSection);
        apiExhausted.current = res.files.length < PAGE_COUNT;
      }

      if (controller.signal.aborted) return;

      const total = apiExhausted.current
        ? formsListStore.items.length + fetched.length
        : formsListStore.items.length + fetched.length + 1;
      formsListStore.appendItems(fetched, total);
      requestThumbnails(fetched);
    } catch {
      // aborted or network error — ignore
    }
  }, [getFolderId, formsListStore, activeSection]);

  return { fetchSection, fetchMore };
}
