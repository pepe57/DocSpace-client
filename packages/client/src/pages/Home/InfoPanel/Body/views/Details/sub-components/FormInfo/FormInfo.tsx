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

import { Link } from "react-router";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";

import { Events } from "@docspace/ui-kit/enums";
import { Tooltip } from "@docspace/ui-kit/components";
import { Card } from "@docspace/ui-kit/components/card";
import { Text } from "@docspace/ui-kit/components/text";
import { ActionButton } from "@docspace/ui-kit/components/action-button";
import type { TFile } from "@docspace/ui-kit/types";
import { Link as LinkButton, LinkType } from "@docspace/ui-kit/components/link";

import { InfoPanelEvents } from "@docspace/shared/enums";

import AIReactSvg from "PUBLIC_DIR/images/icons/16/AI.svg";
import SpreadsheetReactSvg from "PUBLIC_DIR/images/icons/16/spreadsheet.svg";
import FolderSvg from "PUBLIC_DIR/images/icons/12/folder.svg";
import GridSvg from "PUBLIC_DIR/images/icons/12/grid.svg";
import ExternalLinkSvg from "PUBLIC_DIR/images/external.link.react.svg";

import styles from "./FormInfo.module.scss";
import {
  isDoneFolder,
  isFormFile,
  isFormRoom,
  shouldShow,
} from "./FormInfo.utils";
import type {
  EventType,
  ExternalFormInfoProps,
  FormRoomInfoBlocksProps,
  InjectedFormInfoProps,
  ItemType,
} from "./FormInfo.types";

