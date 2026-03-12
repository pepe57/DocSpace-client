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

import { match, P } from "ts-pattern";
import React, { useCallback, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  ModalDialog,
  ModalDialogType,
} from "@docspace/ui-kit/components/modal-dialog";
import { Button } from "@docspace/ui-kit/components/button";
import { Text } from "@docspace/ui-kit/components/text";

import styles from "./ExternalDbModal.module.scss";
import type {
  ExternalDbModalProps,
  ExternalDbFormData,
  ConsumerProp,
} from "./ExternalDbModal.types";
import ExternalDbField from "./ExternalDbField";
import SupportLinks from "./SupportLinks";
import { testExternalDbConnection } from "@docspace/shared/api/settings";
import {
  filterRelevantFields,
  getFieldValidationRules,
} from "./ExternalDbField.utils";
import { toastr } from "@docspace/ui-kit/components";

const ExternalDbModal: React.FC<ExternalDbModalProps> = ({
  visible,
  onClose,
  onSave,
  selectedConsumer,
  isLoading: externalLoading = false,
  t,
  feedbackAndSupportUrl,
  portalSettingsUrl,
}) => {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const getDefaultValues = useMemo((): Record<
    string,
    string | boolean | number
  > => {
    const defaults: Record<string, string | boolean | number> = {};

    selectedConsumer.props.forEach((prop) => {
      const name = prop.name;

      match(prop)
        .with({ type: P.union("text", "password") }, () => {
          defaults[name] = prop.value ?? "";
        })
        .with({ type: "toggle" }, () => {
          defaults[name] = Boolean(prop.value);
        })
        .with({ type: "select" }, ({ value, options }) => {
          defaults[name] = String(value || options[0]);
        })
        .exhaustive();
    });

    return defaults;
  }, [selectedConsumer]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<ExternalDbFormData>({
    defaultValues: getDefaultValues,
    mode: "onChange",
  });

  const formValues = watch();

  const isFieldVisible = useCallback(
    (field: ConsumerProp): boolean => {
      if (!field.dependsOn || !field.dependsOnValue) {
        return true;
      }
      return (
        formValues[field.dependsOn as keyof ExternalDbFormData] ===
        field.dependsOnValue
      );
    },
    [formValues],
  );

  const fieldsToRender = useMemo(
    () => selectedConsumer.props.filter(isFieldVisible),
    [selectedConsumer, isFieldVisible],
  );

  const handleTestConnection = async (): Promise<void> => {
    try {
      setIsTesting(true);
      const formData = watch();
      const filteredData = filterRelevantFields(formData, fieldsToRender);

      const { success, error } = await testExternalDbConnection(filteredData);

      if (error) toastr.error(error);
      setConnected(success);
    } catch (error) {
      console.error("Test connection error:", error);
      toastr.error(error as Error);
    } finally {
      setIsTesting(false);
    }
  };

  const onSubmit = async (data: ExternalDbFormData): Promise<void> => {
    try {
      const filteredData = filterRelevantFields(data, fieldsToRender);
      await onSave(filteredData);
    } catch (error) {
      console.error("Save error:", error);
      toastr.error(error as Error);
    }
  };

  return (
    <ModalDialog
      withForm
      withBodyScroll
      visible={visible}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      displayType={ModalDialogType.aside}
    >
      <ModalDialog.Header>{selectedConsumer.title}</ModalDialog.Header>
      <ModalDialog.Body>
        <div className={styles.modalBody}>
          {selectedConsumer.instruction && (
            <Text className={styles.instruction}>
              {selectedConsumer.instruction}
            </Text>
          )}

          {fieldsToRender.map((fieldConfig) => (
            <Controller
              key={fieldConfig.name}
              name={fieldConfig.name as keyof ExternalDbFormData}
              control={control}
              rules={getFieldValidationRules(fieldConfig, t)}
              render={({ field }) => (
                <ExternalDbField
                  field={fieldConfig}
                  value={field.value ?? ""}
                  onChange={(_, value) => field.onChange(value)}
                />
              )}
            />
          ))}
          <div className={styles.testConnectionSection}>
            <Button
              className={styles.testButton}
              label={t("Common:TestConnection")}
              onClick={handleTestConnection}
              isLoading={isTesting}
              isDisabled={!isValid || externalLoading}
            />
            {match(connected)
              .with(true, () => (
                <Text className={styles.connectedText}>
                  {t("Common:Connected")}
                </Text>
              ))
              .with(false, () => (
                <Text className={styles.connectionFailedText}>
                  {t("Common:ConnectionFailed")}
                </Text>
              ))
              .otherwise(() => null)}
          </div>
          <SupportLinks
            feedbackAndSupportUrl={feedbackAndSupportUrl}
            portalSettingsUrl={portalSettingsUrl}
          />
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          primary
          scale
          label={t("Common:Enable")}
          type="submit"
          isDisabled={!isValid || externalLoading || connected === false}
          isLoading={externalLoading}
        />
        <Button
          scale
          label={t("Common:CancelButton")}
          onClick={onClose}
          isDisabled={externalLoading}
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default ExternalDbModal;
