import { IFloatingOperationsButton } from "@onlyoffice/docspace-plugin-sdk";
import type PluginStore from "SRC_DIR/store/PluginStore";

export type IFloatingOperationsButtonProps = IFloatingOperationsButton & {
  pluginName: string;
};

export type PluginFloatingOperationsButtonProps = {
  floatingOperationsButtonProps: IFloatingOperationsButtonProps;
  dispatchMessage: PluginStore["dispatchMessage"];
  mainButtonVisible?: boolean;
  infoPanelVisible?: boolean;
};
