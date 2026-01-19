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

import unionBy from "lodash/unionBy";
import isString from "lodash/isString";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getTags, editRoom, updateTagName } from "../../../api/rooms";

import type { TagType } from "../../tag/Tag.types";
import type { TTag, UpdateTagNameParams } from "../TagSelector.types";

export const TAGS_QUERY_KEY = ["tags"];

export function useTagsQuery(roomTags: Array<TagType | string>) {
  return useQuery({
    queryKey: TAGS_QUERY_KEY,
    queryFn: getTags,
    refetchOnMount: true,
    select(data) {
      const temp = roomTags
        .filter((tag) => isString(tag) || !tag.isDefault)
        .map((tag) => ({
          name: isString(tag) ? tag : tag.label,
          checked: true,
        }));

      if (!data) return temp;

      return unionBy(
        temp,
        data.map((tag) => ({ name: tag, checked: false })),
        "name",
      );
    },
  });
}

export function useUpdateRoomTagsMutation(roomId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tags: string[]) => editRoom(roomId, { tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
    },
  });
}

export function useUpdateTagNameMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ oldName, newName }: UpdateTagNameParams) =>
      updateTagName(oldName, newName),

    onMutate: async ({ oldName, newName }: UpdateTagNameParams) => {
      console.log({ oldName, newName });
      await queryClient.cancelQueries({ queryKey: TAGS_QUERY_KEY });

      const previousData: TTag[] | undefined =
        queryClient.getQueryData(TAGS_QUERY_KEY);

      const optimisticTags = previousData?.map((tag) =>
        tag.name === oldName ? { ...tag, name: newName } : tag,
      );

      console.log({ previousData, optimisticTags });

      queryClient.setQueryData(TAGS_QUERY_KEY, optimisticTags);

      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(TAGS_QUERY_KEY, context?.previousData);
    },
  });
}
