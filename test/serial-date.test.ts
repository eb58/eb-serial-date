import {
    Month,
    DAYS,
    MONTHS,
    WEEKCODES,

    isLeapYear,
    leapYearCount,

    isValidWeekdayCode,
    isValidMonthCode,
    isValidWeekInMonthCode,

    stringToWeekdayCode,
    stringToMonthCode,

    weekdayCodeToString, 
    
    monthCodeToString, 
    monthCodeToShortString,
    monthCodeToQuarter,
    lastDayOfMonth,
    calcOrdinal,
    ordinalToYear,
    ordinalToMonth,
    ordinalToDayOfMonth,
    addDays,
    addMonths,
    addYears,
    ordinalToWeekday,
    getPreviousDayOfWeek,
    getFollowingDayOfWeek,
    getNearestDayOfWeek,
    getEndOfCurrentMonth,
    weekInMonthToString,
    relativeToString,
    fromSerial,
    fromDate,
    RELATIVE,
    DATE_INTERVAL,
    DateInterval,
    toDate,
    ordinalToString,
    compare,
    isOn,
    isBefore,
    isOnOrBefore,
    isAfter,
    isOnOrAfter,
    isInRange,
    getMonths,
    SERIAL_LOWER_BOUND,
    SERIAL_UPPER_BOUND,
    MINIMUM_YEAR_SUPPORTED,
    MAXIMUM_YEAR_SUPPORTED,
} from '../src/serial-date'

const d = calcOrdinal

const assertEquals = (a: unknown, b: unknown) => expect(a).toBe(b)
const assertTrue = (a: unknown) => expect(a).toBe(true)
const assertFalse = (a: unknown) => expect(a).toBe(false)


test('testset isValidWeekdayCode', () => {
    for (let day = 1; day <= 7; day++) expect(isValidWeekdayCode(day)).toBe(true);
    expect(isValidWeekdayCode(0)).toBe(false);
    expect(isValidWeekdayCode(8)).toBe(false);
})

test('testset isValidMonthCode', () => {
    for (let i = 1; i <= 12; i++) assertTrue(isValidMonthCode(i));
    assertFalse(isValidMonthCode(0));
    assertFalse(isValidMonthCode(13));
})

test('testset testStringToWeekdayCode', () => {
    expect(stringToWeekdayCode("Hello")).toBe(-1);
    expect(stringToWeekdayCode("Monday")).toBe(DAYS.MONDAY);
    expect(stringToWeekdayCode("Mon")).toBe(DAYS.MONDAY);
    expect(stringToWeekdayCode("Tuesday")).toBe(DAYS.TUESDAY);
    expect(stringToWeekdayCode("Tue")).toBe(DAYS.TUESDAY);
    expect(stringToWeekdayCode("Wednesday")).toBe(DAYS.WEDNESDAY);
    expect(stringToWeekdayCode("Wed")).toBe(DAYS.WEDNESDAY);
    expect(stringToWeekdayCode("Thursday")).toBe(DAYS.THURSDAY);
    expect(stringToWeekdayCode("Thu")).toBe(DAYS.THURSDAY);
    expect(stringToWeekdayCode("Friday")).toBe(DAYS.FRIDAY);
    expect(stringToWeekdayCode("Fri")).toBe(DAYS.FRIDAY);
    expect(stringToWeekdayCode("Saturday")).toBe(DAYS.SATURDAY);
    expect(stringToWeekdayCode("Sat")).toBe(DAYS.SATURDAY);
    expect(stringToWeekdayCode("Sunday")).toBe(DAYS.SUNDAY);
    expect(stringToWeekdayCode("Sun")).toBe(DAYS.SUNDAY);
    expect(stringToWeekdayCode(" Wednesday ")).toBe(DAYS.WEDNESDAY);
})

test('testset weekdayCodeToString', () => {
    expect(weekdayCodeToString(DAYS.SUNDAY)).toBe("Sunday");
    expect(weekdayCodeToString(DAYS.MONDAY)).toBe("Monday");
    expect(weekdayCodeToString(DAYS.TUESDAY)).toBe("Tuesday");
    expect(weekdayCodeToString(DAYS.WEDNESDAY)).toBe("Wednesday");
    expect(weekdayCodeToString(DAYS.THURSDAY)).toBe("Thursday");
    expect(weekdayCodeToString(DAYS.FRIDAY)).toBe("Friday");
    expect(weekdayCodeToString(DAYS.SATURDAY)).toBe("Saturday");
})


