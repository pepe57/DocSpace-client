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

import { globalColors } from "@docspace/ui-kit/providers/theme/themes";
import styled from "styled-components";

const StyledWatermark = styled.div<{
  isEdit?: boolean;
  rotate?: number;
  scale?: number;
}>`
  margin-top: 16px;

  .watermark-title {
    margin: 16px 0 8px 0;
  }
  .title-without-top {
    margin-top: 0px;
  }
  .watermark-checkbox {
    margin: 18px 0 0 0;
  }

  .options-wrapper {
    display: grid;
    grid-template-rows: 56px 56px;
    gap: 16px;

    .options {
      color: ${(props) => props.theme.comboBox.label.selectedColor};
    }
  }

  .image-wrapper {
    display: grid;
    grid-template-columns: 216px auto;
    gap: 16px;

    .image-description {
      display: flex;
      gap: 8px;
      align-items: baseline;

      .image-watermark_text {
        margin-bottom: 8px;
      }
    }

    .image-watermark_wrapper {
      width: 216px;
      height: 216px;
      border: 1px solid ${globalColors.grayLightMid};

      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 88%;
        height: 88%;
        transform: ${(props) =>
          `rotate(${props.rotate}deg) scale(${props.scale})`};

        opacity: 0.4;
        margin: auto;
      }
    }
  }

  .watermark-tab_items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-bottom: 20px;
  }
`;
const StyledBody = styled.div`
  .types-content {
  }
`;

export { StyledWatermark, StyledBody };
