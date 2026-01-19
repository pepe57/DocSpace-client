import { useEffect, useEffectEvent } from "react";
import { useTranslation } from "react-i18next";

import {
  HeaderProps,
  THeaderBackButton,
  TSelectorCancelButton,
  TSelectorHeader,
} from "@docspace/shared/components/selector/Selector.types";

import PluginStore from "SRC_DIR/store/PluginStore";

import { TRoomSelector } from "@onlyoffice/docspace-plugin-sdk";
import RoomSelector from "@docspace/shared/selectors/Room";
import { RoomSelectorProps } from "@docspace/shared/selectors/Room/RoomSelector.types";
import { convertPluginRoomType } from "./utils";
import { RoomsType } from "@docspace/shared/enums";

type Props = {
  pluginSelectorProps: TRoomSelector;
  dispatchMessage: PluginStore["dispatchMessage"];
  pluginName: string;
};

const PluginRoomSelector = ({
  pluginSelectorProps: selectorProps,
  dispatchMessage,
  pluginName,
}: Props) => {
  const { t } = useTranslation(["Common"]);

  const {
    id,
    className,
    submitButtonLabel,
    excludeItems,

    emptyScreenDescription,
    emptyScreenHeader,

    cancelButtonLabel,
    withCancelButton,

    isMultiSelect,
    roomType,
    searchArea,

    createDefineRoomLabel,
    createDefineRoomType,

    withCreate,
    withSearch,

    withHeader,
  } = selectorProps;

  const onLoadEvent = useEffectEvent(async () => {
    if (!selectorProps.onLoad) return;
    const message = await selectorProps.onLoad();
    dispatchMessage({ message, pluginName });
  });

  const onSubmit: RoomSelectorProps["onSubmit"] = async (selectedItems) => {
    if (!selectorProps.onSubmit) return;
    const selectedIds = selectedItems
      .filter((item) => item.id)
      .map((item) => item.id!);

    const message = await selectorProps.onSubmit(selectedIds);
    dispatchMessage({ message, pluginName });
  };

  useEffect(() => {
    onLoadEvent();
  }, []);

  const onCancel = async () => {
    if (!selectorProps.onCancel) return;
    const message = await selectorProps.onCancel();
    dispatchMessage({ message, pluginName });
  };

  const onBackClick: THeaderBackButton["onBackClick"] = async () => {
    if (!selectorProps.headerProps?.onBackClick) return;
    const message = await selectorProps.headerProps.onBackClick();
    dispatchMessage({ message, pluginName });
  };

  const headerBackButtonProps: THeaderBackButton = selectorProps.headerProps
    ?.withBackButton
    ? {
        withoutBackButton: false,
        onBackClick,
        withoutBorder: false,
      }
    : {};

  const onCloseClick: HeaderProps["onCloseClick"] = async () => {
    if (!selectorProps.headerProps?.onCloseClick) return;
    const message = await selectorProps.headerProps.onCloseClick();
    dispatchMessage({ message, pluginName });
  };

  const headerProps: TSelectorHeader = withHeader
    ? {
        withHeader: true,
        headerProps: {
          headerLabel: selectorProps.headerProps?.label ?? "",
          isCloseable: selectorProps.headerProps?.isCloseable,
          onCloseClick,
          ...headerBackButtonProps,
        },
      }
    : {};

  const cancelButtonProps: TSelectorCancelButton = withCancelButton
    ? {
        withCancelButton: true,
        cancelButtonLabel: cancelButtonLabel ?? t("Common:CancelButton"),
        onCancel,
      }
    : {};

  return (
    <RoomSelector
      id={id}
      className={className}
      onSubmit={onSubmit}
      submitButtonLabel={submitButtonLabel}
      excludeItems={excludeItems}
      isMultiSelect={!!isMultiSelect}
      emptyScreenDescription={emptyScreenDescription}
      emptyScreenHeader={emptyScreenHeader}
      searchArea={searchArea}
      roomType={convertPluginRoomType(roomType)}
      createDefineRoomLabel={createDefineRoomLabel}
      createDefineRoomType={convertPluginRoomType(createDefineRoomType) as RoomsType | undefined}
      withCreate={withCreate}
      withSearch={withSearch}
      {...headerProps}
      {...cancelButtonProps}
    />
  );
};

export default PluginRoomSelector;
