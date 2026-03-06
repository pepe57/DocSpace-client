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

import { Text } from "@docspace/ui-kit/components/text";
import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import { toastr } from "@docspace/ui-kit/components/toast";

import CardIconUrl from "PUBLIC_DIR/images/icons/16/card.react.svg";
import CheckReactSvg from "PUBLIC_DIR/images/check.edit.react.svg";

import styles from "./PaymentMethod.module.scss";
import PayerInformation from "../PayerInformation";

interface PaymentMethodProps {
  paymentLink?: string;
  isCardLinked?: boolean;
}

interface InjectedProps {
  paymentStore?: {
    paymentLink?: string;
  };
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentLink,
  isCardLinked = true,
}) => {
  const { t } = useTranslation(["Payments", "Common"]);

  const handleGoToStripe = () => {
    if (paymentLink) {
      window.open(paymentLink, "_blank");
    } else {
      toastr.error(t("Common:UnexpectedError"));
    }
  };

  return (
      <div className={styles.container}>
      <Text fontSize="16px" fontWeight={700} lineHeight="22px">
        {t("Payer")}
      </Text>

      <Text
        className={styles.description}
        fontSize="13px"
        fontWeight={400}
        lineHeight="20px"
      >
        {t("PayerResponsibleForBilling")}
      </Text>

      {/* @ts-expect-error all props are injected via MobX inject() */}
      <PayerInformation />

      <div className={styles.header}>
        <Text fontSize="16px" fontWeight={700} lineHeight="22px">
          {t("PaymentMethod")}
        </Text>
      </div>

      <Text
        className={styles.description}
        fontSize="13px"
        fontWeight={400}
        lineHeight="20px"
      >
        {t("PaymentMethodDescription", {
          productName: t("Common:ProductName"),
        })}
      </Text>

      <div className={styles.cardRow}>
        <div className={styles.iconButton}>
          <CardIconUrl />
        </div>

        <div className={styles.cardContent}>
          <Text fontSize="14px" fontWeight={600} lineHeight="16px">
            {t("CardLinked")}
          </Text>
        </div>

        {isCardLinked && (
          <div className={styles.tickedWrapper}>
            <CheckReactSvg />
          </div>
        )}
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          label={t("GoToStripe")}
          size={ButtonSize.small}
          primary
          onClick={handleGoToStripe}
          testId="go_to_stripe_button"
        />
      </div>
    </div>
  )
};

export default inject(({ paymentStore }: InjectedProps) => {
  const { paymentLink } = paymentStore || {};

  return {
    paymentLink,
  };
})(observer(PaymentMethod));
