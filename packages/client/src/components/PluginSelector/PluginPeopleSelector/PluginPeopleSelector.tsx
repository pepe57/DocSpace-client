import { useEffect, useEffectEvent } from "react";
import { useTranslation } from "react-i18next";

import {
  HeaderProps,
  THeaderBackButton,
  TSelectorCancelButton,
  TSelectorHeader,
} from "@docspace/shared/components/selector/Selector.types";

import PluginStore from "SRC_DIR/store/PluginStore";

import PeopleSelector from "@docspace/shared/selectors/People";
import { PeopleSelectorProps } from "@docspace/shared/selectors/People/PeopleSelector.types";
import { TPeopleSelector } from "@onlyoffice/docspace-plugin-sdk";

type Props = {
  pluginSelectorProps: TPeopleSelector;
  dispatchMessage: PluginStore["dispatchMessage"];
  pluginName: string;
};

const PluginPeopleSelector = ({
  pluginSelectorProps: selectorProps,
  dispatchMessage,
  pluginName,
}: Props) => {
  const { t } = useTranslation(["Common"]);

  const {
    className,
    submitButtonLabel,
    alwaysShowFooter,
    excludeItems,
    currentUserId,
    disableDisabledUsers,
    disableInvitedUsers,
    disabledSubmitButton,

    emptyScreenDescription,
    emptyScreenHeader,

    cancelButtonLabel,
    withCancelButton,

    withGroups,
    isGroupsOnly,

    withGuests,
    isGuestsOnly,

    isMultiSelect,
    onlyRoomMembers,
    roomId,
    targetEntityType,
    withHeader,
  } = selectorProps;

  const onLoadEvent = useEffectEvent(async () => {
    if (!selectorProps.onLoad) return;
    const message = await selectorProps.onLoad();
    dispatchMessage({ message, pluginName });
  });

  const onSubmit: PeopleSelectorProps["onSubmit"] = async (
    selectedItems,
    access,
    fileName,
    isFooterCheckboxChecked,
  ) => {
    if (!selectorProps.onSubmit) return;
    const selectedIds = selectedItems
      .filter((item) => item.id)
      .map((item) => item.id!);

    const message = await selectorProps.onSubmit({
      selectedIds,
      fileName,
      isFooterCheckboxChecked,
    });
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

  const groupsProps = withGroups
    ? {
        withGroups: true as const,
        isGroupsOnly,
      }
    : {};

  const guestsProps = withGuests
    ? {
        withGuests: true,
        isGuestsOnly,
      }
    : {};

  return (
    <PeopleSelector
      className={className}
      onSubmit={onSubmit}
      submitButtonLabel={submitButtonLabel}
      disableSubmitButton={!!disabledSubmitButton}
      alwaysShowFooter={alwaysShowFooter}
      excludeItems={excludeItems}
      currentUserId={currentUserId}
      disableDisabledUsers={disableDisabledUsers}
      disableInvitedUsers={disableInvitedUsers}
      isMultiSelect={isMultiSelect}
      onlyRoomMembers={onlyRoomMembers}
      roomId={roomId}
      targetEntityType={targetEntityType}
      emptyScreenDescription={emptyScreenDescription}
      emptyScreenHeader={emptyScreenHeader}
      {...headerProps}
      {...cancelButtonProps}
      {...groupsProps}
      {...guestsProps}
    />
  );
};

export default PluginPeopleSelector;
