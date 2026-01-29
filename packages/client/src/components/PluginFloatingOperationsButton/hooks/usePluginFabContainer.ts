// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { useEffect, useEffectEvent, useMemo } from "react";
import { OperationsProgressProps } from "@docspace/shared/components/operations-progress-button/OperationsProgressButton.types";
import { PluginFabContainerProps } from "../types";

type UsePluginFabContainerParams = Pick<
  PluginFabContainerProps,
  "floatingOperationsButtonProps" | "dispatchMessage" | "getPluginIconUrl"
>;

export const usePluginFabContainer = ({
  floatingOperationsButtonProps,
  dispatchMessage,
  getPluginIconUrl,
}: UsePluginFabContainerParams) => {
  const {
    pluginName,
    operations,
    cancelOperation,
    onCancelOperationFromList,
    onClose,
    onLoad,
  } = floatingOperationsButtonProps;

  const transformedOperations = useMemo(() => {
    if (!operations) return undefined;

    return operations.map(({ icon, ...rest }) => ({
      ...rest,
      iconUrl: icon ? getPluginIconUrl(pluginName, icon) : undefined,
    }));
  }, [operations, pluginName, getPluginIconUrl]);

  const onLoadEvent = useEffectEvent(() => {
    if (!onLoad) return;

    const dispatchMessageAction: Parameters<typeof onLoad>[0] = (message) => {
      dispatchMessage({
        message,
        pluginName,
      });
    };

    onLoad(dispatchMessageAction);
  });

  const onCloseEvent = useEffectEvent(async () => {
    if (!onClose) return;

    const message = await onClose();
    dispatchMessage({
      message,
      pluginName,
    });
  });

  useEffect(() => {
    onLoadEvent();
    return () => {
      onCloseEvent();
    };
  }, []);

  const handleCancel = async () => {
    if (!cancelOperation) return;

    const message = await cancelOperation();

    dispatchMessage({
      message,
      pluginName,
    });
  };

  const handleCancelOperationFromList: OperationsProgressProps["clearOperationsData"] =
    (_, operation) => {
      if (!onCancelOperationFromList || !operation) return;
      onCancelOperationFromList(operation);
    };

  return {
    transformedOperations,
    handleCancel,
    handleCancelOperationFromList,
  };
};
