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
import { observer } from "mobx-react";
import { usePathname } from "next/navigation";

import type { TFile, TFilesSettings } from "@docspace/shared/api/files/types";

import useItemIcon from "@/app/(docspace)/_hooks/useItemIcon";
import useItemList from "@/app/(docspace)/_hooks/useItemList";

import { FormsSection } from "@/types/forms";

import { sectionFromPathname } from "../../_utils/sectionFromPathname";
import { useFormsListStore } from "../../_store/FormsListStore";
import { useFormsNavigationStore } from "../../_store/FormsNavigationStore";
import useFormsContextMenu from "../../_hooks/useFormsContextMenu";
import FormsEmpty from "../forms-empty";
import FormsTile from "./FormsTile";
import SubFolderTile from "./SubFolderTile";
import styles from "./FormsTile.module.scss";

type FormsGridProps = {
  filesSettings: TFilesSettings;
  fetchMore: () => Promise<void>;
};

const FormsGrid = ({ filesSettings, fetchMore }: FormsGridProps) => {
  const { items, folders, hasMore, isLoading } = useFormsListStore();
  const pathname = usePathname();
  const activeSection = sectionFromPathname(pathname);
  const {
    completedFolder,
    inProgressFolder,
    openCompletedFolder,
    openInProgressFolder,
  } = useFormsNavigationStore();
  const { getIcon } = useItemIcon({ filesSettings });
  const { convertFileToItem } = useItemList({
    getIcon,
  });
  const { getFolderContextMenuModel } = useFormsContextMenu();

  const isCompletedRoot =
    activeSection === FormsSection.CompletedForms && !completedFolder;
  const isInProgressRoot =
    activeSection === FormsSection.InProgress && !inProgressFolder;
  const isFoldersRoot = isCompletedRoot || isInProgressRoot;

  const fileItems = React.useMemo(
    () => items.map((file: TFile) => convertFileToItem(file)),
    [items, convertFileToItem],
  );

  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const fetchMoreRef = React.useRef(fetchMore);
  fetchMoreRef.current = fetchMore;

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const scroller = document.querySelector(
      "#sectionScroll .scroll-wrapper > .scroller",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchMoreRef.current();
        }
      },
      {
        root: scroller ?? null,
        rootMargin: "200px",
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, items.length]);

  const hasFolders = folders.length > 0;
  const hasItems = items.length > 0;

  if (!hasFolders && !hasItems) {
    return isLoading ? null : <FormsEmpty />;
  }

  if ((isFoldersRoot || !hasItems) && hasFolders) {
    const onOpenFolder = isCompletedRoot
      ? openCompletedFolder
      : openInProgressFolder;
    return (
      <div className={styles.foldersGrid}>
        {folders.map((folder) => (
          <SubFolderTile
            key={`folder_${folder.id}`}
            folder={folder}
            getIcon={getIcon}
            onOpenFolder={onOpenFolder}
            contextOptions={getFolderContextMenuModel(folder)}
          />
        ))}
      </div>
    );
  }

  if (hasItems) {
    return (
      <>
        <div className={styles.filesGrid}>
          {fileItems.map((item) => (
            <FormsTile key={`file_${item.id}`} item={item} getIcon={getIcon} />
          ))}
        </div>
        {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
      </>
    );
  }

  return isLoading ? null : <FormsEmpty />;
};

export default observer(FormsGrid);
