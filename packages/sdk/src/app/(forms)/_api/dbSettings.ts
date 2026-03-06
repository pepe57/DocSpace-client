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

import { request } from "@docspace/shared/api/client";

type DbFormData = {
  databaseType: string;
  host: string;
  port: string;
  databaseName: string;
  user: string;
  password: string;
  useSsl: boolean;
};

type ConsumerProp = { name: string; value: string };
type Consumer = { name: string; props: ConsumerProp[] };

export const saveDbConfig = (form: DbFormData) => {
  const props = [
    { name: "databaseType", value: form.databaseType.toLowerCase() },
    { name: "dbHost", value: form.host },
    { name: "dbPort", value: form.port },
    { name: "dbName", value: form.databaseName },
    { name: "dbUser", value: form.user },
    { name: "dbPassword", value: form.password },
    { name: "dbSsl", value: String(form.useSsl) },
  ];

  return request<boolean>({
    method: "post",
    url: "/settings/authservice",
    data: { name: "externaldb", props },
  });
};

export const testDbConnection = (form: DbFormData) => {
  return request<boolean>({
    method: "post",
    url: "/settings/authservice/externaldb/test",
    data: {
      databaseType: form.databaseType.toLowerCase(),
      host: form.host,
      port: Number(form.port),
      databaseName: form.databaseName,
      user: form.user,
      password: form.password,
      useSsl: form.useSsl,
    },
  });
};

export const setRoomExternalDb = (
  roomId: string | number,
  enabled: boolean,
) => {
  return request({
    method: "put",
    url: `/files/rooms/${roomId}`,
    data: { SendFormToExternalDB: enabled },
  });
};

export const loadRoomExternalDb = async (
  roomId: string | number,
): Promise<boolean> => {
  const room = await request<{ sendFormToExternalDB?: boolean }>({
    method: "get",
    url: `/files/rooms/${roomId}`,
  });

  return room?.sendFormToExternalDB ?? false;
};

export const loadDbConfig = async (): Promise<ConsumerProp[] | null> => {
  const consumers = await request<Consumer[]>({
    method: "get",
    url: "/settings/authservice",
  });

  if (!consumers) return null;

  const externalDb = consumers.find((c) => c.name === "externaldb");
  return externalDb?.props ?? null;
};
