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

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";

import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import { toastr } from "@docspace/ui-kit/components/toast";

import { copyToFolder } from "@docspace/shared/api/files";
import { ConflictResolveType } from "@docspace/shared/enums";

import { FormsSection } from "@/types/forms";
import { sectionToPath } from "../../_utils/sectionFromPathname";
import { getThumbnail, setThumbnail } from "../../_utils/thumbnailCache";
import { useFormsSettingsStore } from "../../_store/FormsSettingsStore";
import { useLibraryNavigationStore } from "../../_store/LibraryNavigationStore";

import styles from "./LibraryTemplateDetail.module.scss";

const LibraryTemplateDetail = () => {
  const { t } = useTranslation("Common");
  const router = useRouter();
  const libraryNav = useLibraryNavigationStore();
  const { roomId, libraryId } = useFormsSettingsStore();

  const file = libraryNav.selectedTemplate;
  const category = libraryNav.selectedCategory;

  const [isCopying, setIsCopying] = useState(false);

  const thumbUrl = file?.thumbnailUrl
    ? file.thumbnailUrl.replace(/^https?:\/\/[^/]+/, "")
    : "";
  const [blobThumbnail, setBlobThumbnail] = useState(
    () => (thumbUrl && getThumbnail(thumbUrl)) || "",
  );

  useEffect(() => {
    if (!thumbUrl) return;

    const cached = getThumbnail(thumbUrl);
    if (cached) {
      setBlobThumbnail(cached);
      return;
    }

    let cancelled = false;

    fetch(thumbUrl, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        const blobUrl = URL.createObjectURL(blob);
        setThumbnail(thumbUrl, blobUrl);
        setBlobThumbnail(blobUrl);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [thumbUrl]);

  const handleUseTemplate = useCallback(async () => {
    if (isCopying || !roomId || !file) return;

    setIsCopying(true);
    try {
      const operations = await copyToFolder(
        Number(roomId),
        [],
        [file.id as number],
        ConflictResolveType.Duplicate,
        false,
      );

      const op = operations?.[0];
      if (op?.error) {
        toastr.error(op.error);
        return;
      }

      const params = new URLSearchParams();
      if (roomId) params.set("roomId", String(roomId));
      if (libraryId) params.set("libraryId", String(libraryId));
      const qs = params.toString();

      router.push(
        `${sectionToPath(FormsSection.MyForms)}${qs ? `?${qs}` : ""}`,
      );
    } catch (error) {
      toastr.error(error as string);
    } finally {
      setIsCopying(false);
    }
  }, [isCopying, roomId, libraryId, file, router]);

  const handleBack = useCallback(() => {
    libraryNav.clearTemplate();
  }, [libraryNav]);

  if (!file) return null;

  const title = file.title.replace(/\.pdf$/i, "");

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.backButton}
        onClick={handleBack}
      >
        &larr; {category?.title ?? t("Common:Library")}
      </button>

      <div className={styles.content}>
        <div className={styles.preview}>
          {blobThumbnail ? (
            <img
              className={styles.thumbnail}
              src={blobThumbnail}
              alt={title}
              draggable={false}
            />
          ) : (
            <div className={styles.thumbnailPlaceholder} />
          )}
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>

          <p className={styles.meta}>
            {category?.title}
          </p>

          <Button
            className={styles.useButton}
            label={
              isCopying
                ? t("Common:CopyingTemplate")
                : t("Common:UseTemplate")
            }
            size={ButtonSize.normal}
            onClick={handleUseTemplate}
            isDisabled={isCopying}
            isLoading={isCopying}
            primary
          />
        </div>
      </div>
    </div>
  );
};

export default observer(LibraryTemplateDetail);
