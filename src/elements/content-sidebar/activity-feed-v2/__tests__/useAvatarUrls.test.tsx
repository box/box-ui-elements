import { renderHook, waitFor } from '@testing-library/react';
import noop from 'lodash/noop';

import { useAvatarUrls } from '../useAvatarUrls';

import {
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_TASK,
    FEED_ITEM_TYPE_VERSION,
} from '../../../../constants';

import type { FeedItem } from '../../../../common/types/feed';

const commentItem = (itemId: string, authorId: string, replyAuthorIds: string[] = []): FeedItem =>
    ({
        created_at: '2024-01-01T00:00:00Z',
        created_by: { id: authorId, name: 'Author', type: 'user' },
        id: itemId,
        replies: replyAuthorIds.map(replyAuthorId => ({
            created_at: '2024-01-01T00:00:00Z',
            created_by: { id: replyAuthorId, name: 'Reply Author', type: 'user' },
            id: `${itemId}-reply-${replyAuthorId}`,
            type: 'comment',
        })),
        type: FEED_ITEM_TYPE_COMMENT,
    }) as unknown as FeedItem;

const annotationItem = (itemId: string, authorId: string): FeedItem =>
    ({
        created_at: '2024-01-01T00:00:00Z',
        created_by: { id: authorId, name: 'Author', type: 'user' },
        id: itemId,
        type: FEED_ITEM_TYPE_ANNOTATION,
    }) as unknown as FeedItem;

const taskItem = (itemId: string, creatorId: string, assigneeIds: string[]): FeedItem =>
    ({
        assigned_to: {
            entries: assigneeIds.map(assigneeId => ({
                id: `${itemId}-collaborator-${assigneeId}`,
                target: { id: assigneeId, name: 'Assignee', type: 'user' },
                type: 'task_collaborator',
            })),
        },
        created_by: { target: { id: creatorId, name: 'Creator', type: 'user' } },
        id: itemId,
        type: FEED_ITEM_TYPE_TASK,
    }) as unknown as FeedItem;

const versionItem = (itemId: string, modifierId: string): FeedItem =>
    ({
        id: itemId,
        modified_by: { id: modifierId, name: 'Modifier', type: 'user' },
        type: FEED_ITEM_TYPE_VERSION,
    }) as unknown as FeedItem;

