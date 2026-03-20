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
import { createThumbnails } from "@docspace/shared/api/files";
import type { TGetFolder } from "@docspace/shared/api/files/types";
import { thumbnailStatuses } from "@docspace/shared/constants";

import { useFormsListStore } from "../../_store/FormsListStore";
import { useFormsSettingsStore } from "../../_store/FormsSettingsStore";
import { useFormsDbSettingsStore } from "../../_store/FormsDbSettingsStore";
import useFormsData from "../../_hooks/useFormsData";
import FormsGrid from "../../_components/forms-grid";

type MyFormsPageProps = {
  roomId: string | number;
  initialFolderData?: TGetFolder;
};

const MyFormsPage = ({ roomId, initialFolderData }: MyFormsPageProps) => {
  const formsListStore = useFormsListStore();
  const formsSettingsStore = useFormsSettingsStore();
  const formsDbSettingsStore = useFormsDbSettingsStore();
  const { fetchMore } = useFormsData();

  React.useEffect(() => {
    formsListStore.reset();

    if (initialFolderData) {
      const id = Number(roomId);
      const files = id
        ? initialFolderData.files.filter((f) => f.folderId === id)
        : initialFolderData.files;
      formsListStore.setFolders([]);
      formsListStore.setItems(files, files.length);

      if (initialFolderData.current?.security) {
        formsSettingsStore.setFolderSecurity(
          initialFolderData.current.security,
        );
      }

      if (initialFolderData.current?.access !== undefined) {
        formsSettingsStore.setUserAccess(initialFolderData.current.access);
      }

      const current = initialFolderData.current as Record<string, unknown>;
      formsDbSettingsStore.setCollectXlsx(Boolean(current.saveFormAsXLSX));
      formsDbSettingsStore.setSendToDb(Boolean(current.sendFormToExternalDB));

      const thumbIds = files
        .filter(
          (f) =>
            typeof f.id !== "string" &&
            f.thumbnailStatus === thumbnailStatuses.WAITING,
        )
        .map((f) => f.id);
      if (thumbIds.length) {
        createThumbnails(thumbIds).catch(() => {});
      }
    }
  }, [initialFolderData, roomId]);

  return (
    <FormsGrid
      filesSettings={formsSettingsStore.filesSettings!}
      fetchMore={fetchMore}
    />
  );
};

export default observer(MyFormsPage);
