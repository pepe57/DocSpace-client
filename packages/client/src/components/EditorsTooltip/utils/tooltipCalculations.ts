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

import type { EditorUser, TooltipDimensions } from "../EditorsTooltip.types";

const AVATAR_SIZE = 24;
const GAP_SIZE = 8;
const PADDING_LEFT = 12;
const HEADER_HEIGHT = 24;
const HEADER_MARGIN_BOTTOM = 12;
const ITEM_HEIGHT = 24;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;
const MAX_HEIGHT = 176;

/**
 * Calculates the width of text using canvas measureText
 */
export const calculateTextWidth = (text: string, font: string): number => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;
  context.font = font;
  return context.measureText(text).width;
};

/**
 * Calculates optimal dimensions for the tooltip based on editors list
 */
export const calculateTooltipDimensions = (
  editors: EditorUser[],
): TooltipDimensions => {
  if (editors.length === 0) {
    return { width: MIN_WIDTH, height: 0 };
  }

  // Calculate width based on longest name
  const font = "600 12px sans-serif"; // font-weight: 600, font-size: 12px
  const longestName = editors.reduce(
    (longest, editor) =>
      editor.name.length > longest.length ? editor.name : longest,
    "",
  );

  const textWidth = calculateTextWidth(longestName, font);
  // avatar + gap + text + padding
  const calculatedWidth = Math.ceil(
    AVATAR_SIZE + GAP_SIZE + textWidth + PADDING_LEFT,
  );
  const width = Math.max(MIN_WIDTH, Math.min(calculatedWidth, MAX_WIDTH));

  // Calculate height based on number of editors
  const headerTotalHeight = HEADER_HEIGHT + HEADER_MARGIN_BOTTOM;
  const itemsHeight =
    editors.length * ITEM_HEIGHT + Math.max(0, editors.length - 1) * GAP_SIZE;
  const calculatedHeight = headerTotalHeight + itemsHeight;
  const height = Math.min(calculatedHeight, MAX_HEIGHT);

  return { width, height };
};
