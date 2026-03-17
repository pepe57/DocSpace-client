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
import useFolderActions from "../../_hooks/useFolderActions";
import ActionsUploadReactSvgUrl from "PUBLIC_DIR/images/actions.upload.react.svg?url";
import FormPlusReactSvgUrl from "PUBLIC_DIR/images/form.plus.react.svg?url";

import { useFormsAiAgentStore } from "../../_store/FormsAiAgentStore";
import { useFormsUserStore } from "../../_store/FormsUserStore";
import useFormsSocket from "../../_hooks/useFormsSocket";
import useFormEventHooks from "../../_hooks/useFormEventHooks";

import FormsSidebar from "../sidebar";
import FormsGrid from "../forms-grid";
import FormsEditor from "../forms-editor";
import Settings from "../settings";
import AiChatPanel from "../ai-chat-panel";
import AiChatButton from "../ai-chat-button";
import CreateFormDialog from "../create-form-dialog";

import styles from "./FormsLayout.module.scss";

type FormsLayoutProps = {
  filesSettings: TFilesSettings;
};

const FormsLayout = ({ filesSettings }: FormsLayoutProps) => {
  const { t } = useTranslation(["Common"]);
  const {
    activeSection,
    editingFile,
    closeEditor,
    completedFolder,
    goBackToCompletedRoot,
    inProgressFolder,
    goBackToInProgressRoot,
  } = useFormsNavigationStore();
  const formsListStore = useFormsListStore();
  const { items, folders } = formsListStore;
  const formsSettingsStore = useFormsSettingsStore();
  const { roomId, socketUrl } = formsSettingsStore;
  const { isFormFiller } = formsSettingsStore;
  const { fetchSection, fetchMore } = useFormsData();
  const {
    onUploadFiles,
    onCreateBlankForm,
    isCreateFormDialogVisible,
    isCreatingForm,
    onCloseCreateFormDialog,
    onSaveCreateForm,
  } = useFolderActions();
  const { currentDeviceType } = useDeviceType();
  const aiStore = useFormsAiAgentStore();
  const { user } = useFormsUserStore();

  const socketFolderIds = React.useMemo(() => {
    const ids = new Set<string>();
    if (roomId) ids.add(String(roomId));
    if (aiStore.doneFolderId) ids.add(String(aiStore.doneFolderId));
    for (const key of Object.keys(aiStore.folderAgentsMap)) {
      ids.add(key);
    }
    return [...ids];
  }, [roomId, aiStore.doneFolderId, aiStore.folderAgentsMap]);

  useFormsSocket(socketUrl, socketFolderIds);
  useFormEventHooks(aiStore, socketUrl);

  const prevSection = React.useRef(activeSection);
  const prevCompletedFolder = React.useRef(completedFolder);
  const prevInProgressFolder = React.useRef(inProgressFolder);
  const fetchIdRef = React.useRef(0);
  const [contentVisible, setContentVisible] = React.useState(true);
  const [isSectionLoading, setIsSectionLoading] = React.useState(false);

  const isMyForms = activeSection === FormsSection.MyForms;
  const canCreateForms = isMyForms && !isFormFiller;
  const isSettings = activeSection === FormsSection.Settings;
  const isEditing = Boolean(editingFile);
  const isInsideCompletedFolder =
    activeSection === FormsSection.CompletedForms && !!completedFolder;
  const isInsideInProgressFolder =
    activeSection === FormsSection.InProgress && !!inProgressFolder;
  const activeSubfolder = completedFolder ?? inProgressFolder;

  React.useEffect(() => {
    if (roomId && user?.id) {
      aiStore.initForRoom(roomId, user.id);
      aiStore.autoEnableIfAvailable();
    }
  }, [roomId, user?.id, aiStore]);

  React.useEffect(() => {
    const sectionChanged = prevSection.current !== activeSection;
    const folderChanged = prevCompletedFolder.current !== completedFolder;
    const inProgressFolderChanged =
      prevInProgressFolder.current !== inProgressFolder;

    if (sectionChanged || folderChanged || inProgressFolderChanged) {
      prevSection.current = activeSection;
      prevCompletedFolder.current = completedFolder;
      prevInProgressFolder.current = inProgressFolder;

      if (activeSection === FormsSection.Settings) {
        setContentVisible(true);
        setIsSectionLoading(false);
        return;
      }

      setContentVisible(false);
      setIsSectionLoading(true);

      const currentFetchId = ++fetchIdRef.current;

      fetchSection(activeSection)
        .then(async () => {
          if (currentFetchId !== fetchIdRef.current) return;

          setContentVisible(true);
          setIsSectionLoading(false);

          if (
            activeSection === FormsSection.CompletedForms &&
            completedFolder
          ) {
            await aiStore.setCurrentFolder(completedFolder.id);
            if (currentFetchId !== fetchIdRef.current) return;

            const files = formsListStore.items.map((f) => ({
              id: f.id,
              title: f.title,
            }));

            // No agent for this folder yet — create one
            if (aiStore.aiAgentEnabled && !aiStore.currentAgentId) {
              aiStore.setPreparingAgent(true);
              try {
                const entry = await aiStore.createAgentForFolder(
                  { id: completedFolder.id, title: completedFolder.title },
                  files,
                );
                if (currentFetchId !== fetchIdRef.current) return;
                if (entry) {
                  await aiStore.setCurrentFolder(completedFolder.id);
                  if (currentFetchId !== fetchIdRef.current) return;
                }
              } finally {
                aiStore.setPreparingAgent(false);
              }
            }

            if (files.length > 0) {
              aiStore.syncCompletedForms(files);
            }
          } else {
            aiStore.setCurrentFolder(null);
          }
        })
        .catch(() => {});
    }
  }, [
    activeSection,
    completedFolder,
    inProgressFolder,
    fetchSection,
    formsListStore,
    aiStore,
  ]);

  const getSectionTitle = React.useCallback(() => {
    switch (activeSection) {
      case FormsSection.MyForms:
        return t("Common:MyForms");
      case FormsSection.InProgress:
        return t("Common:InProgress");
      case FormsSection.CompletedForms:
        return t("Common:CompletedForms");
      case FormsSection.Settings:
        return t("Common:Settings");
      default:
        return "";
    }
  }, [activeSection, t]);

  const navigationItems = React.useMemo(() => {
    if (isEditing && activeSubfolder) {
      const isCompleted =
        activeSection === FormsSection.CompletedForms;
      return [
        {
          id: `folder-${activeSubfolder.id}`,
          title: activeSubfolder.title,
          isRootRoom: false,
        },
        {
          id: isCompleted ? "completed-root" : "in-progress-root",
          title: isCompleted
            ? t("Common:CompletedForms")
            : t("Common:InProgress"),
          isRootRoom: true,
        },
      ];
    }

    if (isEditing) {
      return [
        {
          id: "home",
          title: getSectionTitle(),
          isRootRoom: true,
        },
      ];
    }

    if (isInsideCompletedFolder) {
      return [
        {
          id: "completed-root",
          title: t("Common:CompletedForms"),
          isRootRoom: true,
        },
      ];
    }

    if (isInsideInProgressFolder) {
      return [
        {
          id: "in-progress-root",
          title: t("Common:InProgress"),
          isRootRoom: true,
        },
      ];
    }

    return [];
  }, [
    isEditing,
    activeSection,
    activeSubfolder,
    isInsideCompletedFolder,
    isInsideInProgressFolder,
    getSectionTitle,
    t,
  ]);

  const getContextOptionsPlus = React.useCallback(() => {
    const security = formsSettingsStore.folderSecurity;
    if (!security?.Create) return [];

    return [
      {
        id: "upload-forms",
        key: "upload-forms",
        label: t("Common:UploadPDFForm"),
        icon: ActionsUploadReactSvgUrl,
        onClick: onUploadFiles,
      },
      {
        id: "create-blank-form",
        key: "create-blank-form",
        label: t("Common:NewPDFForm"),
        icon: FormPlusReactSvgUrl,
        onClick: onCreateBlankForm,
      },
    ];
  }, [formsSettingsStore.folderSecurity, t, onUploadFiles, onCreateBlankForm]);

  const handleEditorNavigatedAway = React.useCallback(() => {
    closeEditor();
    fetchSection();
  }, [closeEditor, fetchSection]);

  const handleEditorBack = React.useCallback(() => {
    closeEditor();
  }, [closeEditor]);

  const handleEditorBreadcrumbClick = React.useCallback(
    (itemId?: string | number) => {
      if (itemId === "completed-root") {
        closeEditor();
        goBackToCompletedRoot();
        return;
      }
      if (itemId === "in-progress-root") {
        closeEditor();
        goBackToInProgressRoot();
        return;
      }
      closeEditor();
    },
    [closeEditor, goBackToCompletedRoot, goBackToInProgressRoot],
  );

  const renderHeader = () => {
    if (isSettings) {
      return (
        <div className={styles.headerRow}>
          <div className={styles.headerNavigation}>
            <Navigation
              showText
              isRootFolder
              canCreate={false}
              title={getSectionTitle()}
              rootRoomTitle=""
              isDesktop={currentDeviceType === DeviceType.desktop}
              isFrame
              navigationItems={[]}
              getContextOptionsPlus={() => []}
              getContextOptionsFolder={() => []}
              onClickFolder={() => {}}
              isTrashFolder={false}
              isEmptyPage={false}
              isEmptyFilesList={false}
              onBackToParentFolder={() => {}}
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
        </div>
      );
    }

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
            onClickFolder={handleEditorBreadcrumbClick}
            isTrashFolder={false}
            isEmptyPage={false}
            isEmptyFilesList={false}
            onBackToParentFolder={handleEditorBack}
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

    if (isInsideCompletedFolder) {
      return (
        <div className={styles.headerRow}>
          <div className={styles.headerNavigation}>
            <Navigation
              showText
              isRootFolder={false}
              canCreate={false}
              title={completedFolder?.title || ""}
              rootRoomTitle=""
              isDesktop={currentDeviceType === DeviceType.desktop}
              isFrame
              navigationItems={navigationItems}
              getContextOptionsPlus={() => []}
              getContextOptionsFolder={() => []}
              onClickFolder={() => goBackToCompletedRoot()}
              isTrashFolder={false}
              isEmptyPage={items.length === 0}
              isEmptyFilesList={items.length === 0}
              onBackToParentFolder={() => goBackToCompletedRoot()}
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
          <AiChatButton />
        </div>
      );
    }

    if (isInsideInProgressFolder) {
      return (
        <div className={styles.headerRow}>
          <div className={styles.headerNavigation}>
            <Navigation
              showText
              isRootFolder={false}
              canCreate={false}
              title={inProgressFolder?.title || ""}
              rootRoomTitle=""
              isDesktop={currentDeviceType === DeviceType.desktop}
              isFrame
              navigationItems={navigationItems}
              getContextOptionsPlus={() => []}
              getContextOptionsFolder={() => []}
              onClickFolder={() => goBackToInProgressRoot()}
              isTrashFolder={false}
              isEmptyPage={items.length === 0}
              isEmptyFilesList={items.length === 0}
              onBackToParentFolder={() => goBackToInProgressRoot()}
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
        </div>
      );
    }

    return (
      <div className={styles.headerRow}>
        <div className={styles.headerNavigation}>
          <Navigation
            showText
            isRootFolder
            canCreate={canCreateForms}
            isPlusButtonVisible={canCreateForms}
            title={getSectionTitle()}
            rootRoomTitle=""
            isDesktop={currentDeviceType === DeviceType.desktop}
            isFrame
            navigationItems={[]}
            getContextOptionsPlus={getContextOptionsPlus}
            getContextOptionsFolder={() => []}
            onClickFolder={() => {}}
            isTrashFolder={false}
            isEmptyPage={items.length === 0 && folders.length === 0}
            isEmptyFilesList={items.length === 0 && folders.length === 0}
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
      </div>
    );
  };

  const renderBody = () => {
    if (isEditing) {
      return <FormsEditor onNavigatedAway={handleEditorNavigatedAway} />;
    }

    if (activeSection === FormsSection.Settings) {
      return <Settings />;
    }

    if (isSectionLoading) {
      return null;
    }

    return (
      <div
        className={contentVisible ? styles.contentFadeIn : styles.contentHidden}
      >
        <FormsGrid filesSettings={filesSettings} fetchMore={fetchMore} />
      </div>
    );
  };

  const showLoaderOverlay =
    isSectionLoading && !isEditing && !isSettings;

  return (
    <div className={styles.root}>
      <FormsSidebar />
      <div className={styles.sectionArea}>
        <Section
          withBodyScroll={!isEditing}
          withoutFooter={isEditing}
          settingsStudio={false}
          viewAs={isSettings ? "settings" : "tile"}
          isEmptyPage={
            !isEditing && items.length === 0 && folders.length === 0
          }
          currentDeviceType={currentDeviceType}
        >
          <Section.SectionHeader>{renderHeader()}</Section.SectionHeader>
          <Section.SectionBody>{renderBody()}</Section.SectionBody>
        </Section>
        {showLoaderOverlay && (
          <div className={styles.loaderOverlay}>
            <Loader type={LoaderTypes.track} size="40px" />
          </div>
        )}
      </div>
      <AiChatPanel />
      <CreateFormDialog
        visible={isCreateFormDialogVisible}
        isCreating={isCreatingForm}
        onClose={onCloseCreateFormDialog}
        onSave={onSaveCreateForm}
      />
    </div>
  );
};

export default observer(FormsLayout);
