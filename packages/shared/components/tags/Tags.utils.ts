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

import type { TagType } from "../tag/Tag.types";

import {
  createTag,
  defaultTagMaxWidth,
  fixedTagWidth,
  paddingSize,
  thirdPartyTagWidth,
} from "./Tags.constants";

export const isTagType = (tag: TagType | string): tag is TagType => {
  return typeof tag === "object";
};

export const createMaxWidthTag = (
  tag: TagType | string,
  maxWidth: string,
): TagType => {
  if (isTagType(tag)) {
    return { ...tag, maxWidth };
  }
  return { label: tag, maxWidth };
};

const addTagWithWidth = (
  tag: TagType | string,
  percentWidth: string,
): TagType => {
  const width =
    isTagType(tag) && tag?.isThirdParty ? fixedTagWidth : percentWidth;
  return createMaxWidthTag(tag, width);
};

export const calculateRenderedTags = (
  tags: (TagType | string)[],
  columnCount: number,
  offsetWidth: number = 0,
  canShowCreate: boolean = false,
  withDropDownTags: boolean = false,
) => {
  const newTags: TagType[] = [];

  // Show all tags without collapsing when columnCount is 0
  if (columnCount === -1) {
    if (canShowCreate) {
      newTags.push(createTag);
    }

    tags.forEach((tag) => {
      newTags.push(createMaxWidthTag(tag, defaultTagMaxWidth));
    });

    return newTags;
  }

  const containerWidth = offsetWidth;
  const createTagCount = canShowCreate ? 1 : 0;

  const isSpecialCase =
    columnCount >= tags.length ||
    (tags.length === 2 &&
      isTagType(tags[0]) &&
      tags[0]?.isThirdParty &&
      isTagType(tags[1]) &&
      tags[1]?.isDefault);

  if (isSpecialCase) {
    const thirdPartyTagCount = tags.filter(
      (tag) => isTagType(tag) && tag?.isThirdParty,
    ).length;

    const simpleTagCount = tags.length - thirdPartyTagCount;

    const totalPaddingWidth = (simpleTagCount + createTagCount) * paddingSize;

    const totalWidthOfThirdPartyTags =
      (thirdPartyTagCount + createTagCount) * thirdPartyTagWidth +
      totalPaddingWidth;

    const currentTagMaxWidth =
      (containerWidth - totalWidthOfThirdPartyTags) / simpleTagCount;
    const maxWidthPercent = Math.floor(
      (currentTagMaxWidth / containerWidth) * 100,
    );

    tags.forEach((tag) => {
      newTags.push(addTagWithWidth(tag, `${maxWidthPercent}%`));
    });

    if (canShowCreate) {
      newTags.push(createTag);
    }
  } else {
    // Handle case where we need a dropdown
    const tagWithDropdown = {
      label: withDropDownTags ? "..." : `+${tags.length - columnCount}`,
      key: "selector",
      maxWidth: fixedTagWidth,
      isOptionTag: true,
      advancedOptions: withDropDownTags
        ? tags
            .slice(columnCount, tags.length)
            .map((tag) => (typeof tag === "string" ? tag : tag.label))
        : [],
    };

    const currentTagMaxWidth =
      (containerWidth - columnCount * paddingSize - thirdPartyTagWidth) /
      columnCount;
    const maxWidthPercent = Math.floor(
      (currentTagMaxWidth / containerWidth) * 100,
    );

    for (let i = 0; i < columnCount; i += 1) {
      newTags.push(addTagWithWidth(tags[i], `${maxWidthPercent}%`));
    }

    newTags.push(tagWithDropdown);
  }

  return newTags;
};
