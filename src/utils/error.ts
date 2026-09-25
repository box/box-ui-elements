import {
    HTTP_STATUS_CODE_CONFLICT,
    HTTP_STATUS_CODE_UNAUTHORIZED,
    HTTP_STATUS_CODE_RATE_LIMIT,
    HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
} from '../constants';

const getBadItemError = (): Error => new Error('Bad box item!');

const getBadPermissionsError = (): Error => new Error('Insufficient Permissions!');

const getBadUserError = (): Error => new Error('Bad box user!');

const getMissingItemTextOrStatus = (): Error => new Error('Missing text or status!');

const isUserCorrectableError = (status: number): boolean =>
    status === HTTP_STATUS_CODE_RATE_LIMIT ||
    status === HTTP_STATUS_CODE_UNAUTHORIZED ||
    status === HTTP_STATUS_CODE_CONFLICT ||
    status >= HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR;

const getAbortError = (): Error => {
    class AbortError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'AbortError';
        }
    }

    return new AbortError('Aborted');
};

export {
    getAbortError,
    getBadItemError,
    getBadPermissionsError,
    getBadUserError,
    getMissingItemTextOrStatus,
    isUserCorrectableError,
};
