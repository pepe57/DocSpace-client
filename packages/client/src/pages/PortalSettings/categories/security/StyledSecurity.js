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

import { injectDefaultTheme, mobile } from "@docspace/shared/utils";

export const MainContainer = styled.div.attrs(injectDefaultTheme)`
  width: 100%;

  .subtitle {
    margin-bottom: 20px;
    color: ${(props) => props.theme.client.settings.common.descriptionColor};
  }

  .settings_tabs {
    padding-bottom: 16px;
  }

  .page_loader {
    position: fixed;
    inset-inline-start: 50%;
  }

  .category-item-description {
    margin-top: 8px;
    max-width: 700px;

    .link-learn-more {
      display: inline-block;
      margin: 4px 0 16px;
      font-weight: 600;
    }

    p {
      color: ${(props) => props.theme.client.settings.common.descriptionColor};
    }

    @media ${mobile} {
      padding-inline-end: 8px;
    }

    ${(props) =>
      props.withoutExternalLink &&
      css`
        padding-bottom: 16px;
      `};
  }
`;

export const StyledCategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  margin-bottom: 8px;
  align-items: center;
`;

export const StyledTooltip = styled.div`
  .subtitle {
    margin-bottom: 10px;
  }
`;

export const LearnMoreWrapper = styled.div`
  display: none;

  .link-learn-more {
    font-weight: 600;
  }

  p {
    color: ${(props) => props.theme.client.settings.common.descriptionColor};
  }

  @media ${mobile} {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    padding-inline-end: 8px;
    line-height: 20px;
  }

  .page-subtitle {
    color: ${(props) =>
      props.theme.client.settings.security.descriptionColor} !important;
  }

  .learn-subtitle {
    margin-bottom: 10px;
  }

  ${(props) =>
    props.withoutExternalLink &&
    css`
      @media ${mobile} {
        .learn-subtitle {
          margin-bottom: 0;
        }

        .page-subtitle {
          margin-bottom: 0 !important;
        }
      }
    `};
`;

export const StyledBruteForceProtection = styled.div`
  width: 100%;

  .brute-force-protection-input {
    width: 100%;
    max-width: 350px;
  }

  .error-label {
    font-size: 10px;
  }

  .save-cancel-buttons {
    margin-top: 24px;
  }

  .input-container {
    margin-bottom: 8px;
    margin-inline-end: 8px;
  }

  .mobile-description {
    margin-bottom: 12px;
  }

  .description {
    max-width: 700px;
    padding-bottom: 19px;

    .page-subtitle {
      line-height: 20px;
      padding-inline-end: 8px;
      color: ${(props) =>
        props.theme.client.settings.security.descriptionColor};
      padding-bottom: 7px;

      ${(props) =>
        props.withoutExternalLink &&
        css`
          padding-bottom: 0;
        `};
    }

    .link {
      line-height: 15px;
      font-weight: 600;

      text-decoration: underline;
    }

    @media ${mobile} {
      padding-bottom: 20px;
    }
  }
`;
