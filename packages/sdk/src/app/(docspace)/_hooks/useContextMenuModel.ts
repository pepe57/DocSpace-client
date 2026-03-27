import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";

import { toastr } from "@docspace/ui-kit/components/toast";

import CheckBoxReactSvgUrl from "PUBLIC_DIR/images/check-box.react.svg?url";
import FolderReactSvgUrl from "PUBLIC_DIR/images/folder.react.svg?url";
import EyeReactSvgUrl from "PUBLIC_DIR/images/eye.react.svg?url";
import InvitationLinkReactSvgUrl from "PUBLIC_DIR/images/invitation.link.react.svg?url";
import DownloadReactSvgUrl from "PUBLIC_DIR/images/icons/16/download.react.svg?url";
import DownloadAsReactSvgUrl from "PUBLIC_DIR/images/download-as.react.svg?url";
import AccessEditReactSvgUrl from "PUBLIC_DIR/images/access.edit.react.svg?url";
import FormFillRectSvgUrl from "PUBLIC_DIR/images/form.fill.rect.svg?url";
import FavoritesReactSvgUrl from "PUBLIC_DIR/images/favorite.react.svg?url";
import FavoritesFillReactSvgUrl from "PUBLIC_DIR/images/favorite.fill.react.svg?url";
import RemoveOutlineSvgUrl from "PUBLIC_DIR/images/remove.react.svg?url";
import ShareSvgUrl from "PUBLIC_DIR/images/icons/12/share.svg?url";
import TrashReactSvgUrl from "PUBLIC_DIR/images/icons/16/trash.react.svg?url";

import { useFilesSelectionStore } from "../_store/FilesSelectionStore";
import { AVAILABLE_CONTEXT_ITEMS } from "../_enums/context-items";

import { TFileItem, TFolderItem } from "./useItemList";
import useFolderActions from "./useFolderActions";
import useFilesActions from "./useFilesActions";
import useDownloadActions from "./useDownloadActions";
import useFavoritesActions from "./useFavoritesActions";

type UseContextMenuModelProps = {
  item?: TFileItem | TFolderItem;
  onShareClick?: (item: TFileItem | TFolderItem) => void;
  onDeleteClick?: (item: TFileItem | TFolderItem) => void;
  onDeleteSelectedClick?: (items: (TFileItem | TFolderItem)[]) => void;
};

