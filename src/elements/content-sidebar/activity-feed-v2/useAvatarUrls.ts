import * as React from 'react';

import type { Annotation } from '../../../common/types/annotations';
import type { Comment, FeedItem } from '../../../common/types/feed';
import type { BoxItemVersion } from '../../../common/types/core';
import type { TaskNew } from '../../../common/types/tasks';

import { getVersionUser } from './transformers';

import type { AvatarUrlMap, GetAvatarUrl } from './types';

import {
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_TASK,
    FEED_ITEM_TYPE_VERSION,
} from '../../../constants';

const collectUserIdsFromComment = (comment: Comment, sink: Set<string>) => {
    if (comment.created_by?.id) sink.add(comment.created_by.id);
    (comment.replies ?? []).forEach(reply => {
        if (reply.created_by?.id) sink.add(reply.created_by.id);
    });
};

const collectUserIds = (feedItems?: FeedItem[] | null): string[] => {
    const ids = new Set<string>();
    (feedItems ?? []).forEach(item => {
        switch (item.type) {
            case FEED_ITEM_TYPE_COMMENT:
                collectUserIdsFromComment(item as unknown as Comment, ids);
                break;
            case FEED_ITEM_TYPE_ANNOTATION: {
                const annotation = item as unknown as Annotation;
                if (annotation.created_by?.id) ids.add(annotation.created_by.id);
                (annotation.replies ?? []).forEach(reply => {
                    if (reply.created_by?.id) ids.add(reply.created_by.id);
                });
                break;
            }
            case FEED_ITEM_TYPE_TASK: {
                const task = item as unknown as TaskNew;
                const authorId = task.created_by?.target?.id;
                if (authorId) ids.add(authorId);
                (task.assigned_to?.entries ?? []).forEach(entry => {
                    if (entry.target?.id) ids.add(entry.target.id);
                });
                break;
            }
            case FEED_ITEM_TYPE_VERSION: {
                const actor = getVersionUser(item as unknown as BoxItemVersion);
                if (actor?.id) ids.add(actor.id);
                break;
            }
            default:
                break;
        }
    });
    return Array.from(ids);
};

export const useAvatarUrls = (feedItems?: FeedItem[] | null, getAvatarUrl?: GetAvatarUrl): AvatarUrlMap => {
    const [avatarUrls, setAvatarUrls] = React.useState<AvatarUrlMap>({});
    const inFlightIdsRef = React.useRef<Set<string>>(new Set());
    const resolvedIdsRef = React.useRef<Set<string>>(new Set());

    React.useEffect(() => {
        if (!getAvatarUrl) return undefined;
        const userIds = collectUserIds(feedItems);
        const pendingIds = userIds.filter(id => !resolvedIdsRef.current.has(id) && !inFlightIdsRef.current.has(id));
        if (pendingIds.length === 0) return undefined;

        let cancelled = false;
        pendingIds.forEach(id => inFlightIdsRef.current.add(id));

        Promise.all(
            pendingIds.map(async id => {
                try {
                    const url = await getAvatarUrl(id);
                    return [id, url] as const;
                } catch {
                    return [id, null] as const;
                }
            }),
        ).then(entries => {
            // Only successful resolutions move to resolvedIdsRef, so transient
            // failures stay eligible for retry on the next render.
            pendingIds.forEach(id => inFlightIdsRef.current.delete(id));
            if (cancelled) return;

            const resolved: Record<string, string> = {};
            entries.forEach(([id, url]) => {
                if (url) {
                    resolved[id] = url;
                    resolvedIdsRef.current.add(id);
                }
            });
            if (Object.keys(resolved).length === 0) return;
            setAvatarUrls(prev => ({ ...prev, ...resolved }));
        });

        return () => {
            cancelled = true;
        };
    }, [feedItems, getAvatarUrl]);

    return avatarUrls;
};
