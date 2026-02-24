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

import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import { Text } from "@docspace/ui-kit/components/text";
import {
  Tabs,
  TabsTypes,
  type TTabItem,
} from "@docspace/ui-kit/components/tabs";
import { Link } from "@docspace/ui-kit/components/link";
import { DateTime } from "luxon";

import { AI_TOOLS } from "@docspace/shared/constants";

import TransactionHistory from "SRC_DIR/pages/PortalSettings/categories/payments/TransactionHistory";
import BalanceAmount from "SRC_DIR/pages/PortalSettings/categories/payments/BalanceAmount";
import ServiceToggleSection from "SRC_DIR/pages/PortalSettings/categories/services/sub-components/ServiceToggleSection";
import { finishRefreshingWithMinCycle } from "SRC_DIR/helpers/refreshing";

import PricingBillingBody from "./sub-components/PricingBillingBody";
import TopUpContainer from "./sub-components/TopUpContainer";

import styles from "./AiPage.module.scss";

type AiPageProps = {
  aiServiceCodeCurrency: string;
  aiServiceBalance: number;
  isEnabled?: boolean;
  onToggle?: (id: string, enabled: boolean) => void;
  onTopUpClick?: () => void;
  onPricingBillingClick?: () => void;
  language?: string;
  fetchAiServiceBalance?: () => Promise<void>;
  fetchTransactionHistory?: (
    startDate: DateTime | null,
    endDate: DateTime | null,
    credit: boolean,
    debit: boolean,
    participantName?: string,
    serviceName?: string,
  ) => Promise<void>;
  logoText?: string;
  aiServiceLastTopUp?: string;
};

const AiPage = (props: AiPageProps) => {
  const {
    isEnabled = false,
    onToggle,
    onTopUpClick,
    onPricingBillingClick,
    aiServiceBalance,
    aiServiceCodeCurrency,
    fetchAiServiceBalance,
    fetchTransactionHistory,
    logoText,
    aiServiceLastTopUp,
  } = props;

  const { t } = useTranslation("Services");

  const [selectedTabId, setSelectedTabId] = useState("usage");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPricingBillingVisible, setIsPricingBillingVisible] = useState(false);
  const [isTopUpVisible, setIsTopUpVisible] = useState(false);

  const onRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    const startTime = Date.now();
    try {
      await Promise.all([
        fetchAiServiceBalance?.(),
        fetchTransactionHistory?.(null, null, true, true, "", "aitools"),
      ]);
    } finally {
      finishRefreshingWithMinCycle({
        startTime,
        setRefreshing: setIsRefreshing,
      });
    }
  };

  const onToggleChange = () => {
    onToggle?.(AI_TOOLS, isEnabled);
  };

  const onOpenPricingBilling = () => {
    onPricingBillingClick?.();
    setIsPricingBillingVisible(true);
  };

  const onClosePricingBilling = () => {
    setIsPricingBillingVisible(false);
  };

  const onOpenTopUp = () => {
    onTopUpClick?.();
    setIsPricingBillingVisible(false);
    setIsTopUpVisible(true);
  };

  const onCloseTopUp = () => {
    setIsTopUpVisible(false);
  };

  const tabsItems: TTabItem[] = [
    {
      id: "usage",
      name: t("Usage"),
      content: (
        <div>
          <TransactionHistory withoutHeader serviceName={AI_TOOLS} />
        </div>
      ),
    },
    {
      id: "model-settings",
      name: t("ModelSettings"),
      content: null,
    },
  ];

  return (
    <div className={styles.container}>
      <PricingBillingBody
        visible={isPricingBillingVisible}
        onClose={onClosePricingBilling}
        isBackButton={false}
        withoutFooter
      />

      <TopUpContainer
        visible={isTopUpVisible}
        onCloseTopUpModal={onCloseTopUp}
        onBackClick={onCloseTopUp}
      />
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
          <BalanceAmount
            amount={aiServiceBalance}
            currency={aiServiceCodeCurrency}
            title={t("AvailableCredits")}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
          />

          <Button
            size={ButtonSize.small}
            primary
            label={t("TopUpCredits")}
            onClick={onOpenTopUp}
            scale
            testId="top_up_credits_button"
          />
        </div>
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
          {aiServiceLastTopUp ? aiServiceLastTopUp : "—"}
        </Text>
        <Link
          className={styles.pricingLink}
          onClick={onOpenPricingBilling}
          textDecoration="underline dotted"
          color="accent"
        >
          <Text fontSize="13px" fontWeight={600}>
            {t("AIPricingAndBilling")}
          </Text>
        </Link>
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

export default inject(
  ({ servicesStore, paymentStore, settingsStore }: TStore) => {
    const { fetchTransactionHistory } = paymentStore;
    const { logoText } = settingsStore;

    const {
      aiServiceCodeCurrency,
      aiServiceBalance,
      fetchAiServiceBalance,
      aiServiceLastTopUp,
    } = servicesStore;

    return {
      aiServiceBalance,
      aiServiceCodeCurrency,
      fetchAiServiceBalance,
      fetchTransactionHistory,
      logoText,
      aiServiceLastTopUp,
    };
  },
)(observer(AiPage));
