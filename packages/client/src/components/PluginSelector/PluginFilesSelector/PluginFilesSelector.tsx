import { inject, observer } from "mobx-react";
import { useEffect, useEffectEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  FilesSecurity,
  Security,
  TFilesSelector,
} from "@onlyoffice/docspace-plugin-sdk";

import FilesSelector from "@docspace/shared/selectors/Files";
import { TSelectorHeader } from "@docspace/shared/components/selector/Selector.types";
import { FilesSelectorProps } from "@docspace/shared/selectors/Files/FilesSelector.types";
import { isDesktop, isTablet } from "@docspace/shared/utils";
import { DeviceType, FolderType } from "@docspace/shared/enums";

import PluginStore from "SRC_DIR/store/PluginStore";
import FilesSettingsStore from "SRC_DIR/store/FilesSettingsStore";
import SelectedFolderStore from "SRC_DIR/store/SelectedFolderStore";

type Props = {
  pluginSelectorProps: TFilesSelector;
  dispatchMessage: PluginStore["dispatchMessage"];
  pluginName: string;
} & Partial<InjectedProps>;

type InjectedProps = {
  getIcon: FilesSettingsStore["getIcon"];
  rootFolderType: SelectedFolderStore["rootFolderType"];
};

const PluginFilesSelector = ({
  pluginSelectorProps: selectorProps,
  dispatchMessage,
  getIcon,
  rootFolderType,
  pluginName,
}: Props) => {
  const { t } = useTranslation(["Common"]);

  const {
    withCreate,
    withCancelButton,
    withSearch,
    openRoot,
    currentFolderId,
    withBreadCrumbs,
    withFooterCheckbox,
    withFooterInput,
    footerCheckboxLabel,
    footerInputHeader,
    currentFooterInputValue,
    descriptionText,
    cancelButtonLabel,
    submitButtonLabel,
    isRoomsOnly,
    isMultiSelect,
  } = selectorProps;

  const onLoadEvent = useEffectEvent(async () => {
    if (!selectorProps.onLoad) return;
    const message = await selectorProps.onLoad();
    dispatchMessage({ message, pluginName });
  });

  useEffect(() => {
    onLoadEvent();
  }, []);

  const onCancel = async () => {
    if (!selectorProps.onCancel) return;
    const message = await selectorProps.onCancel();
    dispatchMessage({ message, pluginName });
  };

  const onSubmit: FilesSelectorProps["onSubmit"] = async (
    selectedItemId,
    folderTitle,
    showMoveToPublicDialog,
    breadCrumbs,
    fileName,
    isChecked,
    selectedTreeNode,
    selectedFileInfo,
  ) => {
    if (!selectorProps.onSubmit) return;

    const message = await selectorProps.onSubmit({
      selectedItemId,
      folderTitle,
      fileName,
      selectedFileInfo: selectedFileInfo,
      breadCrumbs,
      isChecked,
    });
    dispatchMessage({ message, pluginName });
  };

  const onSelectItem: FilesSelectorProps["onSelectItem"] = async (item) => {
    if (!selectorProps.onSelectItem) return;
    console.log(item);
    const message = await selectorProps.onSelectItem(item.id);
    dispatchMessage({ message, pluginName });
  };

  const getIsDisabled: FilesSelectorProps["getIsDisabled"] = (
    isFirstLoad,
    isSelectedParentFolder,
    selectedItemId,
    selectedItemType,
    isRoot,
    selectedItemSecurity,
    selectedFileInfo,
  ) => {
    if (!selectorProps.getIsDisabled || selectedItemType === "agents")
      return false;

    const isDisabled = selectorProps.getIsDisabled({
      isFirstLoad,
      selectedItemId,
      selectedItemType,
      isRoot,
      selectedItemSecurity: selectedItemSecurity as
        | FilesSecurity
        | Security
        | undefined,
      selectedFileInfo,
    });

    return isDisabled;
  };

  const headerProps: TSelectorHeader = selectorProps.withHeader
    ? {
        withHeader: true,
        headerProps: {
          headerLabel:
            selectorProps.headerProps?.label ?? t("Common:SelectFile"),
          isCloseable: selectorProps.headerProps?.isCloseable,
          onCloseClick: onCancel,
        },
      }
    : {};

  return (
    <FilesSelector
      isPanelVisible
      onCancel={onCancel}
      onSubmit={onSubmit}
      getIsDisabled={getIsDisabled}
      onSelectItem={onSelectItem}
      openRoot={openRoot}
      getIcon={getIcon!}
      withSearch={!!withSearch}
      withBreadCrumbs={!!withBreadCrumbs}
      withoutBackButton
      withCancelButton={!!withCancelButton}
      cancelButtonLabel={cancelButtonLabel ?? t("Common:CancelButton")}
      submitButtonLabel={submitButtonLabel ?? t("Common:AddButton")}
      withCreate={!!withCreate}
      withFooterCheckbox={!!withFooterCheckbox}
      withFooterInput={!!withFooterInput}
      disabledItems={[]}
      isRoomsOnly={!!isRoomsOnly}
      isThirdParty={false}
      currentFolderId={currentFolderId ?? ""}
      footerCheckboxLabel={footerCheckboxLabel ?? ""}
      footerInputHeader={footerInputHeader ?? ""}
      currentFooterInputValue={currentFooterInputValue ?? ""}
      descriptionText={descriptionText ?? ""}
      currentDeviceType={
        isDesktop()
          ? DeviceType.desktop
          : isTablet()
            ? DeviceType.tablet
            : DeviceType.mobile
      }
      rootFolderType={rootFolderType || FolderType.Rooms}
      getFilesArchiveError={() => ""}
      isMultiSelect={!!isMultiSelect}
      renderInPortal
      {...headerProps}
    />
  );
};

export default inject<TStore>(({ filesSettingsStore, selectedFolderStore }) => {
  const { getIcon } = filesSettingsStore;
  const { rootFolderType } = selectedFolderStore;

  return {
    getIcon,
    rootFolderType,
  };
})(observer(PluginFilesSelector));
