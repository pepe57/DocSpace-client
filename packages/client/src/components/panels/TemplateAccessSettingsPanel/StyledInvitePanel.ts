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
import { Heading } from "@docspace/ui-kit/components/heading";
import { DropDown } from "@docspace/ui-kit/components/drop-down";
import { Text } from "@docspace/ui-kit/components/text";
import { Link } from "@docspace/ui-kit/components/link";
import { ToggleButton } from "@docspace/ui-kit/components/toggle-button";
import {
  commonIconsStyles,
  mobile,
  commonInputStyles,
} from "@docspace/shared/utils";
import CrossIcon from "PUBLIC_DIR/images/cross.edit.react.svg";

const fillAvailableWidth = css`
  width: 100%;
  width: -moz-available;
  width: -webkit-fill-available;
  width: stretch;
`;

const ScrollList = styled.div<{
  scrollAllPanelContent?: boolean;
  isTotalListHeight?: boolean;
  offsetTop?: number;
}>`
  position: absolute;

  width: calc(100% - 16px);
  height: ${(props) =>
    props.scrollAllPanelContent && props.isTotalListHeight
      ? "auto"
      : props.offsetTop && `calc(100% - ${props.offsetTop}px)`};

  .row-item {
    @media not ${mobile} {
      width: 448px !important;
    }
  }
`;

const StyledBlock = styled.div`
  padding-inline-start: 16px;
  margin-inline-end: -16px;
  border-bottom: ${(props) => props.theme.filesPanels.sharing.borderBottom};
`;

const StyledInviteUserBody = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;

  .invite-input-item {
    display: flex;
    gap: 4px;
  }

  .invite-input-text_me {
    color: ${({ theme }) => theme.text.disableColor};
  }
`;

const StyledSubHeader = styled(Heading)<{ $inline?: boolean }>`
  font-weight: 700 !important;
  font-size: 16px !important;
  margin: 16px 0 8px 0;

  ${(props) =>
    props.$inline &&
    css`
      display: inline-flex;
      align-items: center;
      gap: 16px;
    `};
`;

const StyledDescription = styled(Text)`
  color: ${(props) =>
    props.theme.createEditRoomDialog.commonParam.descriptionColor};
  margin-bottom: 16px;

  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
`;

const StyledRow = styled.div<{ hasWarning?: boolean }>`
  width: calc(100% - 32px) !important;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  min-height: 41px;

  box-sizing: border-box;
  border-bottom: none;

  a {
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
  }

  .invite-panel_access-selector {
    margin-inline-start: auto;
    margin-inline-end: 0;

    ${({ hasWarning }) => hasWarning && `margin-inline-start: 0;`}
  }

  .warning {
    margin-inline-start: auto;
  }

  .combo-button-label {
    color: ${(props) => props.theme.text.disableColor};
  }
  .combo-buttons_expander-icon path {
    fill: ${(props) => props.theme.text.disableColor};
  }

  .remove-icon {
    cursor: pointer;
    margin-inline-start: auto;

    svg {
      path {
        fill: ${(props) => props.theme.text.disableColor};
      }
    }
  }
`;

const StyledInviteInput = styled.div<{ isShowCross?: boolean }>`
  ${fillAvailableWidth}

  .input-link {
    height: 32px;
    border: 0px;

    > input {
      height: 30px;
    }
  }

  display: flex;
  border: 1px solid rgb(208, 213, 218);
  border-radius: 3px;

  .copy-link-icon {
    padding: 0;

    &:hover {
      svg path {
        fill: ${(props) => props.theme.inputBlock.hoverIconColor} !important;
      }
    }

    svg path {
      fill: ${(props) => props.theme.inputBlock.iconColor} !important;
    }
  }

  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    -webkit-appearance: none;
    appearance: none;
  }

  .append {
    display: ${(props) => (props.isShowCross ? "flex" : "none")};
    align-items: center;
    padding-inline-end: 8px;
    cursor: default;
  }

  ${commonInputStyles}

  :focus-within {
    border-color: ${(props) => props.theme.inputBlock.borderColor};
  }
`;

const StyledInviteInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;

  .header_aside-panel {
    max-width: 100% !important;
  }
`;