export default function useContextMenuModel({
  item,
  onShareClick,
  onDeleteClick,
  onDeleteSelectedClick,
}: UseContextMenuModelProps) {
  const { t } = useTranslation(["Common"]);

  const filesSelectionStore = useFilesSelectionStore();

  const { openFolder, copyFolderLink } = useFolderActions({ t });
  const { openFile, copyFileLink } = useFilesActions({ t });
  const { downloadAction, downloadAsAction } = useDownloadActions();
  const { markAsFavorite, removeFromFavorites, removeFromRecent } =
    useFavoritesActions({ t });

  const getSelectItem = useCallback(
    (i: TFileItem | TFolderItem) => {
      return {
        id: "option_select",
        key: "select",
        label: t("Common:SelectAction"),
        icon: CheckBoxReactSvgUrl,
        onClick: () => filesSelectionStore.addSelection(i),
        disabled: false,
      };
    },
    [t, filesSelectionStore],
  );

  const getOpenItem = useCallback(
    (i: TFileItem | TFolderItem) => {
      return {
        id: "option_open",
        key: "open",
        label: t("Common:Open"),
        icon: FolderReactSvgUrl,
        onClick: () => openFolder(i.id, i.title),
        disabled: false,
      };
    },
    [t, openFolder],
  );

  const getPreviewItem = useCallback(
    (i: TFileItem) => {
      return {
        id: "option_preview",
        key: "preview",
        label: t("Common:Preview"),
        icon: EyeReactSvgUrl,
        onClick: () => openFile(i, true),
        disabled: false,
      };
    },
    [openFile, t],
  );

  const getLinkForRoomMembersItem = useCallback(
    (i: TFileItem | TFolderItem) => {
      return {
        id: "option_link-for-room-members",
        key: "link-for-room-members",
        label: t("Common:CopyLink"),
        icon: InvitationLinkReactSvgUrl,
        onClick: i.isFolder
          ? () => copyFolderLink(i.id)
          : () => copyFileLink(i.id),
        disabled: false,
      };
    },
    [copyFileLink, copyFolderLink, t],
  );

  const getOpenPDFItem = useCallback(
    (i: TFileItem) => {
      return {
        id: "option_open-pdf",
        key: "open-pdf",
        label: t("Common:Open"),
        icon: EyeReactSvgUrl,
        onClick: () => openFile(i, false),
        disabled: false,
      };
    },
    [openFile, t],
  );

  const getDownloadItem = useCallback(
    (i?: TFileItem | TFolderItem) => {
      const isDisabled = i
        ? !i.security.Download
        : filesSelectionStore.selection.some((k) => !k.security.Download);

      return {
        id: "option_download",
        key: "download",
        label: t("Common:Download"),
        icon: DownloadReactSvgUrl,
        onClick: () => downloadAction(i),
        disabled: isDisabled,
      };
    },
    [t, filesSelectionStore.selection, downloadAction],
  );

  const getDownloadAsItem = useCallback(() => {
    return {
      key: "download-as",
      label: t("Common:DownloadAs"),
      icon: DownloadAsReactSvgUrl,
      onClick: downloadAsAction,
      disabled: false,
    };
  }, [downloadAsAction, t]);

  const getViewItem = useCallback(
    (i: TFileItem) => {
      return {
        id: "option_view",
        key: "view",
        label: t("Common:View"),
        icon: EyeReactSvgUrl,
        onClick: () => openFile(i),
        disabled: false,
      };
    },
    [t, openFile],
  );

  const getEditItem = useCallback(
    (i: TFileItem) => {
      return {
        id: "option_edit",
        key: "edit",
        label: t("Common:EditButton"),
        icon: AccessEditReactSvgUrl,
        onClick: () => {
          const isPdf = i.fileExst === ".pdf";
          if (isPdf && isMobile) {
            toastr.info(t("Common:MobileEditPdfNotAvailableInfo"));
            return;
          }

          // TODO: check convert
          openFile(i);
        },
        disabled: false,
      };
    },
    [openFile, t],
  );

  const getFillFormItem = useCallback(
    (i: TFileItem) => {
      return {
        id: "option_fill-form",
        key: "fill-form",
        label: t("Common:FillFormButton"),
        icon: FormFillRectSvgUrl,
        onClick: () => openFile(i, false, false, false),
        disabled: false,
      };
    },
    [openFile, t],
  );

  const getMarkAsFavoriteItem = useCallback(
    (i: TFileItem | TFolderItem) => {
      return {
        id: "option_mark-as-favorite",
        key: "mark-as-favorite",
        label: t("Files:MarkAsFavorite"),
        icon: FavoritesReactSvgUrl,
        onClick: () => markAsFavorite(i),
        disabled: false,
      };
    },
    [t, markAsFavorite],
  );

  const getRemoveFromFavoritesItem = useCallback(
    (i: TFileItem | TFolderItem) => {
      return {
        id: "option_remove-from-favorites",
        key: "remove-from-favorites",
        label: t("Common:RemoveFromFavorites"),
        icon: FavoritesFillReactSvgUrl,
        onClick: () => removeFromFavorites(i),
        disabled: false,
      };
    },
    [t, removeFromFavorites],
  );

  const getRemoveFromRecentItem = useCallback(
    (i: TFileItem) => {
      return {
        id: "option_remove-from-recent",
        key: "remove-from-recent",
        label: t("Common:RemoveFromList"),
        icon: RemoveOutlineSvgUrl,
        onClick: () => removeFromRecent(i),
        disabled: false,
      };
    },
    [t, removeFromRecent],
  );

  const getShareItem = useCallback(
    (i: TFileItem | TFolderItem) => {
      return {
        id: "option_share",
        key: "share",
        label: t("Common:Share"),
        icon: ShareSvgUrl,
        onClick: () => onShareClick?.(i),
        disabled: !onShareClick,
      };
    },
    [t, onShareClick],
  );

  const getDeleteItem = useCallback(
    (i: TFileItem | TFolderItem) => {
      return {
        id: "option_delete",
        key: "delete",
        label: t("Common:Delete"),
        icon: TrashReactSvgUrl,
        onClick: () => onDeleteClick?.(i),
        disabled: !onDeleteClick,
      };
    },
    [t, onDeleteClick],
  );


  const getGroupDeleteItem = useCallback(() => {
    const canDelete = filesSelectionStore.selection.every(
      (i) => i.security.Delete,
    );
    return {
      id: "option_delete",
      key: "delete",
      label: t("Common:Delete"),
      icon: TrashReactSvgUrl,
      onClick: () => {
        onDeleteSelectedClick?.(filesSelectionStore.selection);
      },
      disabled: !onDeleteSelectedClick || !canDelete,
    };
  }, [t, onDeleteSelectedClick, filesSelectionStore.selection]);

  const getGroupContextMenuModel = useCallback(() => {
    const items = [];

    items.push(getDownloadItem());

    if (
      filesSelectionStore.selection.some((i) => "fileExst" in i && i.fileExst)
    ) {
      items.push(getDownloadAsItem());
    }

    if (onDeleteSelectedClick) {
      items.push(getGroupDeleteItem());
    }

    return items;
  }, [filesSelectionStore.selection, getDownloadAsItem, getDownloadItem, getGroupDeleteItem, onDeleteSelectedClick]);

  const getHeaderContextMenuModel = useCallback(() => {
    const base = getGroupContextMenuModel();

    const singleFile =
      filesSelectionStore.selection.length === 1 &&
      !filesSelectionStore.selection[0].isFolder
        ? (filesSelectionStore.selection[0] as TFileItem)
        : null;

    if (singleFile) {
      const favItem = singleFile.isFavorite
        ? getRemoveFromFavoritesItem(singleFile)
        : getMarkAsFavoriteItem(singleFile);
      base.push(favItem);

      if (singleFile.contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.removeFromRecent)) {
        base.push(getRemoveFromRecentItem(singleFile));
      }
    }

    return base.map((i) => ({
      iconUrl: i.icon,
      label: i.label,
      title: i.label,

      disabled: i.disabled,

      withDropDown: false,
      options: [],

      onClick: i.onClick,
      id: i.key,
      key: i.key,
    }));
  }, [
    getGroupContextMenuModel,
    getMarkAsFavoriteItem,
    getRemoveFromFavoritesItem,
    getRemoveFromRecentItem,
    filesSelectionStore.selection,
  ]);

  const getContextMenuModel = useCallback(
    (skipSelect: boolean = false) => {
      if (!item) {
        return getHeaderContextMenuModel();
      }

      const { contextOptions } = item!;

      if (!skipSelect) {
        if (
          filesSelectionStore.selection.length &&
          filesSelectionStore.isCheckedItem(item!)
        ) {
          return getGroupContextMenuModel();
        }
      }

      const model = [];

      if (contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.select))
        model.push(getSelectItem(item!));

      if (contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.open))
        model.push(getOpenItem(item!));

      if (contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.view))
        model.push(getViewItem(item as TFileItem));

      if (contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.openPDF))
        model.push(getOpenPDFItem(item as TFileItem));

      if (contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.fillForm))
        model.push(getFillFormItem(item as TFileItem));

      if (contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.edit))
        model.push(getEditItem(item as TFileItem));

      if (contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.preview))
        model.push(getPreviewItem(item as TFileItem));

      if (contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.share))
        model.push(getShareItem(item!));

      if (contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.copyLink))
        model.push(getLinkForRoomMembersItem(item!));

      if (contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.download))
        model.push(getDownloadItem(item));

      if (contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.downloadAs))
        model.push(getDownloadAsItem());

      if (
        contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.markAsFavorite) ||
        contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.removeFromFavorites)
      ) {
        if (item!.isFavorite) {
          model.push(getRemoveFromFavoritesItem(item!));
        } else {
          model.push(getMarkAsFavoriteItem(item!));
        }
      }

      if (contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.removeFromRecent))
        model.push(getRemoveFromRecentItem(item as TFileItem));

      if (
        contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.delete) ||
        contextOptions.includes(AVAILABLE_CONTEXT_ITEMS.deletePermanently)
      )
        model.push(getDeleteItem(item!));

      return model;
    },
    [
      item,
      getSelectItem,
      getOpenItem,
      getViewItem,
      getOpenPDFItem,
      getFillFormItem,
      getEditItem,
      getPreviewItem,
      getLinkForRoomMembersItem,
      getDownloadItem,
      getDownloadAsItem,
      getMarkAsFavoriteItem,
      getRemoveFromFavoritesItem,
      getRemoveFromRecentItem,
      getShareItem,
      getDeleteItem,
      getHeaderContextMenuModel,
      getGroupContextMenuModel,

      filesSelectionStore,
    ],
  );

  return { getContextMenuModel, getHeaderContextMenuModel };
}
