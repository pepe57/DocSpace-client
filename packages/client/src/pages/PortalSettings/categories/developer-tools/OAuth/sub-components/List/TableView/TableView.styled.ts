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

import styled, { css } from "styled-components";

import { TableRow, TableContainer } from "@docspace/ui-kit/components/table";
import { injectDefaultTheme } from "@docspace/shared/utils";

export const TableWrapper = styled(TableContainer)`
  margin-top: 0px;

  .header-container-text {
    font-size: 12px;
  }

  .table-container_header {
    position: absolute;
  }
`;

const StyledRowWrapper = styled.div`
  display: contents;
`;

const StyledTableRow = styled(TableRow).attrs(injectDefaultTheme)`
  .table-container_cell {
    text-overflow: ellipsis;

    padding-inline-end: 8px;
  }

  .mr-8 {
    margin-inline-end: 8px;
  }

  .textOverflow {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .description-text {
    color: ${(props) => props.theme.oauth.list.descriptionColor};
  }

  .toggleButton {
    display: contents;

    input {
      position: relative;

      margin-inline-start: -8px;
    }
  }

  .table-container_row-loader {
    margin-left: 8px;
    margin-right: 16px;
  }

  :hover {
    .table-container_cell {
      cursor: pointer;
      background: ${(props) =>
        `${props.theme.filesSection.tableView.row.backgroundActive} !important`};

      margin-top: -1px;

      border-top: ${(props) =>
        `1px solid ${props.theme.filesSection.tableView.row.borderColor}`};
    }

    .table-container_file-name-cell {
      ${(props) =>
        props.theme.interfaceDirection === "rtl"
          ? css`
              margin-right: -24px;
              padding-right: 24px;
            `
          : css`
              margin-left: -24px;
              padding-left: 24px;
            `}
    }
    .table-container_row-context-menu-wrapper {
      ${(props) =>
        props.theme.interfaceDirection === "rtl"
          ? css`
              margin-left: -20px;
              padding-left: 18px;
            `
          : css`
              margin-right: -20px;
              padding-right: 18px;
            `}
    }
  }
`;

export { StyledRowWrapper, StyledTableRow };
