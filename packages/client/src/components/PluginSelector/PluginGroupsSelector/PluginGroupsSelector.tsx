import { useEffect, useEffectEvent } from "react";
import { useTranslation } from "react-i18next";

import { HeaderProps, THeaderBackButton, TSelectorHeader } from "@docspace/shared/components/selector/Selector.types";

import PluginStore from "SRC_DIR/store/PluginStore";

import { TGroupsSelector } from "@onlyoffice/docspace-plugin-sdk";
import GroupsSelector from "@docspace/shared/selectors/Groups";
import { GroupsSelectorProps } from "@docspace/shared/selectors/Groups/GroupsSelector.types";

type Props = {
  pluginSelectorProps: TGroupsSelector;
  dispatchMessage: PluginStore["dispatchMessage"];
  pluginName: string;
};

const PluginGroupsSelector = ({ pluginSelectorProps: selectorProps, dispatchMessage, pluginName }: Props) => {
  const onLoadEvent = useEffectEvent(async () => {
    if (!selectorProps.onLoad) return;
    const message = await selectorProps.onLoad();
    dispatchMessage({ message, pluginName });
  });

  const onSubmit: GroupsSelectorProps["onSubmit"] = async (
    selectedItems,
    access,
    fileName,
    isFooterCheckboxChecked,
  ) => {
    if (!selectorProps.onSubmit) return;
    const selectedIds = selectedItems.filter((item) => item.id).map((item) => item.id!);

    const message = await selectorProps.onSubmit({ selectedIds, fileName, isFooterCheckboxChecked });
    dispatchMessage({ message, pluginName });
  };

  useEffect(() => {
    onLoadEvent();
  }, []);

  const onBackClick: THeaderBackButton["onBackClick"] = async () => {
    if (!selectorProps.headerProps?.onBackClick) return;
    const message = await selectorProps.headerProps.onBackClick();
    dispatchMessage({ message, pluginName });
  };

  const headerBackButtonProps: THeaderBackButton = selectorProps.headerProps?.withBackButton
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

  const headerProps: TSelectorHeader = selectorProps.withHeader
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

  return <GroupsSelector onSubmit={onSubmit} {...headerProps} />;
};

export default PluginGroupsSelector;
