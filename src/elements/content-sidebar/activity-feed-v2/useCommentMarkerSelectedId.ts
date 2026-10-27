import * as React from 'react';

import { resolveFeedItemIdForEntry } from './helpers';
import type { TransformedFeedItem } from './types';

const feedContentKey = (items: readonly TransformedFeedItem[]): string =>
    items
        .map(item => {
            if (item.type === 'comment') {
                return `c:${item.id}:${item.originalText}:${item.annotationTimestampMs ?? ''}:${item.status ?? ''}:${item.isResolved}`;
            }
            if (item.type === 'annotation') {
                return `a:${item.id}:${item.status ?? ''}:${item.isResolved}`;
            }
            return `${item.type}:${item.id}`;
        })
        .join('|');

type MarkerSelectionSnapshot = {
    activeFeedEntryId: string | undefined;
    contentKey: string;
    emittedSelectedId: string | null;
    selectedId: string | null;
    selectionSeq: number;
};

const resolveSelectedId = (
    activeFeedEntryId: string | undefined,
    filteredItems: readonly TransformedFeedItem[],
): string | null =>
    activeFeedEntryId ? resolveFeedItemIdForEntry(filteredItems, activeFeedEntryId) ?? activeFeedEntryId : null;

const markEmitted = (
    selectedId: string | null,
    filteredItems: readonly TransformedFeedItem[],
    emittedSelectedId: string | null,
): string | null => (selectedId && filteredItems.some(item => item.id === selectedId) ? selectedId : emittedSelectedId);

const createSnapshot = (
    activeFeedEntryId: string | undefined,
    filteredItems: readonly TransformedFeedItem[],
    selectionSeq = 0,
): MarkerSelectionSnapshot => {
    const selectedId = resolveSelectedId(activeFeedEntryId, filteredItems);
    return {
        activeFeedEntryId,
        contentKey: feedContentKey(filteredItems),
        emittedSelectedId: markEmitted(selectedId, filteredItems, null),
        selectedId,
        selectionSeq,
    };
};

const reduceSnapshot = (
    previous: MarkerSelectionSnapshot,
    activeFeedEntryId: string | undefined,
    filteredItems: readonly TransformedFeedItem[],
    selectionSeq: number,
): MarkerSelectionSnapshot => {
    const contentKey = feedContentKey(filteredItems);
    const resolvedId = resolveSelectedId(activeFeedEntryId, filteredItems);

    let selectedId: string | null;
    let { emittedSelectedId } = previous;

    // A new entry, or the same entry chosen again, asserts selection once.
    // A feed refresh with neither change leaves an already-sent id unmarked.
    if (activeFeedEntryId !== previous.activeFeedEntryId || selectionSeq !== previous.selectionSeq) {
        selectedId = resolvedId;
        emittedSelectedId = null;
    } else {
        const alreadyEmitted = Boolean(resolvedId && previous.emittedSelectedId === resolvedId);
        selectedId = alreadyEmitted ? null : resolvedId;
    }

    return {
        activeFeedEntryId,
        contentKey,
        emittedSelectedId: markEmitted(selectedId, filteredItems, emittedSelectedId),
        selectedId,
        selectionSeq,
    };
};

/**
 * Send `isSelected` once for the current `activeFeedEntryId` (click / deep link).
 * Add, delete, and edit refresh the marker list without re-asserting selection,
 * so Preview does not treat the refresh as a new host select and re-seek.
 * `selectionSeq` re-asserts the same entry when the user picks it again.
 */
export const useCommentMarkerSelectedId = (
    activeFeedEntryId: string | undefined,
    filteredItems: readonly TransformedFeedItem[],
    selectionSeq = 0,
): string | null => {
    const [snapshot, setSnapshot] = React.useState(() =>
        createSnapshot(activeFeedEntryId, filteredItems, selectionSeq),
    );
    const contentKey = feedContentKey(filteredItems);

    if (
        activeFeedEntryId !== snapshot.activeFeedEntryId ||
        contentKey !== snapshot.contentKey ||
        selectionSeq !== snapshot.selectionSeq
    ) {
        const nextSnapshot = reduceSnapshot(snapshot, activeFeedEntryId, filteredItems, selectionSeq);
        setSnapshot(nextSnapshot);
        return nextSnapshot.selectedId;
    }

    return snapshot.selectedId;
};
