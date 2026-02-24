import React from "react";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import { inject, observer } from "mobx-react";
import { Text } from "@docspace/ui-kit/components/text";
import { HelpButton } from "@docspace/ui-kit/components/help-button";
import HelpReactSvgUrl from "PUBLIC_DIR/images/help.react.svg?url";
import InputTokensIcon from "PUBLIC_DIR/images/icons/16/input-tokens.svg";
import OutputTokensIcon from "PUBLIC_DIR/images/icons/16/output-tokens.svg";
import VectorizationIcon from "PUBLIC_DIR/images/icons/16/ai-vectorization.svg";
import WebSearchIcon from "PUBLIC_DIR/images/icons/16/web-search.svg";

import styles from "../../../styles/BackupServiceDialog.module.scss";
import type { TAiToolsPrices } from "SRC_DIR/store/ServicesStore";
import {
  Button,
  ButtonSize,
  ModalDialog,
  ModalDialogType,
} from "@docspace/ui-kit/components";

interface PricingBillingBodyProps {
  onBack: () => void;
  visible: boolean;
  onClose: () => void;
  onTopUpClick: () => void;

  aiToolsPrices?: TAiToolsPrices;
  formatAiModelsCurrency?: (amount: number) => string;
  minimumInputPrice?: number;
  minimumOutputPrice?: number;
}

