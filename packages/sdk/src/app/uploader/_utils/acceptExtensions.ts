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

import type { TFilesSettings } from "@docspace/shared/api/files/types";

export type ExtensionCategory =
  | "archive"
  | "audio"
  | "document"
  | "diagram"
  | "image"
  | "presentation"
  | "spreadsheet"
  | "video"
  | "pdf";

const CATEGORY_TO_SETTINGS_KEY: Record<
  ExtensionCategory,
  keyof TFilesSettings
> = {
  archive: "extsArchive",
  audio: "extsAudio",
  document: "extsDocument",
  diagram: "extsDiagram",
  image: "extsImage",
  presentation: "extsPresentation",
  spreadsheet: "extsSpreadsheet",
  video: "extsVideo",
  pdf: "extsWebRestrictedEditing",
};

export const getAcceptExtensions = (
  filesSettings: TFilesSettings | undefined,
  categories: ExtensionCategory[],
): string => {
  if (!filesSettings || categories.length === 0) {
    return "";
  }

  const extensions = new Set<string>();

  for (const category of categories) {
    const settingsKey = CATEGORY_TO_SETTINGS_KEY[category];
    const exts = filesSettings[settingsKey];

    if (Array.isArray(exts)) {
      for (const ext of exts) {
        if (typeof ext === "string") {
          extensions.add(ext);
        }
      }
    }
  }

  return Array.from(extensions).join(",");
};

export const parseAcceptCategories = (
  categoriesString: string | undefined,
): ExtensionCategory[] => {
  if (!categoriesString) {
    return [];
  }

  const validCategories = Object.keys(
    CATEGORY_TO_SETTINGS_KEY,
  ) as ExtensionCategory[];

  return categoriesString
    .split(",")
    .map((c) => c.trim().toLowerCase() as ExtensionCategory)
    .filter((c) => validCategories.includes(c));
};

const POPULAR_EXTENSIONS: Record<ExtensionCategory, string[]> = {
  document: ["DOCX", "DOC", "PDF", "TXT"],
  spreadsheet: ["XLSX", "XLS", "CSV"],
  presentation: ["PPTX", "PPT"],
  image: ["JPG", "PNG", "GIF"],
  video: ["MP4", "AVI", "MOV"],
  audio: ["MP3", "WAV", "OGG"],
  archive: ["ZIP", "RAR"],
  diagram: ["VSDX"],
  pdf: ["PDF"],
};

export const getExtsDisplayText = (
  accept: string,
  maxCount: number = 5,
): string => {
  if (!accept) return "";

  const extensions = accept
    .split(",")
    .map((ext) => ext.replace(".", "").toUpperCase())
    .filter(Boolean);

  if (extensions.length === 0) return "";

  const popular = Object.values(POPULAR_EXTENSIONS).flat();
  const sorted = [...extensions].sort((a, b) => {
    const aIndex = popular.indexOf(a);
    const bIndex = popular.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const displayed = sorted.slice(0, maxCount);
  const remaining = extensions.length - displayed.length;

  const text = displayed.join(", ");

  if (remaining > 0) {
    return `(${text}, +${remaining})`;
  }

  return `(${text})`;
};
