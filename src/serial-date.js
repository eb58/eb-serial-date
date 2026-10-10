const feedX = (x, f) => f(x);
const jsUpperCaseFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const DAYS = {MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 7};
const MONTHS = {
    JANUARY: 1,
    FEBRUARY: 2,
    MARCH: 3,
    APRIL: 4,
    MAY: 5,
    JUNE: 6,
    JULY: 7,
    AUGUST: 8,
    SEPTEMBER: 9,
    OCTOBER: 10,
    NOVEMBER: 11,
    DECEMBER: 12
};

const SERIAL_LOWER_BOUND = 2;     // 1/1/1900
const SERIAL_UPPER_BOUND = 2958465; // 12/31/9999
const MINIMUM_YEAR_SUPPORTED = 1900;
const MAXIMUM_YEAR_SUPPORTED = 9999;

const LAST_DAY_OF_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const AGGREGATE_DAYS_TO_END_OF_PRECEDING_MONTH = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];


const mod = (a, n) => (a % n + n) % n // always >= 0, unlike %

const isValidWeekdayCode = (d) => 1 <= d && d <= 7
const isValidMonthCode = (m) => 1 <= m && m <= 12

const assertValidWeekdayCode = (c) => {
    if (!isValidWeekdayCode(c)) throw Error("Invalid weekday code!")
    return c
}
const assertValidMonthCode = (c) => {
    if (!isValidMonthCode(c)) throw Error("Invalid month code!")
    return c
}

const isLeapYear = (x) => (x % 4 === 0 && x % 100 !== 0) || x % 400 === 0
const leapYearCount = y => {
    // number of leap years from 1900 to the specified year INCLUSIVE.
    // Note that 1900 is not a leap year.
    const leap4 = Math.trunc((y - 1896) / 4);
    const leap100 = Math.trunc((y - 1800) / 100);
    const leap400 = Math.trunc((y - 1600) / 400);
    return leap4 - leap100 + leap400;
}
const lastDayOfMonth = (month, year) => LAST_DAY_OF_MONTH[month] + (month === MONTHS.FEBRUARY && isLeapYear(year) ? 1 : 0)

// no validation, so that the year after the last supported year can be used for searching
const ordinalOf = (day, month, year) => {
    const leapDaysForYear = leapYearCount(year - 1);
    const daysUpToYear = (year - MINIMUM_YEAR_SUPPORTED) * 365 + leapDaysForYear;
    const daysUpToMonth = AGGREGATE_DAYS_TO_END_OF_PRECEDING_MONTH[month] + (isLeapYear(year) && month > MONTHS.FEBRUARY ? 1 : 0)
    const daysInMonth = day - 1;
    return daysUpToYear + daysUpToMonth + daysInMonth + SERIAL_LOWER_BOUND;
}

const WEEKCODES = {
    FIRST_WEEK_IN_MONTH: 1,
    SECOND_WEEK_IN_MONTH: 2,
    THIRD_WEEK_IN_MONTH: 3,
    FOURTH_WEEK_IN_MONTH: 4,
    LAST_WEEK_IN_MONTH: 0
}
const RELATIVE = {PRECEDING: -1, NEAREST: 0, FOLLOWING: 1}
const DATE_INTERVAL = {OPEN: 0, CLOSED_LEFT: 1, CLOSED_RIGHT: 2, CLOSED: 3}

