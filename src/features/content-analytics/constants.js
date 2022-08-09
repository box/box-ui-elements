// @flow
export const DOWNLOADS: 'DOWNLOADS' = 'DOWNLOADS';

export const PREVIEWS: 'PREVIEWS' = 'PREVIEWS';

export const USERS: 'USERS' = 'USERS';

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
