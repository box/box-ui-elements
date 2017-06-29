/**
 * @flow
 * @file Helper for throwing errors
 * @author Box
 */

export default function getBadItemError(): Error {
    return new Error('Bad box item!');
}
