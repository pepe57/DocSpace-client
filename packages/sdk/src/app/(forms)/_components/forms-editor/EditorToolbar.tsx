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

import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import { IconButton } from "@docspace/ui-kit/components/icon-button";

import EyeReactSvgUrl from "PUBLIC_DIR/images/eye.react.svg?url";
import InvitationLinkReactSvgUrl from "PUBLIC_DIR/images/invitation.link.react.svg?url";

import type { EditorAction } from "../../_store/FormsNavigationStore";
import { useFormsNavigationStore } from "../../_store/FormsNavigationStore";
import useFormsActions from "../../_hooks/useFormsActions";

const EditorToolbar = () => {
  const { t } = useTranslation(["Common"]);
  const { editingFile, editorAction, setEditorAction } =
    useFormsNavigationStore();
  const { shareForm } = useFormsActions({ t });

  if (!editingFile) return null;

  const handleModeChange = (action: EditorAction) => {
    setEditorAction(action);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Button
        label={t("Common:View")}
        size={ButtonSize.extraSmall}
        primary={editorAction === "view"}
        onClick={() => handleModeChange("view")}
        icon={
          <img
            src={EyeReactSvgUrl}
            alt=""
            style={{
              width: "16px",
              height: "16px",
              filter:
                editorAction === "view"
                  ? "brightness(0) invert(1)"
                  : undefined,
            }}
          />
        }
      />
      <Button
        label={t("Common:EditButton")}
        size={ButtonSize.extraSmall}
        primary={editorAction === "edit" || editorAction === "fill"}
        onClick={() => handleModeChange("fill")}
      />
      <IconButton
        iconName={InvitationLinkReactSvgUrl}
        size={16}
        onClick={() => shareForm(editingFile.id)}
        title={t("Common:Share")}
        hoverColor="accent"
      />
    </div>
  );
};

export default observer(EditorToolbar);
