/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import EmptyScreenPersonSvgUrl from "PUBLIC_DIR/images/emptyFilter/empty.filter.people.light.svg?url";
import EmptyScreenPersonSvgDarkUrl from "PUBLIC_DIR/images/emptyFilter/empty.filter.people.dark.svg?url";
import ClearEmptyFilterSvgUrl from "PUBLIC_DIR/images/clear.empty.filter.svg?url";
import ChangeTypeReactSvgUrl from "PUBLIC_DIR/images/change.type.react.svg?url";

import { inject, observer } from "mobx-react";
import { tablet } from "@docspace/ui-kit/utils/device";
import styled, { useTheme } from "styled-components";

import { EmptyScreenContainer } from "@docspace/ui-kit/components/empty-screen-container";
import { IconButton } from "@docspace/ui-kit/components/icon-button";
import { Link, LinkType } from "@docspace/ui-kit/components/link";
import {
  TableGroupMenu,
  TGroupMenuItem,
} from "@docspace/ui-kit/components/table";
import { RowContainer, Row } from "@docspace/ui-kit/components/rows";
import { Text } from "@docspace/ui-kit/components/text";
import { globalColors } from "@docspace/ui-kit/providers/theme/themes";

import UsersRow from "./UsersRow";
import {
  InjectedTypeSelectRowViewProps,
  TypeSelectRowViewProps,
} from "../../../../types";

const StyledRowContainer = styled(RowContainer)`
  margin: 0 0 20px;

  .table-group-menu {
    height: 61px;
    position: sticky;
    z-index: 201;
    margin-inline-start: -16px;
    width: 100%;

    margin-top: -32.5px;
    top: 53px;
    margin-bottom: -29.5px;

    .table-container_group-menu {
      padding: 0px 16px;
      border-image-slice: 0;
      box-shadow: ${globalColors.menuShadow} 0px 15px 20px;
    }

    .table-container_group-menu-checkbox {
      margin-inline-start: 8px;
    }

    .table-container_group-menu-separator {
      margin: 0 16px;
    }
  }

  .header-container-text {
    font-size: 12px;
    color: ${(props) =>
      props.theme.client.settings.migration.tableRowTextColor};
  }

  .table-container_header {
    position: absolute;
  }

  .clear-icon {
    margin-inline-end: 8px;
  }

  .ec-desc {
    max-width: 348px;
  }

  .row-main-container-wrapper {
    @media ${tablet} {
      margin: 0;
    }
  }

  .buttons-box {
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
`;

const StyledRow = styled(Row)`
  box-sizing: border-box;
  min-height: 40px;

  .row-header-title {
    color: ${(props) => props.theme.client.settings.migration.tableHeaderText};
    font-weight: 600;
    font-size: 12px;
  }

  @media ${tablet} {
    .row_content {
      height: auto;
    }
  }
`;

const checkedAccountType = "result";

const RowView = (props: TypeSelectRowViewProps) => {
  const {
    t,
    sectionWidth,
    accountsData,
    typeOptions,

    filteredUsers,
    checkedUsers,
    toggleAccount,
    toggleAllAccounts,
    isAccountChecked,
    setSearchValue,
  } = props as InjectedTypeSelectRowViewProps;
  const theme = useTheme();

  const isIndeterminate =
    checkedUsers.result.length > 0 &&
    checkedUsers.result.length !== filteredUsers.length;

  const toggleAll = (isChecked: boolean) =>
    toggleAllAccounts(isChecked, filteredUsers, checkedAccountType);

  const onClearFilter = () => setSearchValue("");

  const headerMenu = [
    {
      id: "change-type",
      label: t("ChangeUserTypeDialog:ChangeUserTypeButton"),
      disabled: false,
      withDropDown: true,
      options: typeOptions,
      iconUrl: ChangeTypeReactSvgUrl,
      onClick: () => {},
      title: t("ChangeUserTypeDialog:ChangeUserTypeButton"),
    },
  ] as TGroupMenuItem[];

  return (
    <StyledRowContainer useReactWindow={false}>
      {checkedUsers.result.length > 0 ? (
        <div className="table-group-menu">
          <TableGroupMenu
            headerMenu={headerMenu}
            withoutInfoPanelToggler
            withComboBox={false}
            isIndeterminate={isIndeterminate}
            isChecked={checkedUsers.result.length === filteredUsers.length}
            onChange={toggleAll}
          />
        </div>
      ) : null}
      {accountsData.length > 0 ? (
        <>
          <StyledRow key="Name">
            <Text className="row-header-title">{t("Common:Name")}</Text>
          </StyledRow>

          {accountsData.map((data) => (
            <UsersRow
              key={data.key}
              data={data}
              sectionWidth={sectionWidth}
              typeOptions={typeOptions}
              isChecked={isAccountChecked(data.key, checkedAccountType)}
              toggleAccount={() => toggleAccount(data, checkedAccountType)}
            />
          ))}
        </>
      ) : (
        <EmptyScreenContainer
          imageSrc={
            theme.isBase ? EmptyScreenPersonSvgUrl : EmptyScreenPersonSvgDarkUrl
          }
          imageAlt={t("Common:NotFoundUsers")}
          headerText={t("Common:NotFoundUsers")}
          descriptionText={t("Common:NotFoundUsersDescription")}
          buttons={
            <div className="buttons-box">
              <IconButton
                className="clear-icon"
                isFill
                size={12}
                onClick={onClearFilter}
                iconName={ClearEmptyFilterSvgUrl}
              />
              <Link
                type={LinkType.action}
                isHovered
                fontWeight="600"
                onClick={onClearFilter}
              >
                {t("Common:ClearFilter")}
              </Link>
            </div>
          }
        />
      )}
    </StyledRowContainer>
  );
};

export default inject<TStore>(({ importAccountsStore }) => {
  const {
    checkedUsers,
    toggleAccount,
    toggleAllAccounts,
    isAccountChecked,
    setSearchValue,
    filteredUsers,
  } = importAccountsStore;

  return {
    checkedUsers,
    toggleAccount,
    toggleAllAccounts,
    isAccountChecked,
    setSearchValue,
    filteredUsers,
  };
})(observer(RowView));
