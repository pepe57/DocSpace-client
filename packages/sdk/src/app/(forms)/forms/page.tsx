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

import { headers, cookies } from "next/headers";

import FilesFilter from "@docspace/shared/api/files/filter";
import { FilterType } from "@docspace/shared/enums";
import type {
	TFilesSettings,
	TGetFolder,
} from "@docspace/shared/api/files/types";

import { getFilesSettings } from "@/api/files";
import { getFormsFolder } from "@/api/forms";
import {
	MY_FORMS_FOLDER_HEADER,
	FORMS_TO_FILL_FOLDER_HEADER,
	COMPLETED_FORMS_FOLDER_HEADER,
	REQUEST_TOKEN_HEADER,
	ROOM_ID_HEADER,
	PAGE_COUNT,
} from "@/utils/constants";

import FormsPage from "./page.client";

export default async function Forms({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string }>;
}) {
	const hdrs = await headers();
	const params = await searchParams;

	const roomId = hdrs.get(ROOM_ID_HEADER) || params.roomId || "";
	const myFormsFolderId =
		hdrs.get(MY_FORMS_FOLDER_HEADER) || params.myFormsFolderId || "";
	const formsToFillFolderId =
		hdrs.get(FORMS_TO_FILL_FOLDER_HEADER) || params.formsToFillFolderId || "";
	const completedFormsFolderId =
		hdrs.get(COMPLETED_FORMS_FOLDER_HEADER) ||
		params.completedFormsFolderId ||
		"";
	const requestToken =
		hdrs.get(REQUEST_TOKEN_HEADER) || params.requestToken || "";

	// Read httpOnly cookie server-side for AI API auth
	const cookieStore = await cookies();
	const authToken = cookieStore.get("asc_auth_key")?.value || "";

	const filter = FilesFilter.getDefault();
	filter.pageCount = PAGE_COUNT;
	filter.filterType = FilterType.PDFForm;

	let filesSettings: TFilesSettings | undefined;
	let initialFolderData: TGetFolder | undefined;

	if (myFormsFolderId) {
		[filesSettings, initialFolderData] = await Promise.all([
			getFilesSettings(),
			getFormsFolder(myFormsFolderId, filter, requestToken),
		]);
	} else {
		filesSettings = await getFilesSettings();
	}

	return (
		<FormsPage
			roomId={roomId}
			myFormsFolderId={myFormsFolderId}
			formsToFillFolderId={formsToFillFolderId}
			completedFormsFolderId={completedFormsFolderId}
			requestToken={requestToken}
			authToken={authToken}
			filesSettings={filesSettings!}
			initialFolderData={initialFolderData}
		/>
	);
}
