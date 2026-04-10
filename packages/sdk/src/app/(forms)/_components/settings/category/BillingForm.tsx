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

"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { MemoryRouter } from "react-router";

import { Text } from "@docspace/ui-kit/components/text";
import { Link, LinkType } from "@docspace/ui-kit/components/link";
import { BillingRoot, Wallet, PaymentMethod } from "@docspace/ui-kit/billing";
import AiPage from "@docspace/ui-kit/billing/services/pages/ai-tools/AiPage";
import type { TPaymentConfig } from "@docspace/ui-kit/billing/types";
import { useFormsUserStore } from "../../../_store/FormsUserStore";

import WalletIcon from "@docspace/ui-kit/assets/icons/16/wallet.react.svg";
import AiIcon from "@docspace/ui-kit/assets/icons/16/ai-agents.svg";
import CardIcon from "@docspace/ui-kit/assets/icons/16/card.react.svg";

import styles from "./SettingsPanel.module.scss";

const PAYMENTS_PATH = "/portal-settings/payments/portal-payments";

const BILLING_ROUTES: TPaymentConfig["routes"] = {
  portalPayments: "/portal-settings/payments",
  services: "/portal-settings/payments/services",
  aiServices: "/portal-settings/payments/services/ai",
  backup: "/portal-settings/payments/services/backup",
  diskStorage: "/portal-settings/payments/services/disk-storage",
};

type BillingTab = "wallet" | "ai" | "payment-method";

const TABS: {
  id: BillingTab;
  titleKey: string;
  iconClass: string;
  icon: React.ReactNode;
  nativeIcon?: boolean;
}[] = [
  {
    id: "wallet",
    titleKey: "Wallet",
    iconClass: styles.billingIconWallet,
    icon: <WalletIcon />,
  },
  {
    id: "ai",
    titleKey: "OrganizationAI",
    iconClass: styles.billingIconAi,
    icon: <AiIcon />,
  },
  {
    id: "payment-method",
    titleKey: "PaymentMethod",
    iconClass: styles.billingIconPayment,
    icon: <CardIcon />,
    nativeIcon: true,
  },
];

const getTabDescription = (id: BillingTab, t: (key: string) => string) => {
  switch (id) {
    case "wallet": return t("BillingWalletCardDesc");
    case "ai": return t("BillingAICardDesc");
    case "payment-method": return t("BillingPaymentMethodCardDesc");
  }
};

const BillingForm = () => {
  const { t, i18n } = useTranslation();
  const { user } = useFormsUserStore();
  const [activeTab, setActiveTab] = React.useState<BillingTab>("ai");

  const onOpenBilling = React.useCallback(() => {
    const url = `${window.location.origin}${PAYMENTS_PATH}`;
    window.open(url, "_blank");
  }, []);

  const billingConfig = React.useMemo<TPaymentConfig>(
    () => ({
      language: i18n.language || "en",
      routes: BILLING_ROUTES,
      user: user
        ? {
            id: user.id,
            email: user.email,
            isOwner: user.isOwner,
          }
        : undefined,
    }),
    [i18n.language, user],
  );

  return (
    <div className={styles.billingWrapper}>
      <Text fontSize="12px" lineHeight="16px" className={styles.billingNotice}>
        {t("BillingPortalNotice")}{" "}
        <Link
          type={LinkType.action}
          fontSize="12px"
          isTextOverflow={false}
          className={styles.billingPortalLink}
          onClick={onOpenBilling}
        >
          {t("OpenPortalBilling")}
        </Link>
      </Text>

      <div className={styles.billingCards}>
        {TABS.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.billingCard} ${activeTab === tab.id ? styles.billingCardActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className={`${styles.billingCardIcon} ${tab.iconClass}`}>
              {tab.nativeIcon ? (
                tab.icon
              ) : (
                <span className={styles.billingCardIconInner}>
                  {tab.icon}
                </span>
              )}
            </div>
            <div className={styles.billingCardText}>
              <Text fontSize="13px" fontWeight={600} truncate>
                {t(tab.titleKey, {
                  productName: t("ProductName"),
                  organizationName: t("OrganizationName"),
                })}
              </Text>
              <Text fontSize="11px" className={styles.billingCardDesc}>
                {getTabDescription(tab.id, t)}
              </Text>
            </div>
          </div>
        ))}
      </div>

      <MemoryRouter>
        <BillingRoot config={billingConfig}>
          <div key={activeTab} className={styles.billingContent}>
            {activeTab === "payment-method" && <PaymentMethod />}
            {activeTab === "wallet" && (
              <Wallet showPortalSettingsLoader={false} />
            )}
            {activeTab === "ai" && <AiPage />}
          </div>
        </BillingRoot>
      </MemoryRouter>
    </div>
  );
};

export default BillingForm;

