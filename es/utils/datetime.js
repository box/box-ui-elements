import isNaN from 'lodash/isNaN';
const MILLISECONDS_PER_SECOND = 1000;
// 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * MILLISECONDS_PER_SECOND;
// 60 sec * 1000
const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;

/**
 * RegExp matcher for acceptable ISO 8601 date formats w/ timezone (see below)
 * Capture groups structured as follows:
 * 1) the date/time portion (2018-06-13T00:00:00.000)
 * 2) the milliseconds (if matched)
 * 3) the timezone portion (e.g., Z, +03, -0400, +05:00)
 * 4) the Z format for timezone (if matched)
 * 5) the short format for timezone (if matched)
 * 6) the colon-less format for timezone (if matched)
 * 7) the colon long format for timezone (if matched)
 */
const RE_ISO8601_DATE = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?)?((Z$)|(?:[+-](?:([0-2]\d$)|([0-2]\d(?:00|30)$)|([0-2]\d:(?:00|30)$))))$/;
const ISO8601_DATETIME = 1;
const ISO8601_MILLISECONDS = 2;
const ISO8601_TIMEZONE = 3;
const ISO8601_Z_FMT = 4;
const ISO8601_SHORT_FMT = 5;
const ISO8601_MEDIUM_FMT = 6;
const ISO8601_LONG_FMT = 7;

/**
 * Helper to normalize a date value to a date object
 * @param dateValue - Date number, string, or object
 * @returns {Date} the normalized date object
 */
function convertToDate(dateValue) {
  return dateValue instanceof Date ? dateValue : new Date(dateValue);
}

/**
 * Converts an integer value in seconds to milliseconds.
 * @param {number} seconds - The value in seconds
 * @returns {number} the value in milliseconds
 */
function convertToMs(seconds) {
  return seconds * MILLISECONDS_PER_SECOND;
}

/**
 * Checks whether the given date value (in unix milliseconds) is today.
 * @param dateValue - Date object or integer representing the number of milliseconds since 1/1/1970 UTC
 * @returns whether the given value is today
 */
function isToday(dateValue) {
  return new Date().toDateString() === convertToDate(dateValue).toDateString();
}

/**
 * Checks whether the given date value (in unix milliseconds) is yesterday.
 * @param dateValue - Date object or integer or representing the number of milliseconds since 1/1/1970 UTC
 * @returns whether the given value is yesterday
 */
function isYesterday(dateValue) {
  return isToday(convertToDate(dateValue).getTime() + MILLISECONDS_PER_DAY);
}

/**
 * Checks whether the given date value (in unix milliseconds) is tomorrow.
 * @param dateValue - Date object or integer or representing the number of milliseconds since 1/1/1970 UTC
 * @returns whether the given value is tomorrow
 */
function isTomorrow(dateValue) {
  return isToday(convertToDate(dateValue).getTime() - MILLISECONDS_PER_DAY);
}

/**
 * Checks whether the given date value (in unix milliseconds) is in the current month.
 * @param dateValue - Date object or integer representing the number of milliseconds since 1/1/1970 UTC
 * @returns whether the given value is in the current month
 */
function isCurrentMonth(dateValue) {
  return new Date().getMonth() === convertToDate(dateValue).getMonth();
}

/**
 * Checks whether the given date value (in unix milliseconds) is in the current year.
 * @param dateValue - Date object or integer representing the number of milliseconds since 1/1/1970 UTC
 * @returns whether the given value is in the current year
 */
function isCurrentYear(dateValue) {
  return new Date().getFullYear() === convertToDate(dateValue).getFullYear();
}

/**
 * Formats a number of seconds as a time string
 *
 * @param seconds - seconds
 * @returns a string formatted like 3:57:35
 */
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 3600 % 60);
  const hour = h > 0 ? `${h.toString()}:` : '';
  const sec = s < 10 ? `0${s.toString()}` : s.toString();
  let min = m.toString();
  if (h > 0 && m < 10) {
    min = `0${min}`;
  }
  return `${hour}${min}:${sec}`;
}

/**
 * Adds time to a given dateValue
 *
 * @param {number|Date} dateValue - date or integer value to add time to
 * @param {number} timeToAdd - amount of time to add in ms
 * @returns {number|Date} the modified date or integer
 */
function addTime(dateValue, timeToAdd) {
  if (dateValue instanceof Date) {
    return new Date(dateValue.getTime() + timeToAdd);
  }
  return dateValue + timeToAdd;
}

