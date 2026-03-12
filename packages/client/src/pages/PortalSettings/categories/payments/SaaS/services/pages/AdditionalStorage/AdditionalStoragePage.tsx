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
import { useTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";
// import { useNavigate } from "react-router";

import { Text } from "@docspace/ui-kit/components/text";
import { Button, ButtonSize } from "@docspace/ui-kit/components/button";

import ServiceToggleSection from "../../sub-components/ServiceToggleSection";

import SettingsIcon from "PUBLIC_DIR/images/settings.react.svg";

import TransactionHistory from "../../../shared/transaction-history";
import styles from "./AdditionalStoragePage.module.scss";
import { DISK_STORAGE } from "@docspace/shared/constants";
import WalletInfo from "../../../shared/top-up-balance/sub-components/WalletInfo";
import { getConvertedSize } from "@docspace/shared/utils/common";

type AdditionalStoragePageProps = {
  currentStoragePlanSize?: number;
  storagePricePerGB?: number;
  storageAutoRenewalDate?: string;
  isStorageEnabled?: boolean;
  formatWalletCurrency?: (amount?: number, fractionDigits?: number) => string;
  onToggleStorage?: (enabled: boolean) => void;
  onIncreaseStorage?: () => void;
  storagePriceIncrement?: number;
  storageSizeIncrement?: number;
};

const AdditionalStoragePage: React.FC<AdditionalStoragePageProps> = ({
  currentStoragePlanSize = 600,
  storagePricePerGB = 0.14,
  storageAutoRenewalDate = "May 5, 2025",
  isStorageEnabled = true,
  formatWalletCurrency,
  onToggleStorage,
  onIncreaseStorage,
  storagePriceIncrement,
  storageSizeIncrement,
}) => {
  const { t } = useTranslation(["Payments", "Common"]);

  const handleToggleChange = () => {
    onToggleStorage?.(!isStorageEnabled);
  };

  const handleIncreaseStorage = () => {
    onIncreaseStorage?.();
  };

  const monthlyPrice = currentStoragePlanSize * storagePricePerGB;

  const formattedPrice = formatWalletCurrency
    ? formatWalletCurrency(monthlyPrice, 2)
    : `$${monthlyPrice.toFixed(2)}`;

  const balance = formatWalletCurrency!();

  return (
    <div className={styles.container}>
      {/* Toggle Section */}
      <ServiceToggleSection
        isEnabled={isStorageEnabled}
        onToggle={handleToggleChange}
        title={t("Payments:AdditionalDiskStorage")}
        priceText={t("PerStorage", {
          currency: formatWalletCurrency!(storagePriceIncrement!, 2),
          amount: getConvertedSize(t, storageSizeIncrement || 0),
        })}
        description={t("Payments:AdjustStorageToExactAmount")}
      />

      {/* Wallet Balance Card */}
      <WalletInfo shortView withoutBackground balance={balance} />

      {/* Current Subscription Card */}
      <div className={styles.subscriptionCard}>
        <div className={styles.subscriptionHeader}>
          <Text fontWeight={700} fontSize="14px">
            {t("Payments:CurrentSubscription")}
          </Text>
          <div className={styles.settingsIcon}>
            <SettingsIcon />
          </div>
        </div>

        <div className={styles.priceContainer}>
          <Text fontWeight={700}>
            <span className={styles.mainPrice}>{formattedPrice}</span>
            <span className={styles.perMonth}>/month</span>{" "}
            <span className={styles.storage}>
              ({currentStoragePlanSize} {t("Common:Gigabyte")})
            </span>
          </Text>
        </div>

        <Button
          className={styles.increaseButton}
          label={t("Payments:IncreaseStorage")}
          size={ButtonSize.small}
          primary
          onClick={handleIncreaseStorage}
        />
      </div>

      {/* Auto Renewal Text */}
      <Text className={styles.renewalText}>
        {t("Payments:SubscriptionWillBeAutomaticallyRenewed")}{" "}
        <span className={styles.renewalDate}>
          {t("Payments:OnDate", { date: storageAutoRenewalDate })}
        </span>
      </Text>

      {/* Transaction History */}
      <div className={styles.transactionSection}>
        <TransactionHistory serviceName={DISK_STORAGE} />
      </div>
    </div>
  );
};

export default inject(({ paymentStore, currentTariffStatusStore }: TStore) => {
  const {
    formatWalletCurrency,
    walletBalance,
    storagePriceIncrement,
    storageSizeIncrement,
  } = paymentStore;
  const { currentStoragePlanSize, storageExpiryDate } =
    currentTariffStatusStore;

  return {
    walletBalance,
    currentStoragePlanSize,
    formatWalletCurrency,
    storageAutoRenewalDate: storageExpiryDate,
    storagePriceIncrement,
    storageSizeIncrement,
  };
})(observer(AdditionalStoragePage));
