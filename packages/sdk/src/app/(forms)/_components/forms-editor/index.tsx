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
import { useTranslation } from "react-i18next";

import { combineUrl } from "@docspace/shared/utils/combineUrl";
import { Heading, HeadingLevel } from "@docspace/ui-kit/components/heading";
import { ContextMenuButton } from "@docspace/ui-kit/components/context-menu-button";

import DownloadReactSvgUrl from "PUBLIC_DIR/images/icons/16/download.react.svg?url";
import CatalogFolderReactSvgUrl from "PUBLIC_DIR/images/icons/16/catalog.folder.react.svg?url";
import RemoveReactSvgUrl from "PUBLIC_DIR/images/remove.react.svg?url";

import { useFormsNavigationStore } from "../../_store/FormsNavigationStore";
import { useFormsSettingsStore } from "../../_store/FormsSettingsStore";
import useFormsActions from "../../_hooks/useFormsActions";

const FormsEditor = () => {
  const { t } = useTranslation(["Common"]);
  const { editingFile, editorAction, closeEditor } =
    useFormsNavigationStore();
  const { requestToken } = useFormsSettingsStore();
  const { downloadForm, deleteFromList } = useFormsActions({ t });

  const editorUrl = React.useMemo(() => {
    if (!editingFile) return "";

    const params = new URLSearchParams();
    params.set("fileId", editingFile.id.toString());
    params.append("action", editorAction === "fill" ? "fill" : editorAction);
    if (requestToken) params.append("share", requestToken);

    return combineUrl(
      window.location.origin,
      `/doceditor?${params.toString()}`,
    );
  }, [editingFile, editorAction, requestToken]);

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "onRequestClose" ||
        event.data === "close-editor"
      ) {
        closeEditor();
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [closeEditor]);

  const getContextMenuModel = React.useCallback(() => {
    if (!editingFile) return [];

    return [
      {
        id: "option_download",
        key: "download",
        label: t("Common:Download"),
        icon: DownloadReactSvgUrl,
        onClick: () => downloadForm(editingFile),
      },
      {
        id: "option_open-location",
        key: "open-location",
        label: t("Common:OpenFileLocation"),
        icon: CatalogFolderReactSvgUrl,
        onClick: () => {
          window.open(
            combineUrl(
              window.location.origin,
              `/products/files/#/rooms/shared/${editingFile.folderId}/filter?folder=${editingFile.folderId}`,
            ),
            "_blank",
          );
        },
      },
      {
        id: "option_delete",
        key: "delete",
        label: t("Common:Delete"),
        icon: RemoveReactSvgUrl,
        onClick: () => {
          deleteFromList(editingFile.id);
          closeEditor();
        },
      },
    ];
  }, [editingFile, t, downloadForm, deleteFromList, closeEditor]);

  if (!editingFile || !editorUrl) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px 0",
          flexShrink: 0,
        }}
      >
        <Heading level={HeadingLevel.h3} truncate>
          {editingFile.title}
        </Heading>
        <ContextMenuButton
          getData={getContextMenuModel}
          directionX="right"
          directionY="bottom"
          size={16}
        />
      </div>

      <iframe
        src={editorUrl}
        style={{
          width: "100%",
          flex: 1,
          border: "none",
          borderRadius: "6px",
        }}
        allow="autoplay; camera; microphone; display-capture; clipboard-write"
        title="Form Editor"
      />
    </div>
  );
};

export default observer(FormsEditor);
