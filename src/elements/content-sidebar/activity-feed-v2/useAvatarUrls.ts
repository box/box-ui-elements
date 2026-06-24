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

const collectUserIdsFromComment = (comment: Comment, userIds: Set<string>) => {
    if (comment.created_by?.id) userIds.add(comment.created_by.id);
    (comment.replies ?? []).forEach(reply => {
        if (reply.created_by?.id) userIds.add(reply.created_by.id);
    });
};

const collectUserIds = (feedItems?: FeedItem[] | null): string[] => {
    const userIds = new Set<string>();
    (feedItems ?? []).forEach(item => {
        switch (item.type) {
            case FEED_ITEM_TYPE_COMMENT:
                collectUserIdsFromComment(item as unknown as Comment, userIds);
                break;
            case FEED_ITEM_TYPE_ANNOTATION: {
                const annotation = item as unknown as Annotation;
                if (annotation.created_by?.id) userIds.add(annotation.created_by.id);
                (annotation.replies ?? []).forEach(reply => {
                    if (reply.created_by?.id) userIds.add(reply.created_by.id);
                });
                break;
            }
            case FEED_ITEM_TYPE_TASK: {
                const task = item as unknown as TaskNew;
                const authorId = task.created_by?.target?.id;
                if (authorId) userIds.add(authorId);
                (task.assigned_to?.entries ?? []).forEach(entry => {
                    if (entry.target?.id) userIds.add(entry.target.id);
                });
                break;
            }
            case FEED_ITEM_TYPE_VERSION: {
                const actor = getVersionUser(item as unknown as BoxItemVersion);
                if (actor?.id) userIds.add(actor.id);
                break;
            }
            default:
                break;
        }
    });
    return Array.from(userIds);
};

export const useAvatarUrls = (feedItems?: FeedItem[] | null, getAvatarUrl?: GetAvatarUrl): AvatarUrlMap => {
    const [avatarUrls, setAvatarUrls] = React.useState<AvatarUrlMap>({});
    const inFlightIdsRef = React.useRef<Set<string>>(new Set());
    const resolvedIdsRef = React.useRef<Set<string>>(new Set());

    React.useEffect(() => {
        if (!getAvatarUrl) return undefined;
        const inFlightIds = inFlightIdsRef.current;
        const resolvedIds = resolvedIdsRef.current;
        const userIds = collectUserIds(feedItems);
        const pendingIds = userIds.filter(id => !resolvedIds.has(id) && !inFlightIds.has(id));
        if (pendingIds.length === 0) return undefined;

        let cancelled = false;
        pendingIds.forEach(id => inFlightIds.add(id));

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
            if (cancelled) return;

            // Only successful resolutions move to resolvedIds, so transient
            // failures stay eligible for retry on the next render.
            const resolved: Record<string, string> = {};
            entries.forEach(([id, url]) => {
                inFlightIds.delete(id);
                if (url) {
                    resolved[id] = url;
                    resolvedIds.add(id);
                }
            });
            if (Object.keys(resolved).length === 0) return;
            setAvatarUrls(prev => ({ ...prev, ...resolved }));
        });

        return () => {
            cancelled = true;
            pendingIds.forEach(id => inFlightIds.delete(id));
        };
    }, [feedItems, getAvatarUrl]);

    return avatarUrls;
};
