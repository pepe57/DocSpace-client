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

import { FC, useCallback, useRef, useState } from "react";
import classNames from "classnames";

import { useUnmount } from "../../hooks/useUnmount";

import { DropDown } from "../drop-down";
import { DropDownItem } from "../drop-down-item";
import { Text } from "../text";
import { Tag } from "../tag";

import styles from "./Tags.module.scss";
import type { DropDownTagsProps } from "./Tags.types";

export const TagsDropdown: FC<DropDownTagsProps> = ({
  removeTagIcon = false,
  onClick,
  advancedOptions,
  ...tagProps
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const tagRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  const onClickOutside = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    if (
      (!!target &&
        typeof target.className !== "object" &&
        target.className?.includes("advanced-tag")) ||
      !isMountedRef.current
    )
      return;

    setOpenDropdown(false);
  }, []);

  const openDropdownAction = () => {
    setOpenDropdown(true);
  };

  const onClickAction = useCallback(
    (e: React.MouseEvent | React.ChangeEvent) => {
      const { roomType, providerType, isDisabled, isDeleted } = tagProps;

      if (onClick && !isDisabled && !isDeleted) {
        const target = e.target as HTMLDivElement;
        const label = target.dataset.tag;

        if (!label) return;

        onClick({ roomType, label, providerType });
        setOpenDropdown(false);
      }
    },
    [onClick, tagProps],
  );

  useUnmount(() => {
    isMountedRef.current = false;
  });

  return (
    <>
      <Tag ref={tagRef} onClick={openDropdownAction} {...tagProps} />
      <DropDown
        open={openDropdown}
        forwardedRef={tagRef}
        clickOutsideAction={onClickOutside}
        isDefaultMode
        directionY="both"
      >
        {advancedOptions.map((tag) => (
          <DropDownItem
            className="tag__dropdown-item tag"
            key={tag}
            onClick={onClickAction}
            data-tag={tag}
            testId={"tag_dropdown_item"}
          >
            <Text
              className={classNames(styles.dropdownText, {
                [styles.removeTagIcon]: removeTagIcon,
              })}
              fontWeight={600}
              fontSize="12px"
              truncate
            >
              {tag}
            </Text>
          </DropDownItem>
        ))}
      </DropDown>
    </>
  );
};
