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

import { useEffect, useState } from "react";
import { Text } from "@docspace/ui-kit/components/text";
// import { TextInput } from "@docspace/ui-kit/components/text-input";
// import { SaveCancelButtons } from "@docspace/shared/components/save-cancel-buttons";
import styled, { useTheme } from "styled-components";
import { Button } from "@docspace/ui-kit/components/button";
import { TwoFactorCampaignBanner } from "@docspace/shared/components/two-factor-campaign";
// import { toastr } from "@docspace/ui-kit/components/toast";
import { mobile, tablet } from "@docspace/shared/utils";
import { Badge } from "@docspace/ui-kit/components/badge";
import { globalColors } from "@docspace/ui-kit/providers/theme/themes";
import { saveToSessionStorage } from "@docspace/shared/utils/saveToSessionStorage";
import { getFromSessionStorage } from "@docspace/shared/utils/getFromSessionStorage";
import { UnavailableStyles } from "../../../utils/commonSettingsStyles";

// const StyledTextInput = styled(TextInput)`
//   margin-top: 4px;
//   margin-bottom: 24px;
//   width: 350px;

//   @media ${mobile} {
//     width: 100%;
//   }
// `;

const MainContainer = styled.div`
  width: 100%;

  .main-wrapper {
    max-width: 700px;
  }

  .paid-badge {
    cursor: auto;
    margin-bottom: 8px;
    margin-inline-start: -2px;
  }

  .login-history-description {
    color: ${(props) => props.theme.client.settings.common.descriptionColor};
    padding-bottom: 24px;
  }

  .save-cancel {
    padding: 0;
    position: static;

    .buttons-flex {
      padding: 0;
    }
  }

  .login-subheader {
    font-size: 13px;
    color: ${(props) =>
      props.theme.client.settings.security.loginHistory.subheaderColor};
  }

  .latest-text {
    font-size: 13px;
    padding: 20px 0 16px;
  }

  .storage-label {
    font-weight: 600;
  }

  .content-wrapper {
    margin-top: 16px;
    margin-bottom: 24px;
    .table-container_header {
      position: absolute;
      z-index: 0;
    }

    .history-row-container {
      max-width: 700px;
    }
  }

  ${(props) => props.isSettingNotPaid && UnavailableStyles}
`;

const DownLoadWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  padding-block: 16px 30px;
  position: sticky;
  bottom: 0;
  margin-top: 32px;
  background-color: ${({ theme }) => theme.backgroundColor};

  @media ${mobile} {
    position: fixed;
    padding-inline: 16px;
    inset-inline: 0;
  }

  .download-report_button {
    width: auto;
    height: auto;
    font-size: 13px;
    line-height: 20px;
    padding-top: 5px;
    padding-bottom: 5px;

    @media ${tablet} {
      font-size: 14px;
      line-height: 16px;
      padding-top: 11px;
      padding-bottom: 11px;
    }

    @media ${mobile} {
      width: 100%;
    }
  }

  .download-report_description {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;

    height: 16px;

    margin: 0;
    color: ${(props) =>
      props.theme.client.settings.security.auditTrail
        .downloadReportDescriptionColor};
  }

  @media ${mobile} {
    flex-direction: column-reverse;
  }
