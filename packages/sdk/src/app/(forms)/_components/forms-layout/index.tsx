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

"use client";

import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import Section from "@docspace/ui-kit/components/section";
import Navigation from "@docspace/ui-kit/components/navigation";
import { Loader, LoaderTypes } from "@docspace/ui-kit/components/loader";
import { DeviceType } from "@docspace/shared/enums";

import type { TFilesSettings } from "@docspace/shared/api/files/types";

import useDeviceType from "@/hooks/useDeviceType";
import { FormsSection } from "@/types/forms";

import { useFormsNavigationStore } from "../../_store/FormsNavigationStore";
import { useFormsListStore } from "../../_store/FormsListStore";
import { useFormsSettingsStore } from "../../_store/FormsSettingsStore";
import useFormsData from "../../_hooks/useFormsData";
import useNewFormActions from "../../_hooks/useNewFormActions";
import FormFileReactSvgUrl from "PUBLIC_DIR/images/form.file.react.svg?url";
import ActionsDocumentsReactSvgUrl from "PUBLIC_DIR/images/actions.documents.react.svg?url";
import FormGalleryReactSvgUrl from "PUBLIC_DIR/images/form.gallery.react.svg?url";

import { useFormsAiAgentStore } from "../../_store/FormsAiAgentStore";

import FormsSidebar from "../sidebar";
import FormsGrid from "../forms-grid";
import FormsEditor from "../forms-editor";
import SettingsButton from "../settings-button";
import SettingsPanel from "../settings-panel";
import AiChatPanel from "../ai-chat-panel";
import AiChatButton from "../ai-chat-button";

import styles from "./FormsLayout.module.scss";

type FormsLayoutProps = {
  filesSettings: TFilesSettings;
};

