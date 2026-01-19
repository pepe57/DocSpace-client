import { RoomsType } from '@docspace/shared/enums';
import { RoomsType as PluginRoomsType } from '@onlyoffice/docspace-plugin-sdk';

export const convertPluginRoomType = (type?: PluginRoomsType | PluginRoomsType[]): RoomsType | RoomsType[] | undefined => {
    if (!type) return;

    const roomsTypeMap = {
        [PluginRoomsType.CustomRoom]: RoomsType.CustomRoom,
        [PluginRoomsType.EditingRoom]: RoomsType.EditingRoom,
        [PluginRoomsType.FormRoom]: RoomsType.FormRoom,
        [PluginRoomsType.PublicRoom]: RoomsType.PublicRoom,
        [PluginRoomsType.VirtualDataRoom]: RoomsType.VirtualDataRoom,
    }

    if (Array.isArray(type)) {
        return type.map((t) => roomsTypeMap[t]);
    }

    return roomsTypeMap[type];
};
