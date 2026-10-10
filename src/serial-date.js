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

const EARLIEST_DATE_ORDINAL = 2;     // 1/1/1900
const LATEST_DATE_ORDINAL = 2958465; // 12/31/9999
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

const WEEKCODES = {
    FIRST_WEEK_IN_MONTH: 1,
    SECOND_WEEK_IN_MONTH: 2,
    THIRD_WEEK_IN_MONTH: 3,
    FOURTH_WEEK_IN_MONTH: 4,
    LAST_WEEK_IN_MONTH: 0
}
const RELATIVE = {PRECEDING: -1, NEAREST: 0, FOLLOWING: 1}

const api = {
    DAYS,
    days: Object.keys(DAYS),
    days2: Object.keys(DAYS).map(jsUpperCaseFirst), // ['Monday', ....

    MONTHS,
    months: Object.keys(MONTHS),
    months2: Object.keys(MONTHS).map(jsUpperCaseFirst),// ['January', ....

    WEEKCODES,
    RELATIVE,

    isLeapYear: (x) => (x % 4 === 0 && x % 100 !== 0) || x % 400 === 0,
    leapYearCount: y => {
        // number of leap years from 1900 to the specified year INCLUSIVE.
        // Note that 1900 is not a leap year.
        const leap4 = Math.trunc((y - 1896) / 4);
        const leap100 = Math.trunc((y - 1800) / 100);
        const leap400 = Math.trunc((y - 1600) / 400);
        return leap4 - leap100 + leap400;
    },

    isValidWeekdayCode,
    isValidMonthCode,
    isValidWeekInMonthCode: (m) => 0 <= m && m <= 4,

    stringToWeekdayCode: s => feedX(api.days.find(day => day.toLowerCase().startsWith(s.toLowerCase())), (x) => x ? DAYS[x] : -1),
    stringToMonthCode: s => feedX(api.months.find(month => month.toLowerCase().startsWith(s.toLowerCase())), (x) => x ? MONTHS[x] : -1),

    weekdayCodeToString: c => jsUpperCaseFirst(api.days[assertValidWeekdayCode(c) - 1]),

    monthCodeToString: c => jsUpperCaseFirst(api.months[assertValidMonthCode(c) - 1]),

    monthCodeToShortString: c => api.monthCodeToString(c).substring(0, 3),

    monthCodeToQuarter: c => Math.ceil(assertValidMonthCode(c) / 3),

    lastDayOfMonth: (month, year) => LAST_DAY_OF_MONTH[month] + (month === MONTHS.FEBRUARY && api.isLeapYear(year) ? 1 : 0),

    calcOrdinal: (day, month, year) => {
        const leapDaysForYear = api.leapYearCount(year - 1);
        const daysUpToYear = (year - MINIMUM_YEAR_SUPPORTED) * 365 + leapDaysForYear;
        const daysUpToMonth = AGGREGATE_DAYS_TO_END_OF_PRECEDING_MONTH[month] + (api.isLeapYear(year) && month > MONTHS.FEBRUARY ? 1 : 0)
        const daysInMonth = day - 1;
        return daysUpToYear + daysUpToMonth + daysInMonth + EARLIEST_DATE_ORDINAL;
    },

    // a date is its ordinal (serial number), see calcOrdinal
    ordinalToYear: ordinal => {
        let year = MINIMUM_YEAR_SUPPORTED + Math.floor((ordinal - EARLIEST_DATE_ORDINAL) / 365.25);
        while (api.calcOrdinal(1, MONTHS.JANUARY, year + 1) <= ordinal) year++;
        while (api.calcOrdinal(1, MONTHS.JANUARY, year) > ordinal) year--;
        return year;
    },
    ordinalToMonth: ordinal => {
        const year = api.ordinalToYear(ordinal);
        const months = Object.values(MONTHS);
        return months.filter(month => api.calcOrdinal(1, month, year) <= ordinal).pop();
    },
    ordinalToDayOfMonth: ordinal =>
        ordinal - api.calcOrdinal(1, api.ordinalToMonth(ordinal), api.ordinalToYear(ordinal)) + 1,

    addDays: (n, ordinal) => ordinal + n,

    addMonths: (n, ordinal) => {
        const monthsSinceYearZero = api.ordinalToYear(ordinal) * 12 + (api.ordinalToMonth(ordinal) - 1) + n;
        const year = Math.floor(monthsSinceYearZero / 12);
        const month = monthsSinceYearZero % 12 + 1;
        const day = Math.min(api.ordinalToDayOfMonth(ordinal), api.lastDayOfMonth(month, year));
        return api.calcOrdinal(day, month, year);
    },

    addYears: (n, ordinal) => api.addMonths(12 * n, ordinal),

    // 1/1/1900 was a Monday
    ordinalToWeekday: ordinal => (ordinal - EARLIEST_DATE_ORDINAL) % 7 + DAYS.MONDAY,

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
        if (ordinal < EARLIEST_DATE_ORDINAL || ordinal > LATEST_DATE_ORDINAL)
            throw Error("Invalid serial date!")
        return ordinal
    },

}

module.exports = api