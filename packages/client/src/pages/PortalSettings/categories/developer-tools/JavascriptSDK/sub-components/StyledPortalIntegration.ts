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

import { mobile, tablet } from "@docspace/ui-kit/utils/device";
import { isMobile } from "react-device-detect";

import { globalColors } from "@docspace/ui-kit/providers/theme/themes";

const SDKContainer = styled.div`
  box-sizing: border-box;
  @media ${tablet} {
    width: 100%;
  }

  ${
    isMobile &&
    css`
    width: 100%;
  `
  }

  .presets-flex {
    display: flex;
    flex-direction: column;
  }
`;

const CategoryHeader = styled.div`
  margin-top: 40px;
  margin-bottom: 16px;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 22px;

  @media ${tablet} {
    margin-top: 24px;
  }

  ${
    isMobile &&
    css`
    margin-top: 24px;
  `
  }
`;

const CategoryDescription = styled.div`
  box-sizing: border-box;
  margin-top: 2px;
  max-width: 700px;
  .sdk-description {
    display: inline;
    line-height: 20px;
    color: ${(props) => props.theme.client.settings.common.descriptionColor};
  }
`;

const PresetsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(min(200px, 100%), 1fr));
  gap: 16px;

  max-width: fit-content;

  margin-top: 16px;

  @media ${mobile} {
    display: flex;
    flex-direction: column;
  }
`;

const IntegrationContainer = styled.div<{ color: string }>`
  .integration-header {
    margin-bottom: 8px;
    margin-top: 36px;
  }

  .icons {
    display: flex;
    gap: 8px;
    margin: 16px 0;

    .icon {
      ${(props) =>
        !props.theme.isBase &&
        css`
          svg rect {
            fill: ${globalColors.white};
            fill-opacity: 0.1;
          }

          .icon-zoom {
            path {
              fill: ${globalColors.white};
            }
          }

          .icon-wordpress {
            path:not(:last-child) {
              fill: ${globalColors.white};
            }
          }

          .icon-drupal {
            path:first-child {
              fill: ${globalColors.white};
            }

            path:nth-child(4),
            path:nth-child(5),
            path:nth-child(6) {
              fill: ${globalColors.lightDarkGrayHover};
            }
          }
        `}

      :hover {
        cursor: pointer;
      }
    }
  }

  .link-container {
    display: flex;
    gap: 4px;

    .link {
      text-decoration: underline;
      font-weight: 600;
      line-height: 15px;
    }

    .icon-arrow {
      :hover {
        cursor: pointer;
      }
    }

    .icon-arrow rect {
      fill: unset;
    }

    .icon-arrow path {
      fill: ${(props) => props.color};
    }
  }
`;

export {
  SDKContainer,
  CategoryHeader,
  CategoryDescription,
  PresetsContainer,
  IntegrationContainer,
};
