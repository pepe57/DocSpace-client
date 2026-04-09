/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import React, { useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { Checkbox } from "@docspace/ui-kit/components/checkbox";
import { IconButton } from "@docspace/ui-kit/components/icon-button";
import { Text } from "@docspace/ui-kit/components/text";
import { HelpButton } from "@docspace/ui-kit/components/help-button";
import PenEditIcon from "@docspace/ui-kit/assets/icons/12/pen-edit.react.svg";

import type { TProviderModelInfo } from "@docspace/shared/api/ai/types";

import styles from "./ModelSelectorPopup.module.scss";

type ModelSelectorPopupProps = {
  anchor: React.RefObject<HTMLDivElement | null>;
  recommended: TProviderModelInfo[];
  other: TProviderModelInfo[];
  selectedModelIds: Set<string>;
  isCustomProvider: boolean;
  onToggle: (modelId: string) => void;
  onEditModel: (modelId: string) => void;
  onClose: () => void;
};

const ModelRow = ({
  model,
  isSelected,
  showPencil,
  onToggle,
  onEdit,
}: {
  model: TProviderModelInfo;
  isSelected: boolean;
  showPencil: boolean;
  onToggle: (modelId: string) => void;
  onEdit: (modelId: string) => void;
}) => {
  return (
    <div
      className={styles.modelRow}
      onClick={() => onToggle(model.modelId)}
      data-testid={`model-row-${model.modelId}`}
    >
      <Checkbox
        isChecked={isSelected}
        onChange={() => onToggle(model.modelId)}
      />
      <span className={styles.modelLabel}>{model.displayName}</span>
      {showPencil ? (
        <IconButton
          className={styles.pencilIcon}
          iconNode={<PenEditIcon />}
          size={12}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(model.modelId);
          }}
          dataTestId={`edit-model-${model.modelId}`}
        />
      ) : null}
    </div>
  );
};

export const ModelSelectorPopup = ({
  anchor,
  recommended,
  other,
  selectedModelIds,
  isCustomProvider,
  onToggle,
  onEditModel,
  onClose,
}: ModelSelectorPopupProps) => {
  const { t } = useTranslation(["AISettings", "Common"]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        anchor.current &&
        !anchor.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchor]);

  const allModels = isCustomProvider ? [...recommended, ...other] : null;

  return (
    <div
      ref={ref}
      className={styles.popup}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      data-testid="model-selector-popup"
    >
      {isCustomProvider ? (
        <>
          {allModels?.map((model) => (
            <ModelRow
              key={model.modelId}
              model={model}
              isSelected={selectedModelIds.has(model.modelId)}
              showPencil
              onToggle={onToggle}
              onEdit={onEditModel}
            />
          ))}
        </>
      ) : (
        <>
          {recommended.length > 0 ? (
            <>
              <div className={styles.sectionHeader}>
                <Text className={styles.sectionTitle}>
                  {t("AISettings:RecommendedModels")}
                </Text>
                <HelpButton
                  tooltipContent={t("AISettings:RecommendedModelsTooltip", {
                    productName: t("Common:ProductName"),
                  })}
                  size={12}
                />
              </div>
              {recommended.map((model) => (
                <ModelRow
                  key={model.modelId}
                  model={model}
                  isSelected={selectedModelIds.has(model.modelId)}
                  showPencil={false}
                  onToggle={onToggle}
                  onEdit={onEditModel}
                />
              ))}
            </>
          ) : null}
          {other.length > 0 ? (
            <>
              <div className={styles.sectionHeader}>
                <Text className={styles.sectionTitle}>
                  {t("AISettings:OtherModels")}
                </Text>
                <HelpButton
                  tooltipContent={t("AISettings:OtherModelsTooltip")}
                  size={12}
                />
              </div>
              {other.map((model) => (
                <ModelRow
                  key={model.modelId}
                  model={model}
                  isSelected={selectedModelIds.has(model.modelId)}
                  showPencil
                  onToggle={onToggle}
                  onEdit={onEditModel}
                />
              ))}
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

