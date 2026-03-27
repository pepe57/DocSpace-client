"use client";

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

import React from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import type {
  TFile,
  TFilesSettings,
  TFolder,
} from "@docspace/shared/api/files/types";
import type { TSettings } from "@docspace/shared/api/settings/types";
import type { TPathParts } from "@docspace/shared/types";
import { FolderType, DeviceType } from "@docspace/shared/enums";

import { SectionWrapper } from "@/app/(docspace)/_components/section";
import Header from "@/app/(docspace)/_components/header";
import useDeviceType from "@/hooks/useDeviceType";
import { Filter } from "@/app/(docspace)/_components/filter";
import SelectionArea from "@/app/(docspace)/_components/selection-area";
import FilesMediaViewer from "@/app/(docspace)/_components/FilesMediaViewer";
import { DeviceTypeObserver } from "@/app/(docspace)/_components/DeviceTypeObserver";
import Dialogs from "@/app/(docspace)/_components/dialogs";
import RootScrollbar from "@/app/(docspace)/_components/RootScrollbar";
import List from "@/app/(docspace)/(files)/_components/list";
import { OpenFileContext } from "@/app/(docspace)/_contexts/OpenFileContext";
import { ShareContext } from "@/app/(docspace)/_contexts/ShareContext";
import { DeleteContext } from "@/app/(docspace)/_contexts/DeleteContext";
import type { TFileItem, TFolderItem } from "@/app/(docspace)/_hooks/useItemList";
import { useSettingsStore } from "@/app/(docspace)/_store/SettingsStore";
import { useFilesListStore } from "@/app/(docspace)/_store/FilesListStore";

import { SidebarProvider, useSidebar } from "../../_contexts/SidebarContext";
import DocsMainButton from "../main-button";
import { useInfoPanelStore } from "../../_store/InfoPanelStore";
import useDocsActions from "../../_hooks/useDocsActions";
import useTrashActions from "../../_hooks/useTrashActions";
import DocsSidebar from "../sidebar";
import DropZone from "../drop-zone";
import DeleteDialog from "../delete-dialog";
import DocsInfoPanel from "../info-panel";

import styles from "./DocsLayout.module.scss";

type DocsLayoutProps = {
  folders: TFolder[];
  files: TFile[];
  total: number;
  current: TFolder;
  pathParts: TPathParts[];
  filesSettings: TFilesSettings;
  portalSettings: TSettings;
  filesFilter: string;
};

const DocsLayoutInner = observer(({
  folders,
  files,
  total,
  current,
  pathParts,
  filesSettings,
  portalSettings,
  filesFilter,
}: DocsLayoutProps) => {
  const { isEmptyList } = useSettingsStore();
  const { rootFolderType } = useFilesListStore();
  const { currentDeviceType } = useSidebar();
  const infoPanelStore = useInfoPanelStore();
  const router = useRouter();

  const isMyDocuments = rootFolderType === FolderType.USER;
  const showMobileButton = currentDeviceType !== DeviceType.desktop && isMyDocuments;


  const { uploadFilesToFolder } = useDocsActions();
  const {
    isTrash,
    requestDeleteItem,
    requestDelete,
    deleteDialogVisible,
    deleteDialogItemCount,
    isDeleting,
    closeDeleteDialog,
    confirmDelete,
  } = useTrashActions();

  const deleteHandler = React.useMemo(
    () => ({ deleteItem: requestDeleteItem, deleteItems: requestDelete }),
    [requestDeleteItem, requestDelete],
  );

  const openFileHandler = React.useCallback(
    (file: TFileItem) => {
      router.push(`/docs/editor/${file.id}`);
    },
    [router],
  );

  const shareHandler = React.useCallback(
    (item: TFileItem | TFolderItem) => {
      infoPanelStore.open(item);
    },
    [infoPanelStore],
  );

  return (
    <OpenFileContext.Provider value={openFileHandler}>
      <ShareContext.Provider value={shareHandler}>
        <DeleteContext.Provider value={deleteHandler}>
        <div className={styles.root}>
          <DocsSidebar />
          <DropZone onFilesDropped={uploadFilesToFolder} disabled={!isMyDocuments}>
            <RootScrollbar>
              <SectionWrapper
                sectionHeaderContent={
                  <Header
                    current={current}
                    pathParts={pathParts}
                    isEmptyList={isEmptyList}
                  />
                }
                sectionFilterContent={<Filter filesFilter={filesFilter} />}
                sectionBodyContent={
                  <List
                    total={total}
                    folders={folders}
                    files={files}
                    filesSettings={filesSettings}
                    portalSettings={portalSettings}
                    filesFilter={filesFilter}
                    current={current}
                  />
                }
                isEmptyPage={isEmptyList}
                filesFilter={filesFilter}
              />
              <SelectionArea />
              <FilesMediaViewer filesSettings={filesSettings} />
              <DeviceTypeObserver />
              <Dialogs />
            </RootScrollbar>
          </DropZone>
          <DocsInfoPanel />
          {showMobileButton && <DocsMainButton mode="mobile" />}
          <DeleteDialog
            visible={deleteDialogVisible}
            isLoading={isDeleting}
            itemCount={deleteDialogItemCount}
            isTrash={isTrash}
            onClose={closeDeleteDialog}
            onConfirm={confirmDelete}
          />
        </div>
        </DeleteContext.Provider>
      </ShareContext.Provider>
    </OpenFileContext.Provider>
  );
});

const DocsLayout = (props: DocsLayoutProps) => {
  const { currentDeviceType } = useDeviceType();

  return (
    <SidebarProvider currentDeviceType={currentDeviceType}>
      <DocsLayoutInner {...props} />
    </SidebarProvider>
  );
};

export default DocsLayout;
