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

import { mobile } from "@docspace/shared/utils";

export const StyledContainer = styled.div`
  width: 100%;
  max-width: 700px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  .read-instructions-button {
     {
      width: fit-content;

      @media ${mobile} {
        width: 100%;
      }
      margin-bottom: 8px;
    }
  }

  .description {
    color: ${(props) => props.theme.plugins.descriptionColor};
  }

  .plugin-list {
    width: 100%;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(328px, 1fr));

    gap: 16px;

    .plugin-list__item {
      width: 100%;
      max-height: 164px;

      padding: 12px 16px;

      box-sizing: border-box;

      display: flex;
      flex-direction: column;
      gap: 12px;

      border: 1px solid ${(props) => props.theme.plugins.borderColor};
      border-radius: 6px;
      .plugin-list__item-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;

        .plugin-logo {
          width: 44px;
          height: 44px;
        }

        .plugin-info-container {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
      }
      .description-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
  }
`;