test('testset monthCodeToQuarter', () => {
    assertEquals(monthCodeToQuarter(MONTHS.JANUARY), 1);
    assertEquals(monthCodeToQuarter(MONTHS.FEBRUARY), 1);
    assertEquals(monthCodeToQuarter(MONTHS.MARCH), 1);
    assertEquals(monthCodeToQuarter(MONTHS.APRIL), 2);
    assertEquals(monthCodeToQuarter(MONTHS.MAY), 2);
    assertEquals(monthCodeToQuarter(MONTHS.JUNE), 2);
    assertEquals(monthCodeToQuarter(MONTHS.JULY), 3);
    assertEquals(monthCodeToQuarter(MONTHS.AUGUST), 3);
    assertEquals(monthCodeToQuarter(MONTHS.SEPTEMBER), 3);
    assertEquals(monthCodeToQuarter(MONTHS.OCTOBER), 4);
    assertEquals(monthCodeToQuarter(MONTHS.NOVEMBER), 4);
    assertEquals(monthCodeToQuarter(MONTHS.DECEMBER), 4);

    // @ts-expect-error invalid code is rejected by the compiler and at runtime
    expect(() => monthCodeToQuarter(-1)).toThrow();
})

test('testset monthCodeToString', () => {
    assertEquals("January", monthCodeToString(MONTHS.JANUARY));
    assertEquals("February", monthCodeToString(MONTHS.FEBRUARY));
    assertEquals("March", monthCodeToString(MONTHS.MARCH));
    assertEquals("April", monthCodeToString(MONTHS.APRIL));
    assertEquals("May", monthCodeToString(MONTHS.MAY));
    assertEquals("June", monthCodeToString(MONTHS.JUNE));
    assertEquals("July", monthCodeToString(MONTHS.JULY));
    assertEquals("August", monthCodeToString(MONTHS.AUGUST));
    assertEquals("September", monthCodeToString(MONTHS.SEPTEMBER));
    assertEquals("October", monthCodeToString(MONTHS.OCTOBER));
    assertEquals("November", monthCodeToString(MONTHS.NOVEMBER));
    assertEquals("December", monthCodeToString(MONTHS.DECEMBER));
    // @ts-expect-error invalid code is rejected by the compiler and at runtime
    expect(() => monthCodeToString(-1)).toThrow();
})

test('testset monthCodeToShortString', () => {
    assertEquals("Jan", monthCodeToShortString(MONTHS.JANUARY));
    assertEquals("Feb", monthCodeToShortString(MONTHS.FEBRUARY));
    assertEquals("Mar", monthCodeToShortString(MONTHS.MARCH));
    assertEquals("Apr", monthCodeToShortString(MONTHS.APRIL));
    assertEquals("May", monthCodeToShortString(MONTHS.MAY));
    assertEquals("Jun", monthCodeToShortString(MONTHS.JUNE));
    assertEquals("Jul", monthCodeToShortString(MONTHS.JULY));
    assertEquals("Aug", monthCodeToShortString(MONTHS.AUGUST));
    assertEquals("Sep", monthCodeToShortString(MONTHS.SEPTEMBER));
    assertEquals("Oct", monthCodeToShortString(MONTHS.OCTOBER));
    assertEquals("Nov", monthCodeToShortString(MONTHS.NOVEMBER));
    assertEquals("Dec", monthCodeToShortString(MONTHS.DECEMBER));

    // @ts-expect-error invalid code is rejected by the compiler and at runtime
    expect(() => monthCodeToShortString(-1)).toThrow();
})

test('testset isValidWeekInMonthCode', () => {
    for ( let w = 0; w <= 4; w++) {
        assertTrue(isValidWeekInMonthCode(w));
    }
    assertFalse(isValidWeekInMonthCode(5));
})

test('testset leapyear', () => {
    assertFalse(isLeapYear(1900));
    assertFalse(isLeapYear(1901));
    assertFalse(isLeapYear(1902));
    assertFalse(isLeapYear(1903));
    assertTrue(isLeapYear(1904));
    assertTrue(isLeapYear(1908));
    assertFalse(isLeapYear(1955));
    assertTrue(isLeapYear(1964));
    assertTrue(isLeapYear(1980));
    assertTrue(isLeapYear(2000));
    assertFalse(isLeapYear(2001));
    assertFalse(isLeapYear(2100));
})

