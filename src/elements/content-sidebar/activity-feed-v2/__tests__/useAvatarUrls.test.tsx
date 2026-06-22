import { renderHook, waitFor } from '@testing-library/react';

import { useAvatarUrls } from '../useAvatarUrls';

import {
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_TASK,
    FEED_ITEM_TYPE_VERSION,
} from '../../../../constants';

import type { FeedItem } from '../../../../common/types/feed';

const commentItem = (id: string, authorId: string, replyAuthorIds: string[] = []): FeedItem =>
    ({
        created_at: '2024-01-01T00:00:00Z',
        created_by: { id: authorId, name: 'A', type: 'user' },
        id,
        replies: replyAuthorIds.map(rid => ({
            created_at: '2024-01-01T00:00:00Z',
            created_by: { id: rid, name: 'R', type: 'user' },
            id: `${id}-r-${rid}`,
            type: 'comment',
        })),
        type: FEED_ITEM_TYPE_COMMENT,
    }) as unknown as FeedItem;

const annotationItem = (id: string, authorId: string): FeedItem =>
    ({
        created_at: '2024-01-01T00:00:00Z',
        created_by: { id: authorId, name: 'A', type: 'user' },
        id,
        type: FEED_ITEM_TYPE_ANNOTATION,
    }) as unknown as FeedItem;

const taskItem = (id: string, creatorId: string, assigneeIds: string[]): FeedItem =>
    ({
        assigned_to: {
            entries: assigneeIds.map(aid => ({
                id: `${id}-tc-${aid}`,
                target: { id: aid, name: 'Assignee', type: 'user' },
                type: 'task_collaborator',
            })),
        },
        created_by: { target: { id: creatorId, name: 'Creator', type: 'user' } },
        id,
        type: FEED_ITEM_TYPE_TASK,
    }) as unknown as FeedItem;

const versionItem = (id: string, modifierId: string): FeedItem =>
    ({
        id,
        modified_by: { id: modifierId, name: 'Modifier', type: 'user' },
        type: FEED_ITEM_TYPE_VERSION,
    }) as unknown as FeedItem;

describe('elements/content-sidebar/activity-feed-v2/useAvatarUrls', () => {
    test('returns empty map when getAvatarUrl is not provided', () => {
        const { result } = renderHook(() => useAvatarUrls([commentItem('c1', '1')]));
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
            commentItem('c1', '1', ['2']),
            annotationItem('a1', '3'),
            taskItem('t1', '4', ['5', '6']),
            versionItem('v1', '7'),
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
        const items: FeedItem[] = [commentItem('c1', '1', ['1']), commentItem('c2', '1'), taskItem('t1', '1', ['1'])];
        const { result } = renderHook(() => useAvatarUrls(items, getAvatarUrl));
        await waitFor(() => expect(result.current['1']).toBe('url-1'));
        expect(getAvatarUrl).toHaveBeenCalledTimes(1);
    });

    test('does not refetch ids already resolved on subsequent renders', async () => {
        const getAvatarUrl = jest.fn(async (id: string) => `url-${id}`);
        const initialItems: FeedItem[] = [commentItem('c1', '1')];
        const { result, rerender } = renderHook(({ items }) => useAvatarUrls(items, getAvatarUrl), {
            initialProps: { items: initialItems },
        });
        await waitFor(() => expect(result.current['1']).toBe('url-1'));
        expect(getAvatarUrl).toHaveBeenCalledTimes(1);

        rerender({ items: [commentItem('c1', '1'), commentItem('c2', '2')] });
        await waitFor(() => expect(result.current['2']).toBe('url-2'));
        expect(getAvatarUrl).toHaveBeenCalledTimes(2);
        expect(getAvatarUrl.mock.calls.filter(([id]) => id === '1')).toHaveLength(1);
    });

    test('omits ids whose fetch fails or returns nullish', async () => {
        const getAvatarUrl = jest.fn(async (id: string) => {
            if (id === '1') throw new Error('boom');
            if (id === '2') return null;
            return `url-${id}`;
        });
        const { result } = renderHook(() => useAvatarUrls([commentItem('c', '1', ['2', '3'])], getAvatarUrl));
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
        const items = [commentItem('c', '1')];
        const { result, rerender } = renderHook(({ extra }) => useAvatarUrls([...items, ...extra], getAvatarUrl), {
            initialProps: { extra: [] as FeedItem[] },
        });
        await waitFor(() => expect(getAvatarUrl).toHaveBeenCalledTimes(1));
        expect(result.current['1']).toBeUndefined();

        rerender({ extra: [commentItem('c2', '2')] });
        await waitFor(() => expect(result.current['1']).toBe('url-1'));
        expect(result.current['2']).toBe('url-2');
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
