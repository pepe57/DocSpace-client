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

import React, { useCallback, useMemo } from "react";

import { Tags } from "@docspace/shared/components/tags";
import { ShareAccessRights } from "@docspace/shared/enums";
import { callSelectorEvent } from "@docspace/shared/components/tag-selector";

const TagsCell = ({
  item,
  tagCount,
  onSelectTag,
  // sideColor,
  isHovered,
  isActive,
  isAdmin,
  checkedProps,
}) => {
  const styleTagsCell = {
    width: "100%",
    overflow: "hidden",
    display: item.thirdPartyIcon ? "flex" : "",
    marginInlineEnd: "8px",
  };

  const tags = useMemo(() => {
    const thirdPartyTag = item.providerType
      ? [
          {
            isDefault: true,
            isThirdParty: true,
            label: item.providerKey,
            icon: item.thirdPartyIcon,
            providerType: item.providerType,
          },
        ]
      : [];

    const itemTags = item?.tags?.length > 0 ? item.tags : [];

    return [...thirdPartyTag, ...itemTags];
  }, [item.providerType, item.providerKey, item.thirdPartyIcon, item.tags]);

  const access = item.access;

  const isRoomManager = access === ShareAccessRights.RoomManager;
  const isOwnerRoom =
    access === ShareAccessRights.FullAccess ||
    access === ShareAccessRights.None;

  const showCreateTag =
    (isHovered || isActive || checkedProps) &&
    (isAdmin || isRoomManager || isOwnerRoom);

  const handleOverflowVisible = useCallback(
    (tags, id, anchorId, setIsOverflowVisible) => {
      callSelectorEvent(tags, id, anchorId, setIsOverflowVisible, access);
    },
    [access],
  );

  return (
    <div style={styleTagsCell}>
      <Tags
        tags={tags}
        id={item.id}
        columnCount={tagCount}
        onSelectTag={onSelectTag}
        showCreateTag={showCreateTag}
        onOverflowClick={handleOverflowVisible}
      />
    </div>
  );
};
export default React.memo(TagsCell);
