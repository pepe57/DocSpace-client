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

import { FC, useCallback, useRef, useState } from "react";
import { isMobile as isMobileDevice } from "react-device-detect";
import { inject, observer } from "mobx-react";

import { TagManagement } from "@docspace/shared/components/tag-management";

import { useUnmount } from "@docspace/shared/hooks/useUnmount";
import { useIsTable } from "@docspace/shared/hooks/useIsTable";
import { useIsMobile } from "@docspace/shared/hooks/useIsMobile";

import { ShareAccessRights } from "@docspace/shared/enums";
import { Tags } from "@docspace/shared/components/tags";

import type {
  InjectedTagManagementProps,
  TagManagementProps,
  TagManagementWrapperProps,
} from "./TagManagement.types";

const TagManagementWrapper: FC<TagManagementWrapperProps> = ({
  id,
  onSelectTag,
  access,
  isAdmin,
  tags,
  columnCount,
  isActive,
  className,
}) => {
  const [showTagManagement, setShowTagManagement] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const onClose = useCallback(() => {
    setShowTagManagement(false);
  }, []);

  const handleOptionClick = useCallback(() => {
    setShowTagManagement(true);
  }, []);

  useUnmount(onClose);

  const isTableView = useIsTable();
  const isMobileView = useIsMobile();

  const isMobile = isTableView || isMobileView || isMobileDevice;

  const isRoomOwner =
    access === ShareAccessRights.None ||
    access === ShareAccessRights.FullAccess;

  const isRoomManager = access === ShareAccessRights.RoomManager;

  const canEdit = isAdmin;
  const canDelete = isAdmin;
  const canCreate = isAdmin || isRoomOwner || isRoomManager;
  const canBindTag = isRoomManager || isAdmin || isRoomOwner;

  const canShowCreateTag =
    (isActive || isMobile || showTagManagement) && canCreate;

  return (
    <>
      <Tags
        tags={tags}
        id={id.toString()}
        columnCount={columnCount}
        onSelectTag={onSelectTag}
        optionTagRef={anchorRef}
        onOptionTagClick={handleOptionClick}
        showCreateTag={canShowCreateTag}
        className={className}
      />
      {showTagManagement ? (
        <TagManagement
          tags={tags}
          roomId={id}
          anchor={anchorRef}
          onClose={onClose}
          onSelectTag={onSelectTag}
          canCreate={canCreate}
          canEdit={canEdit}
          canRemove={canDelete}
          canBindTag={canBindTag}
          canSearch
        />
      ) : null}
    </>
  );
};

export default inject<TStore, TagManagementProps, InjectedTagManagementProps>(
  ({ filesActionsStore, authStore }) => ({
    isAdmin: authStore.isAdmin,
    onSelectTag: filesActionsStore.selectTag,
  }),
)(observer(TagManagementWrapper as FC<TagManagementProps>));
