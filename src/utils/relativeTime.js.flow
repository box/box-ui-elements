// @flow
// Helper function used to calculate relative time (for use with react-intl)

const WEEK_IN_MS = 6.048e8;
const DAY_IN_MS = 8.64e7;
const HOUR_IN_MS = 3.6e6;
const MIN_IN_MS = 6e4;
const SEC_IN_MS = 1e3;
const YEAR_IN_MS = 3.154e10;

const timeFromNow = (ms: number) => {
    const diff = ms - Date.now();
    if (Math.abs(diff) >= YEAR_IN_MS) {
        return { value: Math.trunc(diff / YEAR_IN_MS), unit: 'year' };
    }
    if (Math.abs(diff) >= WEEK_IN_MS) {
        return { value: Math.trunc(diff / WEEK_IN_MS), unit: 'week' };
    }
    if (Math.abs(diff) >= DAY_IN_MS) {
        return { value: Math.trunc(diff / DAY_IN_MS), unit: 'day' };
    }
    if (Math.abs(diff) >= HOUR_IN_MS) {
        return { value: Math.trunc(diff / HOUR_IN_MS), unit: 'hour' };
    }
    if (Math.abs(diff) >= MIN_IN_MS) {
        return { value: Math.trunc(diff / MIN_IN_MS), unit: 'minute' };
    }
    return { value: Math.trunc(diff / SEC_IN_MS), unit: 'second' };
};

export default timeFromNow;
