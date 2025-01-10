/**
 * @flow
 * @file Helper functions for errors
 * @author Box
 */
import {
    HTTP_STATUS_CODE_CONFLICT,
    HTTP_STATUS_CODE_UNAUTHORIZED,
    HTTP_STATUS_CODE_RATE_LIMIT,
    HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
} from '../constants';

function getBadItemError(): Error {
    return new Error('Bad box item!');
}

function getBadPermissionsError(): Error {
    return new Error('Insufficient Permissions!');
}

function getBadUserError(): Error {
    return new Error('Bad box user!');
}

function getMissingItemTextOrStatus(): Error {
    return new Error('Missing text or status!');
}

function isUserCorrectableError(status: number) {
    return (
        status === HTTP_STATUS_CODE_RATE_LIMIT ||
        status === HTTP_STATUS_CODE_UNAUTHORIZED ||
        status === HTTP_STATUS_CODE_CONFLICT ||
        status >= HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR
    );
}

function getAbortError() {
    class AbortError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'AbortError';
        }
    }

    return new AbortError('Aborted');
}

/**
 * Reports an error to window.reportError or falls back to console.error
 * @param {Error | string} error - The error to report
 * @param {Object | string} [info] - Additional error information
 * @returns {void}
 */
function reportError(error: Error | string, info?: Object | string): void {
    if (typeof window.reportError === 'function') {
        window.reportError(error);
    } else {
        // Fallback for browsers that don't support window.reportError
        console.error(error, info); // eslint-disable-line no-console
    }
}

export {
    getAbortError,
    getBadItemError,
    getBadPermissionsError,
    getBadUserError,
    getMissingItemTextOrStatus,
    isUserCorrectableError,
    reportError,
};
