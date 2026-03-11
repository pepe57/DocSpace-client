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

import type {
  TFilesSettings,
  TGetFolder,
} from "@docspace/shared/api/files/types";
import type { TUser } from "@docspace/shared/api/people/types";
import type { TDefaultProvider } from "@docspace/shared/api/ai/types";
import { createThumbnails } from "@docspace/shared/api/files";
import { thumbnailStatuses } from "@docspace/shared/constants";
import { Loader, LoaderTypes } from "@docspace/ui-kit/components/loader";
import { setAuthToken } from "@docspace/shared/api/client";

import { useSDKConfig } from "@/providers/SDKConfigProvider";
import { useFilesSettingsStore } from "@/app/(docspace)/_store/FilesSettingsStore";
import { useSettingsStore } from "@/app/(docspace)/_store/SettingsStore";

import { useFormsSettingsStore } from "../_store/FormsSettingsStore";
import { useFormsListStore } from "../_store/FormsListStore";
import { useFormsUserStore } from "../_store/FormsUserStore";
import { useFormsAiAgentStore } from "../_store/FormsAiAgentStore";
import FormsLayout from "../_components/forms-layout";

type FormsPageProps = {
  roomId: string | number;
  myFormsFolderId: string | number;
  formsToFillFolderId: string | number;
  requestToken: string;
  authToken: string;
  filesSettings: TFilesSettings;
  initialFolderData?: TGetFolder;
  user?: TUser;
  defaultProvider?: TDefaultProvider;
};

function FormsPage({
  roomId,
  myFormsFolderId,
  formsToFillFolderId,
  requestToken,
  authToken,
  filesSettings,
  initialFolderData,
  user,
  defaultProvider,
}: FormsPageProps) {
  useSDKConfig();

  const formsSettingsStore = useFormsSettingsStore();
  const formsListStore = useFormsListStore();
  const formsUserStore = useFormsUserStore();
  const formsAiAgentStore = useFormsAiAgentStore();
  const filesSettingsStore = useFilesSettingsStore();
  const settingsStore = useSettingsStore();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    formsSettingsStore.setConfig({
      roomId,
      myFormsFolderId,
      formsToFillFolderId,
      requestToken,
    });
    formsSettingsStore.setFilesSettings(filesSettings);
    filesSettingsStore.setFilesSettings(filesSettings);
    settingsStore.setFilesViewAs("tile");

    if (user) {
      formsUserStore.setUser(user);
    }

    if (defaultProvider) {
      formsAiAgentStore.setDefaultProvider(defaultProvider);
    }

    const token = requestToken || authToken;
    if (token) {
      document.cookie = `asc_auth_key=${token}; path=/; SameSite=Lax`;
      setAuthToken(token);
    }

    if (initialFolderData) {
      const id = Number(myFormsFolderId);
      const files = id
        ? initialFolderData.files.filter((f) => f.folderId === id)
        : initialFolderData.files;
      formsListStore.setItems(files, files.length);

      if (initialFolderData.current?.security) {
        formsSettingsStore.setFolderSecurity(
          initialFolderData.current.security,
        );
      }

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

    setIsReady(true);
  }, [
    roomId,
    myFormsFolderId,
    formsToFillFolderId,
    requestToken,
    authToken,
    filesSettings,
    initialFolderData,
    user,
    defaultProvider,
    formsSettingsStore,
    formsListStore,
    formsUserStore,
    formsAiAgentStore,
    filesSettingsStore,
    settingsStore,
  ]);

  if (!isReady) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Loader type={LoaderTypes.track} size="40px" />
      </div>
    );
  }

  return <FormsLayout filesSettings={filesSettings} />;
}

export default observer(FormsPage);
