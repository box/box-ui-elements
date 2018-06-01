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
            const parsedVersionNumber = parseInt(previousFeedItem.version_number, 10);

            const {
                modified_by: prevModifiedBy,
                versions = [previousFeedItem],
                version_start = parsedVersionNumber,
                version_end = parsedVersionNumber
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
                    version_start: Math.min(version_start, parsedVersionNumber),
                    version_end: Math.max(version_end, parsedVersionNumber)
                }
            ]);
        }

        return collapsedFeedState.concat([previousFeedItem, feedItem]);
    }, []);
}

export function shouldShowEmptyState(feedState: FeedItems): boolean {
    return feedState.length === 0 || (feedState.length === 1 && feedState[0].type === ItemTypes.fileVersion);
}
