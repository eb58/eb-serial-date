// a date is its ordinal (serial number); the brand exists only at compile time
export type SerialDate = number & { readonly __brand: 'SerialDate' }

export const DAYS = { MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 7 } as const
export const MONTHS = { JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6, JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12 } as const
export const WEEKCODES = {
    FIRST_WEEK_IN_MONTH: 1,
    SECOND_WEEK_IN_MONTH: 2,
    THIRD_WEEK_IN_MONTH: 3,
    FOURTH_WEEK_IN_MONTH: 4,
    LAST_WEEK_IN_MONTH: 0
} as const
export const RELATIVE = { PRECEDING: -1, NEAREST: 0, FOLLOWING: 1 } as const
export const DATE_INTERVAL = { OPEN: 0, CLOSED_LEFT: 1, CLOSED_RIGHT: 2, CLOSED: 3 } as const

export type Weekday = typeof DAYS[keyof typeof DAYS]
export type Month = typeof MONTHS[keyof typeof MONTHS]
export type WeekInMonth = typeof WEEKCODES[keyof typeof WEEKCODES]
export type Relative = typeof RELATIVE[keyof typeof RELATIVE]
export type DateInterval = typeof DATE_INTERVAL[keyof typeof DATE_INTERVAL]

export const SERIAL_LOWER_BOUND = 2;     // 1/1/1900
export const SERIAL_UPPER_BOUND = 2958465; // 12/31/9999
export const MINIMUM_YEAR_SUPPORTED = 1900;
export const MAXIMUM_YEAR_SUPPORTED = 9999;

const LAST_DAY_OF_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const AGGREGATE_DAYS_TO_END_OF_PRECEDING_MONTH = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

const jsUpperCaseFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const mod = (a: number, n: number) => (a % n + n) % n // always >= 0, unlike %

const nameToCode = <T extends Record<string, number>>(codes: T, s: string): T[keyof T] | -1 => {
    const name = Object.keys(codes).find(n => n.toLowerCase().startsWith(s.trim().toLowerCase()));
    return name ? codes[name as keyof T] : -1;
}
const codeToName = (codes: Record<string, number>, c: number, errorMessage: string): string => {
    const name = Object.keys(codes).find(key => codes[key] === c)
    if (!name) throw Error(errorMessage)
    return name
}

export const days = Object.keys(DAYS)
export const months = Object.keys(MONTHS)

export const isValidWeekdayCode = (d: number): d is Weekday => 1 <= d && d <= 7
export const isValidMonthCode = (m: number): m is Month => 1 <= m && m <= 12
export const isValidWeekInMonthCode = (m: number): m is WeekInMonth => 0 <= m && m <= 4

const assertValidWeekdayCode = (c: number): Weekday => {
    if (!isValidWeekdayCode(c)) throw Error("Invalid weekday code!")
    return c
}
const assertValidMonthCode = (c: number): Month => {
    if (!isValidMonthCode(c)) throw Error("Invalid month code!")
    return c
}

export const isLeapYear = (x: number) => (x % 4 === 0 && x % 100 !== 0) || x % 400 === 0
export const leapYearCount = (y: number) => {
    // number of leap years from 1900 to the specified year INCLUSIVE.
    // Note that 1900 is not a leap year.
    const leap4 = Math.trunc((y - 1896) / 4);
    const leap100 = Math.trunc((y - 1800) / 100);
    const leap400 = Math.trunc((y - 1600) / 400);
    return leap4 - leap100 + leap400;
}
export const lastDayOfMonth = (month: Month, year: number) =>
    LAST_DAY_OF_MONTH[month] + (month === MONTHS.FEBRUARY && isLeapYear(year) ? 1 : 0)

export const stringToWeekdayCode = (s: string) => nameToCode(DAYS, s)
export const stringToMonthCode = (s: string): Month | -1 => {
    if (!/^\s*\d+\s*$/.test(s)) return nameToCode(MONTHS, s)
    const n = parseInt(s, 10)
    return isValidMonthCode(n) ? n : -1
}

export const weekdayCodeToString = (c: Weekday) => jsUpperCaseFirst(days[assertValidWeekdayCode(c) - 1])
export const monthCodeToString = (c: Month) => jsUpperCaseFirst(months[assertValidMonthCode(c) - 1])
export const monthCodeToShortString = (c: Month) => monthCodeToString(c).substring(0, 3)
export const monthCodeToQuarter = (c: Month) => Math.ceil(assertValidMonthCode(c) / 3)
export const getMonths = (shortened = false) =>
    Object.values(MONTHS).map(c => shortened ? monthCodeToShortString(c) : monthCodeToString(c))

export const weekInMonthToString = (c: WeekInMonth) =>
    jsUpperCaseFirst(codeToName(WEEKCODES, c, "Invalid week in month code!").replace('_WEEK_IN_MONTH', ''))
export const relativeToString = (c: Relative) =>
    jsUpperCaseFirst(codeToName(RELATIVE, c, "Invalid relative code!"))

// no validation, so that the year after the last supported year can be used for searching
const ordinalOf = (day: number, month: Month, year: number) => {
    const leapDaysForYear = leapYearCount(year - 1);
    const daysUpToYear = (year - MINIMUM_YEAR_SUPPORTED) * 365 + leapDaysForYear;
    const daysUpToMonth = AGGREGATE_DAYS_TO_END_OF_PRECEDING_MONTH[month] + (isLeapYear(year) && month > MONTHS.FEBRUARY ? 1 : 0)
    const daysInMonth = day - 1;
    return daysUpToYear + daysUpToMonth + daysInMonth + SERIAL_LOWER_BOUND;
}

