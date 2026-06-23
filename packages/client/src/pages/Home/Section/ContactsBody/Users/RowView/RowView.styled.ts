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
import { isMobile } from "react-device-detect";

import {
  RowContainer,
  Row,
  RowContent,
} from "@docspace/ui-kit/components/rows";
import { mobile, tablet } from "@docspace/ui-kit/utils/device";
import { globalColors } from "@docspace/ui-kit/providers/theme/themes";

const marginStyles = css`
  margin-inline: -24px;
  padding-inline: 24px;

  @media ${tablet} {
    margin-inline: -16px;
    padding-inline: 16px;
  }
`;

export const StyledRowContainer = styled(RowContainer)`
  .row-selected + .row-wrapper:not(.row-selected) {
    .user-row {
      ${marginStyles}
    }
  }

  .row-wrapper:not(.row-selected) + .row-selected {
    .user-row {
      ${marginStyles}
    }
  }

  .row-list-item:first-child {
    .user-row {
      border-top: 2px solid transparent;
    }

    .row-selected {
      .user-row {
        border-top-color: ${(props) =>
          `${props.theme.filesSection.tableView.row.borderColor} !important`};
      }
    }
  }

  .row-list-item {
    margin-top: -1px;
  }
`;

const marginStylesRow = css`
  margin-inline-start: -24px;
  padding-inline: 24px;

  @media ${tablet} {
    margin-inline-start: -16px;
    padding-inline: 16px;
  }
`;

const marginStylesUserRowContainer = css`
  margin-inline-end: -48px !important;

  @media ${tablet} {
    margin-inline-end: -32px !important;
  }
`;

const checkedStyle = css`
  background: ${(props) => props.theme.filesSection.rowView.checkedBackground};
  ${marginStylesRow}
`;

export const StyledWrapper = styled.div<{
  checked?: boolean;
  isActive?: boolean;
  value?: string;
}>`
  .user-item {
    border: 1px solid transparent;
    border-inline: none;
    margin-inline-start: 0;
    height: 100%;
    user-select: none;

    position: relative;
    outline: none;
    background: none !important;
  }

  .user-row-container {
    ${(props) =>
      (props.checked || props.isActive) && marginStylesUserRowContainer};

    ${
      !isMobile &&
      css`
      :hover {
        ${marginStylesUserRowContainer}
      }
    `
    }
  }
`;

export const StyledSimpleUserRow = styled(Row)<{
  checked?: boolean;
  isActive?: boolean;
}>`
  ${(props) => (props.checked || props.isActive) && checkedStyle};

  .row_content {
    height: 58px;
  }

  height: 59px;

  border-top: ${(props) =>
    `1px solid ${props.theme.filesSection.tableView.row.borderColor}`};
  border-bottom: ${(props) =>
    `1px solid ${props.theme.filesSection.tableView.row.borderColor}`};

  box-sizing: border-box;
  margin-top: -1px;

  ${
    !isMobile &&
    css`
    :hover {
      ${checkedStyle}
    }
  `
  }

  position: unset;
  -webkit-tap-highlight-color: ${globalColors.tapHighlight};
  .styled-element {
    height: 32px;
    margin-inline-end: 12px;
  }
`;

export const StyledRowContent = styled(RowContent)`
  .row-content_tablet-side-info {
    white-space: nowrap;
  }

  .name-block{
    display: flex;
    align-items: center;
  }
  
  .me-label {
    padding-inline-start: 4px;
    color: ${(props) => props.theme.infoPanel.members.meLabelColor};
  }

  @media ${tablet} {
    .row-main-container-wrapper {
      width: 100%;
      display: flex;
      // justify-content: space-between;
      max-width: inherit;
    }

    .badges {
      flex-direction: row-reverse;

      margin-inline-end: 12px;

      .paid-badge {
        margin-inline: 8px 0;
      }
    }
  }

  @media ${mobile} {
    .row-main-container-wrapper {
      justify-content: flex-start;
    }

    .badges {
      margin-top: 0px;
      gap: 8px;

      .paid-badge {
        margin: 0px;
      }
    }
  }
`;
