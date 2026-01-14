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

<<<<<<< HEAD:packages/shared/__mocks__/handlers/index.ts
import { settingsHandlers } from "./settings";
import { capabilitiesHandlers } from "./capabilities";
import { peopleHandlers } from "./people";
import { oauthHandlers } from "./oauth";
import { authenticationHandlers } from "./authentication";
import { portalHandlers } from "./portal";
import { filesHandlers } from "./files";
import { staticsHandlers } from "./statics";
import { aiHandlers } from "./ai";
import { roomsHandlers } from "./rooms";
import { shareHandlers } from "./share";
=======
export {
  thirdPartyProvider as thirdPartyProviderHandler,
  successThirdpartyProviders,
  PATH as THIRD_PARTY_PROVIDER_PATH,
} from "./thirdPartyProviders";
>>>>>>> develop:packages/shared/__mocks__/e2e/handlers/people/index.ts

export * from "./settings";
export * from "./capabilities";
export * from "./people";
export * from "./oauth";
export * from "./authentication";
export * from "./portal";
export * from "./files";
export * from "./statics";
export * from "./ai";
export * from "./rooms";
export * from "./share";

<<<<<<< HEAD:packages/shared/__mocks__/handlers/index.ts
export const allHandlers = (port: string) => [
  ...settingsHandlers(port),
  ...capabilitiesHandlers(port),
  ...peopleHandlers(port),
  ...oauthHandlers(port),
  ...authenticationHandlers(port),
  ...portalHandlers(port),
  ...filesHandlers(port),
  ...staticsHandlers(port),
  ...aiHandlers(port),
  ...roomsHandlers(port),
  ...shareHandlers(port),
];
=======
export {
  PATH as SELF_PATH,
  PATH_CHANGE_AUTH_DATA as SELF_PATH_CHANGE_AUTH_DATA,
  PATH_ACTIVATION_STATUS as SELF_PATH_ACTIVATION_STATUS,
  PATH_UPDATE_USER as SELF_PATH_UPDATE_USER,
  PATH_DELETE_USER as SELF_PATH_DELETE_USER,
  PATH_USER_BY_EMAIL as SELF_PATH_USER_BY_EMAIL,
  PATH_ADD_GUEST,
  PATH_UPDATE_USER_CULTURE as SELF_PATH_UPDATE_USER_CULTURE,
} from "./self";

export {
  peopleListHandler,
  peopleListAccessDeniedHandler,
  PATH_PEOPLE_LIST,
  mockUsers,
  peopleListSuccess,
} from "./list";

export * from "./theme";
>>>>>>> develop:packages/shared/__mocks__/e2e/handlers/people/index.ts