const StyledDropDown = styled(DropDown)<{
  width?: number;
  isRequestRunning: boolean;
}>`
  ${(props) => props.width && `width: ${props.width}px`};

  .list-item {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;

    .list-item_content {
      text-overflow: ellipsis;
      overflow: hidden;

      .list-item_content-box {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .email-list_avatar {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
    }

    .email-list_add-button {
      display: flex;
      margin-inline-start: auto;
      align-items: center;
      gap: 4px;

      svg {
        ${({ theme }) =>
          theme.interfaceDirection === "rtl" && "transform: scaleX(-1);"};

        path {
          fill: ${(props) => props.theme.inputBlock.iconColor};
          ${(props) =>
            props.isRequestRunning &&
            css`
              opacity: 0.65;
            `}
        }
      }
    }
  }
`;

const SearchItemText = styled(Text)<{
  $primary?: boolean;
  $info?: boolean;
  disabled?: boolean;
}>`
  line-height: ${({ theme }) =>
    theme.interfaceDirection === "rtl" ? `20px` : `16px`};

  text-overflow: ellipsis;
  overflow: hidden;
  font-size: ${(props) =>
    props.$primary ? "14px" : props.$info ? "11px" : "12px"};
  font-weight: ${(props) => (props.$primary || props.$info ? "600" : "400")};

  color: ${(props) =>
    (props.$primary && !props.disabled) || props.$info
      ? props.theme.text.color
      : props.theme.text.emailColor};
  ${(props) => props.$info && `margin-inline-start: auto`}
`;

const iconStyles = css`
  ${commonIconsStyles}
  path {
    fill: ${(props) => props.theme.filesEditingWrapper.fill} !important;
  }
  :hover {
    fill: ${(props) => props.theme.filesEditingWrapper.hoverFill} !important;
  }
`;

const StyledCrossIcon = styled(CrossIcon)`
  ${iconStyles}
`;

const StyledLink = styled(Link)`
  float: ${({ theme }) =>
    theme.interfaceDirection === "rtl" ? `left` : `right`};
`;

const StyledToggleButton = styled(ToggleButton)`
  ${(props) =>
    props.theme.interfaceDirection === "rtl"
      ? css`
          left: 8px;
        `
      : css`
          right: 8px;
        `}
  margin-top: -4px;
`;

const StyledBody = styled.div<{ isDisabled?: boolean }>`
  padding-inline-start: 16px;

  ${({ isDisabled, theme }) =>
    isDisabled
      ? css`
          .invite-input-text {
            pointer-events: none;
            cursor: default;
            color: ${theme.text.disableColor};
          }
          .invite-input-avatar {
            opacity: 0.5;
          }

          .invite-input {
            box-shadow: unset !important;
          }
        `
      : css`
          .invite-input-text {
            color: ${theme.text.color};
          }
        `};
`;

const StyledTemplateAccessSettingsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StyledTemplateAccessSettingsHeader = styled.div`
  display: flex;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  gap: 6px;
  margin: 0px 16px;
  height: 53px;
  min-height: 53px;
  position: relative;
  border-bottom: ${(props) => props.theme.selector.border};

  .arrow-button {
    margin-inline: 0 12px;

    svg {
      ${({ theme }) =>
        theme.interfaceDirection === "rtl" && `transform: scaleX(-1);`}
    }
  }

  .close-button {
    margin-inline: auto 0;
    min-width: 17px;
  }
`;

const StyledTemplateAccessSettingsBody = styled.div`
  height: calc(100% - 73px);
`;

const StyledTemplateAccessSettingsFooter = styled.div`
  width: calc(100% - 32px);
  max-height: 73px;
  height: 73px;
  min-height: 73px;
  padding: 0px 16px;
  background-color: ${(props) => props.theme.backgroundColor};
  border-top: ${(props) => props.theme.selector.border};
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 16px;
`;

export {
  StyledBlock,
  StyledRow,
  StyledSubHeader,
  StyledInviteInput,
  StyledInviteInputContainer,
  StyledDropDown,
  SearchItemText,
  StyledCrossIcon,
  StyledLink,
  ScrollList,
  StyledToggleButton,
  StyledDescription,
  StyledInviteUserBody,
  StyledBody,
  StyledTemplateAccessSettingsContainer,
  StyledTemplateAccessSettingsHeader,
  StyledTemplateAccessSettingsBody,
  StyledTemplateAccessSettingsFooter,
};
