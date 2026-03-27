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

import { useFormsSettingsStore } from "../../_store/FormsSettingsStore";
import { useLibraryNavigationStore } from "../../_store/LibraryNavigationStore";
import useLibraryData from "../../_hooks/useLibraryData";
import FormsGrid from "../../_components/forms-grid";

const LibraryPage = () => {
  const formsSettingsStore = useFormsSettingsStore();
  const libraryNav = useLibraryNavigationStore();
  const { fetchLibrarySection, fetchMore } = useLibraryData();

  const fetchRef = React.useRef(fetchLibrarySection);
  fetchRef.current = fetchLibrarySection;
  React.useEffect(() => {
    fetchRef.current();
  }, [libraryNav.languageFolder, libraryNav.folderPath.length]);

  const prevDepthRef = React.useRef(0);
  const prevHadTemplateRef = React.useRef(false);
  React.useEffect(() => {
    const depth = libraryNav.depth;
    const prevDepth = prevDepthRef.current;
    const hasTemplate = !!libraryNav.selectedTemplate;
    const hadTemplate = prevHadTemplateRef.current;
    prevDepthRef.current = depth;
    prevHadTemplateRef.current = hasTemplate;

    if (depth > 0 && prevDepth === 0) {
      history.pushState({ libraryTrap: true }, "", window.location.href);
    }

    if (hasTemplate && !hadTemplate) {
      history.pushState({ libraryTrap: true }, "", window.location.href);
    }

    if (depth === 0) return;

    const handlePopState = () => {
      const hadTemplate = !!libraryNav.selectedTemplate;
      libraryNav.goBack();

      // Re-push trap if we're still inside the library after going back
      // (depth > 0 after goBack, or we just cleared a template but stayed at depth 1)
      if (libraryNav.depth > 0 && (libraryNav.depth > 1 || hadTemplate)) {
        history.pushState({ libraryTrap: true }, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [libraryNav.depth, libraryNav.selectedTemplate, libraryNav]);

  return (
    <FormsGrid
      filesSettings={formsSettingsStore.filesSettings!}
      fetchMore={fetchMore}
    />
  );
};

export default observer(LibraryPage);
