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
import { isMobileOnly } from "react-device-detect";
import { Scrollbar } from "@docspace/ui-kit/components/scrollbar";
import ArrowRightIcon from "PUBLIC_DIR/images/arrow.right.react.svg";
import {
  commonIconsStyles,
  mobile,
  mobileMore,
  injectDefaultTheme,
} from "@docspace/shared/utils";
import { UnavailableStyles } from "../../../utils/commonSettingsStyles";

const menuHeight = "48px";
const sectionHeight = "50px";
const paddingSectionWrapperContent = "22px";
const saveCancelButtons = "56px";
const flex = "4px";

const StyledArrowRightIcon = styled(ArrowRightIcon).attrs(injectDefaultTheme)`
  ${commonIconsStyles}
  path {
    fill: ${(props) => props.theme.client.settings.common.arrowColor};
  }
`;

const StyledScrollbar = styled(Scrollbar)`
  height: calc(
    100vh -
      (
        ${menuHeight} + ${sectionHeight} + ${paddingSectionWrapperContent} +
          ${saveCancelButtons} + ${flex}
      )
  ) !important;
  width: 100% !important;
`;

const StyledSettingsComponent = styled.div`
  .dns-setting_helpbutton {
    margin-inline-end: 4px;
  }

  .paid-badge {
    cursor: auto;
  }

  .dns-textarea {
    textarea {
      color: ${(props) => props.theme.text.disableColor};
    }
    ${(props) => props.standalone && "margin-top: 14px"};
  }

  .dns-error-text {
    color: ${(props) => props.theme.client.settings.common.dns.errorColor};
  }

  .combo-button-label {
    max-width: 100%;
    font-weight: 400;
  }

  .toggle {
    position: inherit;
    grid-gap: inherit;
  }

  .errorText {
    position: absolute;
    font-size: 10px;
    color: ${(props) => props.theme.client.settings.common.dns.errorColor};
  }

  .settings-block__wrapper-language {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .settings-block-description {
    line-height: 20px;
    color: ${(props) => props.theme.client.settings.security.descriptionColor};
    padding-bottom: 12px;
  }

  .combo-box-settings {
    padding: 0px;
    .combo-button {
      justify-content: space-between !important;
    }
  }
  .settings-dns_toggle-button {
    .toggle-button-text {
      font-weight: 600;
      font-size: 14px;
    }
    svg {
      margin-top: 1px;
    }
  }

  .link-learn-more {
    display: inline-block;
    margin: 4px 0 16px 0;
    font-weight: 600;
  }

  .category-item-description {
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

        @media ${mobile} {
          padding-inline-end: 16px;
        }
      `};
  }

  @media ${mobile} {
    ${(props) =>
      props.hasScroll &&
      css`
        width: ${isMobileOnly ? "100vw" : "calc(100vw - 52px)"};
        inset-inline-start: -16px;
        position: relative;

        .settings-block {
          width: ${isMobileOnly ? "calc(100vw - 32px)" : "calc(100vw - 84px)"};
          max-width: none;
          padding-inline-start: 16px;
        }
      `}

    .send-request-container {
      padding-block: 30px;
      position: sticky;
      bottom: 0;
      margin-top: 32px;
      background-color: ${({ theme }) => theme.backgroundColor};

      @media ${mobile} {
        position: fixed;
        padding-inline: 16px;
        inset-inline: 0;
      }
    }

    .send-request-button {
      width: 100%;
    }
  }

  @media ${mobileMore} {
    .settings-block {
      max-width: 350px;
      height: auto;
      margin-top: 0px;
    }

    .settings-block-description {
      display: none;
    }
  }

  @media (orientation: landscape) and ${mobile} {
    ${isMobileOnly &&
    css`
      .settings-block {
        height: auto;
      }
    `}
  }
  ${(props) => !props.isSettingPaid && UnavailableStyles}
`;

export { StyledSettingsComponent, StyledScrollbar, StyledArrowRightIcon };
