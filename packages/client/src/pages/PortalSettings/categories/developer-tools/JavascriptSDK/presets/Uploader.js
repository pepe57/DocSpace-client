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

import { useState, useEffect, useCallback } from "react";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";

import debounce from "lodash.debounce";
import { Label } from "@docspace/ui-kit/components/label";
import { Checkbox } from "@docspace/ui-kit/components/checkbox";
import { TextInput } from "@docspace/ui-kit/components/text-input";
import { RadioButtonGroup } from "@docspace/ui-kit/components/radio-button-group";
import { HelpButton } from "@docspace/ui-kit/components/help-button";
import { Text } from "@docspace/ui-kit/components/text";
import { loadScript, getSdkScriptUrl } from "@docspace/shared/utils/common";
import { setDocumentTitle } from "SRC_DIR/helpers/utils";
import FilesSelectorInput from "SRC_DIR/components/FilesSelectorInput";

import SDK from "@onlyoffice/docspace-sdk-js";

import { WidthSetter } from "../sub-components/WidthSetter";
import { HeightSetter } from "../sub-components/HeightSetter";
import { FrameIdSetter } from "../sub-components/FrameIdSetter";
import { PresetWrapper } from "../sub-components/PresetWrapper";
import { PreviewBlock } from "../sub-components/PreviewBlock";
import { VersionSelector } from "../sub-components/VersionSelector";
import Integration from "../sub-components/Integration";

import {
  dimensionsModel,
  defaultSize,
  defaultDimension,
  sdkSource,
  sdkVersion,
  FILE_TYPE_CATEGORIES,
  FILE_TYPE_EXTENSIONS,
} from "../constants";

import {
  Controls,
  CategorySubHeader,
  ControlsGroup,
  LabelGroup,
  ControlsSection,
  Frame,
  Container,
  FilesSelectorInputWrapper,
  CheckboxGroup,
} from "./StyledPresets";

