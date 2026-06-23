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
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import { inject, observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { ColumnarInfoBar } from "@docspace/ui-kit/components/columnar-info-bar";
import { getCorrectDate } from "@docspace/ui-kit/utils/date/getCorrectDate";

import StatusBadge from "../../sub-components/StatusBadge";
import { getTriggerTranslate } from "../../Webhooks.helpers";

const DetailsBar = ({ eventDetails }) => {
  const { t, i18n } = useTranslation(["Webhooks", "People"]);

  const formattedDelivery = getCorrectDate(i18n.language, eventDetails.delivery);
  const formattedCreationTime = getCorrectDate(
    i18n.language,
    eventDetails.creationTime,
  );

  const trigger = getTriggerTranslate(eventDetails.trigger, t);

  const columns = [
    {
      label: t("People:UserStatus"),
      value: <StatusBadge status={eventDetails.status} />,
    },
    { label: t("EventID"), value: eventDetails.id },
    { label: t("EventType"), value: trigger },
    { label: t("EventTime"), value: formattedCreationTime },
    { label: t("DeliveryTime"), value: formattedDelivery },
  ];

  return <ColumnarInfoBar columns={columns} variant="neutral" />;
};

export default inject(({ webhooksStore }) => {
  const { eventDetails } = webhooksStore;

  return { eventDetails };
})(observer(DetailsBar));
