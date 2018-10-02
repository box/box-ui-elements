/**
 * @flow
 * @file Activity feed utility methods
 */

import { PLACEHOLDER_USER } from '../../../../constants';

const ItemTypes = {
    fileVersion: 'file_version',
    upload: 'upload',
};

export function collapseFeedState(feedState: ?FeedItems): FeedItems {
    if (!feedState) {
        return [];
    }

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
                modified_by: tmpModifiedBy,
                versions = [previousFeedItem],
                version_start = parseInt(previousFeedItem.version_number, 10),
                version_end = parseInt(previousFeedItem.version_number, 10),
            } = previousFeedItem;

            const prevModifiedBy = tmpModifiedBy || PLACEHOLDER_USER;

            const {
                action,
                modified_by: tmpCurModifiedBy,
                created_at,
                trashed_at,
                id,
                version_number,
            } = feedItem;
            const parsedVersionNumber = parseInt(version_number, 10);
            const collaborators = previousFeedItem.collaborators || {
                [prevModifiedBy.id]: { ...prevModifiedBy },
            };

            const modifiedBy = tmpCurModifiedBy || PLACEHOLDER_USER;

            // add collaborators
            collaborators[modifiedBy.id] = { ...modifiedBy };

            return collapsedFeedState.concat([
                {
                    action,
                    collaborators,
                    created_at,
                    modifiedBy,
                    trashed_at,
                    id,
                    type: ItemTypes.fileVersion,
                    version_number,
                    versions: versions.concat([feedItem]),
                    version_start: Math.min(version_start, parsedVersionNumber),
                    version_end: Math.max(version_end, parsedVersionNumber),
                },
            ]);
        }

        return collapsedFeedState.concat([previousFeedItem, feedItem]);
    }, []);
}

export function shouldShowEmptyState(feedState: ?FeedItems): boolean {
    return (
        !feedState ||
        feedState.length === 0 ||
        (feedState.length === 1 && feedState[0].type === ItemTypes.fileVersion)
    );
}
