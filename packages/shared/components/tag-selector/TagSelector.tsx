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

import { match } from "ts-pattern";
import { createPortal } from "react-dom";
import React, { useLayoutEffect, useRef } from "react";
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
} from "@floating-ui/dom";

import { useClickOutside } from "../../utils/useClickOutside";
import { useIsMobile } from "../../hooks/useIsMobile";

import { ModalDialog, ModalDialogType } from "../modal-dialog";

import { useTagsQuery } from "./hooks/useTagsQuery";

import { TagSelectorProvider } from "./TagSelector.provider";
import { TagSelectorFilter } from "./TagSelector.filter";
import { TagSelectorContent } from "./TagSelector.content";
import { TagSelectorLoader } from "./TagSelector.loader";
import type { TagSelectorProps } from "./TagSelector.types";

import styles from "./TagSelector.module.scss";

export const TagSelector: React.FC<TagSelectorProps> = ({
  roomId,
  onClose,
  reference,
  onSelectTag,
  tags: roomTags,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // const [roomTags] = useState(propsTags);

  const isMobile = useIsMobile();
  useClickOutside(isMobile ? modalRef : ref, onClose);

  const { data: fetchedTags, status } = useTagsQuery();

  useLayoutEffect(() => {
    if (!reference.current || !ref.current || isMobile) return;

    const cleanup = autoUpdate(reference.current, ref.current, () => {
      if (!reference.current || !ref.current || isMobile) return;

      computePosition(reference.current, ref.current, {
        placement: "bottom-start",
        strategy: "fixed",
        middleware: [
          offset(4),
          flip({
            fallbackAxisSideDirection: "end",
          }),
          shift(),
        ],
      }).then(({ x, y }) => {
        if (ref.current) {
          ref.current.style.left = `${x}px`;
          ref.current.style.top = `${y}px`;
        }
      });
    });

    return cleanup;
  }, [reference, reference.current, ref, isMobile]);

  const element = (
    <div
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      className={styles.tagSelector}
      ref={ref}
    >
      {match(status)
        .with("pending", () => <TagSelectorLoader />)
        .with("success", () => (
          <TagSelectorProvider
            fetchedTags={fetchedTags ?? []}
            roomTags={roomTags}
          >
            <TagSelectorFilter roomId={roomId} />
            <TagSelectorContent onSelectTag={onSelectTag} roomId={roomId} />
          </TagSelectorProvider>
        ))
        .with("error", () => <></>)
        .otherwise(() => (
          <></>
        ))}
    </div>
  );

  if (isMobile) {
    return (
      <ModalDialog visible autoMaxHeight displayType={ModalDialogType.modal}>
        <ModalDialog.Body className={styles.modalBody} ref={modalRef}>
          {element}
        </ModalDialog.Body>
      </ModalDialog>
    );
  }

  return createPortal(element, document.body);
};
