/**
 * @flow
 * @file Helper for throwing errors
 * @author Box
 */

import messages from '../components/messages';

export function getBadItemError(): Error {
    return new Error('Bad box item!');
}

export function getBadPermissionsError(): Error {
    return new Error('Insufficient Permissions!');
}

export function getActivityFeedApiError(): InlineError {
    return {
        title: messages.errorOccured,
        content: messages.activityFeedItemApiError
    };
}
