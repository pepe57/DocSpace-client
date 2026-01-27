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

import React from "react";
import { ReactSVG } from "react-svg";

import CloseCircleReactSvgUrl from "PUBLIC_DIR/images/remove.session.svg?url";

import { Text } from "@docspace/shared/components/text";
import { IconButton } from "@docspace/shared/components/icon-button";
import { Scrollbar } from "@docspace/shared/components/scrollbar";
import type { TItemIconSizes } from "@docspace/shared/hooks/useItemIcon";

import styles from "./FilesList.module.scss";

export type TFile = {
  id: string;
  name: string;
  extension: string;
  file: File;
};

export type FilesListProps = {
  files: TFile[];
  getIcon: (extension: string, size?: TItemIconSizes) => string;
  onRemove?: (file: TFile) => void;
};

const MAX_VISIBLE_FILES = 2;
const ITEM_HEIGHT = 40;
const GAP = 4;

const FilesList = ({ files, getIcon, onRemove }: FilesListProps) => {
  if (!files.length) return null;

  const getNameWithoutExtension = (name: string, extension: string) => {
    return name.replace(new RegExp(`${extension}$`, "i"), "");
  };

  const needsScroll = files.length > MAX_VISIBLE_FILES;
  const scrollHeight =
    MAX_VISIBLE_FILES * ITEM_HEIGHT + (MAX_VISIBLE_FILES - 1) * GAP;

  const fileItems = files.map((file) => (
    <div
      className={styles.filesListItem}
      key={file.id}
      data-testid="uploader-files-list-item"
    >
      <ReactSVG
        src={getIcon(file.extension, 32)}
        className={styles.filesListItemIcon}
      />

      <div className={styles.filesListItemInfo}>
        <div className={styles.filesListItemInfoText}>
          <Text fontSize="12px" lineHeight="16px" fontWeight={600} truncate>
            {getNameWithoutExtension(file.name, file.extension)}
          </Text>
          <Text fontSize="12px" lineHeight="16px" fontWeight={600} as="span">
            {file.extension}
          </Text>
        </div>

        {onRemove ? (
          <IconButton
            iconName={CloseCircleReactSvgUrl}
            size={16}
            isClickable
            onClick={() => onRemove(file)}
            dataTestId="uploader-remove-file-button"
          />
        ) : null}
      </div>
    </div>
  ));

  return (
    <div className={styles.filesList} data-testid="uploader-files-list">
      {needsScroll ? (
        <Scrollbar style={{ height: scrollHeight }} autoHide={false}>
          <div className={styles.filesListWrapper}>{fileItems}</div>
        </Scrollbar>
      ) : (
        <div className={styles.filesListWrapper}>{fileItems}</div>
      )}
    </div>
  );
};

export default FilesList;
