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

import styled from "styled-components";
import { RectangleSkeleton } from "@docspace/shared/skeletons";
import StyledSettingsSeparator from "SRC_DIR/pages/PortalSettings/StyledSettingsSeparator";

const StyledLoader = styled.div`
  .submenu {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    .item {
      width: 72px;
    }
  }

  .description {
    max-width: 700px;
    margin-bottom: 20px;
  }

  .category {
    margin-top: 24px;
    width: 238px;
  }
`;

const SSOLoader = (props) => {
  const { isToggleSSO } = props;
  return (
    <StyledLoader>
      {!isToggleSSO ? (
        <div className="submenu">
          <RectangleSkeleton className="item" height="28px" />
          <RectangleSkeleton className="item" height="28px" />
        </div>
      ) : null}
      <RectangleSkeleton className="description" height="60px" />
      <RectangleSkeleton height="64px" />

      <RectangleSkeleton className="category" height="22px" />
      <StyledSettingsSeparator />
      <RectangleSkeleton className="category" height="22px" />
    </StyledLoader>
  );
};

export default SSOLoader;
