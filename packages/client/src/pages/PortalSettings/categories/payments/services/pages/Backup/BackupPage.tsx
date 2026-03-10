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
import { useNavigate } from "react-router";

import { Text } from "@docspace/ui-kit/components/text";

import ArrowIcon from "PUBLIC_DIR/images/arrow.react.svg";
import WalletIcon from "PUBLIC_DIR/images/access.comment.react.svg";

import ServiceToggleSection from "../../sub-components/ServiceToggleSection";
import TransactionHistory from "../../../TransactionHistory";
import styles from "./BackupPage.module.scss";
import { BACKUP_SERVICE } from "@docspace/shared/constants";
import { DeviceType } from "@docspace/ui-kit/enums";

type BackupPageProps = {
  walletBalance?: number;
  availableBackupsCount?: number;
  backupPricePerUnit?: number;
  isBackupEnabled?: boolean;
  formatWalletCurrency?: (amount?: number, fractionDigits?: number) => string;
  onToggleBackup?: (enabled: boolean) => void;
};

const BackupPage: React.FC<BackupPageProps> = ({
  walletBalance = 100,
  availableBackupsCount = 8,
  backupPricePerUnit = 12,
  isBackupEnabled = true,
  formatWalletCurrency,
  onToggleBackup,
  currentDeviceType,
}) => {
  const { t } = useTranslation(["Payments", "Common"]);

  const handleToggleChange = () => {
    onToggleBackup?.(!isBackupEnabled);
  };

  const formattedBalance = formatWalletCurrency
    ? formatWalletCurrency(walletBalance, 2)
    : `$${walletBalance.toFixed(2)}`;

  return (
    <div className={styles.container}>
      {/* Toggle Section */}
      <ServiceToggleSection
        isEnabled={isBackupEnabled}
        onToggle={handleToggleChange}
        title={t("Payments:Backup")}
        description={t("Payments:BackupDescription")}
      />

      {/* Wallet Balance Card */}
      <div className={styles.walletCard}>
        <div className={styles.walletIcon}>
          <WalletIcon />
        </div>
        <div className={styles.walletContent}>
          <Text className={styles.walletTitle}>
            {t("Payments:ProductNameWallet", {
              productName: t("Common:ProductName"),
            })}
          </Text>
          <Text className={styles.walletBalance}>
            {t("Payments:Balance")}: {formattedBalance}
          </Text>
        </div>
      </div>

      {/* Available Backups Card */}
      <div className={styles.backupsCard}>
        <div className={styles.backupsHeader}>
          <Text className={styles.backupsTitle}>
            {t("Payments:AvailableBackups")}
          </Text>
        </div>

        <div className={styles.backupsAmountContainer}>
          <Text className={styles.backupsNumber}>{availableBackupsCount}</Text>
          <Text className={styles.backupsPriceText}>
            {t("Payments:PerBackupWithBracket", {
              currency: `$${backupPricePerUnit}`,
            })}
          </Text>
        </div>
      </div>

      {/* Usage History */}
      <div className={styles.usageHistorySection}>
        <TransactionHistory
          withoutHeader={currentDeviceType !== DeviceType.mobile}
          serviceName={BACKUP_SERVICE}
        />
      </div>
    </div>
  );
};

export default inject(({ paymentStore, settingsStore }: TStore) => {
  const { formatWalletCurrency, walletBalance } = paymentStore;
  const { currentDeviceType } = settingsStore;
  return {
    walletBalance,
    formatWalletCurrency,
    currentDeviceType,
  };
})(observer(BackupPage));