test('testset leapYearCount', () => {
    assertEquals(0, leapYearCount(1899));
    assertEquals(0, leapYearCount(1900));
    assertEquals(0, leapYearCount(1901));
    assertEquals(0, leapYearCount(1902));
    assertEquals(0, leapYearCount(1903));
    assertEquals(1, leapYearCount(1904));
    assertEquals(1, leapYearCount(1905));
    assertEquals(1, leapYearCount(1906));
    assertEquals(1, leapYearCount(1907));
    assertEquals(2, leapYearCount(1908));
    assertEquals(24, leapYearCount(1999));
    assertEquals(25, leapYearCount(2000));
    assertEquals(25, leapYearCount(2001));
    assertEquals(49, leapYearCount(2101));
    assertEquals(73, leapYearCount(2201));
    assertEquals(97, leapYearCount(2301));
    assertEquals(122, leapYearCount(2401));
})

test('testset lastDayOfMonth', () => {

    assertEquals(31, lastDayOfMonth(MONTHS.JANUARY, 1901));
    assertEquals(28, lastDayOfMonth(MONTHS.FEBRUARY, 1901));
    assertEquals(31, lastDayOfMonth(MONTHS.MARCH, 1901));
    assertEquals(30, lastDayOfMonth(MONTHS.APRIL, 1901));
    assertEquals(31, lastDayOfMonth(MONTHS.MAY, 1901));
    assertEquals(30, lastDayOfMonth(MONTHS.JUNE, 1901));
    assertEquals(31, lastDayOfMonth(MONTHS.JULY, 1901));
    assertEquals(31, lastDayOfMonth(MONTHS.AUGUST, 1901));
    assertEquals(30, lastDayOfMonth(MONTHS.SEPTEMBER, 1901));
    assertEquals(31, lastDayOfMonth(MONTHS.OCTOBER, 1901));
    assertEquals(30, lastDayOfMonth(MONTHS.NOVEMBER, 1901));
    assertEquals(31, lastDayOfMonth(MONTHS.DECEMBER, 1901));
    assertEquals(29, lastDayOfMonth(MONTHS.FEBRUARY, 1904));
})

test('testset lastDayOfMonth in leap year only changes february', () => {
    assertEquals(31, lastDayOfMonth(MONTHS.JANUARY, 1904));
    assertEquals(31, lastDayOfMonth(MONTHS.MARCH, 1904));
    assertEquals(30, lastDayOfMonth(MONTHS.APRIL, 1904));
    assertEquals(31, lastDayOfMonth(MONTHS.DECEMBER, 1904));
})

test('testset calcOrdinal', () => {
    assertEquals(2, calcOrdinal(1, MONTHS.JANUARY, 1900));
    assertEquals(33, calcOrdinal(1, MONTHS.FEBRUARY, 1900));
    assertEquals(61, calcOrdinal(1, MONTHS.MARCH, 1900));
    assertEquals(367, calcOrdinal(1, MONTHS.JANUARY, 1901));
    assertEquals(2958465, calcOrdinal(31, MONTHS.DECEMBER, 9999));
})

test('testset calcOrdinal in leap year', () => {
    // 1904 is the first leap year after 1900
    assertEquals(calcOrdinal(1, MONTHS.MARCH, 1904) - calcOrdinal(1, MONTHS.FEBRUARY, 1904), 29);
    assertEquals(calcOrdinal(1, MONTHS.JANUARY, 1905) - calcOrdinal(1, MONTHS.JANUARY, 1904), 366);
})

test('testset addDays', () => {
    const newYear1900 = d(1, MONTHS.JANUARY, 1900);
    assertEquals(d(2, MONTHS.JANUARY, 1900), addDays(1, newYear1900));
    assertEquals(d(1, MONTHS.FEBRUARY, 1900), addDays(31, newYear1900));
    assertEquals(d(1, MONTHS.JANUARY, 1901), addDays(365, newYear1900));
    assertEquals(d(31, MONTHS.DECEMBER, 1904), addDays(5 * 365, newYear1900));
})


test('testset ordinalToYear, ordinalToMonth, ordinalToDayOfMonth', () => {
    const check = (day: number, month: Month, year: number) => {
        const ordinal = d(day, month, year);
        assertEquals(year, ordinalToYear(ordinal));
        assertEquals(month, ordinalToMonth(ordinal));
        assertEquals(day, ordinalToDayOfMonth(ordinal));
    }
    check(1, MONTHS.JANUARY, 1900);
    check(28, MONTHS.FEBRUARY, 1900);
    check(1, MONTHS.MARCH, 1900);
    check(29, MONTHS.FEBRUARY, 1904);
    check(31, MONTHS.DECEMBER, 1904);
    check(1, MONTHS.JANUARY, 1905);
    check(31, MONTHS.DECEMBER, 2006);
    check(31, MONTHS.DECEMBER, 9999);
})

