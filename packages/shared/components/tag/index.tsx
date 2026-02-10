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

import React, { FC } from "react";
import { ReactSVG } from "react-svg";
import classNames from "classnames";

import CrossIconReactSvgUrl from "PUBLIC_DIR/images/icons/12/cross.react.svg?url";

import { IconButton } from "../icon-button";
import { Text } from "../text";
import { TooltipContainer } from "../tooltip";

import type { TagProps, TagType, TagClickEvent } from "./Tag.types";
import styles from "./Tag.module.scss";

const TagPure: FC<TagProps> = ({
  ref,
  tag,
  label,
  isNewTag = false,
  isDisabled,
  isDeleted,
  isLast,
  onDelete,
  onClick,
  tagMaxWidth,
  id,
  className,
  style,
  icon,
  roomType,
  providerType,
  dataTestId,
  iconClassName,
  onMouseEnter,
  onMouseLeave,
}) => {
  const anchorId = React.useId();

  const onClickAction = React.useCallback(() => {
    if (onClick && !isDisabled && !isDeleted) {
      onClick({ roomType, label, providerType, anchorId });
    }
  }, [
    onClick,
    isDisabled,
    isDeleted,
    roomType,
    providerType,
    label,
    anchorId,
  ]);

  const onDeleteAction = React.useCallback(() => {
    onDelete?.(tag);
  }, [onDelete, tag]);

  return (
    <TooltipContainer
      as="div"
      id={id}
      ref={ref}
      title={label}
      onClick={onClickAction}
      className={classNames(styles.tag, "tag", className, {
        [styles.isNewTag]: isNewTag,
        [styles.isDisabled]: isDisabled,
        [styles.isDeleted]: isDeleted,
        [styles.isClickable]: !!onClick,
        [styles.isLast]: isLast,
        [styles.thirdPartyTag]: icon,
      })}
      style={{ ...style, maxWidth: tagMaxWidth }}
      aria-label={label}
      aria-disabled={isDisabled}
      data-testid={dataTestId ?? "tag_item"}
      data-anchor-id={anchorId}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {icon ? (
        <ReactSVG
          className={classNames(styles.thirdPartyTag, iconClassName)}
          src={icon}
        />
      ) : null}
      <Text title={label} fontSize="13px" noSelect truncate>
        {label}
      </Text>
      {isNewTag && !!onDelete ? (
        <IconButton
          className={styles.tagIcon}
          iconName={CrossIconReactSvgUrl}
          size={12}
          onClick={onDeleteAction}
        />
      ) : null}
    </TooltipContainer>
  );
};

TagPure.displayName = "TagPure";

const Tag = React.memo(TagPure);

export { Tag, TagProps, TagType, type TagClickEvent };