const PricingBillingBody: React.FC<PricingBillingBodyProps> = ({
  onBack,
  onClose,
  visible,
  onTopUpClick,
  aiToolsPrices,
  formatAiModelsCurrency,
  minimumInputPrice,
  minimumOutputPrice,
}) => {
  const { t } = useTranslation(["Services", "Common"]);

  const safeFormatAiModelsCurrency = (amount: number) =>
    formatAiModelsCurrency ? formatAiModelsCurrency(amount) : String(amount);

  const chatModels = aiToolsPrices?.chat ?? [];
  return (
    <ModalDialog
      visible={visible}
      onClose={onClose}
      displayType={ModalDialogType.aside}
      isBackButton
      onBackClick={onBack}
      onCloseClick={onClose}
      withBodyScroll
    >
      <ModalDialog.Header>{t("AIPricingAndBilling")}</ModalDialog.Header>
      <ModalDialog.Body>
        <div className={styles.pricingBody}>
          <Text fontSize="12px">{t("AIPricingIntro")}</Text>

          <Text fontSize="16px" fontWeight="700">
            {t("AIWhatYouPayForTitle")}
          </Text>

          <div className={styles.pricingSection}>
            <div className={styles.pricingSectionHeader}>
              <Text fontSize="14px" fontWeight="700">
                {t("AIPricingTokensTitle")}
              </Text>
              <HelpButton
                iconName={HelpReactSvgUrl}
                style={{ height: "15px", margin: "0" }}
                tooltipContent={<></>}
              />
            </div>

            <div className={styles.pricingCard}>
              <div className={styles.pricingRow}>
                <div className={styles.pricingRowLeft}>
                  <InputTokensIcon />
                  <Text fontSize="12px">{t("AIPricingInputTokens")}</Text>
                </div>
                <Text fontSize="12px" fontWeight="600">
                  <Trans
                    t={t}
                    ns="Services"
                    i18nKey="AIPricingInputTokensPrice"
                    components={{
                      1: (
                        <Text
                          as="span"
                          className={styles.payForItemTextMuted}
                        />
                      ),
                    }}
                    values={{
                      price: safeFormatAiModelsCurrency(minimumInputPrice ?? 0),
                    }}
                  />
                </Text>
              </div>

              <div className={styles.pricingRow}>
                <div className={styles.pricingRowLeft}>
                  <OutputTokensIcon />
                  <Text fontSize="12px">{t("AIPricingOutputTokens")}</Text>
                </div>
                <Text fontSize="12px" fontWeight="600">
                  <Trans
                    t={t}
                    ns="Services"
                    i18nKey="AIPricingOutputTokensPrice"
                    components={{
                      1: (
                        <Text
                          as="span"
                          className={styles.payForItemTextMuted}
                        />
                      ),
                    }}
                    values={{
                      price: safeFormatAiModelsCurrency(
                        minimumOutputPrice ?? 0,
                      ),
                    }}
                  />
                </Text>
              </div>
            </div>

            <Text className={styles.pricingNote}>{t("AIPricingFeeNote")}</Text>
          </div>

          <div className={styles.pricingSection}>
            <div className={styles.pricingSectionHeader}>
              <Text className={styles.pricingSectionTitle}>
                {t("AIPricingAdditionalFeaturesTitle")}
              </Text>
              <HelpButton
                iconName={HelpReactSvgUrl}
                style={{ height: "15px", margin: "0" }}
                tooltipContent={<></>}
              />
            </div>

            <div className={styles.pricingCard}>
              {aiToolsPrices?.embedding?.[0]?.price?.prompt ? (
                <div className={styles.pricingRow}>
                  <div className={styles.pricingRowLeft}>
                    <div className={styles.pricingRowIconBox}>
                      <VectorizationIcon />
                    </div>
                    <Text fontSize="12px">
                      <Trans
                        t={t}
                        ns="Services"
                        i18nKey="AIWhatYouPayForVectorization"
                        components={{
                          1: (
                            <Text
                              fontSize="12px"
                              as="span"
                              className={styles.payForItemTextMuted}
                            />
                          ),
                        }}
                      />
                    </Text>
                  </div>
                  <Text className={styles.pricingRowPrice}>
                    <Text fontWeight="600">
                      <Trans
                        t={t}
                        ns="Services"
                        i18nKey="AIPricingPricePerTokens"
                        components={{
                          1: (
                            <Text
                              fontSize="12px"
                              as="span"
                              className={styles.payForItemTextMuted}
                            />
                          ),
                        }}
                        values={{
                          price: safeFormatAiModelsCurrency(
                            aiToolsPrices.embedding[0].price.prompt,
                          ),
                        }}
                      />
                    </Text>
                  </Text>
                </div>
              ) : null}

              {aiToolsPrices?.webSearch?.contents ? (
                <div className={styles.pricingRow}>
                  <div className={styles.pricingRowLeft}>
                    <div className={styles.pricingRowIconBox}>
                      <WebSearchIcon />
                    </div>
                    <Text fontSize="12px">{t("AIWhatYouPayForWebSearch")}</Text>
                  </div>
                  <Text fontSize="12px">
                    <Text fontWeight="600">
                      <Trans
                        t={t}
                        ns="Services"
                        i18nKey="AIPricingPricePerRequest"
                        components={{
                          1: (
                            <Text
                              fontSize="12px"
                              as="span"
                              className={styles.payForItemTextMuted}
                            />
                          ),
                        }}
                        values={{
                          price: safeFormatAiModelsCurrency(
                            aiToolsPrices.webSearch.contents,
                          ),
                        }}
                      />
                    </Text>
                  </Text>
                </div>
              ) : null}
              {aiToolsPrices?.webSearch?.search ? (
                <div className={styles.pricingRow}>
                  <div className={styles.pricingRowLeft}>
                    <div className={styles.pricingRowIconBox}>
                      <WebSearchIcon />
                    </div>
                    <Text fontSize="12px">{t("AIWhatYouPayForWebSearch")}</Text>
                  </div>
                  <Text fontSize="12px">
                    <Text fontWeight="600">
                      <Trans
                        t={t}
                        ns="Services"
                        i18nKey="AIPricingPricePerRequest"
                        components={{
                          1: (
                            <Text
                              fontSize="12px"
                              as="span"
                              className={styles.payForItemTextMuted}
                            />
                          ),
                        }}
                        values={{
                          price: safeFormatAiModelsCurrency(
                            aiToolsPrices.webSearch.search,
                          ),
                        }}
                      />
                    </Text>
                  </Text>
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.modelListSection}>
            <Text className={styles.modelListTitle}>
              {t("AIModelListTitle")}
            </Text>
            <Text className={styles.modelListSubtitle}>
              {t("AIModelListSubtitle")}
            </Text>

            <div className={styles.modelList}>
              {chatModels?.map((model, index) => {
                const id = model?.id ?? "Model";

                return (
                  <div key={`${id}-${index}`} className={styles.modelRow}>
                    <div className={styles.modelIconPlaceholder}>
                      <span>{id}</span>
                    </div>
                    <div className={styles.modelText}>
                      <Text className={styles.modelName}>{id}</Text>
                      <Text className={styles.modelPriceLine}>
                        {t("AIModelPrice", {
                          inputPrice: safeFormatAiModelsCurrency(
                            model?.price?.prompt ?? 0,
                          ),
                          outputPrice: safeFormatAiModelsCurrency(
                            model?.price?.completion ?? 0,
                          ),
                        })}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <div className={styles.closeFooter}>
          <Button
            key="OkButton"
            label={t("Payments:TopUp")}
            size={ButtonSize.normal}
            primary
            scale
            isDisabled={false}
            onClick={onTopUpClick}
            isLoading={false}
            testId="top_up_button"
          />
          <Button
            key="CancelButton"
            label={t("Common:CancelButton")}
            size={ButtonSize.normal}
            scale
            onClick={onClose}
            isDisabled={false}
            testId="cancel_top_up_button"
          />
        </div>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default inject(({ servicesStore }: TStore) => {
  const {
    aiToolsPrices,
    formatAiModelsCurrency,
    minimumInputPrice,
    minimumOutputPrice,
  } = servicesStore;

  return {
    aiToolsPrices,
    formatAiModelsCurrency,
    minimumInputPrice,
    minimumOutputPrice,
  };
})(observer(PricingBillingBody));
