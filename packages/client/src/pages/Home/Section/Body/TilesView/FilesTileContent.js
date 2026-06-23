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

import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import styled, { css } from "styled-components";
import { getRoomTypeTitleTranslation } from "@docspace/shared/components/room-type/RoomType.utils";

import { Link } from "@docspace/ui-kit/components/link";
import { Text } from "@docspace/ui-kit/components/text";
import { createPluginFileHandlers } from "@docspace/shared/utils/plugin-file-utils";

import { DeviceType } from "@docspace/shared/enums";
import { tablet } from "@docspace/shared/utils";
import { TileContent } from "@docspace/ui-kit/components/tiles/tile-content";
import withContent from "../../../../../HOCs/withContent";
import withBadges from "../../../../../HOCs/withBadges";

const SimpleFilesTileContent = styled(TileContent)`
  .row-main-container {
    height: auto;
    max-width: 100%;
    display: flex;
    align-items: flex-end;
  }

  ${(props) =>
		props.isTemplate &&
		css`
      overflow: hidden;

      .row-main-container {
        flex-direction: column;
        align-items: start;
      }
    `}

  .main-icons {
    align-self: flex-end;
  }

  .badge {
    margin-inline-end: 8px;
    cursor: pointer;
    height: 16px;
    width: 16px;
  }

  .new-items {
    position: absolute;
    inset-inline-end: 29px;
    top: 19px;
  }

  .badges {
    display: flex;
    align-items: center;
  }

  .share-icon {
    margin-top: -4px;
    padding-inline-end: 8px;
  }

  .favorite,
  .can-convert,
  .edit {
    svg:not(:root) {
      width: 14px;
      height: 14px;
    }
  }

  .item-file-name {
    max-height: 100%;
    line-height: ${(props) => (props.isRooms ? "22px" : "20px")};

    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-align: start;

    font-size: ${(props) =>
			(props.isRooms && "16px") ||
			(
				!props.isRooms && props.currentDeviceType === DeviceType.desktop
					? "13px"
					: "14px"
			)};
  }

  .item-file-exst {
    color: ${(props) => props.theme.filesSection.tableView.fileExstColor};
  }

  ${({ isRooms, isTemplate }) =>
		isRooms ||
		(
			isTemplate &&
				css`
        .item-file-name {
          font-size: 16px;
        }
      `
		)}

  @media ${tablet} {
    display: inline-flex;
    height: auto;

    & > div {
      margin-top: 0;
    }
  }
`;

const FilesTileContent = ({
	t,
	item,
	titleWithoutExt,
	linkStyles,
	theme,
	isRooms,
	currentDeviceType,
	displayFileExtension,
}) => {
	const { fileExst, title, isTemplate } = item;

	const roomType = getRoomTypeTitleTranslation(t, item.roomType);

	let linkProps = { ...linkStyles };

	if (item?.isPlugin) {
		linkProps = createPluginFileHandlers(item, linkProps);
	}

	return (
		<SimpleFilesTileContent
			sideColor={theme.filesSection.tilesView.sideColor}
			isFile={fileExst}
			isRooms={isRooms}
			isTemplate={isTemplate}
			currentDeviceType={currentDeviceType}
		>
			<Link
				className="item-file-name"
				containerWidth="100%"
				type="page"
				title={title}
				fontWeight={isTemplate ? 700 : 600}
				target="_blank"
				{...linkProps}
				color={theme.filesSection.tilesView.color}
				isTextOverflow
				dir="auto"
				view="tile"
			>
				{titleWithoutExt}
				{displayFileExtension ? (
					<span className="item-file-exst">{fileExst}</span>
				) : null}
			</Link>
			{isTemplate ? (
				<Text
					className="item-file-sub-name"
					color={theme.filesSection.tilesView.subTextColor}
					fontSize="13px"
					fontWeight={400}
					truncate
				>
					{roomType}
				</Text>
			) : null}
		</SimpleFilesTileContent>
	);
};

export default inject(({ settingsStore, treeFoldersStore }) => {
	const { isRoomsFolder, isArchiveFolder, isTemplatesFolder } =
		treeFoldersStore;

	const isRooms = isRoomsFolder || isArchiveFolder;

	return {
		theme: settingsStore.theme,
		currentDeviceType: settingsStore.currentDeviceType,
		isRooms,
		isTemplate: isTemplatesFolder,
	};
})(
	observer(
		withTranslation(["Files", "Translations", "Notifications"])(
			withContent(withBadges(FilesTileContent)),
		),
	),
);
