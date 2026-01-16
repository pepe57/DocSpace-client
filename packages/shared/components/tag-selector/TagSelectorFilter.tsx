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

import classNames from "classnames";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import PlusIcon from "PUBLIC_DIR/images/icons/12/plus.svg?url";

import { Tag } from "../tag";
import { Text } from "../text";
import { InputType, TextInput } from "../text-input";

import { useTagSelector } from "./TagSelectorProvider";
import styles from "./TagSelector.module.scss";

export const TagSelectorFilter: React.FC = () => {
  const { t } = useTranslation("Common");
  const {
    searchValue,
    deferredSearchValue,
    showCreateTag,
    setSearchValue,
    handleCreateTag,
  } = useTagSelector();

  const onChangeSearchValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    [setSearchValue],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case "Enter":
          handleCreateTag();
          break;
        case "Escape":
          setSearchValue("");
          break;
        default:
          break;
      }
    },
    [handleCreateTag, setSearchValue],
  );

  return (
    <>
      <TextInput
        scale
        autoFocus
        withBorder={false}
        value={searchValue}
        type={InputType.text}
        className={styles.input}
        onChange={onChangeSearchValue}
        placeholder={t("Common:AddTag")}
        onKeyDown={handleKeyDown}
      />
      <hr className={styles.divider} />
      {showCreateTag ? (
        <Text
          as="div"
          className={classNames(styles.text, styles.wrapperCreateTag)}
          noSelect
          fontSize="12px"
          fontWeight={600}
          lineHeight="16px"
        >
          <span>{t("Common:CreateTag")}</span>
          <Tag
            withIcon
            icon={PlusIcon}
            className={styles.createTag}
            iconClassName={styles.createTagIcon}
            tag={deferredSearchValue}
            label={deferredSearchValue}
            onClick={handleCreateTag}
          />
        </Text>
      ) : null}
      <Text className={styles.text} fontSize="12px" lineHeight="16px" noSelect>
        {showCreateTag
          ? t("Common:OrSelectFromAvailableMatches")
          : t("Common:SelectAnOptionOrCreateOne")}
      </Text>
    </>
  );
};
