import * as React from 'react';

import { resolveFeedItemIdForEntry } from './helpers';
import type { TransformedFeedItem } from './types';

const UNSET = Symbol('unset');

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

/**
 * Send `isSelected` once for the current `activeFeedEntryId` (click / deep link).
 * Add, delete, and edit refresh the marker list without re-asserting selection,
 * so Preview does not treat the refresh as a new host select and re-seek.
 */
export const useCommentMarkerSelectedId = (
    activeFeedEntryId: string | undefined,
    filteredItems: readonly TransformedFeedItem[],
): string | null => {
    const contentKey = feedContentKey(filteredItems);
    const resolvedId = activeFeedEntryId
        ? resolveFeedItemIdForEntry(filteredItems, activeFeedEntryId) ?? activeFeedEntryId
        : null;

    const lastEntryIdRef = React.useRef<string | undefined | typeof UNSET>(UNSET);
    const lastContentKeyRef = React.useRef(contentKey);
    const emittedSelectedIdRef = React.useRef<string | null>(null);
    const selectedIdRef = React.useRef<string | null>(resolvedId);

    if (lastEntryIdRef.current === UNSET || activeFeedEntryId !== lastEntryIdRef.current) {
        lastEntryIdRef.current = activeFeedEntryId;
        lastContentKeyRef.current = contentKey;
        emittedSelectedIdRef.current = null;
        selectedIdRef.current = resolvedId;
    } else if (contentKey !== lastContentKeyRef.current) {
        lastContentKeyRef.current = contentKey;
        const alreadyEmitted = Boolean(resolvedId && emittedSelectedIdRef.current === resolvedId);
        selectedIdRef.current = alreadyEmitted ? null : resolvedId;
    }

    if (selectedIdRef.current && filteredItems.some(item => item.id === selectedIdRef.current)) {
        emittedSelectedIdRef.current = selectedIdRef.current;
    }

    return selectedIdRef.current;
};
