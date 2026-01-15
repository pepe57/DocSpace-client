// (c) Copyright Ascensio System SIA 2009-2025
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

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";
import { ReactSVG } from "react-svg";

import PencilReactSvgUrl from "PUBLIC_DIR/images/pencil.react.svg?url";
import TrashReactSvgUrl from "PUBLIC_DIR/images/icons/16/trash.react.svg?url";

import { IconButton } from "@docspace/shared/components/icon-button";
import { Button } from "@docspace/shared/components/button";
import {
  ModalDialog,
  ModalDialogType,
} from "@docspace/shared/components/modal-dialog";
import { ToggleButton } from "@docspace/shared/components/toggle-button";
import { Text } from "@docspace/shared/components/text";
import { SelectorAddButton } from "@docspace/shared/components/selector-add-button";
import { Aside } from "@docspace/shared/components/aside";
import styles from "./EditRoomGroupsDialog.module.scss";
import RoomSelector from "@docspace/shared/selectors/Room";
import { Backdrop } from "@docspace/shared/components/backdrop";
import { ButtonSize } from "@docspace/shared/components/button";
import GroupIconDialog from "./sub-components/GroupIconDialog";
import { EditRoomGroupsDialogProps } from "./EditRoomGroupsDialog.types";
import type { TRoom } from "@docspace/shared/api/rooms/types";
import type { TSelectorItem } from "@docspace/shared/components/selector/Selector.types";

