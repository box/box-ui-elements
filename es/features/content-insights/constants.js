const DOWNLOADS = 'DOWNLOADS';
const PREVIEWS = 'PREVIEWS';
const USERS = 'USERS';
export const METRIC = Object.freeze({
  DOWNLOADS,
  PREVIEWS,
  USERS
});
const WEEK = 'week';
const MONTH = 'month';
const THREEMONTHS = 'threemonths';
const YEAR = 'year';
export const PERIOD = Object.freeze({
  WEEK,
  MONTH,
  THREEMONTHS,
  YEAR
});
const ONE_WEEK = 'one_week';
const TWO_WEEKS = 'two_weeks';
const ONE_MONTH = 'one_month';
const TWO_MONTHS = 'two_months';
const THREE_MONTHS = 'three_months';
const SIX_MONTHS = 'six_months';
const ONE_YEAR = 'one_year';
const TWO_YEARS = 'two_years';
export const PRESET_TIMES = Object.freeze({
  ONE_WEEK,
  TWO_WEEKS,
  ONE_MONTH,
  TWO_MONTHS,
  THREE_MONTHS,
  SIX_MONTHS,
  ONE_YEAR,
  TWO_YEARS
});
export const PRESET_TO_TIMESTAMPS_MAP = {
  [PERIOD.WEEK]: {
    currentPeriod: PRESET_TIMES.ONE_WEEK,
    previousPeriod: PRESET_TIMES.TWO_WEEKS
  },
  [PERIOD.MONTH]: {
    currentPeriod: PRESET_TIMES.ONE_MONTH,
    previousPeriod: PRESET_TIMES.TWO_MONTHS
  },
  [PERIOD.THREEMONTHS]: {
    currentPeriod: PRESET_TIMES.THREE_MONTHS,
    previousPeriod: PRESET_TIMES.SIX_MONTHS
  },
  [PERIOD.YEAR]: {
    currentPeriod: PRESET_TIMES.ONE_YEAR,
    previousPeriod: PRESET_TIMES.TWO_YEARS
  }
};
//# sourceMappingURL=constants.js.map