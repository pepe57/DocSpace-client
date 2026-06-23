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

const marginCss = css`
  margin-top: -1px;
  border-top: ${(props) =>
    `1px solid ${props.theme.filesSection.tableView.row.borderColor}`};
`;

const groupTitleCss = css`
  margin-inline-start: -24px;
  padding-inline-start: 24px;
  ${marginCss}
`;

const contextCss = css`
  margin-inline-end: -20px;
  padding-inline-end: 20px;
  ${marginCss}
`;

export const GroupsTableContainer = styled(TableContainer)`
  :has(
    .table-container_body
      .table-list-item:first-child:first-child
      > .table-row-selected
  ) {
    .table-container_header {
      border-image-slice: 1;
      border-image-source: ${(props) =>
        props.theme.tableContainer.header.lengthenBorderImageSource};
    }
  }
  .table-row-selected {
    .table-container_group-title-cell {
      ${groupTitleCss}
    }
    .table-container_row-context-menu-wrapper {
      ${contextCss}
    }
  }
  .table-row-selected + .table-row-selected {
    .table-row {
      .table-container_group-title-cell {
        ${groupTitleCss}
        border-inline: 0; //for Safari macOS
        border-image-source: ${(props) => `linear-gradient(to right, 
          ${props.theme.filesSection.tableView.row.borderColorTransition} 17px, ${props.theme.filesSection.tableView.row.borderColor} 31px)`};
      }
      .table-container_row-context-menu-wrapper {
        ${contextCss}
        border-image-source: ${(props) => `linear-gradient(to left,
          ${props.theme.filesSection.tableView.row.borderColorTransition} 17px, ${props.theme.filesSection.tableView.row.borderColor} 31px)`};
      }
    }
  }
  .group-item:not(.table-row-selected) + .table-row-selected {
    .table-row {
      .table-container_group-title-cell {
        ${groupTitleCss}
      }
      .table-container_row-context-menu-wrapper {
        ${contextCss}
      }
    }
  }
`;

export const GroupsRowWrapper = styled.div<{ value?: string }>`
  display: contents;
`;

export const GroupsRow = styled(TableRow)<{
  checked?: boolean;
  isActive?: boolean;
}>`
  .table-container_cell:not(.table-container_row-checkbox-wrapper) {
    height: auto;
    max-height: 48px;
  }

  .table-container_cell {
    border-top: ${(props) =>
      `1px solid ${props.theme.filesSection.tableView.row.borderColor}`};
    margin-top: -1px;

    background: ${(props) =>
      (props.checked || props.isActive) &&
      `${props.theme.filesSection.tableView.row.backgroundActive} !important`};
  }

  .table-container_row-context-menu-wrapper {
    height: 49px !important;
    max-height: none !important;
    box-sizing: border-box;
  }

  .table-container_row-checkbox-wrapper {
    min-width: 48px;
    padding-inline-end: 0;
    .table-container_row-checkbox {
      margin-inline-start: -4px;
      padding-block: 16px;
      padding-inline: 12px 0;
    }
    .table-container_row-loader {
      border-bottom: unset;
      padding-inline-start: 7px;
    }
  }
  .table-cell_group-title {
    margin-inline-end: 12px;
  }
  .table-container_row-context-menu-wrapper {
    justify-content: flex-end;
    padding-inline-end: 0;
  }

  .badges {
    margin-inline-start: 12px;
  }

  :hover {
    .table-container_cell {
      cursor: pointer;
      background: ${(props) =>
        `${props.theme.filesSection.tableView.row.backgroundActive} !important`};
    }
    .table-container_group-title-cell {
      margin-inline-start: -24px;
      padding-inline-start: 24px;
    }
    .table-container_row-context-menu-wrapper {
      margin-inline-end: -20px;
      padding-inline-end: 20px;
    }
  }
`;