test('testset ordinalToYear, ordinalToMonth, ordinalToDayOfMonth roundtrip', () => {
    for (let serial = SERIAL_LOWER_BOUND; serial <= SERIAL_UPPER_BOUND; serial += 97) {
        const ordinal = fromSerial(serial);
        const year = ordinalToYear(ordinal);
        const month = ordinalToMonth(ordinal);
        const day = ordinalToDayOfMonth(ordinal);
        assertEquals(ordinal, d(day, month, year));
        assertTrue(day >= 1 && day <= lastDayOfMonth(month, year));
    }
})

test('testset addMonths', () => {
    assertEquals(d(1, MONTHS.FEBRUARY, 1900), addMonths(1, d(1, MONTHS.JANUARY, 1900)));
    assertEquals(d(28, MONTHS.FEBRUARY, 1900), addMonths(1, d(31, MONTHS.JANUARY, 1900)));
    assertEquals(d(28, MONTHS.FEBRUARY, 1900), addMonths(1, d(30, MONTHS.JANUARY, 1900)));
    assertEquals(d(28, MONTHS.FEBRUARY, 1900), addMonths(1, d(29, MONTHS.JANUARY, 1900)));
    assertEquals(d(28, MONTHS.FEBRUARY, 1900), addMonths(1, d(28, MONTHS.JANUARY, 1900)));
    assertEquals(d(27, MONTHS.FEBRUARY, 1900), addMonths(1, d(27, MONTHS.JANUARY, 1900)));

    assertEquals(d(30, MONTHS.JUNE, 1900), addMonths(5, d(31, MONTHS.JANUARY, 1900)));
    assertEquals(d(30, MONTHS.JUNE, 1901), addMonths(17, d(31, MONTHS.JANUARY, 1900)));

    assertEquals(d(29, MONTHS.FEBRUARY, 1904), addMonths(49, d(31, MONTHS.JANUARY, 1900)));

    assertEquals(d(9, MONTHS.JANUARY, 2002), addMonths(2, d(9, MONTHS.NOVEMBER, 2001)));
    assertEquals(d(5, MONTHS.DECEMBER, 2003), addMonths(2, d(5, MONTHS.OCTOBER, 2003)));
    assertEquals(d(1, MONTHS.JANUARY, 2003), addMonths(0, d(1, MONTHS.JANUARY, 2003)));

    const may31 = d(31, MONTHS.MAY, 2004);
    assertEquals(d(30, MONTHS.JUNE, 2004), addMonths(1, may31));
    assertEquals(d(31, MONTHS.JULY, 2004), addMonths(2, may31));
    assertEquals(d(30, MONTHS.JULY, 2004), addMonths(1, addMonths(1, may31)));

})

test('testset addYears', () => {

    assertEquals(d(1, MONTHS.JANUARY, 1901), addYears(1, d(1, MONTHS.JANUARY, 1900)));
    assertEquals(d(28, MONTHS.FEBRUARY, 1905), addYears(1, d(29, MONTHS.FEBRUARY, 1904)));
    assertEquals(d(28, MONTHS.FEBRUARY, 1905), addYears(1, d(28, MONTHS.FEBRUARY, 1904)));
    assertEquals(d(28, MONTHS.FEBRUARY, 1904), addYears(1, d(28, MONTHS.FEBRUARY, 1903)));
})

test('testset ordinalToWeekday', () => {
    assertEquals(DAYS.MONDAY, ordinalToWeekday(d(1, MONTHS.JANUARY, 1900)));
    assertEquals(DAYS.SUNDAY, ordinalToWeekday(d(7, MONTHS.JANUARY, 1900)));
    assertEquals(DAYS.WEDNESDAY, ordinalToWeekday(d(1, MONTHS.MARCH, 2006)));
    assertEquals(DAYS.SUNDAY, ordinalToWeekday(d(16, MONTHS.APRIL, 2006)));
})

