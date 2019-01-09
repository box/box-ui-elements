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

function isUserCorrectableError(status: number) {
    return (
        status === HTTP_STATUS_CODE_RATE_LIMIT ||
        status === HTTP_STATUS_CODE_UNAUTHORIZED ||
        status === HTTP_STATUS_CODE_CONFLICT ||
        status >= HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR
    );
}

export { getBadItemError, getBadPermissionsError, getBadUserError, isUserCorrectableError };
