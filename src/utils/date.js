import dayjs from "dayjs";

/**
 * Number of FULL months from a given date until today.
 *
 * Examples (assuming today is 2024-03-10):
 * - 2024-02-10 -> 1
 * - 2024-02-11 -> 0 (not a full month yet)
 * - 2024-04-10 -> -1 (date is 1 full month in the future)
 *
 * @param {string|Date|import("dayjs").Dayjs|null|undefined} fromDate
 * @param {string|Date|import("dayjs").Dayjs} [todayInput] optional override for testing
 * @returns {number}
 */
export function monthsFromDateToToday(fromDate, todayInput = new Date()) {
  if (!fromDate) return 0;

  const start = dayjs(fromDate);
  const today = dayjs(todayInput);
  if (!start.isValid() || !today.isValid()) return 0;

  const y1 = start.year();
  const m1 = start.month(); // 0-11
  const d1 = start.date();

  const y2 = today.year();
  const m2 = today.month(); // 0-11
  const d2 = today.date();

  let months = (y2 - y1) * 12 + (m2 - m1);

  // Adjust so we count only FULL months.
  if (months > 0 && d2 < d1) months -= 1;
  if (months < 0 && d2 > d1) months += 1;

  return months;
}

/**
 * Number of FULL weeks (7-day blocks) from a given date until today.
 *
 * Examples (assuming today is 2024-03-10):
 * - 2024-03-03 -> 1
 * - 2024-03-04 -> 0 (not a full 7 days yet)
 * - 2024-03-17 -> -1 (one full week in the future)
 *
 * @param {string|Date|import("dayjs").Dayjs|null|undefined} fromDate
 * @param {string|Date|import("dayjs").Dayjs} [todayInput] optional override for testing
 * @returns {number}
 */
export function weeksFromDateToToday(fromDate, todayInput = new Date()) {
  if (!fromDate) return 0;

  const start = dayjs(fromDate);
  const today = dayjs(todayInput);
  if (!start.isValid() || !today.isValid()) return 0;

  const days = today.startOf("day").diff(start.startOf("day"), "day");
  // For past dates (positive days), count full weeks with floor.
  // For future dates (negative days), use ceil to keep only full weeks.
  return days >= 0 ? Math.floor(days / 7) : Math.ceil(days / 7);
}

/**
 * Calculate years, months, and days from a given date until today.
 * 
 * Examples (assuming today is 2024-03-15):
 * - 2022-01-10 -> { years: 2, months: 2, days: 5 }
 * - 2024-03-10 -> { years: 0, months: 0, days: 5 }
 * - 2024-03-20 -> { years: 0, months: 0, days: -5 }
 * 
 * @param {string|Date|import("dayjs").Dayjs|null|undefined} fromDate
 * @param {string|Date|import("dayjs").Dayjs} [todayInput] optional override for testing
 * @returns {{ years: number, months: number, days: number }}
 */
export function yearsMonthsDaysFromDate(fromDate, todayInput = new Date()) {
  if (!fromDate) return { years: 0, months: 0, days: 0 };

  const start = dayjs(fromDate);
  const today = dayjs(todayInput);
  
  if (!start.isValid() || !today.isValid()) {
    return { years: 0, months: 0, days: 0 };
  }

  // Normalize to start of day for accurate day calculations
  const startDate = start.startOf("day");
  const endDate = today.startOf("day");

  // Calculate years difference
  let years = endDate.diff(startDate, "year");
  let dateAfterYears = startDate.add(years, "year");

  // Calculate months difference after accounting for years
  let months = endDate.diff(dateAfterYears, "month");
  let dateAfterMonths = dateAfterYears.add(months, "month");

  // Calculate remaining days
  let days = endDate.diff(dateAfterMonths, "day");

  return { years, months, days };
}
