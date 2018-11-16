/**
 * @flow
 * @file Helper functions for errors
 * @author Box
 */
import {
    HTTP_STATUS_CODE_UNAUTHORIZED,
    HTTP_STATUS_CODE_RATE_LIMIT,
    HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
} from '../constants';

export function getBadItemError(): Error {
    return new Error('Bad box item!');
}

export function getBadPermissionsError(): Error {
    return new Error('Insufficient Permissions!');
}

export function getBadUserError(): Error {
    return new Error('Bad box user!');
}

export function isUserCorrectableError(status: number) {
    return (
        !status ||
        status === HTTP_STATUS_CODE_RATE_LIMIT ||
        status === HTTP_STATUS_CODE_UNAUTHORIZED ||
        status >= HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR
    );
}

export function enhanceErrorForLogging(
    error: Error,
    type: ErrorTypes,
    code: string,
    contextInfo: Object = {},
): ElementsError {
    // $FlowFixMe
    const enhancedError: ElementsError = error;
    enhancedError.data = {
        type,
        code,
        context_info: {
            ...contextInfo,
        },
    };

    return enhancedError;
}

export function createErrorFromResponse(response: ElementsXhrError): Error {
    if (response instanceof Error) {
        return response;
    }

    return new Error(response.message);
}