test('testset getPreviousDayOfWeek', () => {

    assertEquals(d(24, MONTHS.FEBRUARY, 2006), getPreviousDayOfWeek(DAYS.FRIDAY, d(1, MONTHS.MARCH, 2006)));
    assertEquals(d(22, MONTHS.FEBRUARY, 2006), getPreviousDayOfWeek(DAYS.WEDNESDAY, d(1, MONTHS.MARCH, 2006)));
    assertEquals(d(29, MONTHS.FEBRUARY, 2004), getPreviousDayOfWeek(DAYS.SUNDAY, d(3, MONTHS.MARCH, 2004)));
    assertEquals(d(29, MONTHS.DECEMBER, 2004), getPreviousDayOfWeek(DAYS.WEDNESDAY, d(5, MONTHS.JANUARY, 2005)));

    // @ts-expect-error invalid code is rejected by the compiler and at runtime
    expect(() => getPreviousDayOfWeek(-1, d(1, MONTHS.JANUARY, 2006))).toThrow();
})

test('testset getFollowingDayOfWeek', () => {
    assertEquals(d(1, MONTHS.JANUARY, 2005), getFollowingDayOfWeek(DAYS.SATURDAY, d(26, MONTHS.DECEMBER, 2004)));
    assertEquals(d(3, MONTHS.MARCH, 2004), getFollowingDayOfWeek(DAYS.WEDNESDAY, d(28, MONTHS.FEBRUARY, 2004)));

    // @ts-expect-error invalid code is rejected by the compiler and at runtime
    expect(() => getFollowingDayOfWeek(-1, d(1, MONTHS.JANUARY, 2006))).toThrow();
})

test('testset getNearestDayOfWeek', () => {

    assertEquals(d(16, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.SUNDAY, d(16, MONTHS.APRIL, 2006)));
    assertEquals(d(16, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.SUNDAY, d(17, MONTHS.APRIL, 2006)));
    assertEquals(d(16, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.SUNDAY, d(18, MONTHS.APRIL, 2006)));
    assertEquals(d(16, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.SUNDAY, d(19, MONTHS.APRIL, 2006)));
    assertEquals(d(23, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.SUNDAY, d(20, MONTHS.APRIL, 2006)));
    assertEquals(d(23, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.SUNDAY, d(21, MONTHS.APRIL, 2006)));
    assertEquals(d(23, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.SUNDAY, d(22, MONTHS.APRIL, 2006)));

    assertEquals(d(17, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.MONDAY, d(17, MONTHS.APRIL, 2006)));
    assertEquals(d(17, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.MONDAY, d(18, MONTHS.APRIL, 2006)));
    assertEquals(d(17, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.MONDAY, d(19, MONTHS.APRIL, 2006)));
    assertEquals(d(17, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.MONDAY, d(20, MONTHS.APRIL, 2006)));
    assertEquals(d(24, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.MONDAY, d(21, MONTHS.APRIL, 2006)));
    assertEquals(d(24, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.MONDAY, d(22, MONTHS.APRIL, 2006)));

    assertEquals(d(18, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.TUESDAY, d(18, MONTHS.APRIL, 2006)));
    assertEquals(d(18, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.TUESDAY, d(19, MONTHS.APRIL, 2006)));
    assertEquals(d(18, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.TUESDAY, d(20, MONTHS.APRIL, 2006)));
    assertEquals(d(18, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.TUESDAY, d(21, MONTHS.APRIL, 2006)));
    assertEquals(d(25, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.TUESDAY, d(22, MONTHS.APRIL, 2006)));

    assertEquals(d(19, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.WEDNESDAY, d(19, MONTHS.APRIL, 2006)));
    assertEquals(d(19, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.WEDNESDAY, d(20, MONTHS.APRIL, 2006)));
    assertEquals(d(19, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.WEDNESDAY, d(21, MONTHS.APRIL, 2006)));
    assertEquals(d(19, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.WEDNESDAY, d(22, MONTHS.APRIL, 2006)));

    assertEquals(d(20, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.THURSDAY, d(20, MONTHS.APRIL, 2006)));
    assertEquals(d(20, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.THURSDAY, d(21, MONTHS.APRIL, 2006)));
    assertEquals(d(20, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.THURSDAY, d(22, MONTHS.APRIL, 2006)));

    assertEquals(d(21, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.FRIDAY, d(21, MONTHS.APRIL, 2006)));
    assertEquals(d(21, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.FRIDAY, d(22, MONTHS.APRIL, 2006)));

    assertEquals(d(22, MONTHS.APRIL, 2006), getNearestDayOfWeek(DAYS.SATURDAY, d(22, MONTHS.APRIL, 2006)));

    // @ts-expect-error invalid code is rejected by the compiler and at runtime
    expect(() => getNearestDayOfWeek(-1, d(1, MONTHS.JANUARY, 2006))).toThrow();
})

