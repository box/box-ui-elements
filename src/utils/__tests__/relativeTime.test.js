import timeFromNow from '../relativeTime';

const WEEK_IN_MS = 6.048e8;
const DAY_IN_MS = 8.64e7;
const HOUR_IN_MS = 3.6e6;
const MIN_IN_MS = 6e4;
const SEC_IN_MS = 1e3;
const YEAR_IN_MS = 3.154e10;

describe('timeFromNow function', () => {
    it('should return correct year difference', () => {
        const ms = Date.now() + YEAR_IN_MS * 2; // Two years in the future
        expect(timeFromNow(ms)).toEqual({ value: 2, unit: 'year' });
    });

    it('should return correct week difference', () => {
        const ms = Date.now() + WEEK_IN_MS * 2; // Two weeks in the future
        expect(timeFromNow(ms)).toEqual({ value: 2, unit: 'week' });
    });

    it('should return correct day difference', () => {
        const ms = Date.now() + DAY_IN_MS * 2; // Two days in the future
        expect(timeFromNow(ms)).toEqual({ value: 2, unit: 'day' });
    });

    it('should return correct hour difference', () => {
        const ms = Date.now() + HOUR_IN_MS * 2; // Two hours in the future
        expect(timeFromNow(ms)).toEqual({ value: 2, unit: 'hour' });
    });

    it('should return correct minute difference', () => {
        const ms = Date.now() + MIN_IN_MS * 2; // Two minutes in the future
        expect(timeFromNow(ms)).toEqual({ value: 2, unit: 'minute' });
    });

    it('should return correct second difference', () => {
        const ms = Date.now() + SEC_IN_MS * 2; // Two seconds in the future
        expect(timeFromNow(ms)).toEqual({ value: 2, unit: 'second' });
    });

    it('should return correct negative difference', () => {
        const ms = Date.now() - DAY_IN_MS * 2; // Two days in the past
        expect(timeFromNow(ms)).toEqual({ value: -2, unit: 'day' });
    });
});
