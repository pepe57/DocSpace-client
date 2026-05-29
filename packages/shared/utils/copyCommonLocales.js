/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const fs = require("fs");
const path = require("path");

/**
 * Copies Common.json from a single source workspace locales directory into a
 * target app's public/locales/<lng>/ tree for every locale that exists in the
 * source. SSR apps need their own copy of Common.json so that the runtime
 * loader can read it from appLocalesDir without depending on the deploy layout.
 */
function copyCommonLocales(sourceLocalesDir, targetLocalesDir) {
  if (!fs.existsSync(sourceLocalesDir)) {
    console.warn(
      `[copyCommonLocales] Source dir not found: ${sourceLocalesDir}`,
    );
    return 0;
  }

  const locales = fs
    .readdirSync(sourceLocalesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => d.name);

  let copied = 0;
  for (const lng of locales) {
    const src = path.join(sourceLocalesDir, lng, "Common.json");
    if (!fs.existsSync(src)) continue;
    const destDir = path.join(targetLocalesDir, lng);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, path.join(destDir, "Common.json"));
    copied += 1;
  }

  console.log(
    `[copyCommonLocales] Copied Common.json for ${copied} locale(s) into ${targetLocalesDir}`,
  );

  return copied;
}

module.exports = copyCommonLocales;
