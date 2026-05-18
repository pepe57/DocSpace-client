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

import { useEffect } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ModalDialog } from "@docspace/ui-kit/components/modal-dialog";
import { Text } from "@docspace/ui-kit/components/text";
import { Scrollbar } from "@docspace/ui-kit/components/scrollbar";
import { Loader } from "@docspace/ui-kit/components/loader";
import styled from "styled-components";
import { Link } from "@docspace/ui-kit/components/link";

const StyledBodyContent = styled.div`
  display: contents;
  user-select: text;
  table {
    border-spacing: 0;
    border-collapse: collapse;
    display: block;
    margin-top: 0;
    margin-bottom: 16px;
    width: max-content;
    max-width: 100%;
    overflow: auto;
  }

  --color-border-default: ${(props) => props.theme.dialogs.borderColor};
  --color-border-muted: hsla(210, 18%, 87%, 1);

  a {
    color: ${(props) => props.theme.dialogs.linkColor};
  }

  tr {
    border-top: 1px solid var(--color-border-muted);
  }

  td,
  th {
    padding: 6px 13px;
    border: 1px solid var(--color-border-default);
  }

  th {
    font-weight: 600;
  }

  table img {
    background-color: transparent;
  }
`;

const StyledFooterContent = styled.div`
  display: contents;
  user-select: text;
  .markdown-wrapper {
    box-sizing: border-box;
    overflow: auto;
    height: 362px;
    width: 100%;
  }
`;

const MarkdownLink = ({ href, children }) => (
	<Link fontWeight="600" target="_blank" tag="a" href={href} color="accent">
		{children}
	</Link>
);

const DebugInfoDialog = (props) => {
	const { visible, onClose, user, debugInfoData, getDebugInfo } = props;

	useEffect(() => {
		getDebugInfo();
	}, []);

	return (
		<ModalDialog
			withFooterBorder
			visible={visible}
			onClose={onClose}
			displayType="modal"
			autoMaxHeight
			autoMaxWidth
			isHuge
		>
			<ModalDialog.Header>Debug Info</ModalDialog.Header>
			<ModalDialog.Body className="debug-info-body">
				<StyledBodyContent>
					{/* <Text>{`# Build version: ${BUILD_VERSION}`}</Text> */}
					<Text>
						# Version: <span className="version">{VERSION}</span>
					</Text>
					<Text>{`# Build date: ${BUILD_AT}`}</Text>
					{user ? (
						<Text>{`# Current User: ${user?.displayName} (id:${user?.id})`}</Text>
					) : null}
					<Text>{`# User Agent: ${navigator.userAgent}`}</Text>
				</StyledBodyContent>
			</ModalDialog.Body>
			<ModalDialog.Footer className="debug-info-footer">
				<StyledFooterContent>
					<div className="markdown-wrapper">
						<Scrollbar>
							{!debugInfoData ? <Loader size="20px" type="track" /> : null}
							{debugInfoData ? (
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									components={{
										a: MarkdownLink,
									}}
								>
									{debugInfoData}
								</ReactMarkdown>
							) : null}
						</Scrollbar>
					</div>
				</StyledFooterContent>
			</ModalDialog.Footer>
		</ModalDialog>
	);
};

DebugInfoDialog.propTypes = {
	visible: PropTypes.bool,
	onClose: PropTypes.func,
};

export default inject(({ userStore, settingsStore }) => {
	const { user } = userStore;
	const { debugInfoData, getDebugInfo } = settingsStore;

	return {
		user,
		debugInfoData,
		getDebugInfo,
	};
})(observer(DebugInfoDialog));
