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

import React, { useCallback, useMemo, useState } from "react";

import CheckIconURL from "PUBLIC_DIR/images/check.edit.react.svg?url";
import TrashReactSvgUrl from "PUBLIC_DIR/images/icons/16/trash.react.svg?url";
import AccessEditReactSvgUrl from "PUBLIC_DIR/images/access.edit.react.svg?url";
import CrossIconReactSvgUrl from "PUBLIC_DIR/images/icons/12/cross.react.svg?url";

import { useIsMobile } from "../../hooks/useIsMobile";

import { Tag } from "../tag";
import { toastr } from "../toast";
import { Checkbox } from "../checkbox";
import { Scrollbar } from "../scrollbar";
import { IconButton } from "../icon-button";
import { InputSize, InputType, TextInput } from "../text-input";

import { useTagSelector } from "./TagSelector.provider";
import {
  useUpdateRoomTagsMutation,
  useUpdateTagNameMutation,
} from "./hooks/useTagsQuery";
import styles from "./TagSelector.module.scss";
import {
  ROW_HEIGHT,
  ICON_SIZE,
  MAX_BODY_HEIGHT,
  MARGIN_BOTTOM,
} from "./TagSelector.constants";
import type { TagSelectorContentProps } from "./TagSelector.types";

export const TagSelectorContent: React.FC<TagSelectorContentProps> = ({
  onSelectTag,
  roomId,
}) => {
  const isMobile = useIsMobile();
  const { filteredTags, tags, setTags } = useTagSelector();
  const updateRoomTags = useUpdateRoomTagsMutation(roomId);
  const updateTagName = useUpdateTagNameMutation();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const toggleChecked = useCallback(
    (index: string) => {
      const updatedTags = [...tags];
      const tagIndex = updatedTags.findIndex((tag) => tag.label === index);

      if (tagIndex === -1) return;

      updatedTags[tagIndex].checked = !updatedTags[tagIndex].checked;

      updateRoomTags.mutate(updatedTags, {
        onSuccess: () => {
          setTags(updatedTags);
        },
        onError: (error) => {
          toastr.error(error);
          console.error("Failed to update room tags:", error);
        },
      });
    },
    [tags, updateRoomTags],
  );

  const handleEdit = useCallback(
    (index: number) => {
      setEditingIndex(index);
      setEditValue(tags[index].label);
    },
    [tags],
  );

  const confirmEdit = useCallback(async () => {
    if (editingIndex === null) return;

    const newLabel = editValue.trim();
    const oldLabel = tags[editingIndex].label;

    setEditingIndex(null);
    setEditValue("");

    updateTagName.mutate(
      { oldLabel, newLabel },
      {
        onSuccess: () => {
          setTags((prev) =>
            prev.map((tag) =>
              tag.label === oldLabel ? { ...tag, label: newLabel } : tag,
            ),
          );
        },
        onError: (error) => {
          console.error("Failed to update tag name:", error);
          toastr.error(error);
        },
      },
    );
  }, [editingIndex, editValue, tags, updateRoomTags]);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditValue("");
  }, []);

  const deleteTag = useCallback(
    async (tag: string) => {
      const updatedTags = [...tags];
      const tagIndex = updatedTags.findIndex((t) => t.label === tag);

      if (tagIndex === -1) return;

      updatedTags.splice(tagIndex, 1);

      updateRoomTags.mutate(updatedTags, {
        onSuccess: () => {
          setTags(updatedTags);
        },
        onError: (error) => {
          toastr.error(error);
          console.error("Failed to remove room tag:", error);
        },
      });
    },
    [tags, updateRoomTags],
  );

  const editTagHandleKey = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case "Enter":
          confirmEdit();
          break;
        case "Escape":
          cancelEdit();
          break;
        default:
          break;
      }
    },
    [confirmEdit, cancelEdit],
  );

  const handleEditValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditValue(e.target.value);
    },
    [setEditValue],
  );

  const style = useMemo(() => {
    return {
      height: isMobile
        ? "100%"
        : Math.min(
            MAX_BODY_HEIGHT,
            filteredTags.length * ROW_HEIGHT + MARGIN_BOTTOM,
          ),
    };
  }, [isMobile, filteredTags.length]);

  console.log({ style, filteredTagsLength: filteredTags.length });

  return (
    <div className={styles.wrapperList} style={style}>
      <Scrollbar fixedSize className={styles.scrollbar}>
        {filteredTags.map((tag, index) => {
          return (
            <div key={tag.label} className={styles.row}>
              <Checkbox
                className={styles.checkbox}
                isChecked={tag.checked}
                onChange={() => toggleChecked(tag.label)}
              />
              {editingIndex === index ? (
                <>
                  <TextInput
                    scale
                    autoFocus
                    value={editValue}
                    size={InputSize.base}
                    type={InputType.text}
                    onKeyDown={editTagHandleKey}
                    className={styles.editInput}
                    onChange={handleEditValueChange}
                  />
                  <div className={styles.checkCross}>
                    <IconButton
                      size={ICON_SIZE}
                      className={styles.checkIcon}
                      iconName={CheckIconURL}
                      onClick={confirmEdit}
                    />
                    <IconButton
                      size={ICON_SIZE}
                      className={styles.crossIcon}
                      iconName={CrossIconReactSvgUrl}
                      onClick={cancelEdit}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Tag
                    className={styles.tag}
                    label={tag.label}
                    tag={tag.label}
                    onClick={onSelectTag}
                  />
                  <IconButton
                    size={ICON_SIZE}
                    className={styles.editIcon}
                    iconName={AccessEditReactSvgUrl}
                    onClick={() => handleEdit(index)}
                  />
                  <IconButton
                    size={ICON_SIZE}
                    iconName={TrashReactSvgUrl}
                    className={styles.deleteIcon}
                    onClick={() => deleteTag(tag.label)}
                  />
                </>
              )}
            </div>
          );
        })}
      </Scrollbar>
    </div>
  );
};
