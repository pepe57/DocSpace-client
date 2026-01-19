import { useEffect, useEffectEvent } from "react";

import { Selector, TSelectorItem, type SelectorProps } from "@docspace/shared/components/selector";

import { BreadCrumbsLoader, RowLoader } from "@docspace/shared/skeletons/selector";

import {
  HeaderProps,
  THeaderBackButton,
  TOnSubmit,
  TSelectorBreadCrumbs,
  TSelectorCancelButton,
  TSelectorHeader,
  TSelectorSubmitButton,
} from "@docspace/shared/components/selector/Selector.types";

import EmptyScreenFilter from "PUBLIC_DIR/images/emptyFilter/empty.filter.rooms.light.svg?url";
import PluginStore from "SRC_DIR/store/PluginStore";
import { TBaseSelector, TSelectorItem as TPluginSelectorItem } from "@onlyoffice/docspace-plugin-sdk";

type Props = {
  pluginSelectorProps: TBaseSelector;
  dispatchMessage: PluginStore["dispatchMessage"];
  getPluginIcon: (icon: string) => string | undefined;
  pluginName: string;
};

const PluginBaseSelector = ({
  pluginSelectorProps: selectorProps,
  dispatchMessage,
  getPluginIcon,
  pluginName,
}: Props) => {
  const onLoadEvent = useEffectEvent(async () => {
    if (!selectorProps.onLoad) return;
    const message = await selectorProps.onLoad();
    dispatchMessage({ message, pluginName });
  });

  useEffect(() => {
    onLoadEvent();
  }, []);

  const onSubmit: TOnSubmit = async (selectedItems, access, fileName, isFooterCheckboxChecked) => {
    if (!selectorProps.onSubmit) return;

    const selectedIds = selectedItems.filter((item) => item.id).map((item) => item.id!);

    const message = await selectorProps.onSubmit({
      selectedIds,
      fileName,
      isFooterCheckboxChecked,
    });
    dispatchMessage({ message, pluginName });
  };

  const onSelect: SelectorProps["onSelect"] = async (selectedItem, isDoubleClick) => {
    if (!selectorProps.onSelect) return;

    const message = await selectorProps.onSelect({
      selectedId: selectedItem.id,
      isDoubleClick,
    });
    dispatchMessage({ message, pluginName });
  };

  const mapDtoToSelectorItems = (items: TPluginSelectorItem[]): TSelectorItem[] => {
    return items.map((item) => {
      const onAcceptInput = async (value: string) => {
        if (!item?.onAcceptInput) return;

        const message = await item.onAcceptInput(value);
        dispatchMessage({ message, pluginName });
      };

      const onCancelInput = async () => {
        if (!item?.onCancelInput) return;

        const message = await item.onCancelInput();
        dispatchMessage({ message, pluginName });
      };

      const onCreateClick = async () => {
        if (!item?.onCreateClick) return;

        const message = await item.onCreateClick();
        dispatchMessage({ message, pluginName });
      };

      if (item.isCreateNewItem)
        return {
          key: item.id?.toString(),
          id: item.id,
          label: item.label,
          isCreateNewItem: true,
          onCreateClick,
          onBackClick: () => {},
        } as TSelectorItem;

      return {
        key: item.id?.toString(),
        id: item.id,
        label: item.label,
        icon: item.icon && getPluginIcon(item.icon),

        isInputItem: Boolean(item.isInputItem),
        defaultInputValue: item.defaultInputValue ?? "",
        onAcceptInput,
        onCancelInput,
      };
    });
  };

  const onCancel: SelectorProps["onCancel"] = async () => {
    if (!selectorProps.onCancel) return;

    const message = await selectorProps.onCancel();
    dispatchMessage({ message, pluginName });
  };

  const items = mapDtoToSelectorItems(selectorProps.items);

  const cancelButtonProps: TSelectorCancelButton = selectorProps.withCancelButton
    ? {
        withCancelButton: true,
        cancelButtonLabel: selectorProps.cancelButtonLabel ?? "",
        onCancel,
      }
    : {};

  const submitButtonProps: TSelectorSubmitButton = {
    onSubmit,
    submitButtonLabel: selectorProps.submitButtonLabel ?? "",
    disableSubmitButton: selectorProps.disabledSubmitButton ?? false,
  };

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

  const onSelectBreadCrumb: SelectorProps["onSelectBreadCrumb"] = async (item) => {
    if (!selectorProps.onSelectBreadCrumb) return;
    const message = await selectorProps.onSelectBreadCrumb(item.id);
    dispatchMessage({ message, pluginName });
  };

  const breadCrumbsProps: TSelectorBreadCrumbs = selectorProps.withBreadCrumbs
    ? {
        withBreadCrumbs: true,
        breadCrumbs: selectorProps.breadCrumbs ?? [],
        onSelectBreadCrumb,
        isBreadCrumbsLoading: selectorProps.isBreadCrumbsLoading ?? false,
        bodyIsLoading: false,
        breadCrumbsLoader: <BreadCrumbsLoader />,
      }
    : {};

  const loadNextPage: SelectorProps["loadNextPage"] = async () => {
    if (!selectorProps.onLoadNextPage) return;
    const message = await selectorProps.onLoadNextPage();
    dispatchMessage({ message, pluginName });
  };

  return (
    <Selector
      className={selectorProps.className}
      items={items}
      hasNextPage={!!selectorProps.hasNextPage}
      isNextPageLoading={!!selectorProps.isNextPageLoading}
      loadNextPage={loadNextPage}
      totalItems={items.length}
      rowLoader={<RowLoader isUser={false} isMultiSelect={false} />}
      isLoading={!!selectorProps.isLoading}
      isMultiSelect={!!selectorProps.isMultiSelect}
      onSelect={onSelect}
      onClose={onCancel}
      descriptionText=""
      emptyScreenImage={EmptyScreenFilter}
      emptyScreenHeader=""
      emptyScreenDescription=""
      searchEmptyScreenImage={EmptyScreenFilter}
      searchEmptyScreenHeader=""
      searchEmptyScreenDescription=""
      {...cancelButtonProps}
      {...submitButtonProps}
      {...breadCrumbsProps}
      {...headerProps}
      useAside
    />
  );
};

export default PluginBaseSelector;