describe('elements/content-sidebar/activity-feed-v2/useAvatarUrls', () => {
    test('returns empty map when getAvatarUrl is not provided', () => {
        const { result } = renderHook(() => useAvatarUrls([commentItem('comment-1', '1')]));
        expect(result.current).toEqual({});
    });

    test('returns empty map when feedItems is empty', () => {
        const getAvatarUrl = jest.fn();
        const { result } = renderHook(() => useAvatarUrls([], getAvatarUrl));
        expect(result.current).toEqual({});
        expect(getAvatarUrl).not.toHaveBeenCalled();
    });

    test('resolves avatar URLs for unique authors across feed item types', async () => {
        const getAvatarUrl = jest.fn(async (id: string) => `url-for-${id}`);
        const items: FeedItem[] = [
            commentItem('comment-1', '1', ['2']),
            annotationItem('annotation-1', '3'),
            taskItem('task-1', '4', ['5', '6']),
            versionItem('version-1', '7'),
        ];
        const { result } = renderHook(() => useAvatarUrls(items, getAvatarUrl));
        await waitFor(() => expect(Object.keys(result.current)).toHaveLength(7));
        expect(result.current).toEqual({
            '1': 'url-for-1',
            '2': 'url-for-2',
            '3': 'url-for-3',
            '4': 'url-for-4',
            '5': 'url-for-5',
            '6': 'url-for-6',
            '7': 'url-for-7',
        });
        expect(getAvatarUrl).toHaveBeenCalledTimes(7);
    });

    test('deduplicates identical user ids across items', async () => {
        const getAvatarUrl = jest.fn(async (id: string) => `url-${id}`);
        const items: FeedItem[] = [
            commentItem('comment-1', '1', ['1']),
            commentItem('comment-2', '1'),
            taskItem('task-1', '1', ['1']),
        ];
        const { result } = renderHook(() => useAvatarUrls(items, getAvatarUrl));
        await waitFor(() => expect(result.current['1']).toBe('url-1'));
        expect(getAvatarUrl).toHaveBeenCalledTimes(1);
    });

    test('does not refetch ids already resolved on subsequent renders', async () => {
        const getAvatarUrl = jest.fn(async (id: string) => `url-${id}`);
        const initialItems: FeedItem[] = [commentItem('comment-1', '1')];
        const { result, rerender } = renderHook(({ items }) => useAvatarUrls(items, getAvatarUrl), {
            initialProps: { items: initialItems },
        });
        await waitFor(() => expect(result.current['1']).toBe('url-1'));
        expect(getAvatarUrl).toHaveBeenCalledTimes(1);

        rerender({ items: [commentItem('comment-1', '1'), commentItem('comment-2', '2')] });
        await waitFor(() => expect(result.current['2']).toBe('url-2'));
        expect(getAvatarUrl).toHaveBeenCalledTimes(2);
        expect(getAvatarUrl.mock.calls.filter(([userId]) => userId === '1')).toHaveLength(1);
    });

    test('omits ids whose fetch fails or returns nullish', async () => {
        const getAvatarUrl = jest.fn(async (id: string) => {
            if (id === '1') throw new Error('boom');
            if (id === '2') return null;
            return `url-${id}`;
        });
        const { result } = renderHook(() => useAvatarUrls([commentItem('comment-1', '1', ['2', '3'])], getAvatarUrl));
        await waitFor(() => expect(result.current['3']).toBe('url-3'));
        expect(result.current['1']).toBeUndefined();
        expect(result.current['2']).toBeUndefined();
    });

    test('retries ids whose previous fetch failed', async () => {
        let attempts = 0;
        const getAvatarUrl = jest.fn(async (id: string) => {
            attempts += 1;
            if (id === '1' && attempts === 1) throw new Error('transient');
            return `url-${id}`;
        });
        const items = [commentItem('comment-1', '1')];
        const { result, rerender } = renderHook(({ extra }) => useAvatarUrls([...items, ...extra], getAvatarUrl), {
            initialProps: { extra: [] as FeedItem[] },
        });
        await waitFor(() => expect(getAvatarUrl).toHaveBeenCalledTimes(1));
        expect(result.current['1']).toBeUndefined();

        rerender({ extra: [commentItem('comment-2', '2')] });
        await waitFor(() => expect(result.current['1']).toBe('url-1'));
        expect(result.current['2']).toBe('url-2');
    });

    test('refetches in-flight ids after deps change mid-fetch', async () => {
        let resolveFirstCall: (value: string) => void = noop;
        const firstCallPromise = new Promise<string>(resolve => {
            resolveFirstCall = resolve;
        });
        const getAvatarUrl = jest.fn(async (userId: string) => {
            if (userId === '1' && getAvatarUrl.mock.calls.length === 1) return firstCallPromise;
            return `url-${userId}`;
        });
        const initialItems: FeedItem[] = [commentItem('comment-1', '1')];
        const { result, rerender } = renderHook(({ items }) => useAvatarUrls(items, getAvatarUrl), {
            initialProps: { items: initialItems },
        });
        await waitFor(() => expect(getAvatarUrl).toHaveBeenCalledTimes(1));

        // Dependency change while id '1' is still in flight cancels the original
        // promise; the next effect run should reissue the fetch for '1'.
        rerender({ items: [commentItem('comment-1', '1'), commentItem('comment-2', '2')] });
        await waitFor(() => expect(result.current['2']).toBe('url-2'));

        resolveFirstCall('stale');
        await waitFor(() => expect(getAvatarUrl.mock.calls.filter(([userId]) => userId === '1')).toHaveLength(2));
        expect(result.current['1']).toBe('url-1');
    });

    test('returns stable result when feedItems is null or undefined', () => {
        const getAvatarUrl = jest.fn();
        const { result, rerender } = renderHook(
            ({ items }: { items: FeedItem[] | null | undefined }) => useAvatarUrls(items, getAvatarUrl),
            { initialProps: { items: null } },
        );
        expect(result.current).toEqual({});
        rerender({ items: undefined });
        expect(result.current).toEqual({});
        expect(getAvatarUrl).not.toHaveBeenCalled();
    });
});
