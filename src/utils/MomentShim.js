/**
 * @flow
 * @file Shim for moment.js
 * @author Box
 */
declare var __LANGUAGE__: string;

// This shim is here just to get pikaday working with Intl instead of moment.js
// It basically stubs out all the required methods that pikaday uses.
// May not be needed after https://github.com/dbushell/Pikaday/pull/721
class MomentShim {
    date: Date;

    constructor(date: Date | string) {
        this.date = new Date(date);
    }

    format() {
        return this.date.toLocaleDateString(__LANGUAGE__);
    }

    toDate() {
        return new Date(this.date);
    }

    isValid() {
        return this.date.getTime() > 0;
    }
}

const momentGenerator = (date: Date | string) => new MomentShim(date);
export default momentGenerator;
