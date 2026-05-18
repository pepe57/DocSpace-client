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

import React from "react";
import styled from "styled-components";

import RoomType from "@docspace/shared/components/room-type";
import { RoomsTypeValues } from "@docspace/shared/utils/common";
import { Backdrop } from "@docspace/ui-kit/components/backdrop";
import { Portal } from "@docspace/ui-kit/components/portal";
import { globalColors } from "@docspace/ui-kit/providers/theme/themes";
import { injectDefaultTheme } from "@docspace/shared/utils";
import { RoomsType } from "@docspace/shared/enums";

const StyledDropdownMobile = styled.div.attrs(injectDefaultTheme)<{
  isOpen: boolean;
}>`
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  position: fixed;
  bottom: 0;
  z-index: 500;
  padding-top: 6px;
  box-shadow: 0px -4px 60px ${globalColors.popupShadow};
  border-radius: 6px 6px 0px 0px;
  background: ${(props) =>
    props.theme.createEditRoomDialog.roomTypeDropdown.mobile.background};
`;

type DropdownMobileProps = {
  open: boolean;
  onClose: () => void;
  chooseRoomType: (roomType: RoomsType) => void;
  forceHideDropdown: boolean;
};

const DropdownMobile = ({
  open,
  onClose,
  chooseRoomType,
  forceHideDropdown,
}: DropdownMobileProps) => {
  return (
    <Portal
      visible
      element={
        <>
          <Backdrop
            visible={open}
            onClick={onClose}
            withBackground
            isAside
            zIndex={450}
          />
          {!forceHideDropdown ? (
            <StyledDropdownMobile className="dropdown-mobile" isOpen={open}>
              {RoomsTypeValues.map((roomType) => (
                <RoomType
                  id={roomType.toString()}
                  key={roomType}
                  roomType={roomType}
                  type="dropdownItem"
                  onClick={() => chooseRoomType(roomType)}
                  isOpen
                  selectedId={roomType.toString()}
                />
              ))}
            </StyledDropdownMobile>
          ) : null}
        </>
      }
    />
  );
};

export default DropdownMobile;
