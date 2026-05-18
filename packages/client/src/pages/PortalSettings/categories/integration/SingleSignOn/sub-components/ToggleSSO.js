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
import styled, { useTheme } from "styled-components";
import { inject, observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Text } from "@docspace/ui-kit/components/text";
import { ToggleButton } from "@docspace/ui-kit/components/toggle-button";
import { Badge } from "@docspace/ui-kit/components/badge";
import { globalColors } from "@docspace/ui-kit/providers/theme/themes";
import { mobile } from "@docspace/shared/utils";
import { UnavailableStyles } from "../../../../utils/commonSettingsStyles";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 12px;
  border-radius: 6px;
  background: ${(props) =>
    props.theme.client.settings.integration.sso.toggleContentBackground};

  @media ${mobile} {
    margin-bottom: 24px;
  }

  .toggle {
    position: static;
    margin-top: 1px;
  }

  .toggle-caption {
    display: flex;
    flex-direction: column;
    gap: 4px;
    .toggle-caption_title {
      display: flex;
      .toggle-caption_title_badge {
        margin-inline-start: 4px;
        cursor: auto;
      }
    }
  }

  ${(props) => !props.isSSOAvailable && UnavailableStyles}
`;

const ToggleSSO = ({ enableSso, ssoToggle, isSSOAvailable }) => {
  const { t } = useTranslation("SingleSignOn");

  const onChangeToggle = React.useCallback(() => {
    ssoToggle(t);
  }, [ssoToggle, t]);

  const theme = useTheme();
  return (
    <StyledWrapper isSSOAvailable={isSSOAvailable}>
      <ToggleButton
        className="enable-sso toggle"
        isChecked={enableSso}
        onChange={onChangeToggle}
        isDisabled={!isSSOAvailable}
        dataTestId="enable_sso_toggle_button"
      />

      <div className="toggle-caption">
        <div className="toggle-caption_title">
          <Text
            fontWeight={600}
            lineHeight="20px"
            noSelect
            className="settings_unavailable"
          >
            {t("TurnOnSSO")}
          </Text>
          {!isSSOAvailable ? (
            <Badge
              backgroundColor={
                theme.isBase
                  ? globalColors.favoritesStatus
                  : globalColors.favoriteStatusDark
              }
              label={t("Common:Paid")}
              fontWeight="700"
              className="toggle-caption_title_badge"
              isPaidBadge
            />
          ) : null}
        </div>
        <Text
          fontSize="12px"
          fontWeight={400}
          lineHeight="16px"
          className="settings_unavailable"
        >
          {t("TurnOnSSOCaption")}
        </Text>
      </div>
    </StyledWrapper>
  );
};

export default inject(({ currentQuotaStore, ssoStore }) => {
  const { enableSso, ssoToggle } = ssoStore;
  const { isSSOAvailable } = currentQuotaStore;

  return {
    enableSso,
    ssoToggle,
    isSSOAvailable,
  };
})(observer(ToggleSSO));
