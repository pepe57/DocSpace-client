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
import { inject, observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { Text } from "@docspace/ui-kit/components/text";
import {
  mobile,
  injectDefaultTheme,
} from "@docspace/shared/utils";
import { getCorrectDate } from "@docspace/ui-kit/utils/date/getCorrectDate";

import StatusBadge from "../../sub-components/StatusBadge";
import { getTriggerTranslate } from "../../Webhooks.helpers";

const BarWrapper = styled.div.attrs(injectDefaultTheme)`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  margin-top: 25px;

  background: ${(props) => props.theme.client.settings.webhooks.barBackground};
  border-radius: 3px;

  .barItemHeader {
    margin-bottom: 10px;
    color: ${(props) => props.theme.client.settings.webhooks.color};
  }
`;

const BarItem = styled.div`
  box-sizing: border-box;
  min-height: 76px;
  padding: 16px;

  @media ${mobile} {
    flex-basis: 100%;
  }
`;

const BarItemHeader = ({ children }) => (
  <Text as="h3" fontSize="12px" fontWeight={600} className="barItemHeader">
    {children}
  </Text>
);

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const DetailsBar = ({ eventDetails }) => {
  const { t, i18n } = useTranslation(["Webhooks", "People"]);

  const formattedDelivery = getCorrectDate(
    i18n.language,
    eventDetails.delivery,
  );
  const formattedCreationTime = getCorrectDate(
    i18n.language,
    eventDetails.creationTime,
  );

  const trigger = getTriggerTranslate(eventDetails.trigger, t);

  return (
    <BarWrapper>
      <BarItem>
        <BarItemHeader>{t("People:UserStatus")}</BarItemHeader>
        <FlexWrapper>
          <StatusBadge status={eventDetails.status} />
        </FlexWrapper>
      </BarItem>
      <BarItem>
        <BarItemHeader>{t("EventID")}</BarItemHeader>
        <Text isInline fontWeight={600}>
          {eventDetails.id}
        </Text>
      </BarItem>
      <BarItem>
        <BarItemHeader>{t("EventType")}</BarItemHeader>
        <Text isInline fontWeight={600}>
          {trigger}
        </Text>
      </BarItem>
      <BarItem>
        <BarItemHeader>{t("EventTime")}</BarItemHeader>
        <Text isInline fontWeight={600}>
          {formattedCreationTime}
        </Text>
      </BarItem>
      <BarItem>
        <BarItemHeader>{t("DeliveryTime")}</BarItemHeader>
        <Text isInline fontWeight={600}>
          {formattedDelivery}
        </Text>
      </BarItem>
    </BarWrapper>
  );
};

export default inject(({ webhooksStore }) => {
  const { eventDetails } = webhooksStore;

  return { eventDetails };
})(observer(DetailsBar));
