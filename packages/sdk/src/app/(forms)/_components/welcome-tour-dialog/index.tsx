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

import { useTranslation } from "react-i18next";

import { ModalDialog } from "@docspace/ui-kit/components/modal-dialog";
import { Button, ButtonSize } from "@docspace/ui-kit/components/button";
import { Text } from "@docspace/ui-kit/components/text";

import styles from "./WelcomeTourDialog.module.scss";

type WelcomeTourDialogProps = {
  visible: boolean;
  onStart: () => void;
  onSkip: () => void;
};

export default function WelcomeTourDialog({
  visible,
  onStart,
  onSkip,
}: WelcomeTourDialogProps) {
  const { t } = useTranslation(["Common"]);

  return (
    <ModalDialog visible={visible} onClose={onSkip} autoMaxHeight isLarge>
      <ModalDialog.Header>
        {t("Common:WelcomeToAIForms", "Welcome to AI Forms")}
      </ModalDialog.Header>
      <ModalDialog.Body>
        <div className={styles.body}>
          <Text className={styles.description}>
            {t(
              "Common:WelcomeDescription",
              "AI Forms helps you create, distribute, and collect form submissions — all in one place.",
            )}
          </Text>
          <ul className={styles.features}>
            <li>
              {t(
                "Common:WelcomeFeature1",
                "Create and manage PDF forms from templates or scratch",
              )}
            </li>
            <li>
              {t(
                "Common:WelcomeFeature2",
                "Track form progress and completed submissions",
              )}
            </li>
            <li>
              {t(
                "Common:WelcomeFeature3",
                "Use AI agent to automate form processing",
              )}
            </li>
            <li>
              {t(
                "Common:WelcomeFeature4",
                "Collect data and export results to a database",
              )}
            </li>
          </ul>
          <Text className={styles.question}>
            {t(
              "Common:WelcomeTourQuestion",
              "Would you like a quick tour of the interface?",
            )}
          </Text>
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          label={t("Common:WelcomeStart", "Start")}
          size={ButtonSize.normal}
          primary
          scale
          onClick={onStart}
        />
        <Button
          label={t("Common:Skip", "Skip")}
          size={ButtonSize.normal}
          scale
          onClick={onSkip}
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
}
