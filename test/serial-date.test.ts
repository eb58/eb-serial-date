import {
    Month,
    Weekday,
    SerialDate,
    DateInterval,
    DAYS,
    MONTHS,
    WEEKCODES,
    RELATIVE,
    DATE_INTERVAL,
    SERIAL_LOWER_BOUND,
    SERIAL_UPPER_BOUND,
    MINIMUM_YEAR_SUPPORTED,
    MAXIMUM_YEAR_SUPPORTED,
    days,
    months,

    isLeapYear,
    leapYearCount,
    lastDayOfMonth,

    isValidWeekdayCode,
    isValidMonthCode,
    isValidWeekInMonthCode,
    stringToWeekdayCode,
    stringToMonthCode,
    weekdayCodeToString,
    monthCodeToString,
    monthCodeToShortString,
    monthCodeToQuarter,
    getMonths,
    weekInMonthToString,
    relativeToString,

    calcSerial,
    fromSerial,
    fromDate,
    serialToYear,
    serialToMonth,
    serialToDayOfMonth,
    serialToWeekday,
    toDate,
    serialToString,

    addDays,
    addMonths,
    addYears,
    getEndOfCurrentMonth,
    getPreviousDayOfWeek,
    getFollowingDayOfWeek,
    getNearestDayOfWeek,

    compare,
    isOn,
    isBefore,
    isOnOrBefore,
    isAfter,
    isOnOrAfter,
    isInRange,
} from '../src/serial-date'

const d = calcSerial
const { JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER } = MONTHS
const { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY } = DAYS

// month, name, short name, quarter, days in a common year
const MONTH_TABLE: [Month, string, string, number, number][] = [
    [JANUARY, 'January', 'Jan', 1, 31],
    [FEBRUARY, 'February', 'Feb', 1, 28],
    [MARCH, 'March', 'Mar', 1, 31],
    [APRIL, 'April', 'Apr', 2, 30],
    [MAY, 'May', 'May', 2, 31],
    [JUNE, 'June', 'Jun', 2, 30],
    [JULY, 'July', 'Jul', 3, 31],
    [AUGUST, 'August', 'Aug', 3, 31],
    [SEPTEMBER, 'September', 'Sep', 3, 30],
    [OCTOBER, 'October', 'Oct', 4, 31],
    [NOVEMBER, 'November', 'Nov', 4, 30],
    [DECEMBER, 'December', 'Dec', 4, 31],
]

// weekday, name, short name
const WEEKDAY_TABLE: [Weekday, string, string][] = [
    [MONDAY, 'Monday', 'Mon'],
    [TUESDAY, 'Tuesday', 'Tue'],
    [WEDNESDAY, 'Wednesday', 'Wed'],
    [THURSDAY, 'Thursday', 'Thu'],
    [FRIDAY, 'Friday', 'Fri'],
    [SATURDAY, 'Saturday', 'Sat'],
    [SUNDAY, 'Sunday', 'Sun'],
]

// rows of [readable label, offset or weekday, start date, expected date]
const shift = (n: number, from: SerialDate, expected: SerialDate): [string, number, SerialDate, SerialDate] =>
    [`${serialToString(from)} ${n >= 0 ? '+' : '-'} ${Math.abs(n)} -> ${serialToString(expected)}`, n, from, expected]
const toWeekday = (target: Weekday, from: SerialDate, expected: SerialDate): [string, Weekday, SerialDate, SerialDate] =>
    [`${weekdayCodeToString(target)} from ${serialToString(from)} -> ${serialToString(expected)}`, target, from, expected]

describe('weekday codes', () => {
    test.each(WEEKDAY_TABLE)('%i is %s / %s', (code, name, short) => {
        expect(isValidWeekdayCode(code)).toBe(true);
        expect(weekdayCodeToString(code)).toBe(name);
        expect(stringToWeekdayCode(name)).toBe(code);
        expect(stringToWeekdayCode(short)).toBe(code);
    })

    test('invalid codes and names', () => {
        expect(isValidWeekdayCode(0)).toBe(false);
        expect(isValidWeekdayCode(8)).toBe(false);
        expect(stringToWeekdayCode('Hello')).toBe(-1);
        expect(stringToWeekdayCode(' Wednesday ')).toBe(WEDNESDAY);
    })
})

