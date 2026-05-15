/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactSVG } from "react-svg";
import styled from "styled-components";

import { Text } from "@docspace/ui-kit/components/text";
import { ToggleButton } from "@docspace/ui-kit/components/toggle-button";
import ArrowSvg from "PUBLIC_DIR/images/arrow2.react.svg?url";
import { ImportItemProps, ImportSectionProps } from "../types";
import { tablet } from "@docspace/shared/utils";
import { Tooltip } from "@docspace/ui-kit/components/tooltip";

const SectionWrapper = styled.div<{ isChecked: boolean }>`
  max-width: 700px;

  @media ${tablet} {
    max-width: 675px;
  }

  box-sizing: border-box;
  display: flex;
  align-items: start;
  gap: 4px;

  .toggleButton {
    position: relative;
    margin-top: 0.5px;
  }

  .section-content {
    flex: 1;
    min-width: 0;
  }

  .section-title {
    color: ${(props) => props.theme.client.settings.migration.subtitleColor};
  }

  .section-description {
    color: ${(props) =>
      props.isChecked
        ? props.theme.client.settings.migration.subtitleColor
        : props.theme.client.settings.migration.importItemDisableTextColor};
    margin-top: 4px;
    margin-bottom: 12px;
    span {
      font-size: 12px;
      font-weight: 600;
    }
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex: 1;
  max-width: 400px;
`;

const ImportItemWrapper = styled.div<{ isChecked: boolean }>`
  display: flex;
  flex-direction: column;
  width: calc(50% - 20px);

  .workspace-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${(props) =>
      props.theme.client.settings.migration.importSectionTextColor};
  }

  .importSection {
    display: flex;
    align-items: center;
    height: 36px;
    padding: 8px 12px;
    box-sizing: border-box;
    margin-top: 6px;
    border-radius: 3px;
    background: ${(props) =>
      props.isChecked
        ? props.theme.client.settings.migration.importItemBackground
        : props.theme.client.settings.migration.importItemDisableBackground};
    color: ${(props) =>
      props.isChecked
        ? props.theme.client.settings.migration.importItemTextColor
        : props.theme.client.settings.migration.importItemDisableTextColor};
    font-weight: 600;
    line-height: 20px;
    gap: 8px;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .importSectionIcon {
      div {
        display: flex;
        align-items: center;
      }

      svg {
        path {
          fill: ${(props) =>
            props.isChecked
              ? props.theme.client.settings.migration.importIconColor
              : props.theme.client.settings.migration
                  .importItemDisableTextColor};
        }
      }
    }
  }
`;

const ArrowWrapper = styled.div`
  margin: 32px 12px 0;
  height: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  flex-shrink: 0;

  .arrow-icon {
    transform: ${(props) =>
      props.theme.interfaceDirection === "rtl" && "rotate(180deg)"};
    svg {
      path {
        fill: ${(props) =>
          props.theme.client.settings.migration.importSectionTextColor};
      }
    }
  }
`;

const ImportItem = ({
  sectionName,
  sectionIcon,
  workspace,
  isChecked,
}: ImportItemProps) => {
  return (
    <ImportItemWrapper isChecked={isChecked}>
      <Text
        className="workspace-title"
        fontSize="11px"
        fontWeight={600}
        lineHeight="12px"
        title={workspace}
      >
        {workspace}
      </Text>
      <div className="importSection">
        {sectionIcon ? (
          <ReactSVG className="importSectionIcon" src={sectionIcon} />
        ) : null}
        <Text as="span" fontWeight={600} lineHeight="20px" title={sectionName}>
          {sectionName}
        </Text>
      </div>
    </ImportItemWrapper>
  );
};

const ImportSection = ({
  isDisabled,
  isChecked,
  onChange,
  sectionName,
  description,
  exportSection,
  importSection,
  dataTestId,
  getTooltipContent,
}: ImportSectionProps) => {
  const toggleButtonTooltipId = `toggle-button-tooltip-${sectionName}`;
  return (
    <SectionWrapper data-testid={dataTestId} isChecked={isChecked}>
      <ToggleButton
        isChecked={isChecked}
        onChange={onChange || (() => {})}
        className="toggleButton"
        isDisabled={isDisabled}
        dataTestId="enable_import_section_button"
        dataTooltipId={
          isDisabled && getTooltipContent ? toggleButtonTooltipId : undefined
        }
      />
      {isDisabled && getTooltipContent ? (
        <Tooltip
          id={toggleButtonTooltipId}
          place="bottom-end"
          getContent={getTooltipContent}
          maxWidth="220px"
        />
      ) : null}
      <div className="section-content">
        <Text lineHeight="20px" fontWeight={600} className="section-title">
          {sectionName}
        </Text>
        <Text fontSize="12px" lineHeight="16px" className="section-description">
          {description}
        </Text>
        <FlexContainer>
          <ImportItem {...exportSection} isChecked={isChecked} />
          <ArrowWrapper>
            <ReactSVG className="arrow-icon" src={ArrowSvg} />
          </ArrowWrapper>
          <ImportItem {...importSection} isChecked={isChecked} />
        </FlexContainer>
      </div>
    </SectionWrapper>
  );
};

export default ImportSection;
