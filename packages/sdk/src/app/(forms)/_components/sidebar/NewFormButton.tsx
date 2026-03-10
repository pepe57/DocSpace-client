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

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { MainButton } from "@docspace/ui-kit/components/main-button";
import type { ContextMenuModel } from "@docspace/ui-kit/components/context-menu";

import FormFileReactSvgUrl from "PUBLIC_DIR/images/form.file.react.svg?url";
import ActionsDocumentsReactSvgUrl from "PUBLIC_DIR/images/actions.documents.react.svg?url";
import FormGalleryReactSvgUrl from "PUBLIC_DIR/images/form.gallery.react.svg?url";

type NewFormButtonProps = {
  onChooseFromPersonal: () => void;
  onCreateFromDocx: () => void;
  onCreateFromTemplate: () => void;
};

const NewFormButton = ({
  onChooseFromPersonal,
  onCreateFromDocx,
  onCreateFromTemplate,
}: NewFormButtonProps) => {
  const { t } = useTranslation(["Common"]);

  const model: ContextMenuModel[] = useMemo(
    () => [
      {
        key: "choose-from-personal",
        label: t("Common:ChooseFromPersonalFiles"),
        icon: FormFileReactSvgUrl,
        onClick: onChooseFromPersonal,
      },
      {
        key: "create-from-docx",
        label: t("Common:CreateFromDocx"),
        icon: ActionsDocumentsReactSvgUrl,
        onClick: onCreateFromDocx,
      },
      {
        key: "create-from-template",
        label: t("Common:CreateFromTemplate"),
        icon: FormGalleryReactSvgUrl,
        onClick: onCreateFromTemplate,
      },
    ],
    [t, onChooseFromPersonal, onCreateFromDocx, onCreateFromTemplate],
  );

  return (
    <MainButton
      text={t("Common:New")}
      isDropdown
      isDisabled={false}
      model={model}
      style={
        {
          maxWidth: "fit-content",
          gap: "8px",
          "--main-button-padding": "4px 10px 4px 12px",
        } as React.CSSProperties
      }
    />
  );
};

export default NewFormButton;
