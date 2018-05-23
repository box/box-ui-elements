/**
 * @flow
 * @file Activity feed utility methods
 */
import type { FeedItems } from '../activityFeedFlowTypes';

const ItemTypes = {
    fileVersion: 'file_version',
    upload: 'upload'
};

export function collapseFeedState(feedState: FeedItems): FeedItems {
    return feedState.reduce((collapsedFeedState, feedItem) => {
        const previousFeedItem = collapsedFeedState.pop();

        if (!previousFeedItem) {
            return collapsedFeedState.concat([feedItem]);
        }

        if (
            feedItem.type === ItemTypes.fileVersion &&
            previousFeedItem.type === ItemTypes.fileVersion &&
            feedItem.action === ItemTypes.upload &&
            previousFeedItem.action === ItemTypes.upload
        ) {
            const {
                modified_by: prevModifiedBy,
                versions = [previousFeedItem],
                version_start = previousFeedItem.version_number,
                version_end = previousFeedItem.version_number
            } = previousFeedItem;
            const { action, modified_by, created_at, trashed_at, id, version_number } = feedItem;
            const collaborators = previousFeedItem.collaborators || {
                [prevModifiedBy.id]: { ...prevModifiedBy }
            };

            // add collaborators
            collaborators[modified_by.id] = { ...modified_by };

            return collapsedFeedState.concat([
                {
                    action,
                    collaborators,
                    created_at,
                    modified_by,
                    trashed_at,
                    id,
                    type: ItemTypes.fileVersion,
                    version_number,
                    versions: versions.concat([feedItem]),
                    version_start: Math.min(version_start, version_number),
                    version_end: Math.max(version_end, version_number)
                }
            ]);
        }

        return collapsedFeedState.concat([previousFeedItem, feedItem]);
    }, []);
}

export function shouldShowEmptyState(feedState: FeedItems): boolean {
    return feedState.length === 0 || (feedState.length === 1 && feedState[0].type === ItemTypes.fileVersion);
}

/**
 * Generates a GUID/UUID compliant with RFC4122 version 4.
 *
 * @return {string} A 36 character uuid
 */
export function uuidv4() {
    /* eslint-disable */
    function generateRandom(c) {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    }
    /* eslint-enable */

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, generateRandom);
}