describe('month codes', () => {
    test.each(MONTH_TABLE)('%i is %s / %s, quarter %i, %i days', (code, name, short, quarter, daysInMonth) => {
        expect(isValidMonthCode(code)).toBe(true);
        expect(monthCodeToString(code)).toBe(name);
        expect(monthCodeToShortString(code)).toBe(short);
        expect(monthCodeToQuarter(code)).toBe(quarter);
        expect(lastDayOfMonth(code, 1901)).toBe(daysInMonth);
        expect(stringToMonthCode(name)).toBe(code);
        expect(stringToMonthCode(short)).toBe(code);
        expect(stringToMonthCode(String(code))).toBe(code);
        expect(getMonths()[code - 1]).toBe(name);
        expect(getMonths(true)[code - 1]).toBe(short);
    })

    test('getMonths returns twelve long names by default', () => {
        expect(getMonths()).toHaveLength(12);
        expect(getMonths(false)).toEqual(getMonths());
    })

    test('stringToMonthCode with numbers and spaces', () => {
        expect(stringToMonthCode(' 9 ')).toBe(SEPTEMBER);
        expect(stringToMonthCode(' January ')).toBe(JANUARY);
        expect(stringToMonthCode('0')).toBe(-1);
        expect(stringToMonthCode('13')).toBe(-1);
        expect(stringToMonthCode('Hello')).toBe(-1);
    })

    test('invalid codes', () => {
        expect(isValidMonthCode(0)).toBe(false);
        expect(isValidMonthCode(13)).toBe(false);
        // @ts-expect-error invalid code is rejected by the compiler and at runtime
        expect(() => monthCodeToString(-1)).toThrow();
        // @ts-expect-error invalid code is rejected by the compiler and at runtime
        expect(() => monthCodeToShortString(-1)).toThrow();
        // @ts-expect-error invalid code is rejected by the compiler and at runtime
        expect(() => monthCodeToQuarter(-1)).toThrow();
    })
})

test('name parsing accepts only full names and three-letter abbreviations', () => {
    for (const input of ['', '   ', 'J', 'Ju', 'Janu', 'January!']) {
        expect(stringToMonthCode(input)).toBe(-1);
    }
    for (const input of ['', '   ', 'T', 'Tu', 'Tues', 'Tuesday!']) {
        expect(stringToWeekdayCode(input)).toBe(-1);
    }
    expect(stringToMonthCode(' jAn ')).toBe(JANUARY);
    expect(stringToMonthCode(' JULY ')).toBe(JULY);
    expect(stringToWeekdayCode(' tHu ')).toBe(THURSDAY);
    expect(stringToWeekdayCode(' MONDAY ')).toBe(MONDAY);
})

describe('week in month and relative codes', () => {
    test.each([
        [WEEKCODES.FIRST_WEEK_IN_MONTH, 'First'],
        [WEEKCODES.SECOND_WEEK_IN_MONTH, 'Second'],
        [WEEKCODES.THIRD_WEEK_IN_MONTH, 'Third'],
        [WEEKCODES.FOURTH_WEEK_IN_MONTH, 'Fourth'],
        [WEEKCODES.LAST_WEEK_IN_MONTH, 'Last'],
    ] as const)('week code %i is %s', (code, name) => {
        expect(isValidWeekInMonthCode(code)).toBe(true);
        expect(weekInMonthToString(code)).toBe(name);
    })

    test.each([
        [RELATIVE.PRECEDING, 'Preceding'],
        [RELATIVE.NEAREST, 'Nearest'],
        [RELATIVE.FOLLOWING, 'Following'],
    ] as const)('relative code %i is %s', (code, name) => {
        expect(relativeToString(code)).toBe(name);
    })

    test('invalid codes', () => {
        expect(isValidWeekInMonthCode(5)).toBe(false);
        // @ts-expect-error invalid code is rejected by the compiler and at runtime
        expect(() => weekInMonthToString(5)).toThrow();
        // @ts-expect-error invalid code is rejected by the compiler and at runtime
        expect(() => relativeToString(2)).toThrow();
    })
})

describe('leap years', () => {
    test.each([
        [1900, false], [1901, false], [1902, false], [1903, false], [1904, true], [1908, true],
        [1955, false], [1964, true], [1980, true], [2000, true], [2001, false], [2100, false],
    ])('isLeapYear(%i) is %s', (year, expected) => {
        expect(isLeapYear(year)).toBe(expected);
    })

    test.each([
        [1899, 0], [1900, 0], [1901, 0], [1902, 0], [1903, 0], [1904, 1], [1905, 1], [1906, 1], [1907, 1],
        [1908, 2], [1999, 24], [2000, 25], [2001, 25], [2101, 49], [2201, 73], [2301, 97], [2401, 122],
    ])('leapYearCount(%i) is %i', (year, expected) => {
        expect(leapYearCount(year)).toBe(expected);
    })

    test('a leap year only changes February', () => {
        for (const [month, , , , daysInMonth] of MONTH_TABLE) {
            expect(lastDayOfMonth(month, 1904)).toBe(month === FEBRUARY ? 29 : daysInMonth);
        }
    })
})

