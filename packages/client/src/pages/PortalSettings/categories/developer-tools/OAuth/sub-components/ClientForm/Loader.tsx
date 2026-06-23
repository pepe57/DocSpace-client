/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";

import { RectangleSkeleton } from "@docspace/ui-kit/components/rectangle";
import { DeviceType } from "@docspace/shared/enums";

import {
	StyledBlock,
	StyledButtonContainer,
	StyledCheckboxGroup,
	StyledContainer,
	StyledHeaderRow,
	StyledInputBlock,
	StyledInputGroup,
	StyledInputRow,
	StyledScopesCheckbox,
	StyledScopesContainer,
	StyledScopesName,
} from "./ClientForm.styled";

const HelpButtonSkeleton = () => {
	return <RectangleSkeleton width="12px" height="12px" />;
};

const CheckboxSkeleton = ({ className }: { className?: string }) => {
	return <RectangleSkeleton className={className} width="16px" height="16px" />;
};

const ClientFormLoader = ({
	currentDeviceType,
	isEdit,
}: {
	currentDeviceType?: DeviceType;
	isEdit: boolean;
}) => {
	const buttonHeight = currentDeviceType !== "desktop" ? "40px" : "32px";

	return (
		<StyledContainer>
			<StyledBlock>
				<StyledHeaderRow>
					<RectangleSkeleton width="78px" height="22px" />
				</StyledHeaderRow>
				<StyledInputBlock>
					<StyledInputGroup>
						<StyledHeaderRow>
							<RectangleSkeleton width="65px" height="20px" />
						</StyledHeaderRow>
						<StyledInputRow>
							<RectangleSkeleton width="100%" height="32px" />
						</StyledInputRow>
					</StyledInputGroup>
					<StyledInputGroup>
						<StyledHeaderRow>
							<RectangleSkeleton width="80px" height="20px" />
						</StyledHeaderRow>
						<StyledInputRow>
							<RectangleSkeleton width="100%" height="32px" />
						</StyledInputRow>
					</StyledInputGroup>
					<StyledInputGroup>
						<div className="label">
							<RectangleSkeleton width="60px" height="20px" />
						</div>
						<div className="select">
							<RectangleSkeleton width="32px" height="32px" />
							<RectangleSkeleton width="32px" height="32px" />
							<RectangleSkeleton width="109px" height="20px" />
						</div>
						<RectangleSkeleton width="130px" height="16px" />
					</StyledInputGroup>
					<StyledInputGroup>
						<StyledHeaderRow>
							<RectangleSkeleton width="75px" height="20px" />
						</StyledHeaderRow>
						<StyledInputRow>
							<RectangleSkeleton width="100%" height="60px" />
						</StyledInputRow>
					</StyledInputGroup>
					<StyledInputGroup>
						<StyledHeaderRow>
							<RectangleSkeleton width="75px" height="20px" />
						</StyledHeaderRow>
						<StyledCheckboxGroup>
							<CheckboxSkeleton />
							<RectangleSkeleton width="151px" height="18px" />
							<HelpButtonSkeleton />
						</StyledCheckboxGroup>
					</StyledInputGroup>
				</StyledInputBlock>
			</StyledBlock>
			{isEdit ? (
				<StyledBlock>
					<StyledHeaderRow>
						<RectangleSkeleton width="47px" height="22px" />
						<HelpButtonSkeleton />
					</StyledHeaderRow>
					<StyledInputBlock>
						<StyledInputGroup>
							<StyledHeaderRow>
								<RectangleSkeleton width="96px" height="20px" />
							</StyledHeaderRow>
							<StyledInputRow>
								<RectangleSkeleton width="100%" height="32px" />
							</StyledInputRow>
						</StyledInputGroup>
						<StyledInputGroup>
							<StyledHeaderRow>
								<RectangleSkeleton width="60px" height="20px" />
							</StyledHeaderRow>
							<StyledInputRow>
								<RectangleSkeleton
									className="loader"
									width="calc(100% - 91px)"
									height="32px"
								/>
								<RectangleSkeleton width="91px" height="32px" />
							</StyledInputRow>
						</StyledInputGroup>
					</StyledInputBlock>
				</StyledBlock>
			) : null}
			<StyledBlock>
				<StyledHeaderRow>
					<RectangleSkeleton width="96px" height="22px" />
				</StyledHeaderRow>
				<StyledInputBlock>
					<StyledInputGroup>
						<StyledHeaderRow>
							<RectangleSkeleton width="87px" height="20px" />
							<HelpButtonSkeleton />
						</StyledHeaderRow>
						<StyledInputRow>
							<RectangleSkeleton
								className="loader"
								width="calc(100% - 40px)"
								height="32px"
							/>
							<RectangleSkeleton width="32px" height="32px" />
						</StyledInputRow>
					</StyledInputGroup>
					<StyledInputGroup>
						<StyledHeaderRow>
							<RectangleSkeleton width="96px" height="20px" />
							<HelpButtonSkeleton />
						</StyledHeaderRow>
						<StyledInputRow>
							<RectangleSkeleton
								className="loader"
								width="calc(100% - 40px)"
								height="32px"
							/>
							<RectangleSkeleton width="32px" height="32px" />
						</StyledInputRow>
					</StyledInputGroup>
				</StyledInputBlock>
			</StyledBlock>
			<StyledScopesContainer>
				<StyledHeaderRow className="header">
					<RectangleSkeleton width="111px" height="22px" />
					<HelpButtonSkeleton />
				</StyledHeaderRow>
				<RectangleSkeleton className="header" width="34px" height="22px" />
				<RectangleSkeleton
					className="header header-last"
					width="37px"
					height="22px"
				/>
				<StyledScopesName>
					<RectangleSkeleton
						className="scope-name-loader"
						width="98px"
						height="16px"
					/>
					<RectangleSkeleton
						className="scope-desc-loader"
						width="200px"
						height="17px"
					/>
					<RectangleSkeleton
						className="scope-desc-loader"
						width="230px"
						height="17px"
					/>
				</StyledScopesName>
				<StyledScopesCheckbox>
					<CheckboxSkeleton className="checkbox-read" />
				</StyledScopesCheckbox>
				<StyledScopesCheckbox>
					<CheckboxSkeleton />
				</StyledScopesCheckbox>
				<StyledScopesName>
					<RectangleSkeleton
						className="scope-name-loader"
						width="98px"
						height="16px"
					/>
					<RectangleSkeleton
						className="scope-desc-loader"
						width="200px"
						height="17px"
					/>
					<RectangleSkeleton
						className="scope-desc-loader"
						width="230px"
						height="17px"
					/>
				</StyledScopesName>
				<StyledScopesCheckbox>
					<CheckboxSkeleton className="checkbox-read" />
				</StyledScopesCheckbox>
				<StyledScopesCheckbox>
					<CheckboxSkeleton />
				</StyledScopesCheckbox>
				<StyledScopesName>
					<RectangleSkeleton
						className="scope-name-loader"
						width="98px"
						height="16px"
					/>
					<RectangleSkeleton
						className="scope-desc-loader"
						width="200px"
						height="17px"
					/>
					<RectangleSkeleton
						className="scope-desc-loader"
						width="230px"
						height="17px"
					/>
				</StyledScopesName>
				<StyledScopesCheckbox>
					<CheckboxSkeleton className="checkbox-read" />
				</StyledScopesCheckbox>
				<StyledScopesCheckbox>
					<CheckboxSkeleton />
				</StyledScopesCheckbox>
				<StyledScopesName>
					<RectangleSkeleton
						className="scope-name-loader"
						width="98px"
						height="16px"
					/>
					<RectangleSkeleton
						className="scope-desc-loader"
						width="200px"
						height="17px"
					/>
					<RectangleSkeleton
						className="scope-desc-loader"
						width="230px"
						height="17px"
					/>
				</StyledScopesName>
				<StyledScopesCheckbox>
					<CheckboxSkeleton className="checkbox-read" />
				</StyledScopesCheckbox>
				<StyledScopesCheckbox>
					<CheckboxSkeleton />
				</StyledScopesCheckbox>{" "}
				<StyledScopesName>
					<RectangleSkeleton
						className="scope-name-loader"
						width="98px"
						height="16px"
					/>
					<RectangleSkeleton
						className="scope-desc-loader"
						width="200px"
						height="17px"
					/>
				</StyledScopesName>
				<StyledScopesCheckbox>
					<CheckboxSkeleton className="checkbox-read" />
				</StyledScopesCheckbox>
			</StyledScopesContainer>
			<StyledBlock>
				<StyledHeaderRow>
					<RectangleSkeleton width="162px" height="22px" />
				</StyledHeaderRow>
				<StyledInputBlock>
					<StyledInputGroup>
						<StyledHeaderRow>
							<RectangleSkeleton width="114px" height="20px" />
							<HelpButtonSkeleton />
						</StyledHeaderRow>
						<StyledInputRow>
							<RectangleSkeleton width="100%" height="32px" />
						</StyledInputRow>
					</StyledInputGroup>
					<StyledInputGroup>
						<StyledHeaderRow>
							<RectangleSkeleton width="96px" height="20px" />
							<HelpButtonSkeleton />
						</StyledHeaderRow>
						<StyledInputRow>
							<RectangleSkeleton width="100%" height="32px" />
						</StyledInputRow>
					</StyledInputGroup>
				</StyledInputBlock>
			</StyledBlock>
			<StyledButtonContainer>
				<RectangleSkeleton
					width={currentDeviceType === "desktop" ? "86px" : "100%"}
					height={buttonHeight}
				/>
				<RectangleSkeleton
					width={currentDeviceType === "desktop" ? "86px" : "100%"}
					height={buttonHeight}
				/>
			</StyledButtonContainer>
		</StyledContainer>
	);
};

export default ClientFormLoader;