export const calcOrdinal = (day: number, month: Month, year: number): SerialDate => {
    if (!Number.isInteger(year) || year < MINIMUM_YEAR_SUPPORTED || year > MAXIMUM_YEAR_SUPPORTED)
        throw Error(`The 'year' argument must be in range ${MINIMUM_YEAR_SUPPORTED} to ${MAXIMUM_YEAR_SUPPORTED}.`)
    if (!Number.isInteger(month) || !isValidMonthCode(month))
        throw Error("The 'month' argument must be in the range 1 to 12.")
    if (!Number.isInteger(day) || day < 1 || day > lastDayOfMonth(month, year))
        throw Error("Invalid 'day' argument.")
    return ordinalOf(day, month, year) as SerialDate;
}

export const fromSerial = (serial: number): SerialDate => {
    if (serial < SERIAL_LOWER_BOUND || serial > SERIAL_UPPER_BOUND)
        throw Error("Invalid serial date!")
    return serial as SerialDate
}

export const fromDate = (date: Date): SerialDate =>
    calcOrdinal(date.getDate(), (date.getMonth() + 1) as Month, date.getFullYear())

export const ordinalToYear = (ordinal: SerialDate) => {
    let year = MINIMUM_YEAR_SUPPORTED + Math.floor((ordinal - SERIAL_LOWER_BOUND) / 365.25);
    while (ordinalOf(1, MONTHS.JANUARY, year + 1) <= ordinal) year++;
    while (ordinalOf(1, MONTHS.JANUARY, year) > ordinal) year--;
    return year;
}
export const ordinalToMonth = (ordinal: SerialDate) => {
    const year = ordinalToYear(ordinal);
    return Object.values(MONTHS).filter(month => ordinalOf(1, month, year) <= ordinal).pop() as Month;
}
export const ordinalToDayOfMonth = (ordinal: SerialDate) =>
    ordinal - ordinalOf(1, ordinalToMonth(ordinal), ordinalToYear(ordinal)) + 1

// 1/1/1900 was a Monday
export const ordinalToWeekday = (ordinal: SerialDate) => ((ordinal - SERIAL_LOWER_BOUND) % 7 + DAYS.MONDAY) as Weekday

export const addDays = (n: number, ordinal: SerialDate) => fromSerial(ordinal + n)

export const addMonths = (n: number, ordinal: SerialDate) => {
    const monthsSinceYearZero = ordinalToYear(ordinal) * 12 + (ordinalToMonth(ordinal) - 1) + n;
    const year = Math.floor(monthsSinceYearZero / 12);
    const month = (monthsSinceYearZero % 12 + 1) as Month;
    const day = Math.min(ordinalToDayOfMonth(ordinal), lastDayOfMonth(month, year));
    return calcOrdinal(day, month, year);
}

export const addYears = (n: number, ordinal: SerialDate) => addMonths(12 * n, ordinal)

export const getPreviousDayOfWeek = (targetWeekday: Weekday, ordinal: SerialDate) => {
    assertValidWeekdayCode(targetWeekday);
    const daysBack = mod(ordinalToWeekday(ordinal) - targetWeekday - 1, 7) + 1;
    return addDays(-daysBack, ordinal);
}

export const getFollowingDayOfWeek = (targetWeekday: Weekday, ordinal: SerialDate) => {
    assertValidWeekdayCode(targetWeekday);
    const daysForward = mod(targetWeekday - ordinalToWeekday(ordinal) - 1, 7) + 1;
    return addDays(daysForward, ordinal);
}

export const getNearestDayOfWeek = (targetWeekday: Weekday, ordinal: SerialDate) => {
    assertValidWeekdayCode(targetWeekday);
    const daysToTarget = mod(targetWeekday - ordinalToWeekday(ordinal) + 3, 7) - 3;
    return addDays(daysToTarget, ordinal);
}

export const getEndOfCurrentMonth = (ordinal: SerialDate) => {
    const month = ordinalToMonth(ordinal);
    const year = ordinalToYear(ordinal);
    return calcOrdinal(lastDayOfMonth(month, year), month, year);
}

export const toDate = (ordinal: SerialDate) =>
    new Date(ordinalToYear(ordinal), ordinalToMonth(ordinal) - 1, ordinalToDayOfMonth(ordinal))

// e.g. 1-January-1900
export const ordinalToString = (ordinal: SerialDate) =>
    `${ordinalToDayOfMonth(ordinal)}-${monthCodeToString(ordinalToMonth(ordinal))}-${ordinalToYear(ordinal)}`

export const compare = (ordinal: SerialDate, other: SerialDate) => ordinal - other
export const isOn = (ordinal: SerialDate, other: SerialDate) => ordinal === other
export const isBefore = (ordinal: SerialDate, other: SerialDate) => ordinal < other
export const isOnOrBefore = (ordinal: SerialDate, other: SerialDate) => ordinal <= other
export const isAfter = (ordinal: SerialDate, other: SerialDate) => ordinal > other
export const isOnOrAfter = (ordinal: SerialDate, other: SerialDate) => ordinal >= other

export const isInRange = (ordinal: SerialDate, d1: SerialDate, d2: SerialDate, interval: DateInterval = DATE_INTERVAL.CLOSED) => {
    if (!Object.values(DATE_INTERVAL).includes(interval)) throw Error("Invalid date interval!")
    const left = Math.min(d1, d2);
    const right = Math.max(d1, d2);
    const includesLeft = interval === DATE_INTERVAL.CLOSED_LEFT || interval === DATE_INTERVAL.CLOSED;
    const includesRight = interval === DATE_INTERVAL.CLOSED_RIGHT || interval === DATE_INTERVAL.CLOSED;
    return (includesLeft ? left <= ordinal : left < ordinal) && (includesRight ? ordinal <= right : ordinal < right);
}