describe('creating dates', () => {
    test.each([
        [1, JANUARY, 1900, 2],
        [1, FEBRUARY, 1900, 33],
        [1, MARCH, 1900, 61],
        [1, JANUARY, 1901, 367],
        [31, DECEMBER, 9999, 2958465],
    ] as [number, Month, number, number][])('calcSerial(%i, %i, %i) is %i', (day, month, year, expected) => {
        expect(calcSerial(day, month, year)).toBe(expected);
    })

    test('a leap year has 29 days in February and 366 in total', () => {
        expect(d(1, MARCH, 1904) - d(1, FEBRUARY, 1904)).toBe(29);
        expect(d(1, JANUARY, 1905) - d(1, JANUARY, 1904)).toBe(366);
    })

    test.each([
        [1, JANUARY, 1899],
        [1, JANUARY, 10000],
        [0, JANUARY, 2006],
        [32, JANUARY, 2006],
        [29, FEBRUARY, 1901],
        [31, APRIL, 2006],
        [1.5, JANUARY, 2006],
    ] as [number, Month, number][])('calcSerial(%s, %i, %s) throws', (day, month, year) => {
        expect(() => calcSerial(day, month, year)).toThrow();
    })

    test('calcSerial rejects invalid months', () => {
        // @ts-expect-error invalid code is rejected by the compiler and at runtime
        expect(() => calcSerial(1, 0, 2006)).toThrow();
        // @ts-expect-error invalid code is rejected by the compiler and at runtime
        expect(() => calcSerial(1, 13, 2006)).toThrow();
        expect(calcSerial(29, FEBRUARY, 1904)).toBeGreaterThan(0);
    })

    test('fromSerial accepts exactly the supported range', () => {
        expect(fromSerial(2)).toBe(d(1, JANUARY, 1900));
        expect(fromSerial(367)).toBe(d(1, JANUARY, 1901));
        expect(() => fromSerial(1)).toThrow();
        expect(() => fromSerial(2958466)).toThrow();
    })

    test('fromDate', () => {
        expect(fromDate(new Date(1900, 0, 1))).toBe(d(1, JANUARY, 1900));
        expect(fromDate(new Date(2006, 0, 1))).toBe(d(1, JANUARY, 2006));
        expect(() => fromDate(new Date(1899, 11, 31))).toThrow();
        expect(() => fromDate(new Date(10000, 0, 1))).toThrow();
        expect(() => fromDate(new Date(NaN))).toThrow();
    })

    test('a serial date survives a JSON roundtrip', () => {
        const date = d(15, APRIL, 2000);
        expect(fromSerial(JSON.parse(JSON.stringify(date)))).toBe(date);
    })

    test.each([NaN, Infinity, -Infinity, 1.5, 2.5])('rejects invalid numeric input %s', value => {
        expect(() => fromSerial(value)).toThrow();
        expect(isValidWeekdayCode(value)).toBe(false);
        expect(isValidMonthCode(value)).toBe(false);
        expect(isValidWeekInMonthCode(value)).toBe(false);
        const date = d(1, JANUARY, 2000);
        for (const add of [addDays, addMonths, addYears]) {
            expect(() => add(value, date)).toThrow();
        }
    })
})

