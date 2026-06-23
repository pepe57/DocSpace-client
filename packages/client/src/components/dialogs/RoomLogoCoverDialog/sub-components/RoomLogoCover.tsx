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
import React, { useRef } from "react";
import { inject, observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import styled, { css } from "styled-components";

import { mobile, tablet, isMobile } from "@docspace/shared/utils";
import { Scrollbar } from "@docspace/ui-kit/components/scrollbar";
import { TRoom } from "@docspace/shared/api/rooms/types";
import type { ICover } from "@docspace/ui-kit/types";
import { getRoomTitle } from "@docspace/ui-kit/components";
import { globalColors } from "@docspace/ui-kit/providers/theme/themes";

import { CustomLogo } from "./CustomLogo";
import { SelectColor } from "./SelectColor/SelectColor";
import { SelectIcon } from "./SelectIcon";

import { ILogo, RoomLogoCoverProps } from "../RoomLogoCoverDialog.types";

const RoomLogoCoverContainer = styled.div<{
	isScrollLocked: boolean;
}>`
  color: ${(props) => props.theme.logoCover.textColor};
  .room-logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
    padding-right: 16px;
  }

  .color-select-container {
    margin-bottom: 16px;
  }

  .color-name {
    font-weight: 600;
    font-size: 13px;
    line-height: 20px;
  }
  .colors-container {
    flex-wrap: nowrap;
  }

  .colors-container,
  .cover-icon-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    box-sizing: border-box;
    width: 390px;
  }

  @media ${tablet} {
    .select-container {
      text-align: center;
    }
    .select-color-container {
      margin-bottom: 16px;
    }

    .cover-icon-container {
      flex-wrap: wrap;
      gap: 16px;
      width: 432px;
    }
  }
  @media ${mobile} {
    .cover-icon-container {
      width: 100%;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .color-select-container {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .room-logo-container {
      padding-right: 0px;
    }

    .icon-select-container {
      text-align: center;
    }
    .colors-container {
      width: 100%;
    }
  }

  .cover-icon-container,
  .color-name {
    user-select: none;
  }

  ${(props) =>
		props.isScrollLocked &&
		css`
      .scroll-wrapper > .scroller {
        overflow: hidden !important;
      }
    `}
`;

const RoomLogoCover = ({
	isBaseTheme,
	logo,
	title,
	covers,
	cover,
	setRoomCoverDialogProps,
	roomCoverDialogProps,
	forwardedRef,
	scrollHeight,
	currentColorScheme,
	openColorPicker,
	setOpenColorPicker,
	generalScroll,
	isScrollLocked,
}: RoomLogoCoverProps) => {
	const { t } = useTranslation(["Common", "CreateEditRoomDialog"]);

	const roomTitle: string = React.useMemo(
		() => getRoomTitle(title ?? ""),
		[title],
	);

	const SelectedCover = React.useMemo(() => {
		return covers?.filter((item) => item.id === cover?.cover)[0];
	}, [cover?.cover, covers]);

	const roomColor = cover?.color
		? `#${cover?.color}`
		: logo?.color
			? `#${logo.color}`
			: globalColors.logoColors[0];

	const roomIcon = cover?.cover
		? SelectedCover
		: logo?.cover && roomCoverDialogProps.withSelection
			? logo.cover
			: roomTitle;

	React.useEffect(() => {
		setRoomCoverDialogProps({
			...roomCoverDialogProps,
			icon: roomIcon as unknown as ILogo,
			color: roomColor,
			withoutIcon: typeof roomIcon === "string",
			customColor: globalColors.logoColors.includes(roomColor)
				? roomCoverDialogProps.customColor
				: roomColor,
		});
	}, [roomIcon]);

	const coverId =
		(roomCoverDialogProps.icon as unknown as ICover)?.id ||
		(roomIcon as ICover)?.id;

	const scrollRef = useRef(null);

	const setWithoutIcon = (value: boolean) => {
		if (roomCoverDialogProps.icon === roomTitle) return;

		setRoomCoverDialogProps({
			...roomCoverDialogProps,
			withoutIcon: value,
		});
	};

	const selectContainerBody = (
		<>
			<div className="color-select-container">
				<SelectColor
					t={t}
					selectedColor={roomCoverDialogProps.color}
					logoColors={globalColors.logoColors}
					roomColor={roomCoverDialogProps.customColor}
					openColorPicker={openColorPicker}
					setOpenColorPicker={setOpenColorPicker}
					onChangeColor={(color) =>
						setRoomCoverDialogProps({
							...roomCoverDialogProps,
							color,
							customColor: globalColors.logoColors.includes(color)
								? roomCoverDialogProps.customColor
								: color,
						})
					}
				/>
			</div>
			<div className="icon-select-container">
				<SelectIcon
					t={t}
					withoutIcon={roomCoverDialogProps.withoutIcon}
					$currentColorScheme={currentColorScheme}
					coverId={coverId}
					setIcon={(icon) =>
						setRoomCoverDialogProps({
							...roomCoverDialogProps,
							icon,
							withoutIcon: false,
						})
					}
					setWithoutIcon={setWithoutIcon}
					covers={covers}
				/>
			</div>
		</>
	);

	return (
		<RoomLogoCoverContainer ref={forwardedRef} isScrollLocked={isScrollLocked}>
			<div className="room-logo-container">
				<CustomLogo
					isBaseTheme={!!isBaseTheme}
					icon={roomCoverDialogProps.icon}
					color={roomCoverDialogProps.color}
					withoutIcon={roomCoverDialogProps.withoutIcon}
					roomTitle={roomTitle}
				/>
			</div>
			<div className="select-container">
				{isMobile() || generalScroll ? (
					selectContainerBody
				) : (
					<Scrollbar ref={scrollRef} style={{ height: `${scrollHeight}` }}>
						{selectContainerBody}
					</Scrollbar>
				)}
			</div>
		</RoomLogoCoverContainer>
	);
};

export default inject<TStore>(({ settingsStore, dialogsStore }) => {
	const { theme, currentColorScheme } = settingsStore;

	const {
		coverSelection,
		setCover,
		cover,
		createRoomDialogProps,
		editRoomDialogProps,
		setRoomCoverDialogProps,
		roomCoverDialogProps,
	} = dialogsStore;

	const room: TRoom = coverSelection as unknown as TRoom;

	const logo = createRoomDialogProps.visible ? null : room?.logo;
	const title =
		createRoomDialogProps.visible || editRoomDialogProps.visible
			? roomCoverDialogProps.title
			: room?.title;

	return {
		isBaseTheme: theme?.isBase,
		logo: room?.isTemplate ? room?.logo : logo,
		title,
		cover: cover ?? {
			color: logo?.color,
			cover: logo?.cover?.id,
		},
		setCover,
		setRoomCoverDialogProps,
		roomCoverDialogProps,
		currentColorScheme,
	};
})(observer(RoomLogoCover));
