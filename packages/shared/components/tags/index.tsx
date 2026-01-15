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

import React, { FC, useCallback } from "react";
import isNil from "lodash/isNil";
// import { isMobile as isMobileDevice } from "react-device-detect";

import { classNames } from "../../utils/classNames";
// import { useIsTable } from "../../hooks/useIsTable";
// import { useIsMobile } from "../../hooks/useIsMobile";

import { Tag, type TagType } from "../tag";
import { TagSelector } from "../tag-selector";

import styles from "./Tags.module.scss";
import { calculateRenderedTags } from "./Tags.utils";
import type { TagsProps } from "./Tags.types";

const Tags: FC<TagsProps> = ({
  id,
  tags,
  style,
  className,
  columnCount,
  onSelectTag,
  onMouseEnter,
  onMouseLeave,
  showCreateTag,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [renderedTags, setRenderedTags] = React.useState<TagType[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);

  const tagsRef = React.useRef<HTMLDivElement>(null);

  const canShowCreate = isSelectorOpen || showCreateTag;

  const onCloseSelector = useCallback(() => {
    setIsSelectorOpen(false);
  }, []);

  const onOpenSelector = useCallback(() => {
    setIsSelectorOpen(true);
  }, []);
  React.useLayoutEffect(() => {
    if (isNil(columnCount) || !tags || !tagsRef.current) return;

    const newTags = calculateRenderedTags(
      tags,
      columnCount,
      tagsRef.current.offsetWidth,
      canShowCreate,
    );

    setRenderedTags(newTags);
  }, [tags, columnCount, canShowCreate]);

  return (
    <div
      id={id}
      style={style}
      ref={tagsRef}
      data-testid="tags"
      aria-label="Tags container"
      className={classNames(styles.tags, className)}
    >
      {renderedTags.map((tag, idx) => {
        const props = tag.isSelectorTrigger
          ? { onClick: onOpenSelector, ref }
          : { onClick: onSelectTag };

        return (
          <Tag
            key={tag.label}
            tag={tag.label}
            icon={tag.icon}
            tagMaxWidth={tag.maxWidth}
            providerType={tag.providerType}
            isLast={idx === renderedTags.length - 1}
            label={tag.label}
            roomType={tag.roomType}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...props}
          />
        );
      })}

      {isSelectorOpen && !isNil(id) ? (
        <TagSelector
          roomId={id}
          tags={tags}
          reference={ref}
          onClose={onCloseSelector}
          onSelectTag={onSelectTag}
        />
      ) : null}
    </div>
  );
};

export { Tags };
