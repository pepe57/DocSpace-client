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

import { tablet } from "@docspace/shared/utils";
import { ModalDialog } from "@docspace/ui-kit/components/modal-dialog";
import { globalColors } from "@docspace/ui-kit/providers/theme/themes";
import type { ColorItemProps } from "./SelecColor.types";

const StyledModalDialog = styled(ModalDialog)`
  .modal-close {
    display: none;
  }

  #modal-dialog {
    max-height: none;
  }

  .hex-color-picker {
    padding-bottom: 0 !important;
    width: auto !important;

    .react-colorful__saturation {
      border-bottom: none;

      .react-colorful__interactive {
        width: calc(100% - 16px) !important;
        height: calc(100% - 16px);
      }
    }

    .react-colorful__hue {
      .react-colorful__interactive {
        width: auto;
      }
    }
  }
`;

const StyledColorItem = styled.div<ColorItemProps>`
  width: 30px;
  height: 30px;
  margin-top: 8px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.color};

  @media ${tablet} {
    width: 40px;
    height: 40px;
  }

  ${(props) =>
    props.isSelected &&
    css`
      background-color: ${props.theme.logoCover.selectColor.backgroundColor};
    `}

  &:hover {
    cursor: pointer;
  }
`;

const SelectedColorItem = styled.div`
  width: 30px;
  height: 30px;
  box-sizing: border-box;
  margin-top: 8px;
  border-radius: 50%;
  border: ${(props) => `solid 2px ${props.color}`};
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${tablet} {
    width: 40px;
    height: 40px;
  }

  .circle {
    width: 20px;
    height: 20px;
    background-color: ${(props) => props.color};
    border-radius: 50%;

    @media ${tablet} {
      width: 28px;
      height: 28px;
    }
  }
`;

const CustomSelectedColor = styled.div<ColorItemProps>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  box-sizing: border-box;

  ${(props) =>
    props.color === globalColors.white &&
    css`
      border: 2px solid ${globalColors.black};
    `}

  @media ${tablet} {
    width: 40px;
    height: 40px;
  }

  .color-picker-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${(props) => props.color};

    @media ${tablet} {
      width: 30px;
      height: 30px;
    }
  }

  ${(props) =>
    props.isSelected &&
    css`
      width: 30px;
      height: 30px;

      border: ${props.color === globalColors.white
        ? `solid 2px ${globalColors.black}`
        : `solid 2px ${props.color}`};
      @media ${tablet} {
        width: 40px;
        height: 40px;
      }
    `}

  ${(props) =>
    !props.isSelected &&
    css`
      background-color: ${props.color};
    `}

  svg {
    path {
      fill: ${(props) =>
        props.color === globalColors.white
          ? globalColors.black
          : globalColors.white} !important;
    }
    &:hover {
      path {
        fill: ${(props) =>
          props.color === globalColors.white
            ? globalColors.black
            : globalColors.white} !important;
      }
    }
  }
`;

export {
  StyledModalDialog,
  StyledColorItem,
  SelectedColorItem,
  CustomSelectedColor,
};
