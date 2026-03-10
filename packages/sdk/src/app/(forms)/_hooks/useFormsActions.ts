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

import { useCallback } from "react";

import api from "@docspace/shared/api";
import { toastr } from "@docspace/ui-kit/components/toast";
import { copyShareLink } from "@docspace/shared/utils/copy";
import { frameCallEvent } from "@docspace/shared/utils/common";
import type { TFile } from "@docspace/shared/api/files/types";
import type { TTranslation } from "@docspace/shared/types";

import type { EditorAction } from "../_store/FormsNavigationStore";

import { useSDKConfig } from "@/providers/SDKConfigProvider";

import { useFormsNavigationStore } from "../_store/FormsNavigationStore";

type UseFormsActionsProps = { t: TTranslation };

export default function useFormsActions({ t }: UseFormsActionsProps) {
  const { sdkConfig } = useSDKConfig();
  const { openEditor } = useFormsNavigationStore();

  const openForm = useCallback(
    (file: TFile, action: EditorAction = "edit") => {
      if (sdkConfig?.events?.onFileManagerClick) {
        frameCallEvent({
          event: "onFileManagerClick",
          data: file,
        });
        return;
      }

      openEditor(file, action);
    },
    [sdkConfig?.events?.onFileManagerClick, openEditor],
  );

  const shareForm = useCallback(
    async (fileId: number) => {
      try {
        const itemLink = await api.files.getFileLink(fileId);
        copyShareLink(itemLink.sharedTo.shareLink);
        toastr.success(t("Common:LinkCopySuccess"));
      } catch {
        toastr.error(t("Common:ErrorOccurred"));
      }
    },
    [t],
  );

  const downloadFile = useCallback((fileId: number) => {
    frameCallEvent({
      event: "onDownloadFile",
      data: { fileId },
    });
  }, []);

  const stopFilling = useCallback((fileId: number) => {
    frameCallEvent({
      event: "onStopFilling",
      data: { fileId },
    });
  }, []);

  const deleteFromList = useCallback((fileId: number) => {
    frameCallEvent({
      event: "onDeleteFromList",
      data: { fileId },
    });
  }, []);

  return { openForm, shareForm, downloadFile, stopFilling, deleteFromList };
}
