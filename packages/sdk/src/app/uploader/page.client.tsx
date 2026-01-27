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

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDocumentTitle } from "@docspace/shared/hooks/useDocumentTitle";
import { useItemIcon } from "@docspace/shared/hooks/useItemIcon";
import DropzoneComponent from "@docspace/shared/components/dropzone";
import UploadSvgUrl from "PUBLIC_DIR/images/upload.svg?url";
import { Button, ButtonSize } from "@docspace/shared/components/button";
import getFilesFromEvent from "@docspace/shared/utils/get-files-from-event";
import { toastr } from "@docspace/shared/components/toast";
import {
  finalizeUploadSession,
  startUploadSession,
  uploadChunkParallel,
} from "@docspace/shared/api/files";
import { TFilesSettings } from "@docspace/shared/api/files/types";

import { useSDKConfig } from "@/providers/SDKConfigProvider";

import type { TFileWithOptionalLastModifiedDate } from "./_types";
import {
  getErrorMessage,
  isEmptyDirectoryFile,
  attachParentFolderId,
  runWithConcurrency,
  createChunks,
  getAcceptExtensions,
  parseAcceptCategories,
} from "./_utils";
import FilesList, { type TFile } from "./_components/FilesList";
import styles from "./Uploader.module.scss";

const DEFAULT_CHUNK_UPLOAD_SIZE = 5 * 1024 * 1024;
const DEFAULT_MAX_UPLOAD_THREAD_COUNT = 3;
const DEFAULT_MAX_UPLOAD_FILES_COUNT = 2;

export type UploaderClientProps = {
  filesSettings?: TFilesSettings;
  baseConfig?: {
    targetId?: string;
    acceptCategories?: string;
  };
};

export default function UploaderClient({
  filesSettings,
  baseConfig,
}: UploaderClientProps) {
  useSDKConfig();
  useDocumentTitle("Uploader");
  //TODO: remove article namespace
  const { t } = useTranslation(["Article", "Common"]);
  const { getIcon } = useItemIcon({ filesSettings });

  const folderTargetId = +(baseConfig?.targetId ?? 0);

  const chunkUploadSize =
    filesSettings?.chunkUploadSize || DEFAULT_CHUNK_UPLOAD_SIZE;
  const maxUploadThreadCount =
    filesSettings?.maxUploadThreadCount || DEFAULT_MAX_UPLOAD_THREAD_COUNT;
  const maxUploadFilesCount =
    filesSettings?.maxUploadFilesCount || DEFAULT_MAX_UPLOAD_FILES_COUNT;

  const accept = useMemo(() => {
    const categories = parseAcceptCategories(baseConfig?.acceptCategories);

    if (categories.length === 0) {
      return filesSettings?.extsUploadable?.join(",") ?? "";
    }

    return getAcceptExtensions(filesSettings, categories);
  }, [filesSettings, baseConfig?.acceptCategories]);

  const [isDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [pendingFiles, setPendingFiles] = useState<TFile[]>([]);

  const uploadedBytesRef = useRef(0);
  const totalBytesRef = useRef(0);

  const uploadFiles = useCallback(async (rawFiles: File[]) => {
    const prepared = await attachParentFolderId(rawFiles, folderTargetId);

    const onlyFiles = prepared.filter((f) => !isEmptyDirectoryFile(f));

    totalBytesRef.current = onlyFiles.reduce((acc, f) => acc + f.size, 0);
    uploadedBytesRef.current = 0;
    setPercent(0);

    await runWithConcurrency(onlyFiles, maxUploadFilesCount, async (file) => {

      const session = await startUploadSession(
        folderTargetId,
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
          folderTargetId,
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

      await finalizeUploadSession(folderTargetId, session.id);
    });

    setPercent(100);
  }, []);

  const getFileExtension = useCallback((fileName: string) => {
    const lastDot = fileName.lastIndexOf(".");
    return lastDot !== -1 ? fileName.slice(lastDot) : "";
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      const newFiles: TFile[] = acceptedFiles.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        extension: getFileExtension(file.name),
        file,
      }));

      setPendingFiles((prev) => {
        const existingIds = new Set(prev.map((f) => f.id));
        const uniqueNewFiles = newFiles.filter((f) => !existingIds.has(f.id));
        return [...prev, ...uniqueNewFiles];
      });
    },
    [getFileExtension],
  );

  const onRemoveFile = useCallback((file: TFile) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== file.id));
  }, []);

  const onUploadClick = useCallback(async () => {
    if (!pendingFiles.length) return;

    setIsLoading(true);

    try {
      const filesToUpload = pendingFiles.map((f) => f.file);
      await uploadFiles(filesToUpload);
      toastr.success(
        t("Common:ItemsSuccessfullyUploaded", {
          count: pendingFiles.length,
        }),
      );
      setPendingFiles([]);
    } catch (err) {
      const message = getErrorMessage(err) || t("Common:UnexpectedError");
      toastr.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [pendingFiles, t, uploadFiles]);

  return (
    <DropzoneComponent
      isDisabled={isDisabled || isLoading}
      isLoading={isLoading}
      onDrop={onDrop}
      accept={accept}
      getFilesFromEvent={getFilesFromEvent}
      linkMainText={t("Article:Upload")}
      linkSecondaryText={t("Common:DropzoneTitleSecondary")}
      exstsText="(DOC, DOCX, DOCXF, XLSX, PPTX)"
      dataTestId="sdk-uploader"
      icon={pendingFiles.length === 0 ? UploadSvgUrl : undefined}
      className={`${styles.dropzoneWrapper} ${pendingFiles.length === 0 ? styles.dropzoneCentered : ""}`}
      childrenClassName={styles.dropzoneChildren}
      loaderClassName={styles.dropzoneLoader}
    >
      {pendingFiles.length > 0 && (
        <>
          <FilesList
            files={pendingFiles}
            getIcon={getIcon}
            onRemove={isLoading ? undefined : onRemoveFile}
          />
          <div className={styles.uploadButtonWrapper}>
            <Button
              label={
                isLoading ? `${Math.floor(percent)}%` : t("Article:Upload")
              }
              primary
              size={ButtonSize.normal}
              isDisabled={isLoading}
              isLoading={isLoading}
              onClick={onUploadClick}
            />
          </div>
        </>
      )}
    </DropzoneComponent>
  );
}
