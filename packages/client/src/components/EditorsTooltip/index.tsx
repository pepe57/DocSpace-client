import React, { useMemo, useState, useEffect, useRef } from "react";
import { Tooltip } from "@docspace/shared/components/tooltip";
import { Scrollbar } from "@docspace/shared/components/scrollbar";
import {
  Avatar,
  AvatarSize,
  AvatarRole,
} from "@docspace/shared/components/avatar";
import { getUserPhoto } from "@docspace/shared/api/people";
import DefaultUserAvatarSmall from "PUBLIC_DIR/images/default_user_photo_size_32-32.png";

import styles from "./EditorsTooltip.module.scss";
import type {
  UserPhoto,
  EditorUser,
  EditorsTooltipProps,
} from "./EditorsTooltip.types";

const createEditorsArray = (
  activeEditors: Record<string, string> | undefined,
  editingBy: Record<string, string> | undefined,
  currentUserId?: string,
): EditorUser[] => {
  const currentEditingBy = activeEditors || editingBy;

  if (!currentEditingBy) return [];

  return Object.entries(currentEditingBy).map(([id, name]) => ({
    id,
    name: currentUserId && id === currentUserId ? "Me" : name,
    photo: null,
  }));
};

const generateFakeUsers = (count: number): EditorUser[] => {
  const fakeNames = [
    "John Smith",
    "Emma Johnson",
    "Michael Brown",
    "Sophia Davis",
    "William Wilson",
    "Olivia Martinez",
    "James Anderson",
    "Isabella Taylor",
    "Robert Thomas",
    "Mia Garcia",
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `fake-user-${index}`,
    name: fakeNames[index] || `User ${index + 1}`,
    photo: null,
  }));
};

const loadEditorsPhotos = async (
  editors: EditorUser[],
): Promise<EditorUser[]> => {
  if (editors.length === 0) return editors;

  const editorsNeedingPhotos = editors.filter(
    (editor) => editor.photo === null,
  );

  if (editorsNeedingPhotos.length === 0) return editors;

  try {
    const photoResults = await Promise.allSettled(
      editorsNeedingPhotos.map((editor) => getUserPhoto(editor.id)),
    );

    const photoMap = new Map<string, UserPhoto>();
    editorsNeedingPhotos.forEach((editor, index) => {
      const result = photoResults[index];
      if (result.status === "fulfilled") {
        photoMap.set(editor.id, result.value as UserPhoto);
      }
    });

    const editorsWithPhotos = editors.map((editor) => {
      if (editor.photo !== null) return editor;

      return {
        ...editor,
        photo: photoMap.get(editor.id) || null,
      };
    });

    const fakeUsers = generateFakeUsers(10);
    return [...editorsWithPhotos, ...fakeUsers];
  } catch (e) {
    console.error("Failed to load editors photos:", e);
    return editors;
  }
};

const EditorsTooltip = ({ item, currentUserId }: EditorsTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const photosLoadedRef = useRef(false);

  const { editingBy, activeEditors } = item;

  const [editors, setEditors] = useState<EditorUser[]>(() =>
    createEditorsArray(activeEditors, editingBy),
  );

  useEffect(() => {
    setEditors(createEditorsArray(activeEditors, editingBy, currentUserId));
    photosLoadedRef.current = false;
  }, [editingBy, activeEditors, currentUserId]);

  useEffect(() => {
    if (isOpen && editors.length > 0 && !photosLoadedRef.current) {
      photosLoadedRef.current = true;
      loadEditorsPhotos(editors).then((editorsWithLoadedPhotos) => {
        setEditors(editorsWithLoadedPhotos);
      });
    }

    if (!isOpen) {
      photosLoadedRef.current = false;
    }
  }, [isOpen, editors]);

  const calculateTextWidth = (text: string, font: string): number => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return 0;
    context.font = font;
    return context.measureText(text).width;
  };

  const containerDimensions = useMemo(() => {
    if (editors.length === 0) return { width: 200, height: 0 };

    const font = "600 12px sans-serif"; // font-weight: 600, font-size: 12px
    const longestName = editors.reduce(
      (longest, editor) =>
        editor.name.length > longest.length ? editor.name : longest,
      "",
    );

    const textWidth = calculateTextWidth(longestName, font);
    // 24px (avatar) + 8px (gap) + textWidth + 12px (padding left)
    const calculatedWidth = Math.ceil(24 + 8 + textWidth + 12);
    const width = Math.max(200, Math.min(calculatedWidth, 400)); // min 200px, max 400px

    // 24px (header) + 12px (margin-bottom) + (24px * editors.length) + (8px * (editors.length - 1)) gaps
    const headerHeight = 24 + 12;
    const itemsHeight =
      editors.length * 24 + Math.max(0, editors.length - 1) * 8;
    const calculatedHeight = headerHeight + itemsHeight;
    const height = Math.min(calculatedHeight, 176); // max 176px

    return { width, height };
  }, [editors]);

  const renderTooltipContent = () => {
    if (editors.length === 0) return null;

    return (
      <div
        className={styles.tooltipContainer}
        style={{
          width: `${containerDimensions.width}px`,
          height: `${containerDimensions.height}px`,
          minWidth: "200px",
        }}
      >
        <Scrollbar>
          <div className={styles.tooltipHeader}>
            File is currently edited by:
          </div>
          <div className={styles.editorsList}>
            {editors.map((editor) => (
              <div key={editor.id} className={styles.editorItem}>
                <Avatar
                  size={AvatarSize.extraSmall}
                  userName={editor.name}
                  source={editor.photo?.big || DefaultUserAvatarSmall}
                  className={styles.editorAvatar}
                  role={AvatarRole.user}
                />
                <span className={styles.editorName}>{editor.name}</span>
              </div>
            ))}
          </div>
        </Scrollbar>
      </div>
    );
  };

  return (
    <div data-tooltip-id="editors-tooltip">
      <Tooltip
        tooltipStyle={{
          padding: "12px",
          paddingRight: "0px",
          maxWidth: "fit-content",
        }}
        id="editors-tooltip"
        getContent={renderTooltipContent}
        place="bottom-start"
        offset={10}
        clickable={true}
        openOnClick={true}
        afterShow={() => setIsOpen(true)}
        afterHide={() => setIsOpen(false)}
      />
    </div>
  );
};

export default EditorsTooltip;