const api = {
    DAYS,
    days: Object.keys(DAYS),
    days2: Object.keys(DAYS).map(jsUpperCaseFirst), // ['Monday', ....

    MONTHS,
    months: Object.keys(MONTHS),
    months2: Object.keys(MONTHS).map(jsUpperCaseFirst),// ['January', ....

    WEEKCODES,
    RELATIVE,
    DATE_INTERVAL,

    SERIAL_LOWER_BOUND,
    SERIAL_UPPER_BOUND,
    MINIMUM_YEAR_SUPPORTED,
    MAXIMUM_YEAR_SUPPORTED,

    isLeapYear,
    leapYearCount,

    isValidWeekdayCode,
    isValidMonthCode,
    isValidWeekInMonthCode: (m) => 0 <= m && m <= 4,

    stringToWeekdayCode: s => feedX(api.days.find(day => day.toLowerCase().startsWith(s.toLowerCase())), (x) => x ? DAYS[x] : -1),
    stringToMonthCode: s => /^\s*\d+\s*$/.test(s)
        ? (isValidMonthCode(parseInt(s, 10)) ? parseInt(s, 10) : -1)
        : feedX(api.months.find(month => month.toLowerCase().startsWith(s.trim().toLowerCase())), (x) => x ? MONTHS[x] : -1),

    weekdayCodeToString: c => jsUpperCaseFirst(api.days[assertValidWeekdayCode(c) - 1]),

    monthCodeToString: c => jsUpperCaseFirst(api.months[assertValidMonthCode(c) - 1]),

    monthCodeToShortString: c => api.monthCodeToString(c).substring(0, 3),

    monthCodeToQuarter: c => Math.ceil(assertValidMonthCode(c) / 3),

    getMonths: (shortened = false) =>
        Object.values(MONTHS).map(c => shortened ? api.monthCodeToShortString(c) : api.monthCodeToString(c)),

    lastDayOfMonth,

    calcOrdinal: (day, month, year) => {
        if (!Number.isInteger(year) || year < MINIMUM_YEAR_SUPPORTED || year > MAXIMUM_YEAR_SUPPORTED)
            throw Error(`The 'year' argument must be in range ${MINIMUM_YEAR_SUPPORTED} to ${MAXIMUM_YEAR_SUPPORTED}.`)
        if (!Number.isInteger(month) || !isValidMonthCode(month))
            throw Error("The 'month' argument must be in the range 1 to 12.")
        if (!Number.isInteger(day) || day < 1 || day > lastDayOfMonth(month, year))
            throw Error("Invalid 'day' argument.")
        return ordinalOf(day, month, year);
    },

    // a date is its ordinal (serial number), see calcOrdinal
    ordinalToYear: ordinal => {
        let year = MINIMUM_YEAR_SUPPORTED + Math.floor((ordinal - SERIAL_LOWER_BOUND) / 365.25);
        while (ordinalOf(1, MONTHS.JANUARY, year + 1) <= ordinal) year++;
        while (ordinalOf(1, MONTHS.JANUARY, year) > ordinal) year--;
        return year;
    },
    ordinalToMonth: ordinal => {
        const year = api.ordinalToYear(ordinal);
        const months = Object.values(MONTHS);
        return months.filter(month => api.calcOrdinal(1, month, year) <= ordinal).pop();
    },
    ordinalToDayOfMonth: ordinal =>
        ordinal - api.calcOrdinal(1, api.ordinalToMonth(ordinal), api.ordinalToYear(ordinal)) + 1,

    addDays: (n, ordinal) => api.createInstance(ordinal + n),

    addMonths: (n, ordinal) => {
        const monthsSinceYearZero = api.ordinalToYear(ordinal) * 12 + (api.ordinalToMonth(ordinal) - 1) + n;
        const year = Math.floor(monthsSinceYearZero / 12);
        const month = monthsSinceYearZero % 12 + 1;
        const day = Math.min(api.ordinalToDayOfMonth(ordinal), api.lastDayOfMonth(month, year));
        return api.calcOrdinal(day, month, year);
    },

    addYears: (n, ordinal) => api.addMonths(12 * n, ordinal),

    // 1/1/1900 was a Monday
    ordinalToWeekday: ordinal => (ordinal - SERIAL_LOWER_BOUND) % 7 + DAYS.MONDAY,

    getPreviousDayOfWeek: (targetWeekday, ordinal) => {
        assertValidWeekdayCode(targetWeekday);
        const daysBack = mod(api.ordinalToWeekday(ordinal) - targetWeekday - 1, 7) + 1;
        return api.addDays(-daysBack, ordinal);
    },

    getFollowingDayOfWeek: (targetWeekday, ordinal) => {
        assertValidWeekdayCode(targetWeekday);
        const daysForward = mod(targetWeekday - api.ordinalToWeekday(ordinal) - 1, 7) + 1;
        return api.addDays(daysForward, ordinal);
    },

    getNearestDayOfWeek: (targetWeekday, ordinal) => {
        assertValidWeekdayCode(targetWeekday);
        const daysToTarget = mod(targetWeekday - api.ordinalToWeekday(ordinal) + 3, 7) - 3;
        return api.addDays(daysToTarget, ordinal);
    },

    getEndOfCurrentMonth: ordinal => {
        const month = api.ordinalToMonth(ordinal);
        const year = api.ordinalToYear(ordinal);
        return api.calcOrdinal(api.lastDayOfMonth(month, year), month, year);
    },

    weekInMonthToString: c => {
        const name = Object.keys(WEEKCODES).find(key => WEEKCODES[key] === c)
        if (!name) throw Error("Invalid week in month code!")
        return jsUpperCaseFirst(name.replace('_WEEK_IN_MONTH', ''))
    },

    relativeToString: c => {
        const name = Object.keys(RELATIVE).find(key => RELATIVE[key] === c)
        if (!name) throw Error("Invalid relative code!")
        return jsUpperCaseFirst(name)
    },

    // accepts a serial number or a js Date
    createInstance: x => {
        const ordinal = x instanceof Date ? api.calcOrdinal(x.getDate(), x.getMonth() + 1, x.getFullYear()) : x;
        if (ordinal < SERIAL_LOWER_BOUND || ordinal > SERIAL_UPPER_BOUND)
            throw Error("Invalid serial date!")
        return ordinal
    },

    toDate: ordinal => new Date(api.ordinalToYear(ordinal), api.ordinalToMonth(ordinal) - 1, api.ordinalToDayOfMonth(ordinal)),

    // e.g. 1-January-1900
    ordinalToString: ordinal =>
        `${api.ordinalToDayOfMonth(ordinal)}-${api.monthCodeToString(api.ordinalToMonth(ordinal))}-${api.ordinalToYear(ordinal)}`,

    compare: (ordinal, other) => ordinal - other,
    isOn: (ordinal, other) => ordinal === other,
    isBefore: (ordinal, other) => ordinal < other,
    isOnOrBefore: (ordinal, other) => ordinal <= other,
    isAfter: (ordinal, other) => ordinal > other,
    isOnOrAfter: (ordinal, other) => ordinal >= other,

    isInRange: (ordinal, d1, d2, interval = DATE_INTERVAL.CLOSED) => {
        if (!Object.values(DATE_INTERVAL).includes(interval)) throw Error("Invalid date interval!")
        const left = Math.min(d1, d2);
        const right = Math.max(d1, d2);
        const includesLeft = interval === DATE_INTERVAL.CLOSED_LEFT || interval === DATE_INTERVAL.CLOSED;
        const includesRight = interval === DATE_INTERVAL.CLOSED_RIGHT || interval === DATE_INTERVAL.CLOSED;
        return (includesLeft ? left <= ordinal : left < ordinal) && (includesRight ? ordinal <= right : ordinal < right);
    },

}

module.exports = api