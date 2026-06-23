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
import { useTranslation } from "react-i18next";
import { Row, RowContent } from "@docspace/ui-kit/components/rows";
import { Text } from "@docspace/ui-kit/components/text";
import { ToggleButton } from "@docspace/ui-kit/components/toggle-button";
import { Encoder } from "@docspace/ui-kit/utils/encoder";
import { isMobile, tablet } from "@docspace/shared/utils";

import { useContextOptions } from "../useContextOptions";
import { RowItemType } from "../../types";
import { ApiKeysLifetimeIcon } from "../ApiKeysLifetimeIcon";
import { getStatusByDate } from "../../utils";

const StyledRowContent = styled(RowContent)`
  display: flex;
  padding-bottom: 10px;

  .row-main-container-wrapper {
    @media ${tablet} {
      width: 100%;
    }
  }

  .rowMainContainer {
    height: 100%;
    width: 100%;
  }

  .mainIcons {
    min-width: 76px;
    display: flex;
  }

  .row-content_text {
    color: ${(props) => props.theme.filesSection.rowView.sideColor};
  }

  .api-keys_name {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ToggleButtonWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-inline-start: -52px;

  .toggleButton {
    display: flex;
    align-items: center;
  }
`;

const RowItem = (props: RowItemType) => {
  const {
    item,
    culture,
    sectionWidth,
    onChangeApiKeyParams,
    onDeleteApiKey,
    onEditApiKey,
  } = props;

  const { t } = useTranslation(["Common"]);
  const { contextOptions } = useContextOptions(
    t,
    item,
    onEditApiKey,
    onDeleteApiKey,
  );

  const expiresAtDate = item.expiresAt
    ? getStatusByDate(item.expiresAt, culture)
    : "";

  return (
    <Row contextOptions={contextOptions}>
      <StyledRowContent sectionWidth={sectionWidth}>
        <div>
          <div className="api-keys_name">
            <Text fontWeight={600} fontSize="14px">
              {item.name}
            </Text>
            <ApiKeysLifetimeIcon
              t={t}
              item={item}
              expiresAtDate={expiresAtDate}
              expiresAt={item.expiresAt}
            />
          </div>
          {!isMobile() ? (
            <div>
              <Text
                fontWeight={600}
                fontSize="12px"
                className="row-content_text"
              >
                {item.key} | {Encoder.htmlDecode(item.createBy.displayName ?? "")}
              </Text>
            </div>
          ) : null}
        </div>

        <ToggleButtonWrapper>
          <ToggleButton
            className="toggleButton"
            isChecked={item.isActive}
            onChange={() =>
              onChangeApiKeyParams(item.id, { isActive: !item.isActive })
            }
          />
        </ToggleButtonWrapper>
      </StyledRowContent>
    </Row>
  );
};

export default RowItem;
