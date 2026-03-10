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
import { useTranslation } from "react-i18next";

import type { TFile, TFilesSettings } from "@docspace/shared/api/files/types";
import { useIsServer } from "@docspace/shared/hooks/useIsServer";
import { TileContainer } from "@docspace/ui-kit/components/tiles/tile-container";

import useItemIcon from "@/app/(docspace)/_hooks/useItemIcon";
import useItemList from "@/app/(docspace)/_hooks/useItemList";
import InfiniteGrid from "@/app/(docspace)/(files)/_components/tile-view/sub-components/infinite-grid/InfiniteGrid";

import { useFormsListStore } from "../../_store/FormsListStore";
import FormsEmpty from "../forms-empty";
import FormsTile from "./FormsTile";

type FormsGridProps = {
  filesSettings: TFilesSettings;
  fetchMore: () => Promise<void>;
};

const FormsGrid = ({ filesSettings, fetchMore }: FormsGridProps) => {
  const { t } = useTranslation();
  const isServer = useIsServer();
  const { items, hasMore, isLoading } = useFormsListStore();
  const { getIcon } = useItemIcon({ filesSettings });
  const { convertFileToItem } = useItemList({
    getIcon,
  });

  const fileItems = React.useMemo(
    () => items.map((file: TFile) => convertFileToItem(file)),
    [items, convertFileToItem],
  );

  if (isLoading && items.length === 0) {
    return null;
  }

  if (items.length === 0) {
    return <FormsEmpty />;
  }

  return (
    <TileContainer
      className="tile-container"
      useReactWindow={!isServer}
      infiniteGrid={({ children }) => (
        <InfiniteGrid
          fetchMoreFiles={fetchMore}
          hasMoreFiles={hasMore}
          currentFolderId=""
          filesLength={fileItems.length}
        >
          {children}
        </InfiniteGrid>
      )}
      headingFolders={t("Common:Folders")}
      headingFiles={t("Common:Files")}
    >
      {fileItems.map((item) => (
        <FormsTile
          key={`file_${item.id}`}
          item={item}
          getIcon={getIcon}
        />
      ))}
    </TileContainer>
  );
};

export default observer(FormsGrid);