const EditRoomGroupsDialog = ({
  currentColorScheme,
  getCovers,
  covers,
  setEditRoomGroupsDialogVisible,
  roomGroups,
  setCreateGroupRooms,
  getAllRoomGroups,
  getGroupById,
}: EditRoomGroupsDialogProps) => {
  const { t } = useTranslation(["Common", "GroupingRooms"]);

  const [isOpenRoomList, setIsOpenRoomList] = useState(false);
  const [isOpenGroupIcon, setIsOpenGroupIcon] = useState(false);

  const [arrIdsRooms, setArrIdsRooms] = useState<string[] | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    name: string;
    rooms: TRoom[];
  } | null>(null);

  const onClickCreateNewGroup = () => {
    setIsOpenRoomList(true);
  };

  const onCloseRoomList = () => {
    setIsOpenRoomList(false);
  };

  const onCloseEditRoomGroupsDialog = () => {
    setEditRoomGroupsDialogVisible(false);
  };

  const onSubmitRoom = (items: TSelectorItem[]) => {
    const arrIds: string[] = [];
    items.forEach((item) => {
      if (item.id) arrIds.push(String(item.id));
    });

    setArrIdsRooms(arrIds);
    setIsOpenGroupIcon(true);
  };

  const onClickGroup = async (groupId: string) => {
    try {
      const groupData = await getGroupById(groupId);

      const rooms = groupData.rooms || [];
      setSelectedGroup({
        id: groupId,
        name: groupData.name,
        rooms: rooms,
      });
      setIsOpenRoomList(true);
    } catch (error) {
      console.error("Error fetching group data:", error);
    }
  };

  const onCloseGroupRoomList = () => {
    setIsOpenRoomList(false);
    setSelectedGroup(null);
  };

  if (isOpenGroupIcon) {
    return (
      <GroupIconDialog
        currentColorScheme={currentColorScheme}
        getCovers={getCovers}
        covers={covers}
        setIsOpenGroupIcon={setIsOpenGroupIcon}
        onCloseEditRoomGroupsDialog={onCloseEditRoomGroupsDialog}
        setCreateGroupRooms={setCreateGroupRooms}
        getAllRoomGroups={getAllRoomGroups}
      />
    );
  }

  if (isOpenRoomList && selectedGroup) {
    return (
      <div>
        <Backdrop
          visible={isOpenRoomList}
          isAside
          withBackground
          zIndex={309}
          onClick={onCloseGroupRoomList}
        />
        <Aside
          visible={isOpenRoomList}
          withoutBodyScroll
          zIndex={310}
          onClose={onCloseGroupRoomList}
          withoutHeader
        >
          <RoomSelector
            onSubmit={onSubmitRoom}
            withHeader
            headerProps={{
              onBackClick: onCloseGroupRoomList,
              onCloseClick: onCloseGroupRoomList,
              headerLabel: selectedGroup.name,
              withoutBorder: false,
              withoutBackButton: false,
            }}
            withSearch={false}
            isMultiSelect
            withCancelButton
            cancelButtonLabel={t("Common:CancelButton")}
            onCancel={onCloseGroupRoomList}
            withInit
            initItems={selectedGroup.rooms}
            initTotal={selectedGroup.rooms.length}
            initHasNextPage={false}
            disableFirstFetch
          />
        </Aside>
      </div>
    );
  }

  if (isOpenRoomList && !selectedGroup) {
    return (
      <div>
        <Backdrop
          visible={isOpenRoomList}
          isAside
          withBackground
          zIndex={309}
          onClick={onCloseRoomList}
        />
        <Aside
          visible={isOpenRoomList}
          withoutBodyScroll
          zIndex={310}
          onClose={onCloseRoomList}
          withoutHeader
        >
          <RoomSelector
            onSubmit={onSubmitRoom}
            withHeader
            headerProps={{
              onBackClick: onCloseRoomList,
              onCloseClick: onCloseRoomList,
              headerLabel: "Room list",
              withoutBorder: false,
              withoutBackButton: false,
            }}
            withSearch
            isMultiSelect
            forceIsMultiSelect
            withCancelButton
            cancelButtonLabel={t("Common:CancelButton")}
            onCancel={onCloseRoomList}
          />
        </Aside>
      </div>
    );
  }

  const nodeAddedGroups = () => {
    return roomGroups.map(
      (item: {
        id: string;
        totalRooms: number;
        name: string;
        icon: { data: string };
      }) => (
        <div className={styles.addedGroups} key={item.id}>
          <div className={styles.group}>
            <div
              className={styles.groupData}
              onClick={() => onClickGroup(item.id)}
            >
              <div className={styles.iconGroup} />

              <ReactSVG
                src={`data:image/svg+xml;utf8,${encodeURIComponent(
                  item.icon.data,
                )}`}
              />

              <div className={styles.titleContainer}>
                <div className={styles.nameGroup}>{item.name}</div>
                <div className={styles.countRooms}>
                  {item.totalRooms} {t("Common:Rooms")}
                </div>
              </div>
            </div>

            <div className={styles.editGroup}>
              <IconButton
                className="edit_icon"
                iconName={PencilReactSvgUrl}
                size={16}
              />
              <IconButton
                className="edit_icon"
                iconName={TrashReactSvgUrl}
                size={16}
              />
            </div>
          </div>
        </div>
      ),
    );
  };

  return (
    <ModalDialog
      displayType={ModalDialogType.aside}
      withBodyScroll
      visible={true}
      className={styles.editRoomGroupsDialog}
      onClose={onCloseEditRoomGroupsDialog}
    >
      <ModalDialog.Header>
        {t("GroupingRooms:EditRoomGroups")}
      </ModalDialog.Header>

      <ModalDialog.Body>
        <div className={styles.settingRoomGroups}>
          <div className={styles.roomGroups}>
            <div className={styles.title}>{t("GroupingRooms:RoomGroups")}</div>
            <ToggleButton className={styles.roomGroupsToggle} />
          </div>

          <Text className={styles.description}>
            {t("GroupingRooms:RoomGroupsDescription")}
          </Text>
        </div>
        <SelectorAddButton
          onClick={onClickCreateNewGroup}
          className={styles.selectorAddButton}
          label={t("GroupingRooms:CreateNewGroup")}
        />
        <div className={styles.addedGroups}>{nodeAddedGroups()}</div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          id="shared_create-room-modal_submit"
          tabIndex={5}
          label={t("Common:SaveButton")}
          size={ButtonSize.normal}
          primary
          scale
        />
        <Button
          id="shared_create-room-modal_cancel"
          tabIndex={5}
          label={t("Common:CancelButton")}
          size={ButtonSize.normal}
          scale
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default inject(({ dialogsStore }: TStore) => {
  const { setCreateGroupRooms, getAllRoomGroups, roomGroups, getGroupById } =
    dialogsStore;

  return {
    setCreateGroupRooms,
    getAllRoomGroups,
    roomGroups,
    getGroupById,
  };
})(observer(EditRoomGroupsDialog));