/**
 * Will convert
 *      2018-06-13T07:00:00.000Z
 * to
 *      2018-06-13T00:00:00.000Z
 *
 * That is, it will give you the unix time in ms for midnight of the given
 * date in UTC timezone. This is the opposite of convertISOStringToUTCDate
 *
 * @param {Date} date - the date to be converted to midnight
 * @returns {number} the unix time in ms for midnight of the given date
 */
function convertDateToUnixMidnightTime(date) {
  // date is localized to 00:00:00 at system/browser timezone
  const utcUnixTimeInMs = date.getTime();

  // timezone an integer offset; minutes behind GMT
  // we use the browser timezone offset instead of the user's,
  // because the datepicker uses the browser to get the "midnight"
  // time in the user's timezone with getTime()
  const timezoneOffsetInMins = date.getTimezoneOffset();
  const timezoneOffsetInMs = timezoneOffsetInMins * MILLISECONDS_PER_MINUTE;

  // we need the unix/epoch time for midnight on the date selected
  const unixDayMidnightTime = utcUnixTimeInMs - timezoneOffsetInMs;
  return unixDayMidnightTime;
}

/**
 * Will check to see if a date object is not valid, according to the browser
 * JS engine.
 *
 * @param {Date} date - the date to be validated
 * @returns {boolean} whether the date value passes validation
 */
function isValidDate(date) {
  return !isNaN(date.getTime());
}

/**
 * Will convert ISO8601-compatible dates (with zone designators)
 *      2018-06-13T00:00:00.000-0500
 *      or
 *      2018-06-13T00:00:00.000-05
 *
 * to
 *      2018-06-13T00:00:00.000-05:00
 *
 * Equivalent formats between the two (e.g., uzing 'Z') will remain unchanged.
 * If the date format cannot be converted, it will pass along the existing value
 *
 * @param {string} isoString - the date to be converted
 * @returns {string} converted date format, if applicable
 */
function convertISOStringtoRFC3339String(isoString) {
  // test that the date format inbound is ISO8601-compatible
  if (RE_ISO8601_DATE.test(isoString)) {
    // if it is, parse out the timezone part if it's in a longer format
    // use the capture groups instead of the split result for the datetime and the time zone
    const parseDate = isoString.split(RE_ISO8601_DATE);
    let dateTime = parseDate[ISO8601_DATETIME];
    const milliseconds = parseDate[ISO8601_MILLISECONDS];
    const timeZone = parseDate[ISO8601_TIMEZONE];

    // add milliseconds if missing, to standardize output
    if (!milliseconds) {
      dateTime += '.000';
    }
    if (parseDate[ISO8601_Z_FMT]) {
      return isoString;
    }
    if (parseDate[ISO8601_SHORT_FMT]) {
      return `${dateTime + timeZone}:00`;
    }
    if (parseDate[ISO8601_MEDIUM_FMT]) {
      return `${dateTime + timeZone.substr(0, 3)}:${timeZone.substr(3)}`;
    }
    if (parseDate[ISO8601_LONG_FMT]) {
      return isoString;
    }
  }
  return isoString;
}

/**
 * Will convert
 *      2018-06-13T00:00:00.000Z
 * to
 *      2018-06-13T07:00:00.000Z
 *
 * This is the opposite of convertDateToUnixMidnightTime
 *
 * @param {string} isoString - ISO string in UTC time zone
 * @returns {Date} date in UTC time zone
 */
function convertISOStringToUTCDate(isoString) {
  // get date in UTC midnight time
  const utcDate = new Date(convertISOStringtoRFC3339String(isoString));
  const utcTime = utcDate.getTime();

  // get browser's timezone
  const timezoneOffsetInMins = utcDate.getTimezoneOffset();
  const timezoneOffsetInMs = timezoneOffsetInMins * MILLISECONDS_PER_MINUTE;

  // return date in utc timezone
  const localizedUnixTimeInMs = utcTime + timezoneOffsetInMs;
  return new Date(localizedUnixTimeInMs);
}
export { addTime, convertDateToUnixMidnightTime, convertISOStringtoRFC3339String, convertISOStringToUTCDate, convertToDate, convertToMs, formatTime, isCurrentMonth, isCurrentYear, isToday, isTomorrow, isValidDate, isYesterday };
//# sourceMappingURL=datetime.js.map