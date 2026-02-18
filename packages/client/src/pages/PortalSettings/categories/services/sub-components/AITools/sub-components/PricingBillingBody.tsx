import React from "react";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

import { Text } from "@docspace/ui-kit/components/text";
import { HelpButton } from "@docspace/ui-kit/components/help-button";
import HelpReactSvgUrl from "PUBLIC_DIR/images/help.react.svg?url";
import InputTokensIcon from "PUBLIC_DIR/images/icons/16/input-tokens.svg";
import OutputTokensIcon from "PUBLIC_DIR/images/icons/16/output-tokens.svg";
import VectorizationIcon from "PUBLIC_DIR/images/icons/16/ai-vectorization.svg";
import WebSearchIcon from "PUBLIC_DIR/images/icons/16/web-search.svg";

import styles from "../../../styles/BackupServiceDialog.module.scss";
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
}

const PricingBillingBody: React.FC<PricingBillingBodyProps> = ({
  onBack,
  onClose,
  visible,
  onTopUpClick,
}) => {
  const { t } = useTranslation(["Services", "Common"]);

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
                      price: "$0.006",
                      tokens: "1M",
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
                      price: "$0.006",
                      tokens: "1M",
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
                      i18nKey="AIPricingVectorizationPrice"
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
                        price: "$0.006",
                        tokens: "1M",
                      }}
                    />
                  </Text>
                </Text>
              </div>

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
                      i18nKey="AIPricingWebSearchPrice"
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
                        price: "$0.006",
                      }}
                    />
                  </Text>
                </Text>
              </div>
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
              <div className={styles.modelRow}>
                <div className={styles.modelIconPlaceholder}>
                  <span>GPT</span>
                </div>
                <div className={styles.modelText}>
                  <Text className={styles.modelName}>{t("AIModelGPT")}</Text>
                  <Text className={styles.modelPriceLine}>
                    {t("AIModelGPTPrice")}
                  </Text>
                </div>
              </div>

              <div className={styles.modelRow}>
                <div className={styles.modelIconPlaceholder}>
                  <span>AI</span>
                </div>
                <div className={styles.modelText}>
                  <Text className={styles.modelName}>{t("AIModelClaude")}</Text>
                  <Text className={styles.modelPriceLine}>
                    {t("AIModelClaudePrice")}
                  </Text>
                </div>
              </div>

              <div className={styles.modelRow}>
                <div className={styles.modelIconPlaceholder}>
                  <span>DS</span>
                </div>
                <div className={styles.modelText}>
                  <Text className={styles.modelName}>
                    {t("AIModelDeepseek")}
                  </Text>
                  <Text className={styles.modelPriceLine}>
                    {t("AIModelDeepseekPrice")}
                  </Text>
                </div>
              </div>

              <div className={styles.modelRow}>
                <div className={styles.modelIconPlaceholder}>
                  <span>G</span>
                </div>
                <div className={styles.modelText}>
                  <Text className={styles.modelName}>
                    {t("AIModelGeminiFlash")}
                  </Text>
                  <Text className={styles.modelPriceLine}>
                    {t("AIModelGeminiFlashPrice")}
                  </Text>
                </div>
              </div>

              <div className={styles.modelRow}>
                <div className={styles.modelIconPlaceholder}>
                  <span>G</span>
                </div>
                <div className={styles.modelText}>
                  <Text className={styles.modelName}>
                    {t("AIModelGeminiPro")}
                  </Text>
                  <Text className={styles.modelPriceLine}>
                    {t("AIModelGeminiProPrice")}
                  </Text>
                </div>
              </div>
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

export default PricingBillingBody;
