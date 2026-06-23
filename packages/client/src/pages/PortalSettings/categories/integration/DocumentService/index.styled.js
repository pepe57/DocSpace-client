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

import { mobile } from "@docspace/shared/utils";
import styled from "styled-components";

export const Location = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const LocationHeader = styled.div`
  .main {
    width: 100%;
    max-width: 700px;
    font-size: 13px;
    font-weight: 400;
    color: ${(props) => props.theme.client.settings.common.descriptionColor};
    line-height: 20px;
    margin-bottom: 8px;
  }

  .third-party-link {
    display: inline-block;
    font-weight: 600;
  }
`;

export const LocationSubheader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 22px;
`;

export const LocationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .form-inputs {
    width: 100%;
    max-width: 350px;

    @media ${mobile} {
      max-width: 100%;
    }

    display: flex;
    flex-direction: column;
    gap: 16px;

    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;

      label {
        line-height: 20px;
      }

      .icon-button {
        display: none;
      }

      .password-input {
        .icon-button {
          background-color: ${(props) => props.theme.input.backgroundColor};
          display: block;
          margin: -5px;
          padding: 5px;
        }
      }
    }

    .checkbox {
      margin-top: 4px;

      svg {
        margin-inline-end: 8px;
      }
    }

    .password-field-wrapper {
      width: 100%;
    }

    .group-label {
      display: flex;
      gap: 4px;
      line-height: 20px;
    }

    .label-subtitle {
      color: ${(props) => props.theme.client.settings.common.descriptionColor};
    }

    .subtitle {
      color: ${(props) => props.theme.client.settings.integration.textColor};
      font-size: 12px;
    }
  }
`;
