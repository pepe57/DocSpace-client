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

import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { DeviceType, FilterGroups } from "../../enums";
import GroupManagementIcon from "PUBLIC_DIR/images/group.management.svg?url";
import PlusIcon from "PUBLIC_DIR/images/icons/16/plus.svg?url";

import { TViewSelectorOption, ViewSelector } from "../view-selector";
import { Link, LinkType } from "../link";
import { SelectedItem } from "../selected-item";
import { IconButton } from "../icon-button";
import { TooltipContainer } from "../tooltip";
import { ComboBox, ComboBoxSize } from "../combobox";
import { DropDownItem } from "../drop-down-item";
import { Scrollbar } from "../scrollbar";
import { ContextMenu, ContextMenuRefType } from "../context-menu";
import { ContextMenuModel } from "../context-menu/ContextMenu.types";

import FilterButton from "./sub-components/FilterButton";
import SortButton from "./sub-components/SortButton";
import { isDesktop, isMobile } from "../../utils";
import useSearch from "./hooks/useSearch";

import styles from "./Filter.module.scss";
import { FilterProps, TItem, TRoomGroup } from "./Filter.types";
import {
  convertFilterDataToSelectedFilterValues,
  convertFilterDataToSelectedItems,
  replaceEqualFilterValuesWithPrev,
} from "./Filter.utils";

const getElementFullWidth = (element: HTMLElement | null): number => {
  if (!element) return 0;
  const style = window.getComputedStyle(element);
  const marginLeft = Number.parseFloat(style.marginLeft) || 0;
  const marginRight = Number.parseFloat(style.marginRight) || 0;
  return element.offsetWidth + marginLeft + marginRight;
};

const buildGroupIconDataUrl = (
  icon: TRoomGroup["icon"],
): string | undefined => {
  if (typeof icon !== "object" || icon === null) return undefined;
  return `data:image/svg+xml;utf8,${encodeURIComponent(icon.data.small)}`;
};

