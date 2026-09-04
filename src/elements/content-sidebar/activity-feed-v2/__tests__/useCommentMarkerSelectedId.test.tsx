import { renderHook } from '@testing-library/react';

import { useCommentMarkerSelectedId } from '../useCommentMarkerSelectedId';
import type { TransformedFeedItem } from '../types';

jest.mock('@box/threaded-annotations', () => ({
    serializeMentionMarkup: jest.fn(),
    serializeMessageToMarkdown: jest.fn(),
}));

const comment = (id: string, originalText = ''): TransformedFeedItem =>
    ({
        id,
        isResolved: false,
        messages: [],
        originalText,
        permissions: {},
        type: 'comment',
    }) as TransformedFeedItem;

describe('useCommentMarkerSelectedId()', () => {
    test('should select the active feed entry id', () => {
        const { result } = renderHook(() => useCommentMarkerSelectedId('c1', [comment('c1')]));
        expect(result.current).toBe('c1');
    });

    test('should keep selection until the comment list changes', () => {
        const { result, rerender } = renderHook(({ items }) => useCommentMarkerSelectedId('c1', items), {
            initialProps: { items: [comment('c1')] },
        });
        expect(result.current).toBe('c1');

        rerender({ items: [comment('c1')] });
        expect(result.current).toBe('c1');
    });

    test('should clear selection when a later comment is added', () => {
        const { result, rerender } = renderHook(({ items }) => useCommentMarkerSelectedId('c1', items), {
            initialProps: { items: [comment('c1')] },
        });
        expect(result.current).toBe('c1');

        rerender({ items: [comment('c1'), comment('c2')] });
        expect(result.current).toBeNull();
    });

    test('should clear selection when a comment is deleted', () => {
        const { result, rerender } = renderHook(({ items }) => useCommentMarkerSelectedId('c1', items), {
            initialProps: { items: [comment('c1'), comment('c2')] },
        });
        expect(result.current).toBe('c1');

        rerender({ items: [comment('c1')] });
        expect(result.current).toBeNull();
    });

    test('should clear selection when a comment is edited', () => {
        const { result, rerender } = renderHook(({ items }) => useCommentMarkerSelectedId('c1', items), {
            initialProps: { items: [comment('c1', 'Hello')] },
        });
        expect(result.current).toBe('c1');

        rerender({ items: [comment('c1', 'Edited')] });
        expect(result.current).toBeNull();
    });

    test('should keep selection when the deep-linked entry first appears in the feed', () => {
        const { result, rerender } = renderHook(({ items }) => useCommentMarkerSelectedId('c1', items), {
            initialProps: { items: [] as TransformedFeedItem[] },
        });
        expect(result.current).toBe('c1');

        rerender({ items: [comment('c1')] });
        expect(result.current).toBe('c1');
    });

    test('should select again when the active feed entry changes', () => {
        const items = [comment('c1'), comment('c2')];
        const { result, rerender } = renderHook(({ entryId }) => useCommentMarkerSelectedId(entryId, items), {
            initialProps: { entryId: 'c1' },
        });
        expect(result.current).toBe('c1');

        rerender({ entryId: 'c2' });
        expect(result.current).toBe('c2');
    });
});
