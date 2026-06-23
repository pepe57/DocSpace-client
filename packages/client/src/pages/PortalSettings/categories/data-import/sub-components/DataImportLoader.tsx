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
import { tablet } from "@docspace/ui-kit/utils/device";

const StyledLoader = styled.div`
  padding-inline-end: 8px;

  .header {
    display: flex;
    flex-direction: column;
    max-width: 700px;

    @media ${tablet} {
      max-width: 675px;
    }
  }

  .title {
    margin-bottom: 20px;
    width: 675px;

    @media ${tablet} {
      width: 100%;
    }
  }

  .subtitle {
    margin-bottom: 20px;
    width: 675px;

    @media ${tablet} {
      width: 100%;
    }
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 20px;

    .link {
      color: ${(props) => props.theme.client.settings.migration.linkColor};
    }
  }

  .workspace-item {
    background: ${(props) =>
      props.theme.client.settings.migration.workspaceBackground};
    border: ${(props) => props.theme.client.settings.migration.workspaceBorder};
    border-radius: 6px;
    width: 340px;
    height: 64px;
    box-sizing: border-box;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    &:hover {
      border-color: ${(props) =>
        props.theme.client.settings.migration.workspaceHover};
    }

    &:active {
      background-color: ${(props) =>
        props.theme.client.settings.migration.workspaceBackground};
    }
    max-width: 700px;

    @media ${tablet} {
      max-width: 675px;
      .item {
        width: 327.5px;
      }
    }
  }
`;

const DataImportLoader = () => {
  return (
    <StyledLoader>
      <div className="header">
        <RectangleSkeleton className="title" height="40px" />
        <RectangleSkeleton className="subtitle" height="20px" />
      </div>

      <div className="content">
        <RectangleSkeleton className="item" width="340px" height="64px" />
        <RectangleSkeleton className="item" width="340px" height="64px" />
        <RectangleSkeleton className="item" width="340px" height="64px" />
      </div>
    </StyledLoader>
  );
};

export default DataImportLoader;
