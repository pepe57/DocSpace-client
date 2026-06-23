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

export const GroupMemberRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;

  width: 100%;
  height: 48px;

  .avatar {
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 9px 0;
    overflow: hidden;
    margin-inline-end: 16px;

    .info-box {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .name {
      color: ${({ theme }) => theme.sideBarRow.titleColor};
      font-size: 14px;
      font-weight: 600;
      line-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .email {
      color: ${({ theme }) => theme.sideBarRow.metaDataColor};
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
  }

  .remove-icon {
    cursor: pointer;
    margin-inline-start: auto;

    svg {
      path {
        fill: ${(props) => props.theme.createEditGroupDialog.iconFill};
      }
    }
  }
`;
