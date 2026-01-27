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
import {
  toastr as baseToastr,
  ToastType,
  TData,
} from "@docspace/ui-kit/components/toast";
import { getCookie } from "../../../utils/cookie";

interface NotifyConfig {
  type: ToastType;
  defaultTitleKey: "Done" | "Warning" | "Alert" | "Info";
}

const TOAST_CONFIGS: Record<ToastType, NotifyConfig> = {
  [ToastType.success]: { type: ToastType.success, defaultTitleKey: "Done" }, // t("Common:Done")
  [ToastType.error]: { type: ToastType.error, defaultTitleKey: "Warning" }, // t("Common:Warning")
  [ToastType.warning]: { type: ToastType.warning, defaultTitleKey: "Alert" }, // t("Common:Alert")
  [ToastType.info]: { type: ToastType.info, defaultTitleKey: "Info" }, // t("Common:Info")
};

const getTitle = (type: "Done" | "Warning" | "Alert" | "Info") => {
  const cookieLang = getCookie("asc_language");
  const lang =
    cookieLang === "en-US" || cookieLang === "en-GB" ? "en" : cookieLang;

  const commonKeys =
    (window.i18n &&
      Object.getOwnPropertyNames(window.i18n.loaded).filter(
        (k) => k.indexOf(`${lang}/Common.json`) > -1,
      )) ||
    [];

  if (commonKeys.length === 0) return undefined;

  const key = commonKeys.length === 1 ? commonKeys[0] : commonKeys[1];

  const title = window.i18n.loaded[key].data[type];

  return title;
};

const createToastMethod =
  (type: ToastType) =>
  (
    data: string | TData | React.ReactNode,
    title?: string,
    timeout?: number,
    withCross?: boolean,
    centerPosition?: boolean,
  ) => {
    const config = TOAST_CONFIGS[type];
    const finalTitle = title || getTitle(config.defaultTitleKey) || "";

    return baseToastr[type](
      data,
      finalTitle,
      timeout,
      withCross,
      centerPosition,
    );
  };

const toastr = {
  success: createToastMethod(ToastType.success),
  error: createToastMethod(ToastType.error),
  warning: createToastMethod(ToastType.warning),
  info: createToastMethod(ToastType.info),
  clear: baseToastr.clear,
  isActive: baseToastr.isActive,
} as const;

export { toastr };