describe('date parts', () => {
    test.each([
        [1, JANUARY, 1900],
        [28, FEBRUARY, 1900],
        [1, MARCH, 1900],
        [29, FEBRUARY, 1904],
        [31, DECEMBER, 1904],
        [1, JANUARY, 1905],
        [31, DECEMBER, 2006],
        [31, DECEMBER, 9999],
    ] as [number, Month, number][])('%i.%i.%i', (day, month, year) => {
        const date = d(day, month, year);
        expect(serialToYear(date)).toBe(year);
        expect(serialToMonth(date)).toBe(month);
        expect(serialToDayOfMonth(date)).toBe(day);
    })

    test('serialToYear is exact at every year boundary', () => {
        for (let year = MINIMUM_YEAR_SUPPORTED; year <= MAXIMUM_YEAR_SUPPORTED; year++) {
            expect(serialToYear(d(1, JANUARY, year))).toBe(year);
            expect(serialToYear(d(31, DECEMBER, year))).toBe(year);
        }
    })

    test('roundtrip over the whole range', () => {
        for (let serial = SERIAL_LOWER_BOUND; serial <= SERIAL_UPPER_BOUND; serial += 97) {
            const date = fromSerial(serial);
            const year = serialToYear(date);
            const month = serialToMonth(date);
            const day = serialToDayOfMonth(date);
            expect(d(day, month, year)).toBe(date);
            expect(day).toBeGreaterThanOrEqual(1);
            expect(day).toBeLessThanOrEqual(lastDayOfMonth(month, year));
        }
    })

    test.each([
        [d(1, JANUARY, 1900), MONDAY],
        [d(7, JANUARY, 1900), SUNDAY],
        [d(1, MARCH, 2006), WEDNESDAY],
        [d(16, APRIL, 2006), SUNDAY],
    ])('serialToWeekday(%i) is %i', (date, weekday) => {
        expect(serialToWeekday(date)).toBe(weekday);
    })

    test.each([
        [d(1, JANUARY, 1900), new Date(1900, 0, 1), '1-January-1900'],
        [d(29, FEBRUARY, 2004), new Date(2004, 1, 29), '29-February-2004'],
        [d(31, DECEMBER, 9999), new Date(9999, 11, 31), '31-December-9999'],
    ])('%i is %s', (date, jsDate, text) => {
        expect(toDate(date)).toEqual(jsDate);
        expect(serialToString(date)).toBe(text);
    })
})

describe('arithmetic', () => {
    test.each([
        shift(1, d(1, JANUARY, 1900), d(2, JANUARY, 1900)),
        shift(31, d(1, JANUARY, 1900), d(1, FEBRUARY, 1900)),
        shift(365, d(1, JANUARY, 1900), d(1, JANUARY, 1901)),
        shift(5 * 365, d(1, JANUARY, 1900), d(31, DECEMBER, 1904)),
        shift(1, d(30, DECEMBER, 9999), d(31, DECEMBER, 9999)),
    ])('addDays: %s', (_, n, from, expected) => {
        expect(addDays(n, from)).toBe(expected);
    })

    test.each([
        shift(1, d(1, JANUARY, 1900), d(1, FEBRUARY, 1900)),
        shift(1, d(31, JANUARY, 1900), d(28, FEBRUARY, 1900)),
        shift(1, d(30, JANUARY, 1900), d(28, FEBRUARY, 1900)),
        shift(1, d(29, JANUARY, 1900), d(28, FEBRUARY, 1900)),
        shift(1, d(28, JANUARY, 1900), d(28, FEBRUARY, 1900)),
        shift(1, d(27, JANUARY, 1900), d(27, FEBRUARY, 1900)),
        shift(5, d(31, JANUARY, 1900), d(30, JUNE, 1900)),
        shift(17, d(31, JANUARY, 1900), d(30, JUNE, 1901)),
        shift(49, d(31, JANUARY, 1900), d(29, FEBRUARY, 1904)),
        shift(2, d(9, NOVEMBER, 2001), d(9, JANUARY, 2002)),
        shift(2, d(5, OCTOBER, 2003), d(5, DECEMBER, 2003)),
        shift(0, d(1, JANUARY, 2003), d(1, JANUARY, 2003)),
        shift(1, d(31, MAY, 2004), d(30, JUNE, 2004)),
        shift(2, d(31, MAY, 2004), d(31, JULY, 2004)),
        shift(-1, d(1, JANUARY, 2000), d(1, DECEMBER, 1999)),
    ])('addMonths: %s', (_, n, from, expected) => {
        expect(addMonths(n, from)).toBe(expected);
    })

    test('addMonths caps the day, so two single steps differ from one double step', () => {
        const may31 = d(31, MAY, 2004);
        expect(addMonths(1, addMonths(1, may31))).toBe(d(30, JULY, 2004));
    })

    test.each([
        shift(1, d(1, JANUARY, 1900), d(1, JANUARY, 1901)),
        shift(1, d(29, FEBRUARY, 1904), d(28, FEBRUARY, 1905)),
        shift(1, d(28, FEBRUARY, 1904), d(28, FEBRUARY, 1905)),
        shift(1, d(28, FEBRUARY, 1903), d(28, FEBRUARY, 1904)),
        shift(-1, d(1, JANUARY, 2000), d(1, JANUARY, 1999)),
    ])('addYears: %s', (_, n, from, expected) => {
        expect(addYears(n, from)).toBe(expected);
    })

    test.each(MONTH_TABLE)('end of month %i in 2006', (month, _name, _short, _quarter, daysInMonth) => {
        expect(getEndOfCurrentMonth(d(1, month, 2006))).toBe(d(daysInMonth, month, 2006));
    })

    test('end of February in a leap year', () => {
        expect(getEndOfCurrentMonth(d(1, FEBRUARY, 2008))).toBe(d(29, FEBRUARY, 2008));
    })

    test('results stay within the supported range', () => {
        expect(() => addDays(-1, d(1, JANUARY, 1900))).toThrow();
        expect(() => addDays(1, d(31, DECEMBER, 9999))).toThrow();
        expect(() => addMonths(1, d(31, DECEMBER, 9999))).toThrow();
        expect(() => addYears(-1, d(1, JANUARY, 1900))).toThrow();
    })

    test('fractional offsets are rejected even when rounding would hide them', () => {
        const date = d(1, JANUARY, 2000);
        expect(() => addDays(Number.EPSILON, date)).toThrow();
        expect(() => addMonths(Number.EPSILON, date)).toThrow();
        expect(() => addYears(0.5, date)).toThrow();
    })
})

