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

import { getFilesSettings } from "@/api/files";
import { logger } from "../../../logger.mjs";

import UploaderClient from "./page.client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  logger.info("Uploader page");

  const baseConfig = Object.fromEntries(
    Object.entries(await searchParams).map(([k, v]) => {
      if (v === "true") return [k, true];
      if (v === "false") return [k, false];
      if (k === "filter") return [k, Number.isNaN(+v) ? v : +v];

      return [k, v];
    }),
  );

  const filesSettings = await getFilesSettings();

  const extensionsStr = baseConfig?.acceptExtensions?.trim() ?? "";
  const parsedExtensions = extensionsStr
    ? extensionsStr
        .split(",")
        .map((ext: string) => ext.trim())
        .filter((ext: string) => ext.startsWith(".") && ext.length > 1)
    : [];

  const accept = parsedExtensions.length > 0 ? parsedExtensions.join(",") : "";

  const allExtensions = accept ? accept.split(",") : [];
  const displayExtensions = allExtensions
    .slice(0, 5)
    .map((ext: string) => ext.replace(".", "").toUpperCase());
  const remaining = allExtensions.length - displayExtensions.length;

  const exstsText =
    displayExtensions.length > 0
      ? remaining > 0
        ? `(${displayExtensions.join(", ")} +${remaining})`
        : `(${displayExtensions.join(", ")})`
      : "";

  return (
    <UploaderClient
      filesSettings={filesSettings}
      accept={accept}
      exstsText={exstsText}
      baseConfig={baseConfig}
    />
  );
}
