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

export const DeleteDataLayout = styled.div`
  width: 100%;

  hr {
    margin: 24px 0;
    border: none;
    border-top: ${(props) => props.theme.client.settings.deleteData.borderTop};
  }
`;

export const MainContainer = styled.div`
  max-width: 700px;
  white-space: pre-line;

  .description {
    margin-bottom: 16px;
    color: ${(props) => props.theme.client.settings.common.descriptionColor};
  }

  .helper {
    line-height: 20px;
    margin-bottom: 24px;
    color: ${(props) => props.theme.client.settings.common.descriptionColor};
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  .request-again-link {
    margin-inline-start: 4px;
  }

  @media ${mobile} {
    flex-direction: column-reverse;
    gap: 16px;
    position: absolute;
    bottom: 16px;
    width: calc(100% - 40px);

    @media ${mobile} {
      width: calc(100% - 32px);
    }

    .button {
      width: 100%;
    }
  }
`;
