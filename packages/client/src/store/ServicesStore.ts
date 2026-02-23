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

import { makeAutoObservable } from "mobx";
import axios from "axios";

import { toastr } from "@docspace/ui-kit/components/toast";

import { CurrentTariffStatusStore } from "@docspace/shared/store/CurrentTariffStatusStore";

import { TTranslation } from "@docspace/shared/types";

import PaymentStore from "./PaymentStore";
import { TBalance } from "@docspace/shared/api/portal/types";
import {
  getAiPrices,
  getServiceQuotaBalance,
} from "@docspace/shared/api/portal";
import { authStore } from "@docspace/shared/store";
import { formatterCurrencyWithoutTranction } from "SRC_DIR/pages/PortalSettings/categories/payments/Wallet/utils";

type TAiToolsChatPrice = {
  prompt: number;
  completion: number;
};

type TAiToolsEmbeddingPrice = {
  prompt: number;
};

type TAiToolsChatModelPrice = {
  id: string;
  price: TAiToolsChatPrice;
};

type TAiToolsEmbeddingModelPrice = {
  id: string;
  price: TAiToolsEmbeddingPrice;
};

type TAiToolsWebSearchPrices = {
  search: number;
  contents: number;
};

export type TAiToolsPrices = {
  currency?: string;
  chat?: TAiToolsChatModelPrice[];
  embedding?: TAiToolsEmbeddingModelPrice[];
  webSearch?: TAiToolsWebSearchPrices;
};

class ServicesStore {
  currentTariffStatusStore: CurrentTariffStatusStore | null = null;

  // servicesQuotasFeatures: Map<string, TPaymentFeature> = new Map();

  // servicesQuotas: TPaymentQuota | null = null;

  paymentStore: PaymentStore | null = null;

  isInitServicesPage = false;

  isVisibleWalletSettings = false;

  partialUpgradeFee: number = 0;

  reccomendedAmount: number = 0;

  featureCountData: number = 0;

  confirmActionType: string | null = null;

  aiToolsBalance: TBalance = null;

  aiToolsPrices: TAiToolsPrices | null = null;

  constructor(
    currentTariffStatusStore: CurrentTariffStatusStore,
    paymentStore: PaymentStore,
  ) {
    this.currentTariffStatusStore = currentTariffStatusStore;
    this.paymentStore = paymentStore;

    makeAutoObservable(this);
  }

  // get storageSizeIncrement() { // temp in payment store because of storage tariff deeactivation
  //   return (
  //     (this.servicesQuotasFeatures.get(TOTAL_SIZE) as TNumericPaymentFeature)
  //       ?.value || 0
  //   );
  // }

  // get storagePriceIncrement() {
  //   return this.servicesQuotas?.price.value ?? 0;
  // }

  // get storageQuotaIncrementPrice() {
  //   return (
  //     this.servicesQuotas?.price ?? {
  //       value: 0,
  //       currencySymbol: "",
  //       isoCurrencySymbol: "USD",
  //     }
  //   );
  // }

  get aiServiceBalance() {
    if (this.aiToolsBalance && this.aiToolsBalance.subAccounts.length > 0)
      return this.aiToolsBalance.subAccounts[0].amount;

    return 0.0;
  }

  get aiServiceCodeCurrency() {
    if (this.aiToolsBalance && this.aiToolsBalance.subAccounts.length > 0)
      return this.aiToolsBalance.subAccounts[0].currency;

    return "USD";
  }

  get aiModelsCurrency() {
    if (!this.aiToolsPrices?.currency) return "USD";

    return this.aiToolsPrices.currency;
  }

  get minimumInputPrice() {
    const inputValues: Array<number | undefined> = [];

    for (const model of this.aiToolsPrices?.chat ?? []) {
      inputValues.push(model.price?.prompt);
    }

    for (const model of this.aiToolsPrices?.embedding ?? []) {
      inputValues.push(model.price?.prompt);
    }

    inputValues.push(this.aiToolsPrices?.webSearch?.search);
    inputValues.push(this.aiToolsPrices?.webSearch?.contents);

    const values = inputValues.filter((v): v is number => Number.isFinite(v));

    return values.length ? Math.min(...values) : 0;
  }

  get minimumOutputPrice() {
    const values = (this.aiToolsPrices?.chat ?? [])
      .map((m) => m.price?.completion)
      .filter((v): v is number => Number.isFinite(v));

    return values.length ? Math.min(...values) : 0;
  }

