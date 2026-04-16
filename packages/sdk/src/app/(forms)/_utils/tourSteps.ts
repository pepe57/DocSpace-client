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

import type { Step } from "react-joyride";
import type { TFunction } from "i18next";

import { waitForElement } from "./waitForElement";

export type TourStepData = {
  page: string;
  openCompletedFolder?: boolean;
};

export type TourStepCallbacks = {
  openCompletedFolder: () => void;
  navigate: (path: string) => void;
};

export type TourStepFlags = {
  canCreate: boolean;
  showLibrary: boolean;
  showSettings: boolean;
  showMenu: boolean;
};

function openContextMenu(): Promise<void> {
  // Find the first tile and right-click it to open context menu
  const tile = document.querySelector('[data-testid="tile"]') as HTMLElement | null;
  if (!tile) return Promise.resolve();

  const rect = tile.getBoundingClientRect();
  const event = new MouseEvent("contextmenu", {
    bubbles: true,
    cancelable: true,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
    button: 2,
  });
  tile.dispatchEvent(event);

  return waitForElement("#option_view")
    .then(() => {})
    .catch(() => {});
}

function contextMenuStep(
  targetId: string,
  title: string,
  content: string,
  page: string,
  callbacks?: TourStepCallbacks,
): Step {
  return {
    target: `#${targetId}`,
    spotlightTarget: () => {
      const item = document.querySelector(`#${targetId}`);
      // Walk up to find the context menu container (ul with role)
      const ul = item?.closest("ul");
      return (ul as HTMLElement) ?? null;
    },
    spotlightPadding: 8,
    placement: "right" as const,
    content,
    title,
    data: { page } satisfies TourStepData,
    skipBeacon: true,
    before: async () => {
      callbacks?.navigate(page);
      await waitForElement('[data-tour="forms-grid"]', 3000).catch(() => {});
      if (!document.querySelector(`#${targetId}`)) {
        await openContextMenu();
      }
      await waitForElement(`#${targetId}`, 3000).catch(() => {});
      document
        .querySelector(`#${targetId}`)
        ?.classList.add("tour-outline-item");
    },
    after: () => {
      document
        .querySelector(".tour-outline-item")
        ?.classList.remove("tour-outline-item");
    },
  };
}

function navSectionStep(
  section: string,
  title: string,
  content: string,
  showMenu: boolean,
  callbacks?: TourStepCallbacks,
  extraBefore?: () => Promise<void>,
): Step {
  const path = `/forms/${section}`;
  const navItemSelector = `#forms-nav-${section}`;
  const anchorSelector = `[data-tour="section-${section}"]`;
  const target = showMenu ? navItemSelector : anchorSelector;

  return {
    target,
    spotlightTarget: showMenu
      ? () => {
          // When sidebar shows text, spotlight the article item container (full-width nav item).
          // When sidebar is icon-only (narrow), spotlight the invisible content-header anchor
          // instead — it sits directly behind the visible section title in the header.
          const articleContainer = document.querySelector("#article-container");
          const isTextVisible =
            articleContainer?.getAttribute("data-show-text") === "true";

          if (isTextVisible) {
            const wrapper = document.querySelector(navItemSelector) as HTMLElement | null;
            return (wrapper?.firstElementChild as HTMLElement) ?? wrapper;
          }

          // The tourAnchor CSS now mirrors Navigation .heading at every breakpoint
          // (18px desktop/mobile, 21px tablet), so its getBoundingClientRect()
          // always matches the visible title text.
          return document.querySelector(anchorSelector) as HTMLElement | null;
        }
      : undefined,
    placement: "auto" as const,
    content,
    title,
    data: { page: path } satisfies TourStepData,
    skipBeacon: true,
    before: async () => {
      if (!showMenu) {
        callbacks?.navigate(path);
        await waitForElement(anchorSelector).catch(() => {});
      }
      if (extraBefore) await extraBefore();
      // Outline the visible nav item (invisible anchors don't need it)
      if (showMenu) {
        await waitForElement(navItemSelector).catch(() => {});
        document
          .querySelector(navItemSelector)
          ?.classList.add("tour-outline-item");
      }
    },
    after: () => {
      document
        .querySelector(".tour-outline-item")
        ?.classList.remove("tour-outline-item");
    },
  };
}

