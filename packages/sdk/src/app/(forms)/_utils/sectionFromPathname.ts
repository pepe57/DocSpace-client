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

import { FormsSection } from "@/types/forms";

const SDK_BASE_PATH = "/sdk";
const FORMS_PREFIX = "/forms/";

/**
 * Maps a URL pathname to the corresponding FormsSection enum value.
 *
 * Handles both plain pathnames ("/forms/my-forms") and pathnames that include
 * the SDK base path ("/sdk/forms/in-progress"). Falls back to
 * FormsSection.MyForms when no segment matches a known section.
 */
export function sectionFromPathname(pathname: string): FormsSection {
  const normalized = pathname.startsWith(SDK_BASE_PATH)
    ? pathname.slice(SDK_BASE_PATH.length)
    : pathname;

  const formsIndex = normalized.indexOf(FORMS_PREFIX);

  if (formsIndex === -1) return FormsSection.MyForms;

  const segment = normalized.slice(formsIndex + FORMS_PREFIX.length).split("/")[0];

  const sections: Record<string, FormsSection> = {
    [FormsSection.MyForms]: FormsSection.MyForms,
    [FormsSection.InProgress]: FormsSection.InProgress,
    [FormsSection.CompletedForms]: FormsSection.CompletedForms,
    [FormsSection.Settings]: FormsSection.Settings,
  };

  return sections[segment] ?? FormsSection.MyForms;
}

/**
 * Returns the path segment for a given FormsSection, without a basePath
 * prefix (Next.js adds the configured basePath automatically).
 *
 * Example: FormsSection.MyForms → "/forms/my-forms"
 */
export function sectionToPath(section: FormsSection): string {
  return `${FORMS_PREFIX.slice(0, -1)}/${section}`;
}