const FilterInput = React.memo(
  ({
    onFilter,
    getFilterData,
    getSelectedFilterData,
    onSort,
    getSortData,
    getSelectedSortData,
    view,
    viewAs,
    viewSelectorVisible,
    getViewSettingsData,
    onChangeViewAs,
    placeholder,
    onSearch,
    getSelectedInputValue,

    filterHeader,
    selectorLabel,
    clearAll,

    removeSelectedItem,

    isRooms,
    isContactsPage,
    isContactsPeoplePage,
    isContactsGroupsPage,
    isContactsInsideGroupPage,
    isContactsGuestsPage,
    isFlowsPage,
    isIndexing,
    isIndexEditingMode,
    isRecentFolder,

    filterTitle,
    sortByTitle,

    clearSearch,
    setClearSearch,

    onSortButtonClick,
    onClearFilter,
    currentDeviceType,
    userId,

    disableThirdParty,

    initSearchValue,
    initSelectedFilterData,
    setEditRoomGroupsDialogVisible,
    getAllRoomGroups,
    roomGroups,
    onFilterByGroup,
    currentGroupId,
    isRoomsFolder,
    organizeRoomsGrouping,
    isFilterOrSearchActive,
  }: FilterProps) => {
    const { searchComponent } = useSearch({
      onSearch,
      onClearFilter,
      clearSearch,
      setClearSearch,
      getSelectedInputValue,
      placeholder,
      isIndexEditingMode,
      initSearchValue,
    });

    const [viewSettings, setViewSettings] = React.useState<
      TViewSelectorOption[]
    >(getViewSettingsData());
    const [selectedFilterValue, setSelectedFilterValue] = React.useState<
      Map<FilterGroups, Map<string | number, TItem>>
    >(() =>
      initSelectedFilterData
        ? convertFilterDataToSelectedFilterValues(initSelectedFilterData)
        : new Map(),
    );
    const [selectedItems, setSelectedItems] = React.useState<TItem[]>(() =>
      initSelectedFilterData
        ? convertFilterDataToSelectedItems(initSelectedFilterData)
        : [],
    );
    const currentSelectedFilterDataRef = React.useRef<TItem[] | null>(
      initSelectedFilterData || null,
    );

    const { t } = useTranslation([
      "Common",
      "GroupingRooms",
      "PeopleTranslations",
    ]);

    const [isRoomGroupsLoaded, setIsRoomGroupsLoaded] = React.useState(false);

    React.useEffect(() => {
      if (getAllRoomGroups && organizeRoomsGrouping) {
        getAllRoomGroups().finally(() => {
          setIsRoomGroupsLoaded(true);
        });
      } else if (!organizeRoomsGrouping) {
        // Reset loaded state when grouping is disabled
        setIsRoomGroupsLoaded(false);
      } else {
        setIsRoomGroupsLoaded(true);
      }
    }, [getAllRoomGroups, organizeRoomsGrouping]);

    const mountRef = React.useRef(true);

    const isFirstRenderRef = React.useRef(true);

    React.useEffect(() => {
      const value = getViewSettingsData?.();

      if (value) setViewSettings(value);
    }, [getViewSettingsData]);

    const getSelectedFilterDataAction = React.useCallback(async () => {
      const newSelectedFilterData = await getSelectedFilterData();
      const processedFilterData = replaceEqualFilterValuesWithPrev(
        currentSelectedFilterDataRef.current,
        newSelectedFilterData,
      );

      currentSelectedFilterDataRef.current = processedFilterData;

      if (!mountRef.current) return;

      const newSelectedValue =
        convertFilterDataToSelectedFilterValues(processedFilterData);
      const newSelectedItems =
        convertFilterDataToSelectedItems(processedFilterData);

      setSelectedFilterValue(newSelectedValue);
      setSelectedItems(newSelectedItems);
    }, [getSelectedFilterData]);

    React.useEffect(() => {
      if (isFirstRenderRef.current && currentSelectedFilterDataRef.current) {
        return;
      }

      getSelectedFilterDataAction();
    }, [getSelectedFilterDataAction]);

    const removeSelectedItemAction = React.useCallback(
      (
        key: string | number,
        label: string | React.ReactNode,
        group?: string | FilterGroups,
      ) => {
        const newItems = selectedItems
          .map((item) => ({ ...item }))
          .filter((item) => item.key !== key);

        setSelectedItems(newItems);

        const newGroup = group as FilterGroups;

        removeSelectedItem({ key, group: newGroup });
      },
      [selectedItems, removeSelectedItem],
    );

    const onCreateGroup = () => {
      setEditRoomGroupsDialogVisible?.(true);
    };

    React.useEffect(() => {
      mountRef.current = true;

      return () => {
        mountRef.current = false;
      };
    }, []);

    React.useEffect(() => {
      isFirstRenderRef.current = false;
    }, []);

    const showSortButton = !isIndexing && !isFlowsPage && !isRecentFolder;

    const showViewSelector =
      viewSelectorVisible &&
      viewSettings &&
      !isIndexing &&
      !isFlowsPage &&
      (isRecentFolder || currentDeviceType === DeviceType.desktop);

    // Overflow detection for room group tags
    const roomGroupsWithIcons = React.useMemo(
      () =>
        (roomGroups || []).filter(
          (g) => typeof g.icon === "object" && g.icon !== null,
        ) as TRoomGroup[],
      [roomGroups],
    );

    const rowRef = React.useRef<HTMLDivElement | null>(null);
    const allRoomsMeasureRef = React.useRef<HTMLDivElement | null>(null);
    const ellipsisMeasureRef = React.useRef<HTMLDivElement | null>(null);
    const groupMeasureRefs = React.useRef(
      new Map<string, React.RefObject<HTMLDivElement | null>>(),
    );
    // Cache group widths so we can use them when groups are in overflow
    const cachedGroupWidths = React.useRef(new Map<string, number>());
    // Track group that was manually moved from overflow - should stay visible
    const manuallyMovedGroupRef = React.useRef<string | null>(null);

    const [visibleGroupIds, setVisibleGroupIds] = React.useState<string[]>(() =>
      roomGroupsWithIcons.map((g) => g.id),
    );
    const [overflowGroups, setOverflowGroups] = React.useState<TRoomGroup[]>(
      [],
    );
    const [isRowReady, setIsRowReady] = React.useState(false);
    const hasEverBeenReadyRef = React.useRef(false);
    const [activeGroupId, setActiveGroupId] = React.useState<string | null>(
      currentGroupId != null ? String(currentGroupId) : null,
    );
    // Sync activeGroupId with currentGroupId from URL (page load, browser navigation)
    React.useEffect(() => {
      // Ensure groupId is stored as string for consistent comparison with group.id
      const normalizedGroupId =
        currentGroupId != null ? String(currentGroupId) : null;
      setActiveGroupId(normalizedGroupId);
    }, [currentGroupId]);

    // Clear selected group when filters/search become active
    React.useEffect(() => {
      if (isFilterOrSearchActive && activeGroupId !== null) {
        setActiveGroupId(null);
        onFilterByGroup?.(null);
      }
    }, [isFilterOrSearchActive]);

    const handleCreateGroupClick = React.useCallback(() => {
      setEditRoomGroupsDialogVisible?.(true, null, true);
    }, [setEditRoomGroupsDialogVisible]);

    // Show Create group button when no groups exist (grouping setting and rooms folder are checked in render)
    const showCreateGroupButton = roomGroupsWithIcons.length === 0;

    React.useEffect(() => {
      // Only reset if this is the first time we're setting up groups
      // After initial setup, just trigger recalculation without resetting state
      if (!hasEverBeenReadyRef.current) {
        setVisibleGroupIds(roomGroupsWithIcons.map((g) => g.id));
        setOverflowGroups([]);
      }
      setIsRowReady(false);
    }, [roomGroupsWithIcons]);

    const getGroupMeasureRef = React.useCallback((id: string) => {
      let ref = groupMeasureRefs.current.get(id);
      if (!ref) {
        ref = React.createRef<HTMLDivElement | null>();
        groupMeasureRefs.current.set(id, ref);
      }
      return ref;
    }, []);

    // Check if all group icons have been rendered by ReactSVG
    const areIconsReady = React.useCallback(() => {
      if (roomGroupsWithIcons.length === 0) return true;

      for (const group of roomGroupsWithIcons) {
        const ref = groupMeasureRefs.current.get(group.id);
        if (!ref?.current) return false;
        // ReactSVG injects an svg element when loaded
        const svg = ref.current.querySelector("svg");
        if (!svg) return false;
      }
      return true;
    }, [roomGroupsWithIcons]);

    const calculateOverflow = React.useCallback(() => {
      const row = rowRef.current;
      if (!row) return;

      const rowWidth = row.clientWidth;
      if (rowWidth <= 0) return;

      // Wait for icons to be rendered before measuring (only on initial load)
      // After first ready, we can recalculate even if some icons aren't rendered
      if (!hasEverBeenReadyRef.current && !areIconsReady()) return;

      const MANAGEMENT_BTN_W = 40;
      const ROW_GAP = 16;
      const TAG_GAP = 4;

      const allRoomsW = getElementFullWidth(allRoomsMeasureRef.current);
      const ellipsisW = getElementFullWidth(ellipsisMeasureRef.current);

      // Wait for All Rooms measurement to be ready
      if (allRoomsW <= 0) return;

      const containerWidth = rowWidth - MANAGEMENT_BTN_W - ROW_GAP;

      const groupWidths = roomGroupsWithIcons.map((g) => {
        const measuredWidth = getElementFullWidth(
          groupMeasureRefs.current.get(g.id)?.current ?? null,
        );
        // Cache valid measurements, use cached value if current measurement is 0
        if (measuredWidth > 0) {
          cachedGroupWidths.current.set(g.id, measuredWidth);
        }
        return {
          id: g.id,
          width:
            measuredWidth > 0
              ? measuredWidth
              : (cachedGroupWidths.current.get(g.id) ?? 0),
        };
      });

      // Wait for all group measurements to be ready (only on initial load)
      // After first ready, some groups may be in overflow but we have cached widths
      if (
        !hasEverBeenReadyRef.current &&
        roomGroupsWithIcons.length > 0 &&
        groupWidths.some((g) => g.width <= 0)
      ) {
        return;
      }

      // Total width includes gaps between tags: (1 + N) items = N gaps
      const numGroups = groupWidths.length;
      const totalGaps = numGroups > 0 ? numGroups * TAG_GAP : 0;
      const totalW =
        allRoomsW + groupWidths.reduce((s, g) => s + g.width, 0) + totalGaps;

      if (totalW <= containerWidth) {
        setVisibleGroupIds(roomGroupsWithIcons.map((g) => g.id));
        setOverflowGroups([]);
        setIsRowReady(true);
        hasEverBeenReadyRef.current = true;
        return;
      }

      // Available width for groups (after All Rooms, ellipsis, and their gaps)
      // All Rooms + gap + ellipsis + gap before first visible group
      const availableW = Math.max(
        containerWidth - allRoomsW - ellipsisW - TAG_GAP * 2,
        0,
      );

      // Start with all groups visible, then remove from the end until they fit
      const visible: string[] = roomGroupsWithIcons.map((g) => g.id);
      const overflow: TRoomGroup[] = [];

      const getVisibleWidth = () => {
        const widthSum = visible.reduce(
          (sum, id) => sum + (groupWidths.find((x) => x.id === id)?.width ?? 0),
          0,
        );
        // Add gaps between visible groups
        const gaps = visible.length > 0 ? (visible.length - 1) * TAG_GAP : 0;
        return widthSum + gaps;
      };

      while (visible.length > 0 && getVisibleWidth() > availableW) {
        const removedId = visible.pop()!;
        const removedGroup = roomGroupsWithIcons.find(
          (g) => g.id === removedId,
        );
        if (removedGroup) {
          overflow.unshift(removedGroup);
        }
      }

      // If the active group or manually moved group ended up in overflow, move it to position 0
      const groupToKeepVisible = manuallyMovedGroupRef.current || activeGroupId;
      if (groupToKeepVisible) {
        const groupInOverflow = overflow.findIndex(
          (g) => String(g.id) === String(groupToKeepVisible),
        );
        if (groupInOverflow !== -1) {
          const groupToMove = overflow[groupInOverflow];
          overflow.splice(groupInOverflow, 1);
          visible.unshift(groupToMove.id); // Use the actual group ID to maintain type consistency

          // Recalculate overflow to make room for the group at position 0
          while (visible.length > 1 && getVisibleWidth() > availableW) {
            const removedId = visible.pop()!;
            if (String(removedId) === String(groupToKeepVisible)) {
              visible.push(removedId);
              break;
            }
            const removedGroup = roomGroupsWithIcons.find(
              (g) => g.id === removedId,
            );
            if (removedGroup) {
              overflow.unshift(removedGroup);
            }
          }
        }
        // Clear manually moved group only when activeGroupId has caught up
        if (
          manuallyMovedGroupRef.current &&
          String(activeGroupId) === String(manuallyMovedGroupRef.current)
        ) {
          manuallyMovedGroupRef.current = null;
        }
      }

      setVisibleGroupIds(visible);
      setOverflowGroups(overflow);
      setIsRowReady(true);
      hasEverBeenReadyRef.current = true;
    }, [roomGroupsWithIcons, areIconsReady, activeGroupId]);

    React.useLayoutEffect(() => {
      calculateOverflow();
    }, [calculateOverflow]);

    // Poll for icon loading completion
    React.useEffect(() => {
      if (isRowReady || roomGroupsWithIcons.length === 0) return;

      const checkIcons = () => {
        if (areIconsReady()) {
          calculateOverflow();
        }
      };

      const interval = setInterval(checkIcons, 50);
      return () => clearInterval(interval);
    }, [isRowReady, roomGroupsWithIcons, areIconsReady, calculateOverflow]);

    React.useEffect(() => {
      const row = rowRef.current;
      if (!row || typeof ResizeObserver === "undefined") return;

      const ro = new ResizeObserver(() => calculateOverflow());
      ro.observe(row);
      return () => ro.disconnect();
    }, [calculateOverflow]);

    const [isOverflowOpen, setIsOverflowOpen] = React.useState(false);
    const toggleOverflow = React.useCallback(
      () => setIsOverflowOpen((v) => !v),
      [],
    );

    const handleFilterByGroup = React.useCallback(
      (groupId: string | null) => {
        // If selecting a group that's currently in overflow, move it to visible
        if (groupId) {
          const isInOverflow = overflowGroups.some((g) => g.id === groupId);

          if (isInOverflow) {
            const newVisible = [groupId, ...visibleGroupIds];
            const newOverflow = overflowGroups.filter((g) => g.id !== groupId);

            // Remove last visible group to make room
            if (newVisible.length > 1) {
              const removedId = newVisible.pop()!;
              const removedGroup = roomGroupsWithIcons.find(
                (g) => g.id === removedId,
              );
              if (removedGroup && removedId !== groupId) {
                newOverflow.unshift(removedGroup);
              }
            }

            // Track this group so calculateOverflow keeps it visible
            manuallyMovedGroupRef.current = groupId;
            setVisibleGroupIds(newVisible);
            setOverflowGroups(newOverflow);
          }
        }

        setActiveGroupId(groupId);
        onFilterByGroup?.(groupId);
      },
      [onFilterByGroup, overflowGroups, visibleGroupIds, roomGroupsWithIcons],
    );

    const contextMenuRef = React.useRef<ContextMenuRefType>(null);

    const isMobileView = isMobile();
    const maxVisibleItems = 5;
    const itemHeight = isDesktop() ? 32 : 36;
    const listHeight =
      Math.min(overflowGroups.length, maxVisibleItems) * itemHeight;

    const overflowContextMenuModel: ContextMenuModel[] = React.useMemo(
      () =>
        overflowGroups.map((g) => ({
          key: g.id,
          label: g.name,
          icon: buildGroupIconDataUrl(g.icon),
          onClick: () => {
            handleFilterByGroup(g.id);
          },
        })),
      [overflowGroups, handleFilterByGroup],
    );

    const overflowContextMenuHeader = React.useMemo(
      () => ({
        title: t("GroupingRooms:RoomGroups"),
        icon: "",
      }),
      [t],
    );

    const onOverflowContextMenu = React.useCallback((e: React.MouseEvent) => {
      contextMenuRef.current?.show(e);
    }, []);

    const overflowDropdownList = (
      <Scrollbar
        style={{ height: listHeight }}
        scrollBodyClassName="overflow-dropdown-scroll-body"
      >
        {overflowGroups.map((g) => (
          <DropDownItem
            key={g.id}
            className="option-item"
            icon={buildGroupIconDataUrl(g.icon)}
            truncateText
            onClick={(e) => {
              e.stopPropagation();
              handleFilterByGroup(g.id);
              setIsOverflowOpen(false);
            }}
            testId={`room_group_overflow_${g.id}`}
            label={g.name}
          />
        ))}
      </Scrollbar>
    );

    return (
      <div className={styles.filterInput} data-testid="filter_container">
        <div className="filter-input_filter-row">
          {searchComponent}
          {!isIndexEditingMode && !isFlowsPage ? (
            <FilterButton
              id="filter-button"
              onFilter={onFilter}
              getFilterData={getFilterData}
              selectedFilterValue={selectedFilterValue}
              filterHeader={filterHeader}
              selectorLabel={selectorLabel}
              isRooms={isRooms}
              isContactsPage={isContactsPage}
              isContactsPeoplePage={isContactsPeoplePage}
              isContactsGroupsPage={isContactsGroupsPage}
              isContactsInsideGroupPage={isContactsInsideGroupPage}
              isContactsGuestsPage={isContactsGuestsPage}
              title={filterTitle}
              userId={userId}
              disableThirdParty={disableThirdParty}
            />
          ) : null}

          {showSortButton ? (
            <SortButton
              id="sort-by-button"
              onSort={onSort}
              getSortData={getSortData}
              getSelectedSortData={getSelectedSortData}
              view={view}
              viewAs={viewAs === "table" ? "row" : viewAs}
              viewSettings={viewSettings}
              onChangeViewAs={onChangeViewAs}
              onSortButtonClick={onSortButtonClick}
              viewSelectorVisible={
                viewSettings && viewSelectorVisible
                  ? currentDeviceType !== DeviceType.desktop
                  : false
              }
              title={sortByTitle}
            />
          ) : null}
          {showViewSelector ? (
            <ViewSelector
              id={viewAs === "tile" ? "view-switch--row" : "view-switch--tile"}
              className={classNames(styles.viewSelector, {
                [styles.desktopOnly]: !isRecentFolder, // css hiding for ssr
              })}
              style={{ marginInlineStart: "8px" }}
              viewAs={viewAs === "table" ? "row" : viewAs}
              viewSettings={viewSettings}
              onChangeView={onChangeViewAs}
              isFilter
            />
          ) : null}
        </div>
        {selectedItems && selectedItems.length > 0 ? (
          <div className="filter-input_selected-row">
            {selectedItems.map((item) => (
              <SelectedItem
                key={`${item.key}_${item.group}`}
                propKey={Array.isArray(item.key) ? item.key[0] : item.key}
                label={item.selectedLabel ? item.selectedLabel : item.label}
                group={item.group}
                onClose={removeSelectedItemAction}
                onClick={removeSelectedItemAction}
                dataTestId={`filter_selected_item_${Array.isArray(item.key) ? item.key[0] : item.key}`}
              />
            ))}
            {selectedItems.filter((item) => item.label).length > 1 ? (
              <Link
                className="clear-all-link"
                isHovered
                fontWeight={600}
                isSemitransparent
                type={LinkType.action}
                onClick={clearAll}
                dataTestId="filter_clear_all_link"
              >
                {t("Common:ClearAll")}
              </Link>
            ) : null}
          </div>
        ) : null}

        {isRoomsFolder &&
          isRoomGroupsLoaded &&
          organizeRoomsGrouping &&
          !isFilterOrSearchActive && (
            <div className={styles.rowGroupingRooms} ref={rowRef}>
              {(isRowReady || hasEverBeenReadyRef.current) && (
                <div className="group-tags">
                  <SelectedItem
                    propKey="all-rooms"
                    label={t("GroupingRooms:AllRooms")}
                    onClick={() => handleFilterByGroup(null)}
                    onClose={() => {}}
                    hideCross
                    clickable
                    isActive={activeGroupId === null}
                  />
                  {showCreateGroupButton && (
                    <SelectedItem
                      propKey="create-group"
                      label={t("PeopleTranslations:CreateGroup")}
                      icon={PlusIcon}
                      onClick={handleCreateGroupClick}
                      onClose={() => {}}
                      hideCross
                      clickable
                    />
                  )}
                  {visibleGroupIds.map((groupId) => {
                    const group = roomGroupsWithIcons.find(
                      (g) => g.id === groupId,
                    );
                    if (!group) return null;
                    return (
                      <SelectedItem
                        key={group.id}
                        propKey={group.id}
                        label={group.name}
                        icon={buildGroupIconDataUrl(group.icon)}
                        onClick={() => handleFilterByGroup(group.id)}
                        onClose={() => {}}
                        hideCross
                        clickable
                        isActive={String(activeGroupId) === String(group.id)}
                      />
                    );
                  })}
                  {overflowGroups.length > 0 && (
                    <>
                      <TooltipContainer
                        as="div"
                        className={styles.ellipsisButton}
                        onClick={
                          isMobileView ? onOverflowContextMenu : toggleOverflow
                        }
                        data-testid="rooms_groups_overflow_trigger"
                      >
                        <ComboBox
                          opened={isMobileView ? false : isOverflowOpen}
                          onToggle={isMobileView ? undefined : toggleOverflow}
                          className={styles.ellipsisComboBox}
                          options={[]}
                          selectedOption={{ key: "", label: "" }}
                          directionX="left"
                          directionY="both"
                          size={ComboBoxSize.content}
                          advancedOptions={
                            isMobileView ? undefined : overflowDropdownList
                          }
                          disableIconClick={isMobileView}
                          disableItemClick
                          isDefaultMode={false}
                          advancedOptionsCount={overflowGroups.length}
                          onSelect={() => {}}
                          withBlur={false}
                          withBackdrop={!isMobileView}
                          onBackdropClick={toggleOverflow}
                          type="onlyIcon"
                          dataTestId="rooms_groups_overflow_combobox"
                          withoutPadding
                          noBorder
                          withoutArrow
                          displayArrow={false}
                        >
                          <span className={styles.ellipsisIcon}>...</span>
                        </ComboBox>
                      </TooltipContainer>
                      {isMobileView && (
                        <ContextMenu
                          ref={contextMenuRef}
                          model={overflowContextMenuModel}
                          header={overflowContextMenuHeader}
                          withBackdrop
                          headerOnlyMobile
                          ignoreChangeView
                          maxHeight={6 * 36}
                        />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Hidden measurement container */}
              <div className={styles.groupTagsMeasure} aria-hidden>
                <SelectedItem
                  propKey="m-all"
                  label={t("GroupingRooms:AllRooms")}
                  onClick={() => {}}
                  onClose={() => {}}
                  hideCross
                  clickable
                  forwardedRef={allRoomsMeasureRef}
                />
                {roomGroupsWithIcons.map((g) => (
                  <SelectedItem
                    key={`m-${g.id}`}
                    propKey={`m-${g.id}`}
                    label={g.name}
                    icon={buildGroupIconDataUrl(g.icon)}
                    onClick={() => {}}
                    onClose={() => {}}
                    hideCross
                    clickable
                    forwardedRef={getGroupMeasureRef(g.id)}
                  />
                ))}
                <div
                  ref={ellipsisMeasureRef}
                  className={styles.ellipsisButtonMeasure}
                >
                  ...
                </div>
              </div>

              {(isRowReady || hasEverBeenReadyRef.current) && (
                <TooltipContainer
                  as="div"
                  className={styles.groupManagementButton}
                  onClick={onCreateGroup}
                >
                  <IconButton
                    size={16}
                    iconName={GroupManagementIcon}
                    isFill
                    isClickable
                  />
                </TooltipContainer>
              )}
            </div>
          )}
      </div>
    );
  },
);

FilterInput.displayName = "FilterInput";

export default FilterInput;
