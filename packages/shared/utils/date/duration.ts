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

import { Duration, DurationLikeObject, DateTime } from "luxon";

export type DurationUnit =
  | "years"
  | "months"
  | "weeks"
  | "days"
  | "hours"
  | "minutes"
  | "seconds"
  | "milliseconds";

/**
 * Creates a Duration object from a value and unit
 * @param value - Numeric value
 * @param unit - Unit of time
 * @returns Duration object
 */
export function createDuration(value: number, unit: DurationUnit): Duration {
  const durationObj: DurationLikeObject = { [unit]: value };
  return Duration.fromObject(durationObj);
}

/**
 * Humanizes a duration (similar to moment.duration().humanize())
 * @param value - Numeric value
 * @param unit - Unit of time
 * @param options - Humanization options
 * @returns Human-readable duration string
 */
export function humanizeDuration(
  value: number,
  unit: DurationUnit,
  options?: {
    locale?: string;
    addSuffix?: boolean;
    thresholds?: {
      days?: number;
      months?: number;
      years?: number;
    };
  },
): string {
  const duration = createDuration(value, unit);

  // Shift to larger units for readability
  const shifted = duration
    .shiftTo("years", "months", "days", "hours", "minutes", "seconds")
    .toObject();

  // Get the most significant non-zero unit
  const units: DurationUnit[] = [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds",
  ];

  let significantUnit: string | null = null;
  let significantValue = 0;

  for (const u of units) {
    const val = shifted[u] ?? 0;
    if (Math.abs(val) >= 1) {
      significantUnit = u;
      significantValue = Math.round(val);
      break;
    }
  }

  if (!significantUnit) {
    return options?.locale ? "a few seconds" : "a few seconds";
  }

  // Apply thresholds if provided
  if (options?.thresholds) {
    const totalDays = duration.as("days");
    if (
      options.thresholds.days &&
      Math.abs(totalDays) >= options.thresholds.days
    ) {
      significantUnit = "days";
      significantValue = Math.round(totalDays);
    }
  }

  // Format the result
  const absValue = Math.abs(significantValue);
  const unitSingular = significantUnit.slice(0, -1); // Remove 's'

  let result: string;
  if (absValue === 1) {
    // Handle special cases
    switch (unitSingular) {
      case "year":
        result = "a year";
        break;
      case "month":
        result = "a month";
        break;
      case "week":
        result = "a week";
        break;
      case "day":
        result = "a day";
        break;
      case "hour":
        result = "an hour";
        break;
      case "minute":
        result = "a minute";
        break;
      case "second":
        result = "a few seconds";
        break;
      default:
        result = `1 ${unitSingular}`;
    }
  } else {
    result = `${absValue} ${significantUnit}`;
  }

  // Add suffix if requested (like "in 2 days" or "2 days ago")
  if (options?.addSuffix) {
    if (significantValue > 0) {
      result = `in ${result}`;
    } else if (significantValue < 0) {
      result = `${result} ago`;
    }
  }

  return result;
}

/**
 * Gets human-readable relative time from now
 * Similar to moment().fromNow()
 * @param date - Target date
 * @param options - Options for formatting
 * @returns Human-readable relative time string
 */
export function fromNow(
  date: Date | string | DateTime | null | undefined,
  options?: {
    locale?: string;
    addSuffix?: boolean;
  },
): string {
  if (!date) return "";

  let dt: DateTime;

  if (date instanceof DateTime) {
    dt = date;
  } else if (date instanceof Date) {
    dt = DateTime.fromJSDate(date);
  } else {
    dt = DateTime.fromISO(date);
    if (!dt.isValid) {
      const jsDate = new Date(date);
      if (!Number.isNaN(jsDate.getTime())) {
        dt = DateTime.fromJSDate(jsDate);
      }
    }
  }

  if (!dt.isValid) return "";

  const now = DateTime.now();
  const diff = dt.diff(now, [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds",
  ]);

  // Find the most significant unit
  const units: DurationUnit[] = [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds",
  ];
  const diffObj = diff.toObject();
  let significantUnit: DurationUnit = "seconds";
  let significantValue = 0;

  for (const unit of units) {
    const val = diffObj[unit] ?? 0;
    if (Math.abs(val) >= 1) {
      significantUnit = unit;
      significantValue = Math.round(val);
      break;
    }
  }

  return humanizeDuration(significantValue, significantUnit, {
    locale: options?.locale,
    addSuffix: options?.addSuffix ?? true,
  });
}

/**
 * Gets human-readable relative time to a specific date
 * Similar to moment().to(date)
 * @param from - Start date
 * @param to - End date
 * @param options - Options for formatting
 * @returns Human-readable relative time string
 */
export function toRelative(
  from: Date | string | DateTime | null | undefined,
  to: Date | string | DateTime | null | undefined,
  options?: {
    locale?: string;
    addSuffix?: boolean;
  },
): string {
  if (!from || !to) return "";

  let dtFrom: DateTime;
  let dtTo: DateTime;

  // Parse from
  if (from instanceof DateTime) {
    dtFrom = from;
  } else if (from instanceof Date) {
    dtFrom = DateTime.fromJSDate(from);
  } else {
    dtFrom = DateTime.fromISO(from);
    if (!dtFrom.isValid) {
      const jsDate = new Date(from);
      if (!Number.isNaN(jsDate.getTime())) {
        dtFrom = DateTime.fromJSDate(jsDate);
      }
    }
  }

  // Parse to
  if (to instanceof DateTime) {
    dtTo = to;
  } else if (to instanceof Date) {
    dtTo = DateTime.fromJSDate(to);
  } else {
    dtTo = DateTime.fromISO(to);
    if (!dtTo.isValid) {
      const jsDate = new Date(to);
      if (!Number.isNaN(jsDate.getTime())) {
        dtTo = DateTime.fromJSDate(jsDate);
      }
    }
  }

  if (!dtFrom.isValid || !dtTo.isValid) return "";

  const diff = dtTo.diff(dtFrom, [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds",
  ]);

  // Find the most significant unit
  const units: DurationUnit[] = [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds",
  ];
  const diffObj = diff.toObject();
  let significantUnit: DurationUnit = "seconds";
  let significantValue = 0;

  for (const unit of units) {
    const val = diffObj[unit] ?? 0;
    if (Math.abs(val) >= 1) {
      significantUnit = unit;
      significantValue = Math.round(val);
      break;
    }
  }

  return humanizeDuration(significantValue, significantUnit, {
    locale: options?.locale,
    addSuffix: options?.addSuffix ?? true,
  });
}

/**
 * Converts duration to the specified unit
 * @param value - Numeric value
 * @param fromUnit - Source unit
 * @param toUnit - Target unit
 * @returns Converted value
 */
export function convertDuration(
  value: number,
  fromUnit: DurationUnit,
  toUnit: DurationUnit,
): number {
  const duration = createDuration(value, fromUnit);
  return duration.as(toUnit);
}