test('weekday calculations from the original JCommon tests', () => {
    const november9 = d(9, MONTHS.NOVEMBER, 2001);
    assertEquals(d(5, MONTHS.NOVEMBER, 2001), getPreviousDayOfWeek(DAYS.MONDAY, november9));
    assertEquals(d(12, MONTHS.NOVEMBER, 2001), getFollowingDayOfWeek(DAYS.MONDAY, november9));
    assertEquals(d(12, MONTHS.NOVEMBER, 2001), getNearestDayOfWeek(DAYS.MONDAY, november9));
    assertEquals(d(19, MONTHS.JANUARY, 1970), getNearestDayOfWeek(DAYS.MONDAY, d(22, MONTHS.JANUARY, 1970)));
})

test('testset getEndOfCurrentMonth', () => {
    assertEquals(d(31, MONTHS.JANUARY, 2006), getEndOfCurrentMonth(d(1, MONTHS.JANUARY, 2006)));
    assertEquals(d(28, MONTHS.FEBRUARY, 2006), getEndOfCurrentMonth(d(1, MONTHS.FEBRUARY, 2006)));
    assertEquals(d(31, MONTHS.MARCH, 2006), getEndOfCurrentMonth(d(1, MONTHS.MARCH, 2006)));
    assertEquals(d(30, MONTHS.APRIL, 2006), getEndOfCurrentMonth(d(1, MONTHS.APRIL, 2006)));
    assertEquals(d(31, MONTHS.MAY, 2006), getEndOfCurrentMonth(d(1, MONTHS.MAY, 2006)));
    assertEquals(d(30, MONTHS.JUNE, 2006), getEndOfCurrentMonth(d(1, MONTHS.JUNE, 2006)));
    assertEquals(d(31, MONTHS.JULY, 2006), getEndOfCurrentMonth(d(1, MONTHS.JULY, 2006)));
    assertEquals(d(31, MONTHS.AUGUST, 2006), getEndOfCurrentMonth(d(1, MONTHS.AUGUST, 2006)));
    assertEquals(d(30, MONTHS.SEPTEMBER, 2006), getEndOfCurrentMonth(d(1, MONTHS.SEPTEMBER, 2006)));
    assertEquals(d(31, MONTHS.OCTOBER, 2006), getEndOfCurrentMonth(d(1, MONTHS.OCTOBER, 2006)));
    assertEquals(d(30, MONTHS.NOVEMBER, 2006), getEndOfCurrentMonth(d(1, MONTHS.NOVEMBER, 2006)));
    assertEquals(d(31, MONTHS.DECEMBER, 2006), getEndOfCurrentMonth(d(1, MONTHS.DECEMBER, 2006)));
    assertEquals(d(29, MONTHS.FEBRUARY, 2008), getEndOfCurrentMonth(d(1, MONTHS.FEBRUARY, 2008)));
})

test('testset weekInMonthToString', () => {
    assertEquals("First", weekInMonthToString(WEEKCODES.FIRST_WEEK_IN_MONTH));
    assertEquals("Second", weekInMonthToString(WEEKCODES.SECOND_WEEK_IN_MONTH));
    assertEquals("Third", weekInMonthToString(WEEKCODES.THIRD_WEEK_IN_MONTH));
    assertEquals("Fourth", weekInMonthToString(WEEKCODES.FOURTH_WEEK_IN_MONTH));
    assertEquals("Last", weekInMonthToString(WEEKCODES.LAST_WEEK_IN_MONTH));
    // @ts-expect-error invalid code is rejected by the compiler and at runtime
    expect(() => weekInMonthToString(5)).toThrow();
})

test('testset relativeToString', () => {
    assertEquals("Preceding", relativeToString(RELATIVE.PRECEDING));
    assertEquals("Nearest", relativeToString(RELATIVE.NEAREST));
    assertEquals("Following", relativeToString(RELATIVE.FOLLOWING));
    // @ts-expect-error invalid code is rejected by the compiler and at runtime
    expect(() => relativeToString(2)).toThrow();
})

test('testset date parts of a calculated date', () => {
    const date = d(1, MONTHS.JANUARY, 1900);
    assertEquals(1, ordinalToDayOfMonth(date));
    assertEquals(MONTHS.JANUARY, ordinalToMonth(date));
    assertEquals(1900, ordinalToYear(date));
    assertEquals(2, date);
})

