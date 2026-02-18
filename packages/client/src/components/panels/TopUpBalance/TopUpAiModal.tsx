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

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";

import {
  ModalDialog,
  ModalDialogType,
} from "@docspace/ui-kit/components/modal-dialog";
import { Text } from "@docspace/ui-kit/components/text";

import Amount from "./sub-components/Amount";
import TopUpButtons from "./sub-components/TopUpButtons";
import { AmountProvider } from "../../../pages/PortalSettings/categories/payments/Wallet/context";
import styles from "./styles/TopUpModal.module.scss";
import AiAgents from "PUBLIC_DIR/images/icons/16/ai-agents.svg?url";
import modalStyles from "./styles/TopUpAiModal.module.scss";

import WalletInfo from "./sub-components/WalletInfo";

type TopUpAiModalProps = {
  visible: boolean;
  currency?: string;
  fetchTransactionHistory?: () => Promise<void>;
  walletCustomerEmail?: boolean;
  fetchBalance?: () => Promise<void>;
  onClose: (isTopUp: boolean) => void;
  cardLinked?: string;
  accountLink?: string;
  isEditAutoPayment?: boolean;
  headerProps?: {
    isBackButton: boolean;
    onBackClick: () => void;
    onCloseClick: () => void;
  };
  wasFirstTopUp?: boolean;
  reccomendedAmount?: string;
  amount?: string;
  walletCustomerStatusNotActive?: boolean;
  formatWalletCurrency?: (item?: number, fractionDigits?: number) => string;
  logoText?: string;
};

const TopUpAiModal = (props: TopUpAiModalProps) => {
  const {
    visible,
    currency = "",
    fetchTransactionHistory,
    walletCustomerEmail,
    fetchBalance,
    onClose,
    headerProps,
    reccomendedAmount,
    walletCustomerStatusNotActive,
    formatWalletCurrency,
    logoText,
  } = props;

  const { t } = useTranslation(["Payments", "Services", "Common"]);

  const balanceValue = formatWalletCurrency!();
  const [isLoading, setIsLoading] = useState(false);

  const isDisabled = (isLoading || walletCustomerStatusNotActive) ?? false;

  return (
    <AmountProvider initialAmount={reccomendedAmount}>
      <ModalDialog
        visible={visible}
        onClose={() => onClose(false)}
        displayType={ModalDialogType.aside}
        {...headerProps}
        withBodyScroll
      >
        <ModalDialog.Header>{t("TopUpBalance")}</ModalDialog.Header>
        <ModalDialog.Body>
          <div className={styles.modalBody}>
            <div className={modalStyles.transferSection}>
              <div className={modalStyles.transferBlock}>
                <Text>{t("Payments:From")}</Text>

                <WalletInfo balance={balanceValue} />
              </div>

              <div className={modalStyles.transferBlock}>
                <Text>{t("Payments:To")}</Text>

                <WalletInfo
                  title={t("Services:OrganizationAI", {
                    organizationName: logoText,
                  })}
                  balance={balanceValue}
                  iconUrl={AiAgents}
                />
              </div>
            </div>

            <Amount
              formatWalletCurrency={formatWalletCurrency}
              walletCustomerEmail={walletCustomerEmail}
              isDisabled={isDisabled}
              walletCustomerStatusNotActive={walletCustomerStatusNotActive}
              reccomendedAmount={reccomendedAmount}
            />

            <Text fontSize="12px" className={modalStyles.helperText}>
              {t("Payments:AICreditsHelper")}
            </Text>
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <TopUpButtons
            currency={currency}
            fetchBalance={fetchBalance}
            fetchTransactionHistory={fetchTransactionHistory}
            onClose={onClose}
            walletCustomerEmail={walletCustomerEmail}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            walletCustomerStatusNotActive={walletCustomerStatusNotActive}
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </AmountProvider>
  );
};

export default inject(
  ({ paymentStore, currentTariffStatusStore, settingsStore }: TStore) => {
    const {
      fetchBalance,
      fetchTransactionHistory,
      cardLinked,
      accountLink,
      walletCodeCurrency,
      wasFirstTopUp,
      formatWalletCurrency,
    } = paymentStore;

    const { walletCustomerStatusNotActive, walletCustomerEmail } =
      currentTariffStatusStore;
    const { logoText } = settingsStore;

    return {
      currency: walletCodeCurrency,
      walletCustomerEmail,
      fetchBalance,
      fetchTransactionHistory,
      cardLinked,
      accountLink,
      wasFirstTopUp,
      walletCustomerStatusNotActive,
      formatWalletCurrency,
      logoText,
    };
  },
)(observer(TopUpAiModal));
