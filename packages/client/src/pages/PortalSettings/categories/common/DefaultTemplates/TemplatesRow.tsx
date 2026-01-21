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

import FolderIcon from "PUBLIC_DIR/images/folder.react.svg?url";
import EyeIcon from "PUBLIC_DIR/images/eye.react.svg?url";
import ResetIcon from "PUBLIC_DIR/images/restore.auth.react.svg?url";

import { useState } from "react";
import { inject, observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { ReactSVG } from "react-svg";
import moment from "moment";

import { Badge } from "@docspace/shared/components/badge";
import { ContextMenuButton } from "@docspace/shared/components/context-menu-button";
import { Text } from "@docspace/shared/components/text";
import { TDefaultTemplateItem } from "@docspace/shared/types";

import FilesSelector from "SRC_DIR/components/FilesSelector";
import { ResetTemplateDialog } from "SRC_DIR/components/dialogs";

import { TFile } from "./TemplatesRow.types";
import styles from "./DefaultTemplates.module.scss";

type Props = {
  item: TDefaultTemplateItem;
  getFileIcon?: TStore["filesSettingsStore"]["getFileIcon"];
  setTemplate?: TStore["defaultTemplatesStore"]["setTemplate"];
  resetTemplate?: TStore["defaultTemplatesStore"]["resetTemplate"];
  getFilterParam?: TStore["defaultTemplatesStore"]["getFilterParam"];
};

const TemplatesRow = ({
  item,
  getFileIcon,
  getFilterParam,
  setTemplate,
  resetTemplate,
}: Props) => {
  const { t } = useTranslation(["Settings", "Common"]);
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const getOptions = () => {
    const selectOption = [
      {
        key: "select",
        label: t("Common:SelectAction"),
        onClick: () => setIsSelectorVisible(true),
        disabled: false,
        icon: FolderIcon,
      },
    ];

    if (item?.isModified) {
      return [
        ...selectOption,
        {
          key: "preview",
          label: t("Preview"),
          onClick: () =>
            window.open(`/doceditor?fileId=${item.id}&action=view`, "_blank"),
          disabled: false,
          icon: EyeIcon,
        },
        {
          key: "separator",
          isSeparator: true,
        },
        {
          key: "reset",
          label: t("Settings:ResetToDefault"),
          onClick: () => setIsDialogVisible(true),
          disabled: false,
          icon: ResetIcon,
        },
      ];
    }
    return selectOption;
  };

  const onSelectFile = (file: TFile) => {
    setTemplate?.(file.id, file.fileExst);
  };

  const onResetFile = () => {
    resetTemplate?.(item.extension);
    setIsDialogVisible(false);
  };

  const icon = getFileIcon?.(item.extension);

  const badgeBackgroundColor = item.isModified
    ? "var(--modified-badge-active-background-color)"
    : "var(--modified-badge-background-color)";

  const filterParam = getFilterParam?.(item.extension);

  const lastModified = item.lastModified
    ? moment(item.lastModified).format("MM/DD/YYYY hh:mm A")
    : t("Settings:NotModified");

  return (
    <div className={styles.templateRow}>
      <ResetTemplateDialog
        isVisible={isDialogVisible}
        onReset={() => onResetFile()}
        onClose={() => setIsDialogVisible(false)}
      />
      <ReactSVG src={icon} className={styles.icon} />
      <div className={styles.rowContent}>
        <div className={styles.titleWrapper}>
          <Text fontWeight={600} fontSize="13px">
            {item.title}
          </Text>
          <Badge
            backgroundColor={badgeBackgroundColor}
            label={
              item.isModified ? t("Common:Customized") : t("Common:Default")
            }
            noHover
            fontSize="9px"
          />
        </div>
        <Text
          className={styles.modifiedText}
          containerMinWidth="120px"
          fontSize="12px"
          lineHeight="16px"
          fontWeight={600}
          truncate
        >
          {lastModified}
        </Text>
      </div>
      <ContextMenuButton
        className={styles.contextMenuButton}
        directionX="left"
        getData={getOptions}
      />
      {/* @ts-expect-error need pass all props */}
      <FilesSelector
        key="select-default-template-dialog"
        filterParam={filterParam}
        isPanelVisible={isSelectorVisible}
        // @ts-expect-error its always be good
        onSelectFile={(file) => onSelectFile(file)}
        onClose={() => setIsSelectorVisible(false)}
        acceptButtonLabel={t("Common:SelectAction")}
        isMultiSelect={false}
      />
    </div>
  );
};

export default inject(({ filesSettingsStore }: TStore) => {
  const { getFileIcon } = filesSettingsStore;

  return {
    getFileIcon,
  };
})(observer(TemplatesRow));
