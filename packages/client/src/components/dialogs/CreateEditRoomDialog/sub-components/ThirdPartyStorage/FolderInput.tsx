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

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TFunction } from "i18next";

import FolderReactSvgUrl from "PUBLIC_DIR/images/folder.react.svg?url";

import { IconButton } from "@docspace/ui-kit/components/icon-button";
import { TooltipContainer } from "@docspace/ui-kit/components/tooltip";
import { TFolder } from "@docspace/shared/api/files/types";
import { injectDefaultTheme } from "@docspace/shared/utils";

import FilesSelector from "SRC_DIR/components/FilesSelector";

const StyledFolderInput = styled.div.attrs(injectDefaultTheme)`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 0px;
  width: 100%;
  height: 32px;

  border-radius: 3px;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;

  .folder-path-wrapper {
    display: contents;
  }

  &,
  .icon-wrapper {
    border: 1px solid
      ${(props) =>
				props.theme.createEditRoomDialog.thirdpartyStorage.folderInput
					.borderColor};
  }

  &:hover,
  &:hover > .icon-wrapper {
    border: 1px solid
      ${(props) =>
				props.theme.createEditRoomDialog.thirdpartyStorage.folderInput
					.hoverBorderColor};
  }

  .root_label,
  .path,
  .room_title {
    padding: 5px 0px;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
  }

  .root_label {
    padding-inline-start: 8px;
    /* background-color: ${(props) =>
			props.theme.createEditRoomDialog.thirdpartyStorage.folderInput
				.background}; */
    color: ${(props) =>
			props.theme.createEditRoomDialog.thirdpartyStorage.folderInput
				.rootLabelColor};
  }

  .path {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .room_title {
    padding-inline-end: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon-wrapper {
    margin-inline-start: auto;
    background-color: ${(props) =>
			props.theme.createEditRoomDialog.thirdpartyStorage.folderInput
				.background};
    height: 100%;
    box-sizing: border-box;
    width: 31px;
    min-width: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    border-top: none !important;
    border-bottom: none !important;
    border-inline-end: none !important;

    &:hover {
      path {
        fill: ${(props) =>
					props.theme.createEditRoomDialog.thirdpartyStorage.folderInput
						.iconFill};
      }
    }
  }
`;

type FolderInputProps = {
	t: TFunction;
	roomTitle: string;
	thirdpartyAccount: Record<string, unknown>;
	onChangeStorageFolderId: (storageFolderId: string) => void;
	isDisabled: boolean;
	createNewFolderIsChecked: boolean;
};

const FolderInput = ({
	t,
	roomTitle,
	thirdpartyAccount,
	onChangeStorageFolderId,
	isDisabled,
	createNewFolderIsChecked,
}: FolderInputProps) => {
	const [treeNode, setTreeNode] = useState<TFolder | null>(null);
	const [path, setPath] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const onOpen = () => {
		if (isDisabled) return;
		setIsDialogOpen(true);
	};
	const onClose = () => {
		setIsDialogOpen(false);
	};

	const getPathValue = () => {
		if (!treeNode) return;

		let currentPath = treeNode.path;
		currentPath = currentPath?.slice(1);

		let result = "";
		currentPath?.map(
			(node, i) =>
				(result += node.title + (i !== currentPath.length - 1 ? "/" : "")),
		);

		setPath(result);
	};

	useEffect(() => {
		if (!treeNode) return;
		onChangeStorageFolderId(treeNode?.id?.toString() || "");
		getPathValue();
	}, [treeNode]);

	if (!thirdpartyAccount.id) return null;

	let title = createNewFolderIsChecked || path ? "/" : t("RootFolderLabel");
	title += path;
	if (createNewFolderIsChecked) {
		title += path ? "/" : "";
		title += roomTitle || t("Common:NewRoom");
	}

	return (
		<>
			<StyledFolderInput onClick={onOpen}>
				<TooltipContainer
					as="div"
					className="folder-path-wrapper"
					title={title}
				>
					<span className="root_label">
						{createNewFolderIsChecked || path ? "/" : t("RootFolderLabel")}
					</span>
					<span className="path">{path}</span>
					{createNewFolderIsChecked ? (
						<span className="room_title">
							{(path ? "/" : "") + (roomTitle || t("Common:NewRoom"))}
						</span>
					) : null}
				</TooltipContainer>
				<TooltipContainer
					as="div"
					title={t("Common:SelectFolder")}
					className="icon-wrapper"
				>
					<IconButton size={16} iconName={FolderReactSvgUrl} isClickable />
				</TooltipContainer>
			</StyledFolderInput>

			{isDialogOpen ? (
				// @ts-expect-error need pass all props
				<FilesSelector
					isPanelVisible={isDialogOpen}
					onClose={onClose}
					isThirdParty
					isSelectFolder
					onSelectTreeNode={setTreeNode}
					currentFolderId={
						treeNode
							? treeNode.id
							: ((thirdpartyAccount as Record<string, unknown>).id as string)
					}
				/>
			) : null}
		</>
	);
};

export default FolderInput;
