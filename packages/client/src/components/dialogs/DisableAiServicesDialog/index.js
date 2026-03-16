// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";

import { Button } from "@docspace/ui-kit/components/button";
import { ModalDialog } from "@docspace/ui-kit/components/modal-dialog";
import { Text } from "@docspace/ui-kit/components/text";

const DisableAiServicesDialogComponent = ({
  visible,
  onClose,
  onContinue,
  isLoading,
  isAiToolsServiceOn = false,
  aiServiceBalance = 0,
  aiServiceCodeCurrency = "USD",
  formatAiServiceCurrency = (amount) => `${amount}`,
}) => {
  const { t } = useTranslation(["Settings", "Common"]);

  const effects = [
    t("DisableAiServicesEffect1", {
      productName: t("Common:ProductName"),
      aiSettings: t("AISettings"),
    }),
    t("DisableAiServicesEffect2", {
      aiServices: t("Common:AIServices"),
    }),
    t("DisableAiServicesEffect3", {
      aiAgents: t("Common:AIAgents"),
    }),
    t("DisableAiServicesEffect4"),
  ];

  return (
    <ModalDialog
      visible={visible}
      onClose={onClose}
      displayType="modal"
      autoMaxHeight
      data-testid="disable_ai_services_dialog"
    >
      <ModalDialog.Header>
        {t("DisableAiServices", {
          aiServices: t("Common:AIServices"),
        })}
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Text
          fontSize="13px"
          fontWeight={400}
          style={{ marginBottom: "22px" }}
          lineHeight="20px"
        >
          {t("DisableAiServicesDescription", {
            organizationName: t("Common:OrganizationName"),
          })}
        </Text>
        <Text fontSize="13px" fontWeight={400} as="div">
          <ul
            style={{
              margin: "0",
              paddingLeft: "0px",
              listStyleType: "none",
            }}
          >
            {effects.map((effect, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "0px",
                  fontSize: "13px",
                  lineHeight: "18px",
                  paddingLeft: "0",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    verticalAlign: "middle",
                    marginRight: "3px",
                  }}
                >
                  •
                </span>
                {effect}
              </li>
            ))}
          </ul>
        </Text>
        {isAiToolsServiceOn && (
          <Text fontSize="13px" fontWeight={400} style={{ marginTop: "16px" }}>
            <Trans
              t={t}
              i18nKey="DisableAiServicesBalance"
              values={{
                balance: formatAiServiceCurrency(
                  aiServiceBalance,
                  3,
                  aiServiceCodeCurrency,
                ),
                aiServices: t("Common:AIServices"),
              }}
              components={{
                1: <strong key="balance-strong" />,
              }}
            />
          </Text>
        )}
        <Text
          fontSize="13px"
          fontWeight={isAiToolsServiceOn ? 700 : 400}
          style={{ marginTop: "16px" }}
        >
          {t("DisableAiServicesConfirm", {
            aiServices: t("Common:AIServices"),
          })}
        </Text>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          primary
          size="normal"
          label={t("Common:ContinueButton")}
          scale
          onClick={onContinue}
          isLoading={isLoading}
          testId="disable_ai_services_continue_button"
        />
        <Button
          size="normal"
          label={t("Common:CancelButton")}
          scale
          onClick={onClose}
          isDisabled={isLoading}
          testId="disable_ai_services_cancel_button"
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

DisableAiServicesDialogComponent.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isAiToolsServiceOn: PropTypes.bool,
  aiServiceBalance: PropTypes.number,
  aiServiceCodeCurrency: PropTypes.string,
  formatAiServiceCurrency: PropTypes.func,
};

const DisableAiServicesDialog = inject(({ servicesStore, paymentStore }) => {
  const { aiServiceBalance, aiServiceCodeCurrency, formatAiServiceCurrency } =
    servicesStore;
  const { isAiToolsServiceOn } = paymentStore;

  return {
    isAiToolsServiceOn,
    aiServiceBalance,
    aiServiceCodeCurrency,
    formatAiServiceCurrency,
  };
})(observer(DisableAiServicesDialogComponent));

export default DisableAiServicesDialog;