describe('weekdays', () => {
    test.each([
        toWeekday(FRIDAY, d(1, MARCH, 2006), d(24, FEBRUARY, 2006)),
        toWeekday(WEDNESDAY, d(1, MARCH, 2006), d(22, FEBRUARY, 2006)),
        toWeekday(SUNDAY, d(3, MARCH, 2004), d(29, FEBRUARY, 2004)),
        toWeekday(WEDNESDAY, d(5, JANUARY, 2005), d(29, DECEMBER, 2004)),
        toWeekday(MONDAY, d(9, NOVEMBER, 2001), d(5, NOVEMBER, 2001)),
    ])('previous %s', (_, target, from, expected) => {
        expect(getPreviousDayOfWeek(target, from)).toBe(expected);
    })

    test.each([
        toWeekday(SATURDAY, d(26, DECEMBER, 2004), d(1, JANUARY, 2005)),
        toWeekday(WEDNESDAY, d(28, FEBRUARY, 2004), d(3, MARCH, 2004)),
        toWeekday(MONDAY, d(9, NOVEMBER, 2001), d(12, NOVEMBER, 2001)),
    ])('following %s', (_, target, from, expected) => {
        expect(getFollowingDayOfWeek(target, from)).toBe(expected);
    })

    // target weekday, start day and expected day, all in April 2006 (16 April was a Sunday)
    const NEAREST_IN_APRIL_2006: [Weekday, number, number][] = [
        [SUNDAY, 16, 16], [SUNDAY, 17, 16], [SUNDAY, 18, 16], [SUNDAY, 19, 16],
        [SUNDAY, 20, 23], [SUNDAY, 21, 23], [SUNDAY, 22, 23],
        [MONDAY, 17, 17], [MONDAY, 18, 17], [MONDAY, 19, 17], [MONDAY, 20, 17], [MONDAY, 21, 24], [MONDAY, 22, 24],
        [TUESDAY, 18, 18], [TUESDAY, 19, 18], [TUESDAY, 20, 18], [TUESDAY, 21, 18], [TUESDAY, 22, 25],
        [WEDNESDAY, 19, 19], [WEDNESDAY, 20, 19], [WEDNESDAY, 21, 19], [WEDNESDAY, 22, 19],
        [THURSDAY, 20, 20], [THURSDAY, 21, 20], [THURSDAY, 22, 20],
        [FRIDAY, 21, 21], [FRIDAY, 22, 21],
        [SATURDAY, 22, 22],
    ]
    test.each([
        ...NEAREST_IN_APRIL_2006.map(([target, from, expected]) => toWeekday(target, d(from, APRIL, 2006), d(expected, APRIL, 2006))),
        toWeekday(MONDAY, d(9, NOVEMBER, 2001), d(12, NOVEMBER, 2001)),
        toWeekday(MONDAY, d(22, JANUARY, 1970), d(19, JANUARY, 1970)),
    ])('nearest %s', (_, target, from, expected) => {
        expect(getNearestDayOfWeek(target, from)).toBe(expected);
    })

    test('invalid target weekdays', () => {
        const date = d(1, JANUARY, 2006);
        // @ts-expect-error invalid code is rejected by the compiler and at runtime
        expect(() => getPreviousDayOfWeek(-1, date)).toThrow();
        // @ts-expect-error invalid code is rejected by the compiler and at runtime
        expect(() => getFollowingDayOfWeek(-1, date)).toThrow();
        // @ts-expect-error invalid code is rejected by the compiler and at runtime
        expect(() => getNearestDayOfWeek(-1, date)).toThrow();
    })
})

