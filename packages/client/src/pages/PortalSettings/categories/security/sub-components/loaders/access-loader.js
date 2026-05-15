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
import { tablet, mobile } from "@docspace/shared/utils";

const StyledLoader = styled.div`
  .header {
    width: 296px;
    height: 29px;
    margin-bottom: 14px;

    @media ${tablet} {
      width: 184px;
      height: 37px;
    }

    @media ${mobile} {
      width: 273px;
      height: 37px;
      margin-bottom: 18px;
    }
  }

  .submenu {
    display: flex;
    gap: 20px;
    margin-bottom: 22px;
  }

  .owner {
    width: 700px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 40px;

    @media ${mobile} {
      width: 100%;
    }

    .header {
      height: 40px;
      @media ${tablet} {
        height: 60px;
      }
    }
  }

  .admins {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .description {
      width: 700px;
      @media ${tablet} {
        width: 100%;
      }
    }
  }
`;

const AccessLoader = () => {
  return (
    <StyledLoader>
      <RectangleSkeleton className="header" height="100%" />
      <div className="submenu">
        <RectangleSkeleton height="28px" width="72px" />
        <RectangleSkeleton height="28px" width="72px" />
        <RectangleSkeleton height="28px" width="72px" />
        <RectangleSkeleton height="28px" width="72px" />
      </div>
      <div className="owner">
        <RectangleSkeleton className="header" height="100%" />
        <RectangleSkeleton height="82px" />
      </div>
      <div className="admins">
        <RectangleSkeleton height="22px" width="77px" />
        <RectangleSkeleton height="20px" width="56px" />
        <RectangleSkeleton className="description" height="40px" />
      </div>
    </StyledLoader>
  );
};

export default AccessLoader;