const FormsLayout = ({ filesSettings }: FormsLayoutProps) => {
  const { t } = useTranslation(["Common"]);
  const { activeSection, editingFile, closeEditor } = useFormsNavigationStore();
  const formsListStore = useFormsListStore();
  const { items } = formsListStore;
  const { roomId, requestToken } = useFormsSettingsStore();
  const { fetchSection, fetchMore } = useFormsData();
  const { onChooseFromPersonal, onCreateFromDocx, onCreateFromTemplate } =
    useNewFormActions();
  const { currentDeviceType } = useDeviceType();
  const aiStore = useFormsAiAgentStore();
  const prevSection = React.useRef(activeSection);
  const fetchIdRef = React.useRef(0);
  const [contentVisible, setContentVisible] = React.useState(true);
  const [isSectionLoading, setIsSectionLoading] = React.useState(false);

  const isMyForms = activeSection === FormsSection.MyForms;
  const isEditing = Boolean(editingFile);

  React.useEffect(() => {
    if (roomId) {
      aiStore.loadAgentForRoom(roomId, requestToken);
    }
  }, [roomId, requestToken, aiStore]);

  React.useEffect(() => {
    if (prevSection.current !== activeSection) {
      setContentVisible(false);
      setIsSectionLoading(true);
      prevSection.current = activeSection;

      const currentFetchId = ++fetchIdRef.current;

      fetchSection(activeSection).then(() => {
        if (currentFetchId !== fetchIdRef.current) return;

        setContentVisible(true);
        setIsSectionLoading(false);

        // Sync completed forms to AI agent KB after data is loaded
        if (
          activeSection === FormsSection.CompletedForms &&
          formsListStore.items.length > 0
        ) {
          const files = formsListStore.items.map((f) => ({
            id: f.id,
            title: f.title,
          }));
          aiStore.syncCompletedForms(files);
        }
      });
    }
  }, [activeSection, fetchSection, formsListStore, aiStore]);

  const getSectionTitle = React.useCallback(() => {
    switch (activeSection) {
      case FormsSection.MyForms:
        return t("Common:MyForms");
      case FormsSection.FormsToFill:
        return t("Common:FormsToFill");
      case FormsSection.CompletedForms:
        return t("Common:CompletedForms");
      default:
        return "";
    }
  }, [activeSection, t]);

  const navigationItems = React.useMemo(() => {
    if (!isEditing) return [];

    return [
      {
        id: "home",
        title: getSectionTitle(),
        isRootRoom: true,
      },
    ];
  }, [isEditing, getSectionTitle]);

  const getContextOptionsPlus = React.useCallback(() => {
    return [
      {
        id: "choose-from-personal",
        key: "choose-from-personal",
        label: t("Common:ChooseFromPersonalFiles"),
        icon: FormFileReactSvgUrl,
        onClick: onChooseFromPersonal,
      },
      {
        id: "create-from-docx",
        key: "create-from-docx",
        label: t("Common:CreateFromDocx"),
        icon: ActionsDocumentsReactSvgUrl,
        onClick: onCreateFromDocx,
      },
      {
        id: "create-from-template",
        key: "create-from-template",
        label: t("Common:CreateFromTemplate"),
        icon: FormGalleryReactSvgUrl,
        onClick: onCreateFromTemplate,
      },
    ];
  }, [t, onChooseFromPersonal, onCreateFromDocx, onCreateFromTemplate]);

  const renderHeader = () => {
    if (isEditing) {
      return (
        <div className={styles.headerEditing}>
          <Navigation
            showText
            isRootFolder={false}
            canCreate={false}
            title={editingFile?.title || ""}
            rootRoomTitle=""
            isDesktop={currentDeviceType === DeviceType.desktop}
            isFrame
            navigationItems={navigationItems}
            getContextOptionsPlus={() => []}
            getContextOptionsFolder={() => []}
            onClickFolder={() => closeEditor()}
            isTrashFolder={false}
            isEmptyPage={false}
            isEmptyFilesList={false}
            onBackToParentFolder={() => closeEditor()}
            showRootFolderTitle={false}
            withLogo=""
            burgerLogo=""
            withMenu={false}
            currentDeviceType={currentDeviceType}
            titleIcon=""
            titleIconTooltip=""
            showNavigationButton={false}
            isCurrentFolderInfo={false}
            showTitle
            isPublicRoom={false}
            isRoom={false}
            isInfoPanelVisible={false}
            toggleInfoPanel={() => {}}
            onLogoClick={() => {}}
            hideInfoPanel={() => {}}
            clearTrash={() => {}}
            showFolderInfo={() => {}}
          />
        </div>
      );
    }

    return (
      <div className={styles.headerRow}>
        <div className={styles.headerNavigation}>
          <Navigation
            showText
            isRootFolder
            canCreate={isMyForms}
            isPlusButtonVisible={isMyForms}
            title={getSectionTitle()}
            rootRoomTitle=""
            isDesktop={currentDeviceType === DeviceType.desktop}
            isFrame
            navigationItems={[]}
            getContextOptionsPlus={getContextOptionsPlus}
            getContextOptionsFolder={() => []}
            onClickFolder={() => {}}
            isTrashFolder={false}
            isEmptyPage={items.length === 0}
            isEmptyFilesList={items.length === 0}
            onBackToParentFolder={() => {}}
            showRootFolderTitle={false}
            withLogo=""
            burgerLogo=""
            withMenu
            currentDeviceType={currentDeviceType}
            titleIcon=""
            titleIconTooltip=""
            showNavigationButton={false}
            isCurrentFolderInfo={false}
            showTitle
            isPublicRoom={false}
            isRoom={false}
            isInfoPanelVisible={false}
            toggleInfoPanel={() => {}}
            onLogoClick={() => {}}
            hideInfoPanel={() => {}}
            clearTrash={() => {}}
            showFolderInfo={() => {}}
          />
        </div>
        <AiChatButton />
        <SettingsButton />
      </div>
    );
  };

  const renderBody = () => {
    if (isEditing) {
      return <FormsEditor />;
    }

    if (isSectionLoading) {
      return (
        <div className={styles.loaderCenter}>
          <Loader type={LoaderTypes.track} size="40px" />
        </div>
      );
    }

    return (
      <div
        className={contentVisible ? styles.contentFadeIn : styles.contentHidden}
      >
        <FormsGrid filesSettings={filesSettings} fetchMore={fetchMore} />
      </div>
    );
  };

  return (
    <div className={styles.root}>
      <FormsSidebar />
      <Section
        withBodyScroll={!isEditing}
        withoutFooter={isEditing}
        settingsStudio={false}
        viewAs="tile"
        isEmptyPage={!isEditing && items.length === 0}
        currentDeviceType={currentDeviceType}
      >
        <Section.SectionHeader>{renderHeader()}</Section.SectionHeader>
        <Section.SectionBody>{renderBody()}</Section.SectionBody>
      </Section>
      <AiChatPanel />
      <SettingsPanel />
    </div>
  );
};

export default observer(FormsLayout);
