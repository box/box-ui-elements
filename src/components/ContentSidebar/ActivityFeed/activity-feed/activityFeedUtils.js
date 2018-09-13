/**
 * @flow
 * @file Activity feed utility methods
 */
import { fillUserPlaceholder } from '../../../../util/fields';

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

        const filledFeedItem = fillUserPlaceholder(feedItem);

        if (!previousFeedItem) {
            return collapsedFeedState.concat([filledFeedItem]);
        }

        if (
            filledFeedItem.type === ItemTypes.fileVersion &&
            previousFeedItem.type === ItemTypes.fileVersion &&
            filledFeedItem.action === ItemTypes.upload &&
            previousFeedItem.action === ItemTypes.upload
        ) {
            const {
                modified_by: prevModifiedBy,
                versions = [previousFeedItem],
                version_start = parseInt(previousFeedItem.version_number, 10),
                version_end = parseInt(previousFeedItem.version_number, 10),
            } = previousFeedItem;
            const {
                action,
                modified_by,
                created_at,
                trashed_at,
                id,
                version_number,
            } = filledFeedItem;
            const parsedVersionNumber = parseInt(version_number, 10);
            const collaborators = previousFeedItem.collaborators || {
                [prevModifiedBy.id]: { ...prevModifiedBy },
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
                    versions: versions.concat([filledFeedItem]),
                    version_start: Math.min(version_start, parsedVersionNumber),
                    version_end: Math.max(version_end, parsedVersionNumber),
                },
            ]);
        }

        return collapsedFeedState.concat([previousFeedItem, filledFeedItem]);
    }, []);
}

export function shouldShowEmptyState(feedState: ?FeedItems): boolean {
    return (
        !feedState ||
        feedState.length === 0 ||
        (feedState.length === 1 && feedState[0].type === ItemTypes.fileVersion)
    );
}