test('testset fromSerial', () => {
    assertEquals(d(1, MONTHS.JANUARY, 1900), fromSerial(2));
    assertEquals(d(1, MONTHS.JANUARY, 1901), fromSerial(367));
    expect(() => fromSerial(1)).toThrow();
    expect(() => fromSerial(2958466)).toThrow();
})

test('testset fromDate', () => {
    assertEquals(d(1, MONTHS.JANUARY, 1900), fromDate(new Date(1900, 0, 1)));
    assertEquals(d(1, MONTHS.JANUARY, 2006), fromDate(new Date(2006, 0, 1)));
    expect(() => fromDate(new Date(1899, 11, 31))).toThrow();
    expect(() => fromDate(new Date(10000, 0, 1))).toThrow();
})

test('serial date survives a JSON roundtrip', () => {
    const date = d(15, MONTHS.APRIL, 2000);
    assertEquals(date, fromSerial(JSON.parse(JSON.stringify(date))));
})

test('testset toDate', () => {
    expect(toDate(d(1, MONTHS.JANUARY, 1900))).toEqual(new Date(1900, 0, 1));
    expect(toDate(d(29, MONTHS.FEBRUARY, 2004))).toEqual(new Date(2004, 1, 29));
    expect(toDate(d(31, MONTHS.DECEMBER, 9999))).toEqual(new Date(9999, 11, 31));
})

test('testset ordinalToString', () => {
    assertEquals("1-January-1900", ordinalToString(d(1, MONTHS.JANUARY, 1900)));
    assertEquals("29-February-2004", ordinalToString(d(29, MONTHS.FEBRUARY, 2004)));
    assertEquals("31-December-9999", ordinalToString(d(31, MONTHS.DECEMBER, 9999)));
})

test('testset compare', () => {
    const d1 = d(1, MONTHS.JANUARY, 2006);
    const d2 = d(2, MONTHS.JANUARY, 2006);
    assertTrue(compare(d1, d2) < 0);
    assertEquals(0, compare(d1, d1));
    assertTrue(compare(d2, d1) > 0);
})

test('testset isOn, isBefore, isOnOrBefore, isAfter, isOnOrAfter', () => {
    const d1 = d(1, MONTHS.JANUARY, 2006);
    const d2 = d(2, MONTHS.JANUARY, 2006);

    assertTrue(isOn(d1, d1));
    assertFalse(isOn(d1, d2));

    assertTrue(isBefore(d1, d2));
    assertFalse(isBefore(d1, d1));
    assertFalse(isBefore(d2, d1));

    assertTrue(isOnOrBefore(d1, d2));
    assertTrue(isOnOrBefore(d1, d1));
    assertFalse(isOnOrBefore(d2, d1));

    assertTrue(isAfter(d2, d1));
    assertFalse(isAfter(d1, d1));
    assertFalse(isAfter(d1, d2));

    assertTrue(isOnOrAfter(d2, d1));
    assertTrue(isOnOrAfter(d1, d1));
    assertFalse(isOnOrAfter(d1, d2));
})

test('testset isInRange', () => {
    const left = d(10, MONTHS.JANUARY, 2006);
    const middle = d(15, MONTHS.JANUARY, 2006);
    const right = d(20, MONTHS.JANUARY, 2006);
    const before = d(9, MONTHS.JANUARY, 2006);
    const after = d(21, MONTHS.JANUARY, 2006);
    const check = (interval: DateInterval, expected: boolean[]) => {
        const [onLeft, inMiddle, onRight] = expected;
        assertEquals(onLeft, isInRange(left, left, right, interval));
        assertEquals(inMiddle, isInRange(middle, left, right, interval));
        assertEquals(onRight, isInRange(right, left, right, interval));
        assertFalse(isInRange(before, left, right, interval));
        assertFalse(isInRange(after, left, right, interval));
    }
    check(DATE_INTERVAL.OPEN, [false, true, false]);
    check(DATE_INTERVAL.CLOSED_LEFT, [true, true, false]);
    check(DATE_INTERVAL.CLOSED_RIGHT, [false, true, true]);
    check(DATE_INTERVAL.CLOSED, [true, true, true]);
})

