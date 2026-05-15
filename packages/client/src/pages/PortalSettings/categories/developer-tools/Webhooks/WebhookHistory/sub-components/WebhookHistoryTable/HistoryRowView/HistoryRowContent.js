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
import { useTranslation } from "react-i18next";

import { Text } from "@docspace/ui-kit/components/text";
import { RowContent } from "@docspace/ui-kit/components/rows";

import { globalColors } from "@docspace/ui-kit/providers/theme/themes";
import { getCorrectDate } from "@docspace/ui-kit/utils/date/getCorrectDate";

import StatusBadge from "../../../../sub-components/StatusBadge";

const StyledRowContent = styled(RowContent)`
  display: flex;
  padding-bottom: 10px;

  .rowMainContainer {
    height: 100%;
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
`;

const StatusHeader = styled.div`
  display: flex;
`;

export const HistoryRowContent = ({ sectionWidth, historyItem }) => {
  const { i18n } = useTranslation("Webhooks");

  const formattedDelivery = getCorrectDate(i18n.language, historyItem.delivery);

  return (
    <StyledRowContent sectionWidth={sectionWidth}>
      <ContentWrapper>
        <StatusHeader>
          <Text
            fontWeight={600}
            fontSize="14px"
            style={{ marginInlineEnd: "8px" }}
          >
            {historyItem.id}
          </Text>
          <StatusBadge status={historyItem.status} />
        </StatusHeader>
        <Text fontWeight={600} fontSize="12px" color={globalColors.gray}>
          {formattedDelivery}
        </Text>
      </ContentWrapper>
      <span />
    </StyledRowContent>
  );
};
