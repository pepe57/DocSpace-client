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

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";

import classNames from "classnames";

import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import { IconButton } from "@docspace/ui-kit/components/icon-button";
import { Text } from "@docspace/ui-kit/components/text";
import {
  Tabs,
  TabsTypes,
  type TTabItem,
} from "@docspace/ui-kit/components/tabs";
import { Link } from "@docspace/ui-kit/components/link";

import { AI_TOOLS } from "@docspace/shared/constants";

import TransactionHistory from "SRC_DIR/pages/PortalSettings/categories/payments/TransactionHistory";
import ServiceToggleSection from "SRC_DIR/pages/PortalSettings/categories/services/sub-components/ServiceToggleSection";

import RefreshReactSvgUrl from "PUBLIC_DIR/images/icons/16/refresh.react.svg?url";

import styles from "./AiPage.module.scss";

type AiPageProps = {
  isEnabled?: boolean;
  onToggle?: (id: string, enabled: boolean) => void;
  onTopUpClick?: () => void;
  onPricingBillingClick?: () => void;
  walletBalance?: number;
  fetchBalance?: () => Promise<void>;
  fetchTransactionHistory?: () => Promise<void>;
  logoText?: string;
};

const formatBalanceParts = (balance: number) => {
  const [major, minor] = balance.toFixed(3).split(".");
  return {
    major: `${major}`,
    minor: `.${minor ?? "000"}`,
  };
};

const AiPage = (props: AiPageProps) => {
  const {
    isEnabled = false,
    onToggle,
    onTopUpClick,
    onPricingBillingClick,
    walletBalance = 0,
    fetchBalance,
    fetchTransactionHistory,
    logoText,
  } = props;

  const { t } = useTranslation("Services");

  const [selectedTabId, setSelectedTabId] = useState("usage");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const balanceParts = useMemo(() => {
    return formatBalanceParts(walletBalance);
  }, [walletBalance]);

  const onRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await Promise.all([fetchBalance?.(), fetchTransactionHistory?.()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const onToggleChange = () => {
    onToggle?.(AI_TOOLS, isEnabled);
  };

  const tabsItems: TTabItem[] = [
    {
      id: "usage",
      name: t("Usage"),
      content: fetchTransactionHistory ? (
        <div>
          <TransactionHistory
            fetchTransactionHistory={fetchTransactionHistory}
            withoutHeader
          />
        </div>
      ) : null,
    },
    {
      id: "model-settings",
      name: t("ModelSettings"),
      content: null,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.toggleSection}>
        <ServiceToggleSection
          isEnabled={isEnabled}
          onToggle={onToggleChange}
          title={t("EnableOrganizationAI", { organizationName: logoText })}
          description={t("EnableAIDescription")}
          testId="service-ai-toggle-button"
        />
      </div>

      <div className={styles.balanceSection}>
        <div className={styles.balanceCard}>
          <div className={styles.balanceHeader}>
            <Text
              className={styles.balanceTitle}
              fontSize="18px"
              fontWeight={700}
            >
              {t("AvailableCredits")}
            </Text>
            <IconButton
              iconName={RefreshReactSvgUrl}
              size={16}
              onClick={onRefresh}
              className={classNames(styles.refreshIcon, {
                [styles.spinning]: isRefreshing,
              })}
            />
          </div>

          <div className={styles.balanceAmount}>
            <span
              className={styles.balanceMajor}
            >{`$${balanceParts.major}`}</span>
            <span className={styles.balanceMinor}>{balanceParts.minor}</span>
          </div>

          <div className={styles.lastTopUpRow}>
            <Text
              className={styles.lastTopUpLabel}
              fontSize="13px"
              fontWeight={600}
            >
              {t("LastTopUp")}
            </Text>
            <Text
              className={styles.lastTopUpValue}
              fontSize="14px"
              fontWeight={600}
            >
              {"—"}
            </Text>
            <Link
              className={styles.pricingLink}
              onClick={onPricingBillingClick}
              textDecoration="underline dotted"
              color="accent"
            >
              <Text fontSize="13px" fontWeight={600}>
                {t("AIPricingAndBilling")}
              </Text>
            </Link>
          </div>

          <Button
            size={ButtonSize.small}
            primary
            label={t("TopUpCredits")}
            onClick={onTopUpClick}
            scale
            testId="top_up_credits_button"
          />
        </div>
      </div>

      <div className={styles.tabsWrapper}>
        <Tabs
          items={tabsItems}
          selectedItemId={selectedTabId}
          onSelect={(item) => setSelectedTabId(item.id)}
          withAnimation
        />
      </div>
    </div>
  );
};

export default inject(({ paymentStore, settingsStore }: TStore) => {
  const { walletBalance, fetchBalance, fetchTransactionHistory } = paymentStore;
  const { logoText } = settingsStore;
  return {
    walletBalance,
    fetchBalance,
    fetchTransactionHistory,
    logoText,
  };
})(observer(AiPage));
