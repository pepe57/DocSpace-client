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

import { ToggleButton } from "@docspace/ui-kit/components/toggle-button";

import { StyledParam } from "./StyledParam";

const StyledToggleParam = styled(StyledParam)`
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  max-width: 100%;

  .set_room_params-info-description {
    box-sizing: border-box;
    max-width: 100%;
  }

  .set_room_params-toggle {
    width: 28px;
    min-width: 28px;
  }
`;

type ToggleParamProps = {
  id: string;
  title: string;
  description: string;
  isChecked: boolean;
  onCheckedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
};

const ToggleParam = ({
  id,
  title,
  description,
  isChecked,
  isDisabled,
  onCheckedChange,
}: ToggleParamProps) => {
  return (
    <StyledToggleParam>
      <div className="set_room_params-info">
        <div className="set_room_params-info-title">
          <div className="set_room_params-info-title-text">{title}</div>
        </div>
        <div className="set_room_params-info-description">{description}</div>
      </div>
      <ToggleButton
        id={id}
        className="set_room_params-toggle"
        isChecked={isChecked}
        onChange={onCheckedChange}
        dataTestId="create_edit_room_toggle"
        isDisabled={isDisabled}
      />
    </StyledToggleParam>
  );
};

export default ToggleParam;
