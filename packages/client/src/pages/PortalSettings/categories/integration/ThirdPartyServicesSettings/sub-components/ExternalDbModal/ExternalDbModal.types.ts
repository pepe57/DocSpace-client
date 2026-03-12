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

export type DatabaseType = "mysql" | "sqlite";

export type ConsumerPropNumber = {
  type: "number";
  value: number;
};

export interface ConsumerPropSelect {
  type: "select";
  value: string;
  options: string[];
}
export interface ConsumerPropText {
  type: "text";
  value: string;
}

export interface ConsumerPropPassword {
  type: "password";
  value: string;
}
export interface ConsumerPropToggle {
  type: "toggle";
  value: boolean;
}

export type BaseConsumerProp = {
  name: string;
  title: string;
  dependsOn?: string;
  dependsOnValue?: string;
};

export type ConsumerProp = BaseConsumerProp &
  (
    | ConsumerPropToggle
    | ConsumerPropSelect
    | ConsumerPropText
    | ConsumerPropPassword
    | ConsumerPropNumber
  );

export interface SelectedConsumer {
  name: string;
  title: string;
  description: string;
  instruction: string;
  canSet: boolean;
  paid: boolean;
  props: ConsumerProp[];
}

// Union type для формы с конкретными полями
export type ExternalDbFormData = {
  databaseType: "mysql" | "sqlite";
  host?: string;
  port?: string;
  databaseName?: string;
  user?: string;
  password?: string;
  useSsl?: boolean;
  sqliteFilePath?: string;
};

export interface SupportLinksProps {
  feedbackAndSupportUrl?: string;
  portalSettingsUrl?: string;
}

export interface ExternalDbModalProps extends SupportLinksProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Record<string, string | boolean>) => Promise<void>;
  selectedConsumer: SelectedConsumer;
  isLoading?: boolean;
  t: (key: string, options?: Record<string, unknown>) => string;
}

export interface TestConnectionResponse {
  success: boolean;
  message?: string;
}
