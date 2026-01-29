import { IFloatingOperationsButtonClient } from "SRC_DIR/helpers/plugins/types";
import type PluginStore from "SRC_DIR/store/PluginStore";

export type PluginFloatingOperationsButtonProps = {
  floatingOperationsButtonProps: IFloatingOperationsButtonClient;
  isVisible?: boolean;
  dispatchMessage: PluginStore["dispatchMessage"];
  getPluginIconUrl: PluginStore["getPluginIconUrl"];
  mainButtonVisible?: boolean;
  infoPanelVisible?: boolean;
};

export type PluginFabContainerProps = {
  floatingOperationsButtonProps: IFloatingOperationsButtonClient;
  dispatchMessage: PluginStore["dispatchMessage"];
  getPluginIconUrl: PluginStore["getPluginIconUrl"];
  mainButtonVisible?: boolean;
  infoPanelVisible?: boolean;
};
