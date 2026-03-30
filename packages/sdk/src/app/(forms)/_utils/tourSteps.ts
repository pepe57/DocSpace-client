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

function simulateClick(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
    button: 0,
    view: window,
  });
  el.dispatchEvent(event);
}

function openPlusMenu(): Promise<void> {
  if (document.querySelector("#upload-forms")) return Promise.resolve();

  const iconBtn = document.querySelector(
    '[data-testid="plus-button"] [data-testid="icon-button"]',
  ) as HTMLElement | null;

  if (iconBtn) {
    simulateClick(iconBtn);
  }

  return waitForElement("#upload-forms", 3000)
    .then(() => {})
    .catch(() => {});
}

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
): Step {
  return {
    target: `#${targetId}`,
    content,
    title,
    data: { page } satisfies TourStepData,
    skipBeacon: true,
    before: async () => {
      if (!document.querySelector(`#${targetId}`)) {
        await openContextMenu();
      }
      await waitForElement(`#${targetId}`, 3000).catch(() => {});
    },
  };
}

export function getTourSteps(t: TFunction, callbacks?: TourStepCallbacks): Step[] {
  return [
    // 1. My Forms sidebar
    {
      target: "#forms-nav-my-forms",
      content: t(
        "Common:TourMyForms",
        "This is your main workspace. All your PDF forms are stored here. Upload new forms or create them from scratch.",
      ),
      title: t("Common:MyForms"),
      data: { page: "/forms/my-forms" } satisfies TourStepData,
      skipBeacon: true,
    },
    // 2. Plus button
    {
      target: '[data-testid="plus-button"]',
      content: t(
        "Common:TourPlusButton",
        "Use this button to upload existing PDF forms or create new ones from scratch.",
      ),
      title: t("Common:TourPlusButtonTitle", "Add forms"),
      data: { page: "/forms/my-forms" } satisfies TourStepData,
      skipBeacon: true,
    },
    // 3. Plus menu — Upload
    {
      target: "#upload-forms",
      content: t(
        "Common:TourUploadForms",
        "Upload PDF forms from your device to start collecting data right away.",
      ),
      title: t("Common:UploadPDFForm", "Upload PDF form"),
      data: { page: "/forms/my-forms" } satisfies TourStepData,
      skipBeacon: true,
      before: () => openPlusMenu(),
    },
    // 4. Plus menu — Create blank form
    {
      target: "#create-blank-form",
      content: t(
        "Common:TourCreateForm",
        "Create a new blank PDF form and design it with the built-in editor.",
      ),
      title: t("Common:NewPDFForm", "New PDF form"),
      data: { page: "/forms/my-forms" } satisfies TourStepData,
      skipBeacon: true,
      before: () => openPlusMenu(),
    },
    // 5. Forms grid
    {
      target: '[data-tour="forms-grid"]',
      content: t(
        "Common:TourFormsGrid",
        "Your forms appear here as cards. Click on a form to open it for editing or filling.",
      ),
      title: t("Common:TourFormsGridTitle", "Forms overview"),
      data: { page: "/forms/my-forms" } satisfies TourStepData,
      skipBeacon: true,
      before: () => waitForElement('[data-tour="forms-grid"]').then(() => {}),
    },
    // 6. Context menu — Edit
    contextMenuStep(
      "option_edit",
      t("Common:EditButton", "Edit"),
      t(
        "Common:TourCtxEdit",
        "Open the form in the editor to modify fields, layout, and structure.",
      ),
      "/forms/my-forms",
    ),
    // Context menu — Fill Form
    contextMenuStep(
      "option_fill-form",
      t("Common:TourCtxFillTitle", "Fill Form"),
      t(
        "Common:TourCtxFill",
        "Open the form to fill it out. Completed data will be saved automatically.",
      ),
      "/forms/my-forms",
    ),
    // Context menu — Ask from DB
    contextMenuStep(
      "option_ask-from-db",
      t("Common:TourCtxAskFromDBTitle", "Ask from DB"),
      t(
        "Common:TourCtxAskFromDB",
        "Chat with the AI agent about this form using data from a connected database.",
      ),
      "/forms/my-forms",
    ),
    // Context menu — Start Filling
    contextMenuStep(
      "option_start-filling",
      t("Common:TourCtxStartFillingTitle", "Start Filling"),
      t(
        "Common:TourCtxStartFilling",
        "Distribute the form to assigned users so they can begin filling it out.",
      ),
      "/forms/my-forms",
    ),
    // Context menu — Reset Filling
    contextMenuStep(
      "option_reset-filling",
      t("Common:TourCtxResetFillingTitle", "Reset Filling"),
      t(
        "Common:TourCtxResetFilling",
        "Clear all current submissions and reassign the form for a fresh round of filling.",
      ),
      "/forms/my-forms",
    ),
    // Context menu — View
    contextMenuStep(
      "option_view",
      t("Common:TourCtxViewTitle", "View"),
      t(
        "Common:TourCtxView",
        "Preview the form in read-only mode without making any changes.",
      ),
      "/forms/my-forms",
    ),
    // Context menu — Download
    contextMenuStep(
      "option_download",
      t("Common:Download", "Download"),
      t(
        "Common:TourCtxDownload",
        "Download the form as a PDF file to your device.",
      ),
      "/forms/my-forms",
    ),
    // Context menu — Delete
    contextMenuStep(
      "option_delete",
      t("Common:Delete", "Delete"),
      t(
        "Common:TourCtxDelete",
        "Remove the form from your workspace.",
      ),
      "/forms/my-forms",
    ),
    // In Progress sidebar
    {
      target: "#forms-nav-in-progress",
      content: t(
        "Common:TourInProgress",
        "Each folder corresponds to a specific form and contains draft files from people who started filling but haven't submitted yet.",
      ),
      title: t("Common:InProgress"),
      data: { page: "/forms/in-progress" } satisfies TourStepData,
      skipBeacon: true,
    },
    // Completed Forms sidebar
    {
      target: "#forms-nav-completed-forms",
      content: t(
        "Common:TourCompletedForms",
        "Each folder contains all submitted copies of a specific form, organized by submission.",
      ),
      title: t("Common:CompletedForms"),
      data: { page: "/forms/completed-forms" } satisfies TourStepData,
      skipBeacon: true,
    },
    // Inside completed folder
    {
      target: '[data-tour="forms-grid"]',
      content: t(
        "Common:TourCompletedFolder",
        "Each completed file is named with a number, the submitter's name, and the submission date. You can view or download any submission.",
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
    // AI Chat button
    {
      target: '[data-tour="ai-chat-button"]',
      content: t(
        "Common:TourAiChat",
        "Chat with the AI agent about completed submissions in this folder. Ask questions, get summaries, or request analysis.",
      ),
      title: t("Common:TourAiChatTitle", "AI Chat"),
      data: {
        page: "/forms/completed-forms",
        openCompletedFolder: true,
      } satisfies TourStepData,
      skipBeacon: true,
      before: async () => {
        callbacks?.openCompletedFolder();
        await waitForElement('[data-tour="ai-chat-button"]');
      },
    },
    // Settings sidebar
    {
      target: "#forms-nav-settings",
      content: t(
        "Common:TourSettings",
        "Configure billing, access permissions, AI agent, and data collection for your forms room.",
      ),
      title: t("Common:Settings"),
      data: { page: "/forms/settings/billing" } satisfies TourStepData,
      skipBeacon: true,
    },
    // Settings — Billing
    {
      target: '[data-tour="settings-billing"]',
      content: t(
        "Common:TourBilling",
        "Manage your subscription plan and payment details for this forms room.",
      ),
      title: "Billing",
      data: { page: "/forms/settings/billing" } satisfies TourStepData,
      skipBeacon: true,
      before: async () => {
        callbacks?.navigate("/forms/settings/billing");
        await waitForElement('[data-tour="settings-billing"]');
      },
    },
    // Settings — AI Agent
    {
      target: '[data-tour="settings-ai-agent"]',
      content: t(
        "Common:TourAiAgent",
        "Enable the AI agent to automatically process submitted forms, extract data, and assist with form review.",
      ),
      title: t("Common:AIAgent"),
      data: { page: "/forms/settings/ai-agent" } satisfies TourStepData,
      skipBeacon: true,
      before: async () => {
        callbacks?.navigate("/forms/settings/ai-agent");
        await waitForElement('[data-tour="settings-ai-agent"]');
      },
    },
    // Settings — Access
    {
      target: '[data-tour="settings-access"]',
      content: t(
        "Common:TourAccess",
        "Manage who can access this forms room. Add Form Admins and Form Managers to control permissions.",
      ),
      title: t("Common:AccessSettings", "Access Settings"),
      data: { page: "/forms/settings/access" } satisfies TourStepData,
      skipBeacon: true,
      before: async () => {
        callbacks?.navigate("/forms/settings/access");
        await waitForElement('[data-tour="settings-access"]');
      },
    },
    // Settings — Collect Data
    {
      target: '[data-tour="settings-collect-data"]',
      content: t(
        "Common:TourCollectData",
        "Set up automatic data collection from completed forms. Export results to XLSX or connect a MySQL database.",
      ),
      title: t("Common:CollectData"),
      data: { page: "/forms/settings/collect-data" } satisfies TourStepData,
      skipBeacon: true,
      before: async () => {
        callbacks?.navigate("/forms/settings/collect-data");
        await waitForElement('[data-tour="settings-collect-data"]');
      },
    },
  ];
}
