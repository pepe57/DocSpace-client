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

import React, { memo, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { Checkbox } from "@docspace/ui-kit/components/checkbox";
import { IconButton } from "@docspace/ui-kit/components/icon-button";
import { Text } from "@docspace/ui-kit/components/text";
import { HelpButton } from "@docspace/ui-kit/components/help-button";
import { Scrollbar } from "@docspace/ui-kit/components/scrollbar";
import { Backdrop } from "@docspace/ui-kit/components/backdrop";
import { isMobile } from "@docspace/shared/utils";
import AccessEditReactSvgUrl from "PUBLIC_DIR/images/access.edit.react.svg?url";

import type { TProviderModelInfo } from "@docspace/shared/api/ai/types";

import styles from "./ModelSelectorPopup.module.scss";

const ROW_HEIGHT = 30;
const ROW_GAP = 2;
const SECTION_HEADER_HEIGHT = 36;
const FOOTER_PADDING = 80;

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

type ModelRowProps = {
  model: TProviderModelInfo;
  isSelected: boolean;
  showPencil: boolean;
  onToggle: (modelId: string) => void;
  onEdit: (modelId: string) => void;
};

const ModelRow = memo(
  ({ model, isSelected, showPencil, onToggle, onEdit }: ModelRowProps) => {
    return (
      <div
        className={styles.modelRow}
        onClick={() => onToggle(model.modelId)}
        data-testid={`model-row-${model.modelId}`}
      >
        <span onClick={(e) => e.stopPropagation()}>
          <Checkbox
            isChecked={isSelected}
            onChange={() => onToggle(model.modelId)}
          />
        </span>
        <span className={styles.modelLabel}>{model.displayName}</span>
        {showPencil ? (
          <IconButton
            className={styles.pencilIcon}
            iconName={AccessEditReactSvgUrl}
            size={16}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(model.modelId);
            }}
            dataTestId={`edit-model-${model.modelId}`}
          />
        ) : null}
      </div>
    );
  },
);

ModelRow.displayName = "ModelRow";

const calcContentHeight = (
  recommended: TProviderModelInfo[],
  other: TProviderModelInfo[],
  isCustomProvider: boolean,
): number => {
  if (isCustomProvider) {
    const totalModels = recommended.length + other.length;
    const gaps = totalModels > 1 ? (totalModels - 1) * ROW_GAP : 0;
    return totalModels * ROW_HEIGHT + gaps;
  }

  let height = 0;

  if (recommended.length > 0) {
    const gaps =
      recommended.length > 1 ? (recommended.length - 1) * ROW_GAP : 0;
    height += SECTION_HEADER_HEIGHT + recommended.length * ROW_HEIGHT + gaps;
  }

  if (other.length > 0) {
    const gaps = other.length > 1 ? (other.length - 1) * ROW_GAP : 0;
    height += SECTION_HEADER_HEIGHT + other.length * ROW_HEIGHT + gaps;
  }

  return height;
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
  const isMobileView = isMobile();

  useLayoutEffect(() => {
    if (isMobileView) return;
    if (!anchor.current || !ref.current) return;

    // Anchor to the + button row, not the whole container
    const addButton = anchor.current.querySelector(
      '[data-testid="add-model-button"]',
    );
    const anchorEl = addButton ?? anchor.current;
    const rect = anchorEl.getBoundingClientRect();
    const popupEl = ref.current;

    const top = rect.bottom + 8;
    let left = anchor.current.getBoundingClientRect().left;

    if (left + 285 > window.innerWidth) {
      left = window.innerWidth - 285 - 8;
    }

    const maxHeight = window.innerHeight - top - FOOTER_PADDING;

    popupEl.style.top = `${top}px`;
    popupEl.style.left = `${left}px`;
    popupEl.style.maxHeight = `${Math.max(maxHeight, 100)}px`;
  }, [anchor, recommended.length, other.length, isMobileView]);

  useEffect(() => {
    if (isMobileView) return;

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
  }, [onClose, anchor, isMobileView]);

  const allModels = isCustomProvider ? [...recommended, ...other] : null;

  const scrollHeight = useMemo(
    () => calcContentHeight(recommended, other, isCustomProvider),
    [recommended, other, isCustomProvider],
  );

  const modelList = isCustomProvider ? (
    <>
      <div className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>
          {t("AISettings:SelectModels")}
        </Text>
      </div>
      <div
        className={styles.scrollWrapper}
        style={{ height: scrollHeight }}
      >
        <Scrollbar className={styles.scrollbar}>
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
        </Scrollbar>
      </div>
    </>
  ) : (
    <div
      className={styles.scrollWrapper}
      style={{ height: scrollHeight }}
    >
      <Scrollbar fixedSize className={styles.scrollbar}>
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
                place="bottom"
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
            <div
              className={classNames(
                styles.sectionHeader,
                styles.sectionHeaderOther,
              )}
            >
              <Text className={styles.sectionTitle}>
                {t("AISettings:OtherModels")}
              </Text>
              <HelpButton
                tooltipContent={t("AISettings:OtherModelsTooltip")}
                place="bottom"
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
      </Scrollbar>
    </div>
  );

  return createPortal(
    <>
      {isMobileView ? (
        <Backdrop
          visible
          withBackground
          shouldShowBackdrop
          onClick={onClose}
          zIndex={449}
        />
      ) : null}
      <div
        ref={ref}
        className={classNames(styles.popup, {
          [styles.mobileView]: isMobileView,
        })}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        data-testid="model-selector-popup"
      >
        {modelList}
      </div>
    </>,
    document.body,
  );
};
