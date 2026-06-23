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

import { RectangleSkeleton } from "@docspace/shared/skeletons";
import styled from "styled-components";

const StyledLoader = styled.div`
  .item {
    padding-bottom: 12px;
  }

  .loader-header {
    padding-bottom: 5px;
    display: block;
  }

  .loader-label {
    padding-bottom: 4px;
    display: block;
  }

  .button {
    padding-top: 8px;
  }

  .save {
    padding-inline-end: 8px;
  }
`;

const LoaderCompanyInfoSettings = () => {
  return (
    <StyledLoader>
      <div className="item">
        <RectangleSkeleton
          width="179px"
          height="22px"
          className="loader-header"
        />
        <RectangleSkeleton width="419px" height="22px" />
      </div>

      <div className="item">
        <RectangleSkeleton
          width="99px"
          height="20px"
          className="loader-label"
        />
        <RectangleSkeleton width="433px" height="32px" />
      </div>

      <div className="item">
        <RectangleSkeleton
          width="35px"
          height="20px"
          className="loader-label"
        />
        <RectangleSkeleton width="433px" height="32px" />
      </div>

      <div className="item">
        <RectangleSkeleton
          width="40px"
          height="20px"
          className="loader-label"
        />
        <RectangleSkeleton width="433px" height="32px" />
      </div>

      <div className="item">
        <RectangleSkeleton
          width="51px"
          height="20px"
          className="loader-label"
        />
        <RectangleSkeleton width="433px" height="32px" />
      </div>

      <div className="item">
        <RectangleSkeleton
          width="51px"
          height="20px"
          className="loader-label"
        />
        <RectangleSkeleton width="433px" height="32px" />
      </div>

      <div className="button">
        <RectangleSkeleton width="86px" height="32px" className="save" />
        <RectangleSkeleton width="170px" height="32px" />
      </div>
    </StyledLoader>
  );
};

export default LoaderCompanyInfoSettings;
