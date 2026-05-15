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

const StyledLoader = styled.div`
  .section {
    padding-bottom: 16px;
  }
  .title-long {
    width: 283px;
    padding-bottom: 4px;
  }

  .width {
    width: 100%;
  }

  .padding-bottom {
    padding-bottom: 4px;
  }

  .padding-top {
    padding-top: 5px;
  }

  .display {
    display: block;
  }
`;

const LoaderCustomizationNavbar = () => {
  return (
    <StyledLoader>
      <div className="section">
        <RectangleSkeleton height="22px" className="title-long" />
        <RectangleSkeleton height="80px" className="width padding-bottom" />
        <RectangleSkeleton height="20px" width="73px" />
      </div>

      <div className="section">
        <RectangleSkeleton
          height="22px"
          width="201px"
          className="title padding-bottom display"
        />
        <RectangleSkeleton height="80px" className="width" />
      </div>

      <div className="section">
        <RectangleSkeleton
          height="22px"
          width="119px"
          className="padding-top"
        />
        <RectangleSkeleton height="40px" className="width" />
        <RectangleSkeleton
          height="20px"
          width="73px"
          className="width padding-top"
        />
      </div>

      <div className="section">
        <RectangleSkeleton
          height="22px"
          width="150px"
          className="title padding-bottom display"
        />
        <RectangleSkeleton
          height="20px"
          width="253px"
          className="padding-top"
        />
      </div>
    </StyledLoader>
  );
};

export default LoaderCustomizationNavbar;