function settingsStep(
  subSection: "billing" | "ai-agent" | "access" | "collect-data",
  title: string,
  content: string,
  callbacks?: TourStepCallbacks,
): Step {
  const path = `/forms/settings/${subSection}`;
  // Wait for the *page content* element, not the tab — the tab is always in the
  // DOM (Tabs renders all items at once), so waiting for it resolves before the
  // URL actually changes.  The page wrapper is unmounted/remounted on each route
  // transition, so it only appears once navigation has fully completed.
  const pageSelector = `[data-tour="settings-${subSection}"]`;
  const tabSelector = `[data-testid="${subSection}_tab"]`;
  const containerSelector = '[data-tour="settings-spotlight"]';

  return {
    target: containerSelector,
    spotlightPadding: 8,
    placement: "auto" as const,
    content,
    title,
    data: { page: path } satisfies TourStepData,
    skipBeacon: true,
    before: async () => {
      callbacks?.navigate(path);
      await waitForElement(pageSelector);
      (document.querySelector(tabSelector) as HTMLElement | null)
        ?.setAttribute("data-tour-active", "true");
    },
    after: () => {
      document
        .querySelector(tabSelector)
        ?.removeAttribute("data-tour-active");
    },
  };
}

export function getTourSteps(
  t: TFunction,
  callbacks?: TourStepCallbacks,
  flags?: TourStepFlags,
): Step[] {
  const { canCreate = true, showLibrary = true, showSettings = true, showMenu = true } =
    flags ?? {};

  return [
    // My Forms
    navSectionStep(
      "my-forms",
      t("Common:MyForms"),
      t(
        "Common:TourMyForms",
        "This is your main workspace. All your PDF forms are stored here. Upload new forms or create them from scratch.",
      ),
      showMenu,
      callbacks,
    ),
    // Plus button — only with Create permission
    canCreate && {
      target: '[data-testid="plus-button"]',
      content: t(
        "Common:TourPlusButton",
        "Use this button to upload existing PDF forms or create new ones from scratch.",
      ),
      title: t("Common:TourPlusButtonTitle", "Add forms"),
      data: { page: "/forms/my-forms" } satisfies TourStepData,
      skipBeacon: true,
    },
    // Context menu — Ask from DB — only with Create permission
    canCreate &&
      contextMenuStep(
        "option_ask-from-db",
        t("Common:TourCtxAskFromDBTitle", "Ask from DB"),
        t(
          "Common:TourCtxAskFromDB",
          "Chat with the AI agent about this form using data from a connected database.",
        ),
        "/forms/my-forms",
        callbacks,
      ),
    // In Progress
    navSectionStep(
      "in-progress",
      t("Common:InProgress"),
      t(
        "Common:TourInProgress",
        "Each folder corresponds to a specific form and contains draft files from people who started filling but haven't submitted yet.",
      ),
      showMenu,
      callbacks,
    ),
    // Completed Forms
    navSectionStep(
      "completed-forms",
      t("Common:CompletedForms"),
      t(
        "Common:TourCompletedForms",
        "Each folder contains all submitted copies of a specific form, organized by submission.",
      ),
      showMenu,
      callbacks,
    ),
    // Inside completed folder + AI Chat
    {
      target: '[data-tour="forms-grid"]',
      content: t(
        "Common:TourCompletedFolder",
        "Each completed file is named with a number, the submitter's name, and the submission date. Use the AI Chat button to ask questions or get summaries about submissions.",
      ),
      title: t("Common:TourCompletedFolderTitle", "Completed submissions"),
      data: {
        page: "/forms/completed-forms",
        openCompletedFolder: true,
      } satisfies TourStepData,
      skipBeacon: true,
      before: async () => {
        callbacks?.openCompletedFolder();
        await waitForElement('[data-tour="forms-grid"]');
      },
    },
    // Library — only if visible
    showLibrary &&
      navSectionStep(
        "library",
        t("Common:Library"),
        t(
          "Common:TourLibrary",
          "Browse ready-made form templates. Pick a template to quickly create a new form without starting from scratch.",
        ),
        showMenu,
        callbacks,
      ),
    // Settings — Billing — only for Owner/Admin
    showSettings &&
      settingsStep(
        "billing",
        t("Common:Billing", "Billing"),
        t(
          "Common:TourBilling",
          "Manage your subscription plan and payment details for this forms room.",
        ),
        callbacks,
      ),
    // Settings — AI Agent — only for Owner/Admin
    showSettings &&
      settingsStep(
        "ai-agent",
        t("Common:AIAgent"),
        t(
          "Common:TourAiAgent",
          "Enable the AI agent to automatically process submitted forms, extract data, and assist with form review.",
        ),
        callbacks,
      ),
    // Settings — Access — only for Owner/Admin
    showSettings &&
      settingsStep(
        "access",
        t("Common:AccessSettings", "Access Settings"),
        t(
          "Common:TourAccess",
          "Manage who can access this forms room. Add Form Admins and Form Managers to control permissions.",
        ),
        callbacks,
      ),
    // Settings — Collect Data — only for Owner/Admin
    showSettings &&
      settingsStep(
        "collect-data",
        t("Common:CollectData"),
        t(
          "Common:TourCollectData",
          "Set up automatic data collection from completed forms. Export results to XLSX or connect a MySQL database.",
        ),
        callbacks,
      ),
  ].filter(Boolean) as Step[];
}
