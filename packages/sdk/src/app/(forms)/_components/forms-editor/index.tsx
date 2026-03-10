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

import { observer } from "mobx-react";
import React from "react";
import { useTranslation } from "react-i18next";

import { combineUrl } from "@docspace/shared/utils/combineUrl";
import { Loader, LoaderTypes } from "@docspace/ui-kit/components/loader";

import { FormsSection } from "@/types/forms";

import { useFormsNavigationStore } from "../../_store/FormsNavigationStore";
import { useFormsSettingsStore } from "../../_store/FormsSettingsStore";
import styles from "./FormsEditor.module.scss";

const FormsEditor = () => {
  const { t } = useTranslation(["Common"]);
  const { editingFile, editorAction, closeEditor, setActiveSection } =
    useFormsNavigationStore();
  const { requestToken } = useFormsSettingsStore();
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [isIframeLoaded, setIsIframeLoaded] = React.useState(false);

  const editorOrigin = React.useMemo(
    () =>
      window.ClientConfig?.proxy?.url ||
      window.ClientConfig?.api?.origin ||
      window.location.origin,
    [],
  );

  const editorUrl = React.useMemo(() => {
    if (!editingFile) return "";

    const params = new URLSearchParams();
    params.set("fileId", editingFile.id.toString());
    params.append("action", editorAction);
    // Doceditor authenticates via the `share` query parameter on the
    // initial HTTP request (cross-origin, no cookie access).
    // referrerPolicy="no-referrer" on the iframe prevents the token
    // from leaking via Referrer headers to third-party resources.
    if (requestToken) params.append("share", requestToken);

    return combineUrl(editorOrigin, `/doceditor?${params.toString()}`);
  }, [editingFile, editorAction, requestToken, editorOrigin]);

  const handleFormCompleted = React.useCallback(() => {
    closeEditor();
    setActiveSection(FormsSection.CompletedForms);
  }, [closeEditor, setActiveSection]);

  const checkCompletedUrl = React.useCallback(() => {
    try {
      const href = iframeRef.current?.contentWindow?.location.href;
      if (href?.includes("completed-form")) {
        handleFormCompleted();
        return true;
      }
    } catch {
      // cross-origin — ignore
    }
    return false;
  }, [handleFormCompleted]);

  React.useEffect(() => {
    setIsIframeLoaded(false);
  }, [editingFile?.id]);

  // Fallback: poll iframe URL for same-origin completion page
  React.useEffect(() => {
    if (!editingFile) return;

    const interval = setInterval(checkCompletedUrl, 500);
    return () => clearInterval(interval);
  }, [editingFile, checkCompletedUrl]);

  // Primary: listen for postMessage from doceditor
  React.useEffect(() => {
    if (!editingFile) return;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== editorOrigin) return;

      if (
        event.data?.type === "onRequestClose" ||
        event.data === "close-editor"
      ) {
        closeEditor();
      }

      if (
        event.data?.type === "onFormComplete" ||
        event.data === "completed-form"
      ) {
        handleFormCompleted();
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [editingFile, closeEditor, handleFormCompleted, editorOrigin]);

  const onIframeLoad = React.useCallback(() => {
    setIsIframeLoaded(true);
    checkCompletedUrl();
  }, [checkCompletedUrl]);

  if (!editingFile || !editorUrl) return null;

  return (
    <div className={styles.editorWrapper}>
      {!isIframeLoaded && (
        <div className={styles.loaderOverlay}>
          <Loader type={LoaderTypes.track} size="40px" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={editorUrl}
        onLoad={onIframeLoad}
        className={
          isIframeLoaded
            ? styles.editorIframe
            : styles.editorIframeHidden
        }
        allow="autoplay; camera; microphone; display-capture; clipboard-write"
        referrerPolicy="no-referrer"
        title={t("Common:FormEditor")}
      />
    </div>
  );
};

export default observer(FormsEditor);
