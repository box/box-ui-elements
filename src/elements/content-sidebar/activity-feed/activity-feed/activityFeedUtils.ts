import selectors from '../../../common/selectors/version';
import { FEED_ITEM_TYPE_VERSION, PLACEHOLDER_USER, VERSION_UPLOAD_ACTION } from '../../../../constants';
import { FeedItems } from '../../../../common/types/feed';

export const ItemTypes = {
    fileVersion: FEED_ITEM_TYPE_VERSION,
} as const;

export function collapseFeedState(feedState: FeedItems | null): FeedItems {
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
            selectors.getVersionAction(feedItem) === VERSION_UPLOAD_ACTION &&
            selectors.getVersionAction(previousFeedItem) === VERSION_UPLOAD_ACTION
        ) {
            const {
                modified_by: tmpModifiedBy,
                versions = [previousFeedItem],
                version_start = parseInt(previousFeedItem.version_number, 10),
                version_end = parseInt(previousFeedItem.version_number, 10),
            } = previousFeedItem;

            const prevModifiedBy = tmpModifiedBy || PLACEHOLDER_USER;

            const { modified_by: tmpCurModifiedBy, created_at, trashed_at, id, version_number } = feedItem;
            const parsedVersionNumber = parseInt(version_number, 10);
            const collaborators = previousFeedItem.collaborators || {
                [prevModifiedBy.id]: { ...prevModifiedBy },
            };

            const modifiedBy = tmpCurModifiedBy || PLACEHOLDER_USER;

            // add collaborators
            // $FlowFixMe
            collaborators[modifiedBy.id] = { ...modifiedBy };

            return collapsedFeedState.concat([
                {
                    collaborators,
                    created_at,
                    modified_by: modifiedBy,
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
