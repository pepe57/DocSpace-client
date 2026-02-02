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

import { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";

import { Label } from "@docspace/shared/components/label";
import { Checkbox } from "@docspace/shared/components/checkbox";
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
  const { t, theme } = props;

  setDocumentTitle(t("JavascriptSdk"));

  const [version, onSetVersion] = useState(sdkVersion[210]);

  const [source, onSetSource] = useState(sdkSource.Package);

  const [config, setConfig] = useState({
    src: window.location.origin,
    mode: "uploader",
    width: `${defaultSize.width}${defaultDimension.label}`,
    height: `${defaultSize.height}${defaultDimension.label}`,
    frameId: "ds-frame",
    init: true,
    acceptCategories: "document",
    linkMainText: t("Common:Upload"),
    linkSecondaryText: t("Common:DropzoneTitleSecondary"),
    events: {
      onUploadSuccess: (data) => {
        console.log("onUploadSuccess", data);
      },
      onUploadError: (data) => {
        console.log("onUploadError", data);
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

  const getSelectedCategories = () => {
    return config.acceptCategories ? config.acceptCategories.split(",") : [];
  };

  const onChangeCategoryCheckbox = (category) => {
    const selectedCategories = getSelectedCategories();
    const isSelected = selectedCategories.includes(category);

    let newCategories;
    if (isSelected) {
      newCategories = selectedCategories.filter((c) => c !== category);
    } else {
      newCategories = [...selectedCategories, category];
    }

    setConfig((oldConfig) => ({
      ...oldConfig,
      acceptCategories: newCategories.join(","),
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
      description={t("UploaderDescription")}
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
        />
        <Controls>
          <VersionSelector
            t={t}
            onSetSource={onSetSource}
            onSetVersion={onSetVersion}
          />
          <ControlsSection>
            <CategorySubHeader>{t("FolderId")}</CategorySubHeader>
            <ControlsGroup>
              <LabelGroup>
                <Label className="label" text={t("Common:SelectFolder")} />
              </LabelGroup>
              <FilesSelectorInputWrapper>
                <FilesSelectorInput
                  onSelectFolder={onChangeFolderId}
                  isSelect
                />
              </FilesSelectorInputWrapper>
            </ControlsGroup>
          </ControlsSection>

          <ControlsSection>
            <CategorySubHeader>{t("FileTypes")}</CategorySubHeader>
            <CheckboxGroup>
              {FILE_TYPE_CATEGORIES.map((category) => (
                <Checkbox
                  key={category.key}
                  className="checkbox"
                  label={t(category.labelKey)}
                  onChange={() => onChangeCategoryCheckbox(category.key)}
                  isChecked={getSelectedCategories().includes(category.key)}
                  dataTestId={`${category.key}_checkbox`}
                />
              ))}
            </CheckboxGroup>
          </ControlsSection>

          <ControlsSection>
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

export const Component = inject(({ settingsStore }) => {
  const { theme } = settingsStore;

  return {
    theme,
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
