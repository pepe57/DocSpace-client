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

import styled from "styled-components";

import { Row } from "@docspace/ui-kit/components/rows";
import { Text } from "@docspace/ui-kit/components/text";
import { mobile } from "@docspace/shared/utils";

const StyledBaseQuotaComponent = styled.div`
  .quotas_description {
    margin-bottom: 20px;
  }

  .paid-badge {
    cursor: auto;
  }

  .toggle-container {
    margin-bottom: 32px;
    .quotas_toggle-button {
      position: static;
    }

    .toggle_label {
      margin-top: 10px;
      margin-bottom: 16px;

      ${(props) =>
        props.isDisabled && `color: ${props.theme.text.disableColor}`};
    }
  }
  .category-item-description {
    color: ${(props) =>
      props.theme.client.settings.storageManagement.descriptionColor};
  }
`;

const StyledMainTitle = styled(Text)`
  margin-bottom: 16px;
`;
const StyledDiscSpaceUsedComponent = styled.div`
  margin-top: 16px;

  .disk-space_title {
    color: ${(props) =>
      props.theme.client.settings.storageManagement.grayBackgroundText};
  }
  .disk-space_link {
    text-decoration: underline;
  }
  .button-container {
    display: flex;
    gap: 16px;
    margin-top: 16px;
    .text-container {
      display: grid;
      min-height: 35px;
      .last-update {
        color: ${(props) =>
          props.theme.client.settings.storageManagement.descriptionColor};
      }
    }

    @media ${mobile} {
      flex-direction: column;
    }
  }

  .disk-space_content {
    display: grid;
    grid-template-columns: 1fr 16px;

    border-radius: 6px;

    .disk-space_size-info {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-inline-end: 8px;
      p {
        margin-inline-end: 16px;
      }
    }
    .disk-space_icon {
      display: flex;
      align-items: center;
    }
  }
`;

const StyledDiagramComponent = styled.div`
  .diagram_slider,
  .diagram_description {
    margin-top: 16px;
  }
  .diagram_slider {
    width: 100%;
    max-width: ${(props) => props.maxWidth}px;
    display: flex;
    background: ${(props) =>
      props.theme.client.settings.payment.backgroundColor};
    border-radius: 46px;
    overflow: hidden;
  }
  .diagram_description {
    display: flex;

    flex-wrap: wrap;

    .diagram_folder-tag {
      display: flex;
      margin-inline-end: 24px;
      padding-bottom: 8px;

      .tag_text {
        margin-inline-start: 4px;
      }
    }

    @media ${mobile} {
      flex-direction: column;
    }
  }
`;

const StyledFolderTagSection = styled.div`
  height: 12px;
  ${(props) =>
    props.width !== 0 &&
    `border-inline-end: 1px solid ${props.theme.client.settings.payment.backgroundColor}`};
  background: ${(props) => props.color};
  width: ${(props) => `${props.width}%`};
`;

const StyledFolderTagColor = styled.div`
  margin: auto 0;

  width: 12px;
  height: 12px;
  background: ${(props) => props.color};
  border-radius: 50%;
  margin-inline-end: 4px;
`;

const StyledStatistics = styled.div`
  max-width: 700px;

  .paid-badge {
    cursor: auto;
  }

  .statistics-description {
    margin-bottom: 20px;
  }
  .statistics-container {
    margin-bottom: 40px;
  }
  .item-statistic {
    margin-bottom: 4px;
  }

  .button-element {
    margin-top: 20px;
  }
`;

const StyledDivider = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${(props) =>
    props.theme.client.settings.storageManagement.dividerColor};
  margin: 28px 0 28px;
`;

const StyledSimpleFilesRow = styled(Row)`
  .row_content {
    gap: 12px;
    align-items: center;
    height: 56px;
    .row_name {
      width: 100%;
      overflow: hidden;

      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .user-icon {
      .react-svg-icon {
        height: 32px;
        border-radius: 50%;
      }
    }
  }
`;

const StyledMainInfo = styled.div`
  display: flex;
  flex-wrap: wrap;

  border-radius: 6px;

  column-gap: 24px;
  row-gap: 12px;
  padding-right: 12px;
  p {
    color: ${(props) =>
      props.theme.client.settings.storageManagement.grayBackgroundText};
  }
`;

const StyledBody = styled.div`
  max-width: 660px;

  .title-container {
    display: flex;
    align-items: flex-start;
    gap: 4px;
  }
`;

export {
  StyledBody,
  StyledBaseQuotaComponent,
  StyledDiscSpaceUsedComponent,
  StyledFolderTagSection,
  StyledFolderTagColor,
  StyledDiagramComponent,
  StyledStatistics,
  StyledDivider,
  StyledSimpleFilesRow,
  StyledMainInfo,
  StyledMainTitle,
};
