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

"use client";

import React, { useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useDocumentTitle } from "@docspace/shared/hooks/useDocumentTitle";
import DropzoneComponent from "@docspace/shared/components/dropzone";
import getFilesFromEvent from "@docspace/shared/utils/get-files-from-event";
import { toastr } from "@docspace/shared/components/toast";
import {
  finalizeUploadSession,
  getSettingsFiles,
  startUploadSession,
  uploadChunkParallel,
} from "@docspace/shared/api/files";
import { FileExtensions } from "@docspace/shared/enums";
import { TFilesSettings } from "@docspace/shared/api/files/types";

import { useSDKConfig } from "@/providers/SDKConfigProvider";

import type { TFileWithOptionalLastModifiedDate } from "./_types";
import {
  getErrorMessage,
  isEmptyDirectoryFile,
  attachParentFolderId,
  runWithConcurrency,
  createChunks,
} from "./_utils";

const TARGET_FOLDER_ID = 9;
const DEFAULT_CHUNK_UPLOAD_SIZE = 5 * 1024 * 1024;
const DEFAULT_MAX_UPLOAD_THREAD_COUNT = 3;
const DEFAULT_MAX_UPLOAD_FILES_COUNT = 2;

export type UploaderClientProps = {
  filesSettings: TFilesSettings;
};

export default function UploaderClient({ filesSettings }: UploaderClientProps) {
  useSDKConfig();
  useDocumentTitle("Uploader");
  //TODO: remove article namespace
  const { t } = useTranslation(["Article", "Common"]);

  const chunkUploadSize =
    filesSettings?.chunkUploadSize || DEFAULT_CHUNK_UPLOAD_SIZE;
  const maxUploadThreadCount =
    filesSettings?.maxUploadThreadCount || DEFAULT_MAX_UPLOAD_THREAD_COUNT;
  const maxUploadFilesCount =
    filesSettings?.maxUploadFilesCount || DEFAULT_MAX_UPLOAD_FILES_COUNT;

  const accept = useMemo(
    () =>
      [
        `.${FileExtensions.DOC}`,
        `.${FileExtensions.DOCX}`,
        `.${FileExtensions.DOCXF}`,
        `.${FileExtensions.XLSX}`,
        `.${FileExtensions.PPTX}`,
      ].join(","),
    [],
  );

  const [isDisabled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [percent, setPercent] = React.useState(0);
  const uploadedBytesRef = useRef(0);
  const totalBytesRef = useRef(0);

  const uploadFiles = useCallback(async (rawFiles: File[]) => {
    const prepared = await attachParentFolderId(rawFiles, TARGET_FOLDER_ID);

    const onlyFiles = prepared.filter((f) => !isEmptyDirectoryFile(f));

    totalBytesRef.current = onlyFiles.reduce((acc, f) => acc + f.size, 0);
    uploadedBytesRef.current = 0;
    setPercent(0);

    await runWithConcurrency(onlyFiles, maxUploadFilesCount, async (file) => {
      const folderId = file.parentFolderId ?? TARGET_FOLDER_ID;

      const session = await startUploadSession(
        folderId,
        file.name,
        file.size,
        "",
        false,
        (file as TFileWithOptionalLastModifiedDate).lastModifiedDate ??
          file.lastModified,
        true,
      );

      const chunks = createChunks(file, chunkUploadSize);

      await runWithConcurrency(chunks, maxUploadThreadCount, async (chunk) => {
        await uploadChunkParallel(
          folderId,
          session.id,
          chunk.index,
          chunk.data,
        );

        uploadedBytesRef.current += chunk.size;
        const total = totalBytesRef.current;
        if (total > 0) {
          const nextPercent = Math.min(
            100,
            (uploadedBytesRef.current / total) * 100,
          );
          setPercent(nextPercent);
        }
      });

      await finalizeUploadSession(folderId, session.id);
    });

    setPercent(100);
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      setIsLoading(true);

      try {
        await uploadFiles(acceptedFiles);
        toastr.success(
          t("Common:ItemsSuccessfullyUploaded", {
            count: acceptedFiles.length,
          }),
        );
      } catch (err) {
        const message = getErrorMessage(err) || t("Common:UnexpectedError");
        toastr.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [t, uploadFiles],
  );

  return (
    <div>
      <DropzoneComponent
        isDisabled={isDisabled}
        isLoading={isLoading}
        onDrop={onDrop}
        accept={accept}
        getFilesFromEvent={getFilesFromEvent}
        linkMainText={t("Article:Upload")}
        linkSecondaryText={t("Common:DropzoneTitleSecondary")}
        exstsText="(DOC, DOCX, DOCXF, XLSX, PPTX)"
        dataTestId="sdk-uploader"
      />
      {isLoading ? (
        <div style={{ marginTop: 12, fontSize: 13, textAlign: "center" }}>
          {`${Math.floor(percent)}%`}
        </div>
      ) : null}
    </div>
  );
}
