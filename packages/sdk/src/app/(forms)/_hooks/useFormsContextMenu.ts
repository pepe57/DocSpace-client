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
import { useTranslation } from "react-i18next";

import AccessEditReactSvgUrl from "PUBLIC_DIR/images/access.edit.react.svg?url";
import EyeReactSvgUrl from "PUBLIC_DIR/images/eye.react.svg?url";
import InvitationLinkReactSvgUrl from "PUBLIC_DIR/images/invitation.link.react.svg?url";
import FormFillRectSvgUrl from "PUBLIC_DIR/images/form.fill.rect.svg?url";
import RemoveReactSvgUrl from "PUBLIC_DIR/images/remove.react.svg?url";
import DownloadReactSvgUrl from "PUBLIC_DIR/images/icons/16/download.react.svg?url";
import AccessNoneReactSvgUrl from "PUBLIC_DIR/images/access.none.react.svg?url";

import type { TFile } from "@docspace/shared/api/files/types";

import { FormsSection } from "@/types/forms";

import { useFormsNavigationStore } from "../_store/FormsNavigationStore";
import useFormsActions from "./useFormsActions";

export type TFormsContextMenuItem = {
  id: string;
  key: string;
  label: string;
  icon: string;
  onClick: () => void;
  disabled: boolean;
};

export default function useFormsContextMenu() {
  const { t } = useTranslation(["Common"]);
  const { activeSection } = useFormsNavigationStore();
  const { openForm, shareForm, deleteFromList, downloadFile, stopFilling } =
    useFormsActions({ t });

  const getContextMenuModel = useCallback(
    (file: TFile): TFormsContextMenuItem[] => {
      const model: TFormsContextMenuItem[] = [];

      const canEditForm =
        file.security?.EditForm && !file.startFilling && file.isForm;
      const canFillForm =
        file.security?.FillForms &&
        file.viewAccessibility?.WebRestrictedEditing;
      const canShare = file.security?.CopyLink;
      const canDownload = file.security?.Download;
      const canStopFilling = file.security?.StopFilling;
      const canDelete = file.security?.Delete;

      switch (activeSection) {
        case FormsSection.MyForms: {
          if (canEditForm) {
            model.push({
              id: "option_edit-form",
              key: "edit-form",
              label: t("Common:EditButton"),
              icon: AccessEditReactSvgUrl,
              onClick: () => openForm(file, "edit"),
              disabled: false,
            });
          }

          if (canFillForm) {
            model.push({
              id: "option_fill-form",
              key: "fill-form",
              label: t("Common:FillFormButton"),
              icon: FormFillRectSvgUrl,
              onClick: () => openForm(file, "fill"),
              disabled: false,
            });
          }

          model.push({
            id: "option_view",
            key: "view",
            label: t("Common:View"),
            icon: EyeReactSvgUrl,
            onClick: () => openForm(file, "view"),
            disabled: false,
          });

          if (canShare) {
            model.push({
              id: "option_share",
              key: "share",
              label: t("Common:Share"),
              icon: InvitationLinkReactSvgUrl,
              onClick: () => shareForm(file.id),
              disabled: false,
            });
          }

          if (canDownload) {
            model.push({
              id: "option_download",
              key: "download",
              label: t("Common:Download"),
              icon: DownloadReactSvgUrl,
              onClick: () => downloadFile(file.id),
              disabled: false,
            });
          }

          if (canDelete) {
            model.push({
              id: "option_delete-from-list",
              key: "delete-from-list",
              label: t("Common:DeleteFromList"),
              icon: RemoveReactSvgUrl,
              onClick: () => deleteFromList(file.id),
              disabled: false,
            });
          }
          break;
        }

        case FormsSection.FormsToFill: {
          if (canFillForm) {
            model.push({
              id: "option_fill-form",
              key: "fill-form",
              label: t("Common:FillFormButton"),
              icon: FormFillRectSvgUrl,
              onClick: () => openForm(file, "fill"),
              disabled: false,
            });
          }

          model.push({
            id: "option_view",
            key: "view",
            label: t("Common:View"),
            icon: EyeReactSvgUrl,
            onClick: () => openForm(file, "view"),
            disabled: false,
          });

          if (canStopFilling) {
            model.push({
              id: "option_stop-filling",
              key: "stop-filling",
              label: t("Common:StopFilling"),
              icon: AccessNoneReactSvgUrl,
              onClick: () => stopFilling(file.id),
              disabled: false,
            });
          }

          if (canDownload) {
            model.push({
              id: "option_download",
              key: "download",
              label: t("Common:Download"),
              icon: DownloadReactSvgUrl,
              onClick: () => downloadFile(file.id),
              disabled: false,
            });
          }
          break;
        }

        case FormsSection.CompletedForms: {
          model.push({
            id: "option_view",
            key: "view",
            label: t("Common:View"),
            icon: EyeReactSvgUrl,
            onClick: () => openForm(file, "view"),
            disabled: false,
          });

          if (canDownload) {
            model.push({
              id: "option_download",
              key: "download",
              label: t("Common:Download"),
              icon: DownloadReactSvgUrl,
              onClick: () => downloadFile(file.id),
              disabled: false,
            });
          }
          break;
        }
      }

      return model;
    },
    [t, activeSection, openForm, shareForm, deleteFromList, downloadFile, stopFilling],
  );

  return { getContextMenuModel };
}
