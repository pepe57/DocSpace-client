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

import { RowContainer, RowContent } from "@docspace/ui-kit/components/rows";
import { tablet } from "@docspace/ui-kit/utils/device";

export const StyledRowContainer = styled(RowContainer)`
  margin-top: 0px;

  .row-list-item {
    padding-left: 21px;
  }

  .row-loader {
    width: calc(100% - 46px) !important;
    padding-left: 21px;
  }

  img {
    width: 32px;
    max-width: 32px;

    height: 32px;
    max-height: 32px;
  }

  .oauth2-row-selected {
    background: ${(props) =>
      props.theme.filesSection.rowView.checkedBackground};

    cursor: pointer;
    border-bottom: none;

    margin-left: -24px;
    margin-right: -24px;
    padding-left: 24px;
    padding-right: 24px;

    @media ${tablet} {
      margin-left: -16px;
      margin-right: -16px;
      padding-left: 16px;
      padding-right: 16px;
    }
  }

  .oauth2-row {
    margin-top: -3px;
    padding-top: 3px;

    :hover {
      background: ${(props) =>
        props.theme.filesSection.rowView.checkedBackground};

      cursor: pointer;
      border-bottom: none;

      margin-left: -24px;
      margin-right: -24px;
      padding-left: 24px;
      padding-right: 24px;

      @media ${tablet} {
        margin-left: -16px;
        margin-right: -16px;
        padding-left: 16px;
        padding-right: 16px;
      }
    }
  }
`;

export const StyledRowContent = styled(RowContent)`
  display: flex !important;
  padding-bottom: 10px;
  box-sizing: border-box;

  .rowMainContainer {
    height: 100%;
    width: 100%;
  }

  .mainIcons {
    min-width: 76px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
`;

export const ToggleButtonWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  label {
    margin-top: 1px;
    position: relative;
    gap: 0px;

    margin-right: -8px;
  }
`;

export const FlexWrapper = styled.div`
  display: flex;
`;
