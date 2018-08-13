/**
 * @flow
 * @file Helper for throwing errors
 * @author Box
 */

export function getBadItemError(): Error {
    return new Error('Bad box item!');
}

export function getBadPermissionsError(): Error {
    return new Error('Insufficient Permissions!');
}

export function getBadUserError(): Error {
    return new Error('Bad box user!');
}
