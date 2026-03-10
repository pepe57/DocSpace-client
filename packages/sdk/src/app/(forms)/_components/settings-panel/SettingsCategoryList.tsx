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

import { IconButton } from "@docspace/ui-kit/components/icon-button";

import { useFormsDbSettingsStore } from "../../_store/FormsDbSettingsStore";

import PortfolioIconUrl from "PUBLIC_DIR/images/icons/16/catalog.portfolio.react.svg?url";
import AiAgentsReactSvgUrl from "PUBLIC_DIR/images/icons/16/catalog.ai-agents.react.svg?url";
import ArrowRightIconUrl from "PUBLIC_DIR/images/arrow.right.react.svg?url";

import styles from "./SettingsPanel.module.scss";

const handleKeyDown =
  (callback: () => void) =>
  (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

const SettingsCategoryList = () => {
  const { t } = useTranslation(["Common"]);
  const { setCurrentLevel } = useFormsDbSettingsStore();

  return (
    <div className={styles.panelBody}>
      <div className={styles.categoryList}>
        <div
          className={styles.categoryItem}
          role="button"
          tabIndex={0}
          onClick={() => setCurrentLevel("ConnectDatabase")}
          onKeyDown={handleKeyDown(() =>
            setCurrentLevel("ConnectDatabase"),
          )}
        >
          <IconButton
            iconName={PortfolioIconUrl}
            size={20}
            isClickable={false}
          />
          <span className={styles.categoryLabel}>
            {t("Common:ConnectDatabase")}
          </span>
          <IconButton
            iconName={ArrowRightIconUrl}
            size={12}
            isClickable={false}
          />
        </div>
        <div
          className={styles.categoryItem}
          role="button"
          tabIndex={0}
          onClick={() => setCurrentLevel("AIAgent")}
          onKeyDown={handleKeyDown(() =>
            setCurrentLevel("AIAgent"),
          )}
        >
          <IconButton
            iconName={AiAgentsReactSvgUrl}
            size={20}
            isClickable={false}
          />
          <span className={styles.categoryLabel}>
            {t("Common:AIAgent")}
          </span>
          <IconButton
            iconName={ArrowRightIconUrl}
            size={12}
            isClickable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(SettingsCategoryList);
