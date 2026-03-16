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

import React, { useState, useEffect, useRef } from "react";
import { inject, observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { Text } from "@docspace/ui-kit/components/text";
import { useInterfaceDirection } from "@docspace/ui-kit/context/InterfaceDirectionContext";
import { Loader, LoaderTypes } from "@docspace/ui-kit/components/loader";
import { toastr } from "@docspace/ui-kit/components/toast";

import { calcalateWalletPayment } from "@docspace/shared/api/portal";

import { useServicesActions } from "../../hooks/useServicesActions";
import { usePaymentContext } from "../../context/PaymentContext";

import styles from "../../styles/OrderSummary.module.scss";
import { calculateDifference } from "../../hooks/resourceUtils";

const getDirectionalText = (isRTL: boolean) => {
  return isRTL ? `>1` : `<1`;
};

type OrderSummaryProps = {
  amount: number;
  currentStoragePlanSize?: number;
  storagePriceIncrement?: number;
  storageExpiryDate?: string;
  walletBalance?: number;
  formatWalletCurrency?: (amount?: number, fractionDigits?: number) => string;
  isUpgradeStoragePlan?: boolean;
  isDowngradeStoragePlan?: boolean;
  daysUntilStorageExpiry?: number;
  setPartialUpgradeFee?: (value: number) => void;
  partialUpgradeFee?: number;
  totalPrice?: number;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  amount,
  currentStoragePlanSize,
  storagePriceIncrement,
  storageExpiryDate,
  walletBalance = 0,
  formatWalletCurrency,
  totalPrice = 0,
  isUpgradeStoragePlan,
  daysUntilStorageExpiry,
  setPartialUpgradeFee,
  partialUpgradeFee,
  isDowngradeStoragePlan,
}) => {
  const { t } = useTranslation(["Services", "Payments", "Common"]);
  const { isRTL } = useInterfaceDirection();
  const { setIsWaitingCalculation } = usePaymentContext();
  const {
    calculateDifferenceBetweenPlan,
    isExceedingPlanLimit,
    maxStorageLimit,
  } = useServicesActions();

  const [isPriceLoading, setIsPriceLoading] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isUpgradeStoragePlan) return;

    setIsPriceLoading(true);
    setIsWaitingCalculation(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      const quantity = calculateDifferenceBetweenPlan(amount);
      try {
        const result = await calcalateWalletPayment(
          quantity,
          1,
          controllerRef.current.signal,
        );

        if (!result) {
          toastr.error(t("Common:UnexpectedError"));
          return;
        }

        setPartialUpgradeFee!(result.amount);
        setIsPriceLoading(false);
        setIsWaitingCalculation(false);
      } catch (e) {
        toastr.error(e as unknown as string);
      }
    }, 1000);
  }, [amount, isUpgradeStoragePlan]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsWaitingCalculation(false);
    };
  }, []);

  const isExceedingStorageLimit = isExceedingPlanLimit(amount);

  const additionalStorage = calculateDifference(
    amount,
    currentStoragePlanSize!,
  );
  const remainingBalance = walletBalance - partialUpgradeFee!;
  const daysDisplay = daysUntilStorageExpiry || getDirectionalText(isRTL);

  return (
    <div className={styles.orderSummaryWrapper}>
      <Text fontWeight="700" fontSize="16px" className={styles.sectionTitle}>
        {t("OrderSummary")}
      </Text>
      <div className={styles.summaryCard}>
        <div className={styles.summaryContent}>
          <div className={styles.summaryRow}>
            <Text fontSize="14px" className={styles.rowLabel}>
              {t("StorageUpgrade")}
            </Text>
            <Text fontWeight="600" fontSize="14px" className={styles.rowValue}>
              {t("Payments:StorageUpgradeMessage", {
                fromSize: `${currentStoragePlanSize} ${t("Common:Gigabyte")}`,
                toSize: isExceedingStorageLimit
                  ? `${maxStorageLimit}+ ${t("Common:Gigabyte")}`
                  : `${amount} ${t("Common:Gigabyte")}`,
              })}
            </Text>
          </div>
          {!isExceedingStorageLimit ? (
            <div className={styles.summaryRow}>
              <Text fontSize="14px" className={styles.rowLabel}>
                {isDowngradeStoragePlan
                  ? t("ReducedStorage")
                  : t("AdditionalStorageInfo")}
              </Text>
              <Text
                fontWeight="600"
                fontSize="14px"
                className={styles.rowValue}
              >
                {isDowngradeStoragePlan ? "-" : "+"}
                {additionalStorage} {t("Common:Gigabyte")}
              </Text>
            </div>
          ) : null}
          <div className={styles.summaryRow}>
            <Text fontSize="14px" className={styles.rowLabel}>
              {t("PricePerGB")}
            </Text>
            <Text fontWeight="600" fontSize="14px" className={styles.rowValue}>
              {formatWalletCurrency!(storagePriceIncrement, 2)}
            </Text>
          </div>
          {!isExceedingStorageLimit ? (
            <div className={styles.summaryRow}>
              <Text fontSize="14px" className={styles.rowLabel}>
                {isDowngradeStoragePlan
                  ? t("EffectiveDate")
                  : t("RemainingPeriod")}
              </Text>
              <Text
                fontWeight="600"
                fontSize="14px"
                className={styles.rowValue}
              >
                {isDowngradeStoragePlan ? (
                  storageExpiryDate
                ) : (
                  <>
                    {daysDisplay} {t("Days")}{" "}
                    <Text
                      as="span"
                      fontSize="14px"
                      className={styles.rowSubtext}
                    >
                      ({t("UntilDate", { date: storageExpiryDate })})
                    </Text>
                  </>
                )}
              </Text>
            </div>
          ) : null}
          <div className={styles.divider} />
          <div className={styles.summaryRow}>
            <Text fontWeight="600" fontSize="14px" className={styles.rowLabel}>
              {isExceedingStorageLimit
                ? t("Payments:StorageUponRequest", {
                    amount: `${maxStorageLimit} ${t("Common:Gigabyte")}`,
                  })
                : t("TotalDueToday")}
            </Text>
            {!isExceedingStorageLimit ? (
              <div className={styles.rowValue}>
                {isUpgradeStoragePlan && isPriceLoading ? (
                  <Loader color="" size="20px" type={LoaderTypes.track} />
                ) : (
                  <Text fontWeight="600" fontSize="14px">
                    {formatWalletCurrency!(
                      isDowngradeStoragePlan
                        ? 0
                        : isUpgradeStoragePlan
                          ? partialUpgradeFee!
                          : totalPrice,
                      2,
                    )}
                  </Text>
                )}
              </div>
            ) : null}
          </div>
        </div>
        {isUpgradeStoragePlan && !isPriceLoading && remainingBalance >= 0 ? (
          <Text fontSize="12px" className={styles.balanceInfo}>
            {t("RemainingBalanceAfterPurchase", {
              currency: formatWalletCurrency!(remainingBalance, 2),
            })}
          </Text>
        ) : null}
      </div>
    </div>
  );
};

export default inject(
  ({ paymentStore, currentTariffStatusStore, servicesStore }: TStore) => {
    const { formatWalletCurrency, storagePriceIncrement, walletBalance } =
      paymentStore;
    const {
      currentStoragePlanSize,
      storageExpiryDate,
      daysUntilStorageExpiry,
    } = currentTariffStatusStore;
    const { setPartialUpgradeFee, partialUpgradeFee } = servicesStore;

    return {
      formatWalletCurrency,
      storagePriceIncrement,
      walletBalance,
      currentStoragePlanSize,
      storageExpiryDate,
      daysUntilStorageExpiry,
      setPartialUpgradeFee,
      partialUpgradeFee,
    };
  },
)(observer(OrderSummary));