test('testset isInRange with swapped bounds and invalid interval', () => {
    const left = d(10, MONTHS.JANUARY, 2006);
    const right = d(20, MONTHS.JANUARY, 2006);
    assertTrue(isInRange(d(15, MONTHS.JANUARY, 2006), right, left, DATE_INTERVAL.OPEN));
    assertTrue(isInRange(left, right, left, DATE_INTERVAL.CLOSED_LEFT));
    // @ts-expect-error invalid code is rejected by the compiler and at runtime
    expect(() => isInRange(left, left, right, 7)).toThrow();
})

test('testset isInRange without interval includes both bounds', () => {
    const left = d(10, MONTHS.JANUARY, 2006);
    const right = d(20, MONTHS.JANUARY, 2006);
    assertTrue(isInRange(left, left, right));
    assertTrue(isInRange(d(15, MONTHS.JANUARY, 2006), right, left));
    assertTrue(isInRange(right, left, right));
    assertFalse(isInRange(d(9, MONTHS.JANUARY, 2006), left, right));
    assertFalse(isInRange(d(21, MONTHS.JANUARY, 2006), left, right));
})

test('testset getMonths', () => {
    assertEquals(12, getMonths().length);
    assertEquals("January", getMonths()[0]);
    assertEquals("December", getMonths()[11]);
    assertEquals("January", getMonths(false)[0]);
    assertEquals("Jan", getMonths(true)[0]);
    assertEquals("Dec", getMonths(true)[11]);
})

test('testset stringToMonthCode with numbers', () => {
    for (let month = 1; month <= 12; month++) {
        assertEquals(month, stringToMonthCode(String(month)));
    }
    assertEquals(9, stringToMonthCode(" 9 "));
    assertEquals(-1, stringToMonthCode("0"));
    assertEquals(-1, stringToMonthCode("13"));
    assertEquals(-1, stringToMonthCode("Hello"));
    assertEquals(MONTHS.JANUARY, stringToMonthCode("January"));
    assertEquals(MONTHS.JANUARY, stringToMonthCode(" January "));
    assertEquals(MONTHS.MARCH, stringToMonthCode("Mar"));

    for (const month of Object.values(MONTHS)) {
        assertEquals(month, stringToMonthCode(monthCodeToString(month)));
        assertEquals(month, stringToMonthCode(monthCodeToShortString(month)));
    }
})

test('testset supported bounds', () => {
    assertEquals(2, SERIAL_LOWER_BOUND);
    assertEquals(2958465, SERIAL_UPPER_BOUND);
    assertEquals(1900, MINIMUM_YEAR_SUPPORTED);
    assertEquals(9999, MAXIMUM_YEAR_SUPPORTED);
})

test('testset calcOrdinal validates its arguments', () => {
    expect(() => calcOrdinal(1, MONTHS.JANUARY, 1899)).toThrow();
    expect(() => calcOrdinal(1, MONTHS.JANUARY, 10000)).toThrow();
    // @ts-expect-error invalid code is rejected by the compiler and at runtime
    expect(() => calcOrdinal(1, 0, 2006)).toThrow();
    // @ts-expect-error invalid code is rejected by the compiler and at runtime
    expect(() => calcOrdinal(1, 13, 2006)).toThrow();
    expect(() => calcOrdinal(0, MONTHS.JANUARY, 2006)).toThrow();
    expect(() => calcOrdinal(32, MONTHS.JANUARY, 2006)).toThrow();
    expect(() => calcOrdinal(29, MONTHS.FEBRUARY, 1901)).toThrow();
    expect(() => calcOrdinal(31, MONTHS.APRIL, 2006)).toThrow();
    expect(() => calcOrdinal(1.5, MONTHS.JANUARY, 2006)).toThrow();
    assertEquals(SERIAL_LOWER_BOUND, calcOrdinal(1, MONTHS.JANUARY, 1900));
    assertEquals(SERIAL_UPPER_BOUND, calcOrdinal(31, MONTHS.DECEMBER, 9999));
    assertTrue(calcOrdinal(29, MONTHS.FEBRUARY, 1904) > 0);
})

test('testset date arithmetic stays within the supported range', () => {
    expect(() => addDays(-1, d(1, MONTHS.JANUARY, 1900))).toThrow();
    expect(() => addDays(1, d(31, MONTHS.DECEMBER, 9999))).toThrow();
    expect(() => addMonths(1, d(31, MONTHS.DECEMBER, 9999))).toThrow();
    expect(() => addYears(-1, d(1, MONTHS.JANUARY, 1900))).toThrow();
    assertEquals(d(31, MONTHS.DECEMBER, 9999), addDays(1, d(30, MONTHS.DECEMBER, 9999)));
})
