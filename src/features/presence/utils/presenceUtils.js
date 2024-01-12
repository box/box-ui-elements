import messages from '../messages';

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = MS_IN_SECOND * 60;
const MS_IN_HOUR = MS_IN_MINUTE * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;
const MS_IN_MONTH = MS_IN_DAY * 30;
const MS_IN_YEAR = MS_IN_DAY * 365;
const INTERACTION_TYPE_MODIFY = 'user.item_modify';
const INTERACTION_TYPE_UPLOAD = 'user.item_upload';
const INTERACTION_TYPE_PREVIEW = 'user.item_preview';
const INTERACTION_TYPE_OPEN = 'user.item_open';
const INTERACTION_TYPE_COMMENT = 'user.comment_create';

function convertMillisecondsToUnitAndValue(ms) {
    if (ms < MS_IN_MINUTE) {
        return { unit: 'second', value: ms / MS_IN_SECOND };
    }
    if (ms < MS_IN_HOUR) {
        return { unit: 'minute', value: Math.round(ms / MS_IN_MINUTE) };
    }
    if (ms < MS_IN_DAY) {
        return { unit: 'hour', value: Math.round(ms / MS_IN_HOUR) };
    }
    if (ms < MS_IN_MONTH) {
        return { unit: 'day', value: Math.round(ms / MS_IN_DAY) };
    }
    if (ms < MS_IN_YEAR) {
        return { unit: 'month', value: Math.round(ms / MS_IN_MONTH) };
    }

    return { unit: 'year', value: Math.round(ms / MS_IN_YEAR) };
}

function getLastActionTimeMS(lastAccessTimeMS, lastModifiedTimeMS, sessionLengthMS = MS_IN_DAY) {
    if (!lastModifiedTimeMS) {
        return lastAccessTimeMS;
    }

    return lastAccessTimeMS - lastModifiedTimeMS < sessionLengthMS ? lastModifiedTimeMS : lastAccessTimeMS;
}

function sortByActivity(a, b) {
    if (a.isActive && b.isActive) {
        // if both users are active,  do not modify sort order
        return 0;
    }
    if (a.isActive && !b.isActive) {
        // if a is active and b is inactive, a comes first
        return -1;
    }
    if (!a.isActive && b.isActive) {
        // vice versa as above
        return 1;
    }

    // otherwise, neither collaborator is active and we sort on the last "action" time
    return 0;
}

function determineInteractionMessage(interactionType, interactedAt) {
    let message;
    const lessThanAMinuteAgo = Date.now() - interactedAt < MS_IN_MINUTE;
    switch (interactionType) {
        // For Box Notes only
        case INTERACTION_TYPE_MODIFY:
        case INTERACTION_TYPE_UPLOAD:
            message = lessThanAMinuteAgo ? messages.modifiedIntheLastMinuteText : messages.timeSinceLastModifiedText;
            break;
        case INTERACTION_TYPE_PREVIEW:
            message = lessThanAMinuteAgo ? messages.previewedIntheLastMinuteText : messages.timeSinceLastPreviewedText;
            break;
        // For Box Notes only
        case INTERACTION_TYPE_OPEN:
            message = lessThanAMinuteAgo ? messages.accessedInTheLastMinuteText : messages.timeSinceLastAccessedText;
            break;
        case INTERACTION_TYPE_COMMENT:
            message = lessThanAMinuteAgo ? messages.commentedIntheLastMinuteText : messages.timeSinceLastCommentedText;
            break;
        default:
            message = null;
            break;
    }
    return message;
}

export { sortByActivity, getLastActionTimeMS, determineInteractionMessage, convertMillisecondsToUnitAndValue };
