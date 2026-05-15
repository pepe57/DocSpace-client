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

import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { RectangleSkeleton } from "@docspace/shared/skeletons";
import { desktop, mobileMore } from "@docspace/shared/utils";

const tabletStyles = css`
  .header {
    display: ${(props) => !props.dnsSettings && "block"};
    width: ${(props) =>
      props.lngTZSettings
        ? "283px"
        : props.welcomePage
          ? "201px"
          : props.portalRenaming
            ? "150px"
            : props.deepLink || props.adManagement || props.aiServicesManagement
              ? "250px"
              : 0};
    padding-bottom: 16px;
  }

  .description {
    display: none;
  }

  .title {
    display: block;
    width: ${(props) =>
      props.lngTZSettings
        ? "61px"
        : props.welcomePage
          ? "28px"
          : props.portalRenaming
            ? "109px"
            : 0};
    padding-bottom: 4px;
  }

  .combo-box {
    display: block;
    width: 350px;
  }

  .field-container {
    display: block;
    width: 350px;
  }

  .save-cancel-buttons {
    display: block;
    position: static;
    width: ${(props) => (props.welcomePage ? "274px" : "197px")};
    padding: 8px 0 0;
  }

  .dns-description {
    width: 122px;
    padding-bottom: 12px;
  }

  .deep-link-description {
    width: 400px;
    padding-bottom: 12px;
  }

  .dns-field {
    width: 350px;
    padding-bottom: 12px;
  }
`;

const StyledLoader = styled.div`
  .header {
    display: none;
  }

  .description {
    width: 100%;
    padding-bottom: 12px;
  }

  .title {
    width: ${(props) => (props.portalRenaming ? "109px" : "61px")};
  }

  .title-long {
    display: block;
    width: 64px;
    padding-bottom: 4px;
  }

  .combo-box {
    display: block;
    width: 100%;
    padding-bottom: 16px;
  }

  .field-container {
    width: 100%;
    padding-bottom: 12px;
  }

  .save-cancel-buttons {
    display: block;
    position: absolute;
    bottom: 0;
    width: calc(100% - 32px);
    inset-inline-start: 0;
    padding-block: 0 16px;
    padding-inline: 16px 0;
  }

  .flex {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
  }

  .description {
    padding-bottom: 8px;
  }

  .padding-right {
    padding-inline-end: 8px;
  }

  .dns-field {
    height: 32px;
  }

  .checkboxs {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 50px;
  }

  @media ${mobileMore} {
    ${tabletStyles}
  }

  @media ${desktop} {
    .save-cancel-buttons {
      width: ${(props) => (props.welcomePage ? "264px" : "192px")};
    }
  }
`;

const LoaderCustomization = (props) => {
  const {
    lngTZSettings,
    portalRenaming,
    welcomePage,
    dnsSettings,
    deepLink,
    adManagement,
    aiServicesManagement,
  } = props;
  const [isMobileView, setIsMobileView] = useState(false);
  const [isDesktopView, setIsDesktopView] = useState(false);

  const checkInnerWidth = () => {
    if (window.innerWidth < 600) {
      setIsMobileView(true);
    } else {
      setIsMobileView(false);
    }

    if (window.innerWidth <= 1024) {
      setIsDesktopView(true);
    } else {
      setIsDesktopView(false);
    }
  };

  useEffect(() => {
    checkInnerWidth();
    window.addEventListener("resize", checkInnerWidth);

    return () => window.removeEventListener("resize", checkInnerWidth);
  });

  const heightSaveCancelButtons = isDesktopView ? "40px" : "32px";
  const heightDnsDescription = isMobileView ? "40px" : "22px";

  return (
    <StyledLoader
      lngTZSettings={lngTZSettings}
      portalRenaming={portalRenaming}
      welcomePage={welcomePage}
      dnsSettings={dnsSettings}
      deepLink={deepLink}
      adManagement={adManagement}
      aiServicesManagement={aiServicesManagement}
      className="category-item-wrapper"
    >
      <RectangleSkeleton height="22px" className="header" />

      {portalRenaming ? (
        <RectangleSkeleton height="80px" className="description" />
      ) : null}

      {dnsSettings ? (
        <>
          <RectangleSkeleton
            className="dns-description"
            height={heightDnsDescription}
          />
          <div className="flex">
            <RectangleSkeleton
              height="16px"
              width="16px"
              className="padding-right"
            />
            <RectangleSkeleton height="20px" width="135px" />
          </div>
          <RectangleSkeleton className="dns-field" />
        </>
      ) : !deepLink && !adManagement && !aiServicesManagement ? (
        <>
          <RectangleSkeleton height="20px" className="title" />
          <RectangleSkeleton height="32px" className="combo-box" />
        </>
      ) : null}

      {deepLink || adManagement || aiServicesManagement ? (
        <>
          <RectangleSkeleton className="description" />
          <div className="checkboxs">
            <RectangleSkeleton height="20px" />
            <RectangleSkeleton height="20px" />
          </div>
        </>
      ) : null}

      {lngTZSettings ? (
        <>
          <RectangleSkeleton height="20px" className="title-long" />
          <RectangleSkeleton height="32px" className="combo-box" />
        </>
      ) : null}

      <RectangleSkeleton
        height={heightSaveCancelButtons}
        className="save-cancel-buttons"
      />
    </StyledLoader>
  );
};

export default LoaderCustomization;
