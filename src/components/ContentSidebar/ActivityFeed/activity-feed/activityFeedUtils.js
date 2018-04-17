/**
 * @flow
 * @file Activity feed utility methods
 */
import type { Item } from '../activityFeedFlowTypes';

export function collapseFeedState(feedState: Array<Item>): Array<Item> {
    return feedState.reduce((collapsedFeedState, feedItem) => {
        const previousFeedItem = collapsedFeedState.pop();

        if (!previousFeedItem) {
            return collapsedFeedState.concat([feedItem]);
        }

        if (
            feedItem.type === 'file_version' &&
            previousFeedItem.type === 'file_version' &&
            feedItem.action === 'upload' &&
            previousFeedItem.action === 'upload'
        ) {
            const {
                createdBy: prevCreatedBy,
                versions = [previousFeedItem],
                versionStart = previousFeedItem.versionNumber,
                versionEnd = previousFeedItem.versionNumber
            } = previousFeedItem;
            const { action, createdBy, id, versionNumber } = feedItem;
            const collaborators = previousFeedItem.collaborators || {
                [prevCreatedBy.id]: { ...prevCreatedBy }
            };

            // add collaborators
            collaborators[createdBy.id] = { ...createdBy };

            return collapsedFeedState.concat([
                {
                    action,
                    collaborators,
                    createdBy,
                    id,
                    type: 'file_version',
                    versionNumber,
                    versions: versions.concat([feedItem]),
                    versionStart: Math.min(versionStart, versionNumber),
                    versionEnd: Math.max(versionEnd, versionNumber)
                }
            ]);
        }

        return collapsedFeedState.concat([previousFeedItem, feedItem]);
    }, []);
}

export function shouldShowEmptyState(feedState: Array<Item>): boolean {
    return feedState.length === 0 || (feedState.length === 1 && feedState[0].type === 'file_version');
}
