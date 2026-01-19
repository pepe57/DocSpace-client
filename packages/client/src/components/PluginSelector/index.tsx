import { inject, observer } from "mobx-react";
import PluginBaseSelector from "./PluginBaseSelector/PluginBaseSelector";
import { TSelectorProps } from "./types";
import PluginFilesSelector from "./PluginFilesSelector/PluginFilesSelector";
import PluginStore from "SRC_DIR/store/PluginStore";
import { SelectorType } from "@onlyoffice/docspace-plugin-sdk";
import PluginGroupsSelector from "./PluginGroupsSelector/PluginGroupsSelector";
import PluginPeopleSelector from "./PluginPeopleSelector/PluginPeopleSelector";
import PluginRoomSelector from "./PluginRoomSelector/PluginRoomSelector";

export interface PluginSelectorProps {
  pluginSelectorProps: TSelectorProps;
  dispatchMessage: PluginStore["dispatchMessage"];
  getPluginIcon: (icon: string) => string | undefined;
}

const PluginSelector = ({
  pluginSelectorProps,
  dispatchMessage,
  getPluginIcon,
}: PluginSelectorProps) => {
  switch (pluginSelectorProps.type) {
    case SelectorType.Base:
      return (
        <PluginBaseSelector
          pluginSelectorProps={pluginSelectorProps.props}
          dispatchMessage={dispatchMessage}
          getPluginIcon={getPluginIcon}
          pluginName={pluginSelectorProps.pluginName}
        />
      );
    case SelectorType.Files:
      return (
        <PluginFilesSelector
          pluginSelectorProps={pluginSelectorProps.props}
          dispatchMessage={dispatchMessage}
          pluginName={pluginSelectorProps.pluginName}
        />
      );
    case SelectorType.Groups:
      return (
        <PluginGroupsSelector
          pluginSelectorProps={pluginSelectorProps.props}
          dispatchMessage={dispatchMessage}
          pluginName={pluginSelectorProps.pluginName}
        />
      );
    case SelectorType.People:
      return (
        <PluginPeopleSelector
          pluginSelectorProps={pluginSelectorProps.props}
          dispatchMessage={dispatchMessage}
          pluginName={pluginSelectorProps.pluginName}
        />
      );
    case SelectorType.Room:
      return (
        <PluginRoomSelector
          pluginSelectorProps={pluginSelectorProps.props}
          dispatchMessage={dispatchMessage}
          pluginName={pluginSelectorProps.pluginName}
        />
      )
    default:
      return null;
  }
};

export default inject<TStore>(({ pluginStore, filesSettingsStore }) => {
  const { pluginSelectorProps, dispatchMessage, getPluginIconUrl } =
    pluginStore;

  const { getIcon } = filesSettingsStore;

  const getPluginIcon = (icon: string) => {
    if (!pluginSelectorProps?.pluginName) return;

    return getPluginIconUrl(pluginSelectorProps.pluginName, icon);
  };

  return {
    pluginSelectorProps,
    dispatchMessage,
    getPluginIcon,
    getIcon,
  };
})(observer(PluginSelector));
