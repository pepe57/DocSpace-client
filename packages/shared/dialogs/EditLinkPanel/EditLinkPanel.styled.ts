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

import { Scrollbar } from "@docspace/ui-kit/components/scrollbar";

const StyledEditLinkBodyContent = styled.div`
  padding: 20px 0px 0px;

  margin-inline-end: -16px;
  width: calc(100% + 16px);

  .edit-link_link-block {
    padding: 0px 16px 20px;

    .edit-link-text {
      display: inline-flex;
      margin-bottom: 8px;
    }

    .edit-link_link-input {
      margin-bottom: 8px;
      margin-top: 16px;

      -webkit-text-fill-color: ${({ theme }) =>
        theme.editLink.editInputColor} !important;
      color: ${({ theme }) => theme.editLink.editInputColor};
    }
  }

  .edit-link-toggle-block {
    padding: 0 16px 20px;
    border-top: ${(props) => props.theme.filesPanels.sharing.borderBottom};

    .edit-link-toggle-header {
      display: flex;
      padding-top: 20px;
      padding-bottom: 8px;
      gap: 8px;

      align-items: center;

      .edit-link-toggle--wrapper {
        margin-inline-start: auto;
        align-self: center;

        display: flex;
        align-items: center;

        .edit-link-toggle {
          position: static;
          gap: 0px;
        }
      }
    }
    .edit-link_password-block {
      margin-top: 8px;
    }

    .password-field-wrapper {
      width: 100%;
    }
  }

  .edit-link-toggle-description {
    color: ${({ theme }) => theme.editLink.text.color};
  }

  .edit-link-toggle-description_expired {
    color: ${({ theme }) => theme.editLink.text.errorColor};
  }

  .edit-link_password-block {
    width: 100%;
    display: flex;

    .edit-link_password-input {
      width: 100%;
    }

    .edit-link_generate-icon {
      margin-block: 16px 0;
      margin-inline: 8px 0;
    }
  }

  .edit-link-panel {
    .scroll-body {
      padding-inline-end: 0 !important;
    }
  }

  .field-label-icon {
    display: none;
  }

  .edit-link_password-links {
    display: flex;
    gap: 12px;
    margin-top: -8px;
  }

  .edit-link_header {
    padding: 0 16px;
    border-bottom: ${(props) => props.theme.filesPanels.sharing.borderBottom};

    .edit-link_heading {
      font-weight: 700;
      font-size: 18px;
    }
  }

  .public-room_date-picker {
    padding-top: 8px;
  }
`;

const StyledScrollbar = styled(Scrollbar)`
  position: relative;
  padding: 16px 0;
  height: calc(100% - 150px) !important;
`;

const StyledButtons = styled.div`
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  position: absolute;
  bottom: 0px;
  width: 100%;
  background: ${(props) => props.theme.filesPanels.sharing.backgroundButtons};
  border-top: ${(props) => props.theme.filesPanels.sharing.borderTop};
`;

export {
  // StyledEditLinkPanel,
  StyledScrollbar,
  StyledButtons,
  StyledEditLinkBodyContent,
};
