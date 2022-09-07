// @flow
const DOWNLOADS: 'DOWNLOADS' = 'DOWNLOADS';
const PREVIEWS: 'PREVIEWS' = 'PREVIEWS';
const USERS: 'USERS' = 'USERS';

export const METRIC = Object.freeze({
    DOWNLOADS,
    PREVIEWS,
    USERS,
});

const WEEK: 'week' = 'week';
const MONTH: 'month' = 'month';
const THREEMONTHS: 'threemonths' = 'threemonths';
const YEAR: 'year' = 'year';

export const PERIOD = Object.freeze({
    WEEK,
    MONTH,
    THREEMONTHS,
    YEAR,
});

const ONE_WEEK: 'one_week' = 'one_week';
const TWO_WEEKS: 'two_weeks' = 'two_weeks';
const ONE_MONTH: 'one_month' = 'one_month';
const TWO_MONTHS: 'two_months' = 'two_months';
const THREE_MONTHS: 'three_months' = 'three_months';
const SIX_MONTHS: 'six_months' = 'six_months';
const ONE_YEAR: 'one_year' = 'one_year';
const TWO_YEARS: 'two_years' = 'two_years';

export const PRESET_TIMES = Object.freeze({
    ONE_WEEK,
    TWO_WEEKS,
    ONE_MONTH,
    TWO_MONTHS,
    THREE_MONTHS,
    SIX_MONTHS,
    ONE_YEAR,
    TWO_YEARS,
});

export const PRESET_TO_TIMESTAMPS_MAP = {
    [PERIOD.WEEK]: {
        currentPeriod: PRESET_TIMES.ONE_WEEK,
        previousPeriod: PRESET_TIMES.TWO_WEEKS,
    },
    [PERIOD.MONTH]: {
        currentPeriod: PRESET_TIMES.ONE_MONTH,
        previousPeriod: PRESET_TIMES.TWO_MONTHS,
    },
    [PERIOD.THREEMONTHS]: {
        currentPeriod: PRESET_TIMES.THREE_MONTHS,
        previousPeriod: PRESET_TIMES.SIX_MONTHS,
    },
    [PERIOD.YEAR]: {
        currentPeriod: PRESET_TIMES.ONE_YEAR,
        previousPeriod: PRESET_TIMES.TWO_YEARS,
    },
};
