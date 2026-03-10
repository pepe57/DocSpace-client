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

import { Text } from "@docspace/ui-kit/components/text";
import { ToggleButton } from "@docspace/ui-kit/components/toggle-button";
import { Checkbox } from "@docspace/ui-kit/components/checkbox";
import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import AIAgentSelector from "@docspace/ui-kit/selectors/AIAgent";
import type { TSelectorItem } from "@docspace/ui-kit/components/selector";

import { useFormsDbSettingsStore } from "../../_store/FormsDbSettingsStore";

import styles from "./SettingsPanel.module.scss";

const AIAgentForm = () => {
  const { t } = useTranslation(["Common"]);
  const store = useFormsDbSettingsStore();

  const onAgentSubmit = React.useCallback(
    (items: TSelectorItem[]) => {
      const agent = items[0];
      if (agent?.id) {
        store.setAiAgent(agent.id as number, agent.label);
      }
    },
    [store],
  );

  const onSelectorClose = React.useCallback(() => {
    store.closeAgentSelector();
  }, [store]);

  if (store.isAgentSelectorVisible) {
    return (
      <AIAgentSelector onSubmit={onAgentSubmit} onClose={onSelectorClose} />
    );
  }

  return (
    <div className={styles.panelBody}>
      <div className={styles.toggleBlock}>
        <div className={styles.toggleHeader}>
          <Text fontSize="16px" fontWeight={700}>
            {t("Common:EnableAIAgent")}
          </Text>
          <ToggleButton
            className={styles.toggle}
            isChecked={store.aiAgentEnabled}
            onChange={() => store.setAiAgentEnabled(!store.aiAgentEnabled)}
          />
        </div>
        <Text fontSize="12px" fontWeight={400}>
          {t("Common:AIAgentDescription")}
        </Text>
      </div>

      {store.aiAgentEnabled && store.aiAgentId ? (
        <div className={styles.formBlock}>
          <div className={styles.fieldGroup}>
            <Text fontSize="13px" fontWeight={600}>
              {t("Common:AIAgent")}
            </Text>
            <div className={styles.agentRow}>
              <Text fontSize="13px" truncate>
                {store.aiAgentName || `Agent #${store.aiAgentId}`}
              </Text>
              <Button
                label={t("Common:ChangeButton")}
                size={ButtonSize.extraSmall}
                onClick={() => store.openAgentSelector()}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <Checkbox
              label={t("Common:AutoSyncKnowledge")}
              isChecked={store.aiAutoSyncKnowledge}
              onChange={() =>
                store.setAiAutoSyncKnowledge(!store.aiAutoSyncKnowledge)
              }
            />
            <Text
              fontSize="12px"
              fontWeight={400}
              style={{ paddingLeft: "24px" }}
            >
              {t("Common:AutoSyncKnowledgeDescription")}
            </Text>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default observer(AIAgentForm);