const Uploader = (props) => {
  const { t, theme, myFolderId, fetchTreeFolders } = props;

  setDocumentTitle(t("JavascriptSdk"));

  const [version, onSetVersion] = useState(sdkVersion[220]);
  const [source, onSetSource] = useState(sdkSource.Package);
  const [uploadMode, setUploadMode] = useState("files");
  const [uploadQuantity, setUploadQuantity] = useState("single");

  const uploadModeOptions = [
    {
      value: "files",
      label: (
        <LabelGroup>
          {t("Common:Files")}
          <HelpButton
            offsetRight={0}
            size={12}
            place="right"
            tooltipContent={
              <Text fontSize="12px">
                {t("Common:UploadFilesDescription")}
              </Text>
            }
            dataTestId="upload_files_help_button"
          />
        </LabelGroup>
      ),
    },
    {
      value: "folders",
      label: (
        <LabelGroup>
          {t("Common:Folders")}
          <HelpButton
            offsetRight={0}
            size={12}
            place="right"
            tooltipContent={
              <Text fontSize="12px">
                {t("Common:UploadFoldersDescription")}
              </Text>
            }
            dataTestId="upload_folders_help_button"
          />
        </LabelGroup>
      ),
    },
  ];

  const uploadQuantityOptions = [
    {
      value: "single",
      label: (
        <LabelGroup>
          {t("Common:SingleFile")}
          <HelpButton
            offsetRight={0}
            size={12}
            place="right"
            tooltipContent={
              <Text fontSize="12px">
                {t("Common:SingleFileDescription")}
              </Text>
            }
            dataTestId="single_file_help_button"
          />
        </LabelGroup>
      ),
    },
    {
      value: "multiple",
      label: (
        <LabelGroup>
          {t("Common:MultipleFiles")}
          <HelpButton
            offsetRight={0}
            size={12}
            place="right"
            tooltipContent={
              <Text fontSize="12px">
                {t("Common:MultipleFilesDescription")}
              </Text>
            }
            dataTestId="multiple_files_help_button"
          />
        </LabelGroup>
      ),
    },
  ];

  const getDefaultSecondaryText = (isFolderUpload, isMultipleUpload) => {
    if (isFolderUpload && isMultipleUpload) {
      return t("Common:DropzoneFoldersSecondary");
    }
    if (isFolderUpload && !isMultipleUpload) {
      return t("Common:DropzoneFolderSecondary");
    }
    if (!isFolderUpload && isMultipleUpload) {
      return t("Common:DropzoneFilesSecondary");
    }
    return t("Common:DropzoneTitleSecondary");
  };

  const [config, setConfig] = useState({
    src: window.location.origin,
    mode: "uploader",
    width: `${defaultSize.width}${defaultDimension.label}`,
    height: `${defaultSize.height}${defaultDimension.label}`,
    frameId: "ds-frame",
    init: true,
    acceptExtensions: FILE_TYPE_EXTENSIONS.document.join(","),
    linkMainText: t("Common:Upload"),
    secondaryText: getDefaultSecondaryText(false, false),
    id: myFolderId,
    isFolderUpload: false,
    isMultipleUpload: false,
    events: {
      onUploadSuccess: (data) => {
        console.log("onUploadSuccess", data);
      },
      onUploadError: (data) => {
        console.log("onUploadError", data);
      },
      onUploadProgress: (data) => {
        console.log("onUploadProgress", data);
      },
    },
  });

  const fromPackage = source === sdkSource.Package;

  const sdkScriptUrl = getSdkScriptUrl(version);

  const sdk = fromPackage ? new SDK() : window.DocSpace.SDK;

  const destroyFrame = () => {
    sdk?.frames[config.frameId]?.destroyFrame();
  };

  const initFrame = () => {
    setTimeout(() => sdk?.init(config), 0);
  };

  useEffect(() => {
    const script = document.getElementById("sdk-script");

    if (script) {
      script.remove();
      destroyFrame();
    }

    if (!fromPackage) {
      loadScript(sdkScriptUrl, "sdk-script");
    }

    return () => {
      destroyFrame();
      setTimeout(() => script?.remove(), 10);
    };
  }, [source, version]);

  useEffect(() => {
    const scroll = document.getElementsByClassName("section-scroll")[0];
    if (scroll) {
      scroll.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (!myFolderId) {
      fetchTreeFolders();
    } else {
      setConfig((oldConfig) => ({ ...oldConfig, id: myFolderId }));
    }
  }, [myFolderId, fetchTreeFolders]);

  useEffect(() => {
    initFrame();

    return () => {
      destroyFrame();
    };
  });

  const onChangeFolderId = (folderId) => {
    const newConfig = {
      id: folderId,
      init: true,
    };

    setConfig((oldConfig) => {
      return { ...oldConfig, ...newConfig };
    });
  };

  const debouncedSetLinkFilesText = useCallback(
    debounce((newText) => {
      setConfig((oldConfig) => ({
        ...oldConfig,
        linkMainText: newText,
        init: true,
      }));
    }, 500),
    [setConfig],
  );

  const onChangeLinkFileText = (e) => {
    const newText = e.target.value;
    setConfig((oldConfig) => ({
      ...oldConfig,
      linkMainText: newText,
    }));
    debouncedSetLinkFilesText(newText);
  };

  const debouncedSetSecondaryText = useCallback(
    debounce((newText) => {
      setConfig((oldConfig) => ({
        ...oldConfig,
        secondaryText: newText,
        init: true,
      }));
    }, 500),
    [setConfig],
  );

  const onChangeSecondaryText = (e) => {
    const newText = e.target.value;
    setConfig((oldConfig) => ({
      ...oldConfig,
      secondaryText: newText,
    }));
    debouncedSetSecondaryText(newText);
  };

  const getSelectedExtensions = () => {
    return config.acceptExtensions ? config.acceptExtensions.split(",") : [];
  };

  const isCategorySelected = (category) => {
    const selectedExtensions = getSelectedExtensions();
    const categoryExtensions = FILE_TYPE_EXTENSIONS[category] || [];
    return categoryExtensions.every((ext) => selectedExtensions.includes(ext));
  };

  const onChangeCategoryCheckbox = (category) => {
    const selectedExtensions = getSelectedExtensions();
    const categoryExtensions = FILE_TYPE_EXTENSIONS[category] || [];
    const isSelected = isCategorySelected(category);

    let newExtensions;
    if (isSelected) {
      newExtensions = selectedExtensions.filter(
        (ext) => !categoryExtensions.includes(ext),
      );
    } else {
      const extensionsSet = new Set([
        ...selectedExtensions,
        ...categoryExtensions,
      ]);
      newExtensions = [...extensionsSet];
    }

    setConfig((oldConfig) => ({
      ...oldConfig,
      acceptExtensions: newExtensions.join(","),
      init: true,
    }));
  };

  const preview = (
    <Frame
      width={config.width.includes("px") ? config.width : undefined}
      height={config.height.includes("px") ? config.height : undefined}
      targetId={config.frameId}
    >
      <div id={config.frameId} />
    </Frame>
  );

  return (
    <PresetWrapper
      description={t("UploaderPresetInfo")}
      header={t("CreateSampleUploader")}
    >
      <Container>
        <PreviewBlock
          loadCurrentFrame={initFrame}
          preview={preview}
          theme={theme}
          frameId={config.frameId}
          scriptUrl={sdkScriptUrl}
          config={config}
          isDisabled={config?.id === undefined}
          showScriptParamsWithEvents={false}
        />
        <Controls>
          <VersionSelector
            t={t}
            onSetSource={onSetSource}
            onSetVersion={onSetVersion}
          />
          <ControlsSection>
            <CategorySubHeader>{t("DestinationFolderId")}</CategorySubHeader>
            <ControlsGroup>
              <LabelGroup>
                <Label className="label" text={t("Common:SelectFolder")} />
                <HelpButton
                  offsetRight={0}
                  size={12}
                  place="right-end"
                  tooltipContent={
                    <Text fontSize="12px">
                      {t("Common:SelectDestinationFolder")}
                    </Text>
                  }
                  dataTestId="room_or_folder_help_button"
                />
              </LabelGroup>
              <FilesSelectorInputWrapper>
                {config.id && (
                  <FilesSelectorInput
                    key={config.id}
                    id={config.id}
                    onSelectFolder={onChangeFolderId}
                    isSelect
                  />
                )}
              </FilesSelectorInputWrapper>
            </ControlsGroup>
          </ControlsSection>

          <ControlsSection>
            <CategorySubHeader>{t("Common:UploadMode")}</CategorySubHeader>
            <RadioButtonGroup
              orientation="vertical"
              options={uploadModeOptions}
              name="uploadMode"
              selected={uploadMode}
              onClick={(e) => {
                const value = e.target.value;
                const isFolderUpload = value === "folders";
                setUploadMode(value);
                setConfig((oldConfig) => ({
                  ...oldConfig,
                  isFolderUpload,
                  secondaryText: getDefaultSecondaryText(isFolderUpload, oldConfig.isMultipleUpload),
                  init: true,
                }));
              }}
              spacing="8px"
              dataTestId="upload_mode_radiobutton_group"
            />
          </ControlsSection>

          <ControlsSection>
            <CategorySubHeader>{t("Common:Quantity")}</CategorySubHeader>
            <RadioButtonGroup
              orientation="vertical"
              options={uploadQuantityOptions}
              name="uploadQuantity"
              selected={uploadQuantity}
              onClick={(e) => {
                const value = e.target.value;
                const isMultipleUpload = value === "multiple";
                setUploadQuantity(value);
                setConfig((oldConfig) => ({
                  ...oldConfig,
                  isMultipleUpload,
                  secondaryText: getDefaultSecondaryText(oldConfig.isFolderUpload, isMultipleUpload),
                  init: true,
                }));
              }}
              spacing="8px"
              dataTestId="upload_quantity_radiobutton_group"
            />
          </ControlsSection>

          {!config.isFolderUpload && (
            <ControlsSection>
              <LabelGroup>
                <CategorySubHeader>{t("AvailableFileTypes")}</CategorySubHeader>
                <HelpButton
                  offsetRight={0}
                  size={12}
                  place="right"
                  tooltipContent={
                    <Text fontSize="12px">{t("Common:AllowedFileTypes")}</Text>
                  }
                  dataTestId="available_file_types_help_button"
                />
              </LabelGroup>
              <CheckboxGroup>
                {FILE_TYPE_CATEGORIES.map((category) => (
                  <Checkbox
                    key={category.key}
                    className="checkbox"
                    label={t(category.labelKey)}
                    onChange={() => onChangeCategoryCheckbox(category.key)}
                    isChecked={isCategorySelected(category.key)}
                    dataTestId={`${category.key}_checkbox`}
                  />
                ))}
              </CheckboxGroup>
            </ControlsSection>
          )}

          <ControlsSection>
            <ControlsGroup>
              <Label className="label" text={t("ButtonText")} />
              <TextInput
                scale
                value={config.linkMainText}
                onChange={onChangeLinkFileText}
                tabIndex={5}
                testId="button_text_input"
              />
            </ControlsGroup>

            <ControlsGroup>
              <Label className="label" text={t("HelperText")} />
              <TextInput
                scale
                value={config.secondaryText}
                onChange={onChangeSecondaryText}
                tabIndex={6}
                testId="helper_text_input"
              />
            </ControlsGroup>

            <CategorySubHeader>{t("CustomizingDisplay")}</CategorySubHeader>
            <WidthSetter
              t={t}
              setConfig={setConfig}
              dataDimensions={dimensionsModel}
              defaultDimension={defaultDimension}
              defaultWidth={defaultSize.width}
            />
            <HeightSetter
              t={t}
              setConfig={setConfig}
              dataDimensions={dimensionsModel}
              defaultDimension={defaultDimension}
              defaultHeight={defaultSize.height}
            />
            <FrameIdSetter
              t={t}
              defaultFrameId={config.frameId}
              setConfig={setConfig}
            />
          </ControlsSection>

          <Integration className="integration-examples" />
        </Controls>
      </Container>

      <Integration className="integration-examples integration-examples-bottom" />
    </PresetWrapper>
  );
};

export const Component = inject(({ settingsStore, treeFoldersStore }) => {
  const { theme } = settingsStore;
  const { myFolderId, fetchTreeFolders } = treeFoldersStore;

  return {
    theme,
    myFolderId,
    fetchTreeFolders,
  };
})(
  withTranslation([
    "JavascriptSdk",
    "Files",
    "EmbeddingPanel",
    "Common",
    "CreateEditRoomDialog",
  ])(observer(Uploader)),
);
