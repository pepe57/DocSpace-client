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
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { ComboBox, type TOption } from "@docspace/ui-kit/components/combobox";
import { TextInput } from "@docspace/ui-kit/components/text-input";
import { PasswordInput } from "@docspace/ui-kit/components/password-input";
import { InputSize, InputType } from "@docspace/ui-kit/components/text-input";
import { Checkbox } from "@docspace/ui-kit/components/checkbox";
import { ToggleButton } from "@docspace/ui-kit/components/toggle-button";
import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import { Text } from "@docspace/ui-kit/components/text";
import { toastr } from "@docspace/ui-kit/components/toast";

import {
  useFormsDbSettingsStore,
  type DatabaseType,
} from "../../_store/FormsDbSettingsStore";
import { testDbConnection } from "../../_api/dbSettings";

import styles from "./SettingsPanel.module.scss";

const DB_TYPE_OPTIONS: TOption[] = [
  { key: "MySQL", label: "MySQL" },
  { key: "PostgreSQL", label: "PostgreSQL" },
];

const ConnectDatabaseForm = () => {
  const { t } = useTranslation(["Common"]);
  const store = useFormsDbSettingsStore();

  const selectedDbType = React.useMemo(
    () =>
      DB_TYPE_OPTIONS.find((o) => o.key === store.databaseType) ??
      DB_TYPE_OPTIONS[0],
    [store.databaseType],
  );

  const onDbTypeChange = React.useCallback(
    (option: TOption) => {
      store.setDatabaseType(option.key as DatabaseType);
    },
    [store],
  );

  const onTestConnection = React.useCallback(async () => {
    store.setIsTesting(true);
    try {
      const result = await testDbConnection(store.formData);
      if (result) {
        toastr.success(t("Common:ConnectionSuccessful"));
      } else {
        toastr.error(t("Common:ConnectionFailed"));
      }
    } catch {
      toastr.error(t("Common:ConnectionFailed"));
    } finally {
      store.setIsTesting(false);
    }
  }, [store, t]);

  return (
    <div className={styles.panelBody}>
      <div className={styles.toggleBlock}>
        <div className={styles.toggleHeader}>
          <Text fontSize="16px" fontWeight={700}>
            {t("Common:SaveFormDataToDatabase")}
          </Text>
          <ToggleButton
            className={styles.toggle}
            isChecked={store.sendToDb}
            onChange={() => store.setSendToDb(!store.sendToDb)}
          />
        </div>
        <Text fontSize="12px" fontWeight={400}>
          {t("Common:ConnectDatabaseDescription")}
        </Text>
      </div>

      <div className={styles.formBlock}>
        <div className={styles.fieldGroup}>
          <Text fontSize="13px" fontWeight={600}>
            {t("Common:DatabaseType")}
          </Text>
          <ComboBox
            scaled
            scaledOptions
            options={DB_TYPE_OPTIONS}
            selectedOption={selectedDbType}
            onSelect={onDbTypeChange}
            dropDownMaxHeight={200}
          />
        </div>

        <div className={styles.fieldGroup}>
          <Text fontSize="13px" fontWeight={600}>
            {t("Common:Host")}
          </Text>
          <TextInput
            scale
            type={InputType.text}
            value={store.host}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              store.setHost(e.target.value)
            }
            size={InputSize.base}
            placeholder="localhost"
          />
        </div>

        <div className={styles.fieldGroup}>
          <Text fontSize="13px" fontWeight={600}>
            {t("Common:Port")}
          </Text>
          <TextInput
            scale
            type={InputType.text}
            value={store.port}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              store.setPort(e.target.value)
            }
            size={InputSize.base}
          />
        </div>

        <div className={styles.fieldGroup}>
          <Text fontSize="13px" fontWeight={600}>
            {t("Common:DatabaseName")}
          </Text>
          <TextInput
            scale
            type={InputType.text}
            value={store.databaseName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              store.setDatabaseName(e.target.value)
            }
            size={InputSize.base}
          />
        </div>

        <div className={styles.fieldGroup}>
          <Text fontSize="13px" fontWeight={600}>
            {t("Common:User")}
          </Text>
          <TextInput
            scale
            type={InputType.text}
            value={store.user}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              store.setUser(e.target.value)
            }
            size={InputSize.base}
          />
        </div>

        <div className={styles.fieldGroup}>
          <Text fontSize="13px" fontWeight={600}>
            {t("Common:Password")}
          </Text>
          <PasswordInput
            simpleView
            passwordSettings={{ minLength: 0 }}
            inputValue={store.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              store.setPassword(e.target.value)
            }
            size={InputSize.base}
          />
        </div>

        <Checkbox
          label={t("Common:UseSSL")}
          isChecked={store.useSsl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            store.setUseSsl(e.target.checked)
          }
        />

        <div className={styles.testButtonWrapper}>
          <Button
            label={t("Common:TestConnection")}
            size={ButtonSize.normal}
            onClick={onTestConnection}
            isLoading={store.isTesting}
            scale
          />
        </div>
      </div>
    </div>
  );
};

export default observer(ConnectDatabaseForm);