describe('comparisons', () => {
    const earlier = d(1, JANUARY, 2006);
    const later = d(2, JANUARY, 2006);

    test('compare returns the difference in days', () => {
        expect(compare(earlier, later)).toBe(-1);
        expect(compare(earlier, earlier)).toBe(0);
        expect(compare(later, earlier)).toBe(1);
    })

    // results for (same, same), (earlier, later), (later, earlier)
    test.each([
        ['isOn', isOn, [true, false, false]],
        ['isBefore', isBefore, [false, true, false]],
        ['isOnOrBefore', isOnOrBefore, [true, true, false]],
        ['isAfter', isAfter, [false, false, true]],
        ['isOnOrAfter', isOnOrAfter, [true, false, true]],
    ] as [string, (a: SerialDate, b: SerialDate) => boolean, boolean[]][])('%s', (_, fn, [same, forward, backward]) => {
        expect(fn(earlier, earlier)).toBe(same);
        expect(fn(earlier, later)).toBe(forward);
        expect(fn(later, earlier)).toBe(backward);
    })

    const left = d(10, JANUARY, 2006);
    const middle = d(15, JANUARY, 2006);
    const right = d(20, JANUARY, 2006);
    const before = d(9, JANUARY, 2006);
    const after = d(21, JANUARY, 2006);

    // results for left bound, middle and right bound
    test.each([
        ['OPEN', DATE_INTERVAL.OPEN, [false, true, false]],
        ['CLOSED_LEFT', DATE_INTERVAL.CLOSED_LEFT, [true, true, false]],
        ['CLOSED_RIGHT', DATE_INTERVAL.CLOSED_RIGHT, [false, true, true]],
        ['CLOSED', DATE_INTERVAL.CLOSED, [true, true, true]],
    ] as [string, DateInterval, boolean[]][])('isInRange %s', (_, interval, [onLeft, inMiddle, onRight]) => {
        expect(isInRange(left, left, right, interval)).toBe(onLeft);
        expect(isInRange(middle, left, right, interval)).toBe(inMiddle);
        expect(isInRange(right, left, right, interval)).toBe(onRight);
        expect(isInRange(before, left, right, interval)).toBe(false);
        expect(isInRange(after, left, right, interval)).toBe(false);
        expect(isInRange(middle, right, left, interval)).toBe(true);
    })

    test('isInRange with swapped bounds, default interval and invalid interval', () => {
        expect(isInRange(left, right, left, DATE_INTERVAL.CLOSED_LEFT)).toBe(true);
        expect(isInRange(left, left, right)).toBe(true);
        expect(isInRange(right, left, right)).toBe(true);
        expect(isInRange(before, left, right)).toBe(false);
        expect(isInRange(after, left, right)).toBe(false);
        // @ts-expect-error invalid code is rejected by the compiler and at runtime
        expect(() => isInRange(left, left, right, 7)).toThrow();
    })
})

describe('constants and exports', () => {
    test('supported bounds', () => {
        expect(SERIAL_LOWER_BOUND).toBe(2);
        expect(SERIAL_UPPER_BOUND).toBe(2958465);
        expect(MINIMUM_YEAR_SUPPORTED).toBe(1900);
        expect(MAXIMUM_YEAR_SUPPORTED).toBe(9999);
        expect(d(1, JANUARY, MINIMUM_YEAR_SUPPORTED)).toBe(SERIAL_LOWER_BOUND);
        expect(d(31, DECEMBER, MAXIMUM_YEAR_SUPPORTED)).toBe(SERIAL_UPPER_BOUND);
    })

    test('exported name lists cannot change date formatting', () => {
        for (const names of [days, months]) {
            // @ts-expect-error exported lists are readonly and frozen at runtime
            expect(() => names.reverse()).toThrow(TypeError);
            // @ts-expect-error individual names cannot be overwritten either
            expect(() => { names[0] = 'Changed'; }).toThrow(TypeError);
        }
        expect(weekdayCodeToString(MONDAY)).toBe('Monday');
        expect(monthCodeToString(JANUARY)).toBe('January');
    })
})