function FormInfoComponent({
  selection,
  askAIAction,
  externalDbEnabled,
  openLocationAction,
  onClickLinkFillForm,
  infoPanelRoomSelection,
}: FormRoomInfoBlocksProps) {
  const { t } = useTranslation(["InfoPanel", "Common"]);

  const isDone = isDoneFolder(selection);
  const isFile = isFormFile(selection);
  const isRoom = isFormRoom(selection);

  const aiConnected =
    !!infoPanelRoomSelection?.sendFormToExternalDB && externalDbEnabled;
  const collectionConnected = !!infoPanelRoomSelection?.saveFormAsXLSX;

  const handleEditRoom = (item: ItemType) => {
    const event: EventType = new Event(Events.ROOM_EDIT);

    event.item = item;
    event.cb = (room) => {
      const event: EventType = new CustomEvent(
        InfoPanelEvents.setInfoPanelSelectedRoom,
        { detail: { room } },
      );

      window.dispatchEvent(event);
    };
    window.dispatchEvent(event);
  };

  const goToCompleteFolder = (item: TFile) => {
    if (!item.resultsFolderId) return;

    openLocationAction({
      id: item.resultsFolderId,
      rootFolderType: item.rootFolderType,
    });
  };

  const filForm = () => {
    if (isFile) onClickLinkFillForm(selection);
  };

  const handleConnect = () => {
    if (!infoPanelRoomSelection) return;
    handleEditRoom(infoPanelRoomSelection);
  };

  const connectedBadge = (
    <Text fontSize="12px" fontWeight={600} className={styles.connectedBadge}>
      {`✓ ${t("Common:Connected")}`}
    </Text>
  );

  const aiTitle = (
    <span className={styles.cardTitle}>
      <AIReactSvg className={styles.cardIcon} />
      {aiConnected
        ? isFile
          ? t("InfoPanel:FormRoomAIAnalyzeTitle")
          : t("InfoPanel:FormRoomAIReadyTitle")
        : t("InfoPanel:FormRoomAIUnlockTitle")}
    </span>
  );

  const aiDescription = useMemo(() => {
    if (aiConnected) {
      if (isDone) return t("InfoPanel:FormRoomAIReadyDescriptionFolder");
      if (isFile) return t("InfoPanel:FormRoomAIReadyDescriptionFile");
      return t("InfoPanel:FormRoomAIReadyDescriptionRoom");
    }

    if (!externalDbEnabled) return t("InfoPanel:FormRoomConnectDatabase");

    return t("InfoPanel:FormRoomAINotConnectedDescription");
  }, [t, aiConnected, isFile, isDone, externalDbEnabled]);

  const collectionDescription = useMemo(() => {
    if (collectionConnected) {
      if (isRoom)
        return t("InfoPanel:FormRoomCollectionConnectedDescriptionRoom");

      return t("InfoPanel:FormRoomCollectionConnectedDescription");
    }

    return t("InfoPanel:FormRoomCollectionNotConnectedDescription");
  }, [collectionConnected, isRoom, t]);

  const aiAction = () => {
    if (aiConnected) {
      if (isFile && selection.security?.AskAi) {
        return (
          <ActionButton
            icon={<AIReactSvg />}
            label={t("Common:AskAI")}
            className={styles.actionButton}
            onClick={() => askAIAction(selection)}
          />
        );
      }

      return null;
    }

    if (!externalDbEnabled)
      return (
        <ActionButton
          as={Link}
          reloadDocument
          icon={<GridSvg />}
          label={t("InfoPanel:FormRoomConnectDatabaseLink")}
          to="/portal-settings/integration/third-party-services?consumer=externaldb"
        />
      );

    return (
      <ActionButton
        label={t("Common:Connect")}
        icon={<ExternalLinkSvg />}
        onClick={handleConnect}
      />
    );
  };

  const collectionAction = collectionConnected ? (
    isFile ? (
      <>
        <ActionButton
          id="complete-folder"
          label={t("InfoPanel:FormRoomGoToCompleteFolder")}
          icon={<FolderSvg />}
          onClick={() => goToCompleteFolder(selection)}
          disabled={!selection.resultsFolderId}
        />
        {!selection.resultsFolderId ? (
          <Tooltip anchorSelect="#complete-folder" clickable>
            <Text>{t("InfoPanel:FormRoomNoSubmissionsYet")}</Text>
            <Text>{t("InfoPanel:FormRoomResultsFolderNote")}</Text>
            <LinkButton
              color="accent"
              onClick={filForm}
              type={LinkType.page}
              className={styles.tooltipLink}
            >
              {t("Common:FillOutTheForm")}
            </LinkButton>
          </Tooltip>
        ) : null}
      </>
    ) : null
  ) : (
    <ActionButton
      label={t("Common:Connect")}
      icon={<ExternalLinkSvg />}
      onClick={handleConnect}
    />
  );

  if (!shouldShow(selection)) return null;

  return (
    <div className={styles.container}>
      <Card
        title={aiTitle}
        footer={aiAction()}
        className={styles.block}
        extra={aiConnected ? connectedBadge : undefined}
      >
        <p className={styles.cardDescription}>{aiDescription}</p>
      </Card>
      <Card
        title={
          <span className={styles.cardTitle}>
            <SpreadsheetReactSvg className={styles.cardIcon} />
            {t("InfoPanel:FormRoomCollectionTitle")}
          </span>
        }
        extra={collectionConnected ? connectedBadge : undefined}
        footer={collectionAction}
        className={styles.block}
      >
        <p className={styles.cardDescription}>{collectionDescription}</p>
      </Card>
    </div>
  );
}

export const FormInfo = inject<
  TStore,
  ExternalFormInfoProps,
  InjectedFormInfoProps
>(
  ({
    filesActionsStore,
    settingsStore,
    contextOptionsStore,
    infoPanelStore,
  }) => ({
    askAIAction: filesActionsStore.askAIAction,
    openLocationAction: filesActionsStore.openLocationAction,
    externalDbEnabled: settingsStore.externalDbEnabled,
    onClickLinkFillForm: contextOptionsStore.onClickLinkFillForm,
    infoPanelRoomSelection: infoPanelStore.infoPanelRoomSelection,
  }),
)(observer(FormInfoComponent as FC<ExternalFormInfoProps>));