`;

const HistoryMainContent = (props) => {
  const {
    t,
    lifetime,
    subHeader,
    content,
    downloadReport,
    downloadReportDescription,
    getReport,
    isSettingNotPaid,
    isLoadingDownloadReport,
    tfaEnabled,
    withCampaign,
    currentColorScheme,
    loginHistory,
  } = props;

  const [loginLifeTime, setLoginLifeTime] = useState(String(lifetime) || "180");
  const [auditLifeTime, setAuditLifeTime] = useState(String(lifetime) || "180");

  const theme = useTheme();

  const getSettings = () => {
    const storagePeriodSettings = getFromSessionStorage("storagePeriod");
    const defaultData = {
      loginHistoryLifeTime: String(lifetime),
      auditTrailLifeTime: String(lifetime),
    };

    saveToSessionStorage("defaultStoragePeriod", defaultData);
    if (storagePeriodSettings) {
      setLoginLifeTime(storagePeriodSettings.loginHistoryLifeTime);
      setAuditLifeTime(storagePeriodSettings.auditTrailLifeTime);
    } else {
      setLoginLifeTime(String(lifetime));
      setAuditLifeTime(String(lifetime));
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  useEffect(() => {
    const newSettings = {
      loginHistoryLifeTime: loginLifeTime,
      auditTrailLifeTime: auditLifeTime,
    };
    saveToSessionStorage("storagePeriod", newSettings);
  }, [loginLifeTime, auditLifeTime]);

  const handleMouseDown = (e) => {
    if (e.button === 0 || e.button === 1) {
      getReport();
      e.preventDefault();
    }
  };

  return (
    <MainContainer isSettingNotPaid={isSettingNotPaid}>
      <TwoFactorCampaignBanner
        tfaEnabled={tfaEnabled}
        currentColorScheme={currentColorScheme}
        withCampaign={withCampaign}
        style={{ marginBottom: "20px" }}
      />
      {isSettingNotPaid ? (
        <Badge
          className="paid-badge"
          fontWeight="700"
          backgroundColor={
            theme.isBase
              ? globalColors.favoritesStatus
              : globalColors.favoriteStatusDark
          }
          label={t("Common:Paid")}
          isPaidBadge
        />
      ) : null}
      <div className="main-wrapper">
        <Text fontSize="13px" className="login-history-description">
          {subHeader}
        </Text>

        {/*  
        // This part is commented out because it is not used in the current version of the application
        <Text className="latest-text settings_unavailable">{latestText} </Text>

        <label
          className="storage-label settings_unavailable"
          htmlFor="storage-period"
        >
          {storagePeriod}
        </label>
        {isLoginHistoryPage ? (
          <>
            <StyledTextInput
              onChange={onChangeLoginLifeTime}
              value={loginLifeTime}
              size="base"
              id="login-history-period"
              type="text"
              isDisabled={isSettingNotPaid}
            />
            <SaveCancelButtons
              className="save-cancel"
              onSaveClick={setLifeTimeSettings}
              onCancelClick={onCancelLoginLifeTime}
              saveButtonLabel={saveButtonLabel}
              cancelButtonLabel={cancelButtonLabel}
              showReminder={loginLifeTimeReminder}
              reminderText={t("Common:YouHaveUnsavedChanges")}
              displaySettings={true}
              hasScroll={false}
              isDisabled={isSettingNotPaid}
            />
          </>
        ) : (
          <>
            <StyledTextInput
              onChange={onChangeAuditLifeTime}
              value={auditLifeTime}
              size="base"
              id="audit-history-period"
              type="text"
              isDisabled={isSettingNotPaid}
            />
            <SaveCancelButtons
              className="save-cancel"
              onSaveClick={setLifeTimeSettings}
              onCancelClick={onCancelAuditLifeTime}
              saveButtonLabel={saveButtonLabel}
              cancelButtonLabel={cancelButtonLabel}
              showReminder={auditLifeTimeReminder}
              reminderText={t("Common:YouHaveUnsavedChanges")}
              displaySettings={true}
              hasScroll={false}
              isDisabled={isSettingNotPaid}
            />
          </>
        )} */}
      </div>
      {content}
      <DownLoadWrapper>
        <Button
          className="download-report_button"
          dataTestId={
            loginHistory
              ? "login_history_download_report_button"
              : "audit_trail_download_report_button"
          }
          primary
          label={downloadReport}
          size="normal"
          minWidth="auto"
          onMouseDown={handleMouseDown}
          isDisabled={isSettingNotPaid}
          isLoading={isLoadingDownloadReport}
        />
        <span className="download-report_description">
          {downloadReportDescription}
        </span>
      </DownLoadWrapper>
    </MainContainer>
  );
};

export default HistoryMainContent;