  get wasFirstAiServiceTopUp() {
    if (!this.aiToolsBalance) return false;

    return this.aiToolsBalance.subAccounts.length !== 0;
  }

  setPartialUpgradeFee = (partialUpgradeFee: number) => {
    this.partialUpgradeFee = partialUpgradeFee;
  };

  setVisibleWalletSetting = (isVisibleWalletSettings: boolean) => {
    this.isVisibleWalletSettings = isVisibleWalletSettings;
  };

  setIsInitServicesPage = (isInitServicesPage: boolean) => {
    this.isInitServicesPage = isInitServicesPage;
  };

  setAiServiceBalance = async () => {
    const balance = await getServiceQuotaBalance();

    this.aiToolsBalance = balance;
  };

  setAiPrices = async () => {
    const prices = await getAiPrices();

    this.aiToolsPrices = prices as TAiToolsPrices;
  };

  formatAiModelsCurrency = (amount: number) => {
    const { language } = authStore;

    return formatterCurrencyWithoutTranction(
      language,
      amount,
      this.aiModelsCurrency,
    );
  };

  formatAiServiceCurrency = (item: number | null = null) => {
    const { language } = authStore;

    const amount = item ?? this.aiServiceBalance;

    return formatterCurrencyWithoutTranction(
      language,
      amount,
      this.aiServiceCodeCurrency,
    );
  };

  // handleServicesQuotas = async () => { // temp in payment store because of storage tariff deeactivation
  //   const res = await getServicesQuotas();

  //   if (!res) return;

  //   res[0].features.forEach((feature) => {
  //     this.servicesQuotasFeatures.set(feature.id, feature);
  //   });

  //   this.servicesQuotas = res[0];

  //   return res;
  // };

  setConfirmActionType = (value: string) => {
    this.confirmActionType = value;
  };

  setReccomendedAmount = (amount: number) => {
    this.reccomendedAmount = amount;
  };

  setFeatureCountData = (featureCountData: number) => {
    this.featureCountData = featureCountData;
  };

  servicesInit = async (t: TTranslation) => {
    const isRefresh = window.location.href.includes("complete=true");

    if (!isRefresh) {
      if (this.isVisibleWalletSettings) this.setVisibleWalletSetting(false);
    }

    const {
      fetchAutoPayments,
      fetchCardLinked,
      setPaymentAccount,
      initWalletPayerAndBalance,
      handleServicesQuotas,
    } = this.paymentStore!;

    const { fetchPortalTariff, walletCustomerStatusNotActive } =
      this.currentTariffStatusStore!;

    try {
      const requests = [
        handleServicesQuotas(),
        initWalletPayerAndBalance(isRefresh),
        fetchPortalTariff(),
        this.setAiServiceBalance(),
        this.setAiPrices(),
      ];

      const [quotas] = await Promise.all(requests);

      if (!quotas) throw new Error();

      if (this.paymentStore!.isAlreadyPaid) {
        if (this.paymentStore!.isStripePortalAvailable) {
          requests.push(setPaymentAccount());

          if (this.paymentStore!.isPayer && walletCustomerStatusNotActive) {
            requests.push(fetchCardLinked());
          }

          if (
            this.paymentStore!.isShowStorageTariffDeactivated() &&
            this.paymentStore!.isPayer
          ) {
            this.paymentStore!.setIsShowTariffDeactivatedModal(true);
          }
        }
        requests.push(fetchAutoPayments());
      } else {
        requests.push(fetchCardLinked());
      }

      this.setIsInitServicesPage(true);
      if (isRefresh) {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        const amountParam = params.get("amount");
        const recommendedAmountParam = params.get("recommendedAmount");
        const actionTypeParam = params.get("actionType");

        if (amountParam && recommendedAmountParam) {
          const amount = Number(amountParam);
          const recommendedAmount = Number(recommendedAmountParam);

          this.setReccomendedAmount(Math.ceil(recommendedAmount));
          this.setFeatureCountData(amount);
        }

        if (actionTypeParam) {
          this.setConfirmActionType(actionTypeParam);
          this.setVisibleWalletSetting(true);
        }

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    } catch (e) {
      if (axios.isCancel(e)) return;
      toastr.error(t("Common:UnexpectedError"));
      console.error(e);
    }
  };
}

export default ServicesStore;
