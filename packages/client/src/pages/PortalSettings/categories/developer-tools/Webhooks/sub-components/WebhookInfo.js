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

import { injectDefaultTheme } from "@docspace/shared/utils";

import { Text } from "@docspace/ui-kit/components/text";

import { useTranslation } from "react-i18next";
import { Link, LinkTarget, LinkType } from "@docspace/ui-kit/components/link";
import { getBrandName } from "@docspace/shared/constants/brands";

const InfoText = styled(Text).attrs(injectDefaultTheme)`
  max-width: 660px;
  white-space: break-spaces;
  margin: 0 0 8px;
  line-height: 20px;
  color: ${(props) => props.theme.client.settings.common.descriptionColor};
`;

const WebhookInfo = (props) => {
	const { t } = useTranslation(["Webhooks"]);
	const { webhooksGuideUrl, logoText } = props;

	return (
		<div>
			<InfoText as="p">
				{t("WebhooksInfo", {
					productName: getBrandName("ProductName"),
					organizationName: logoText,
				})}
			</InfoText>
			{webhooksGuideUrl ? (
				<Link
					id="webhooks-info-link"
					tag="a"
					fontWeight={600}
					href={webhooksGuideUrl}
					target={LinkTarget.blank}
					type={LinkType.page}
					isHovered
					color="accent"
					dataTestId="webhooks_info_link"
				>
					{t("WebhooksGuide")}
				</Link>
			) : null}
		</div>
	);
};

export default inject(({ settingsStore }) => {
	const { webhooksGuideUrl, logoText } = settingsStore;

	return {
		webhooksGuideUrl,
		logoText,
	};
})(observer(WebhookInfo));
