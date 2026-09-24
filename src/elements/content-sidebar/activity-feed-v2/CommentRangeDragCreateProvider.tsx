import * as React from 'react';

import { ViewType } from '../../common/types/SidebarNavigation';
import type { InternalSidebarNavigation, InternalSidebarNavigationHandler } from '../../common/types/SidebarNavigation';
import type { PreviewHandle, ViewerHandle } from './types';
import {
    CommentRangeDragCreateContext,
    EVENT_RANGE_DRAG_CREATE,
    EVENT_RANGE_DRAFT_DISMISS,
    readRangeChange,
} from './useMediaTimestamp';
import type { PendingCommentRange } from './useMediaTimestamp';

/** Same cadence as comment-marker attachment: the waveform shell exists before getViewer() resolves. */
const VIEWER_POLL_MS = 100;

const ACTIVITY_PATH = `/${ViewType.ACTIVITY}`;

type HistoryLike = {
    push: (location: { pathname: string; state: { open: boolean } }) => void;
    replace: (location: { pathname: string; state: { open: boolean } }) => void;
};

type LocationLike = {
    pathname: string;
};

export type CommentRangeDragCreateProviderProps = {
    children: React.ReactNode;
    /** False when audio player v2 is off or the host has no Activity feed. Listening is then a no-op. */
    enabled: boolean;
    fileId?: string;
    getPreview?: () => PreviewHandle | null;
    getViewer?: () => ViewerHandle | null;
    history?: HistoryLike;
    internalSidebarNavigation?: InternalSidebarNavigation;
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler;
    location?: LocationLike;
    routerDisabled?: boolean;
};

const isExactActivityNavigation = (navigation?: InternalSidebarNavigation): boolean => {
    if (!navigation || navigation.sidebar !== ViewType.ACTIVITY) {
        return false;
    }
    return !('activeFeedEntryType' in navigation) && !('versionId' in navigation);
};

const resolveViewer = (
    getViewer?: () => ViewerHandle | null,
    getPreview?: () => PreviewHandle | null,
): ViewerHandle | null => {
    const loaded = getViewer?.() ?? null;
    if (loaded) {
        return loaded;
    }
    const current = getPreview?.()?.getCurrentViewer?.() ?? null;
    if (!current || current.isDestroyed?.()) {
        return null;
    }
    return current;
};

/**
 * Listens for a viewer drag create on chrome that stays mounted when Activity is collapsed
 * or showing another panel. Opens Activity and stashes the range for the composer to adopt.
 * Does not emit comment_range_draft — that would collapse the handles the viewer just drew.
 */
const CommentRangeDragCreateProvider = ({
    children,
    enabled,
    fileId,
    getPreview,
    getViewer,
    history,
    internalSidebarNavigation,
    internalSidebarNavigationHandler,
    location,
    routerDisabled = false,
}: CommentRangeDragCreateProviderProps): JSX.Element => {
    const pendingRef = React.useRef<PendingCommentRange | null>(null);
    const [version, setVersion] = React.useState(0);
    const fileIdRef = React.useRef(fileId);

    if (fileIdRef.current !== fileId) {
        fileIdRef.current = fileId;
        pendingRef.current = null;
    }

    const getViewerRef = React.useRef(getViewer);
    const getPreviewRef = React.useRef(getPreview);
    getViewerRef.current = getViewer;
    getPreviewRef.current = getPreview;

    const navigationRef = React.useRef({
        history,
        internalSidebarNavigation,
        internalSidebarNavigationHandler,
        location,
        routerDisabled,
    });
    navigationRef.current = {
        history,
        internalSidebarNavigation,
        internalSidebarNavigationHandler,
        location,
        routerDisabled,
    };

    const clearPendingDragCreate = React.useCallback(() => {
        pendingRef.current = null;
    }, []);

    const consumePendingDragCreate = React.useCallback((): PendingCommentRange | null => {
        const pending = pendingRef.current;
        pendingRef.current = null;
        return pending;
    }, []);

    const publishPendingDragCreate = React.useCallback((range: PendingCommentRange) => {
        pendingRef.current = range;
        setVersion(current => current + 1);
    }, []);

    const dropPendingDragCreate = React.useCallback(() => {
        if (pendingRef.current === null) {
            return;
        }
        pendingRef.current = null;
        setVersion(current => current + 1);
    }, []);

    const contextValue = React.useMemo(
        () => ({ clearPendingDragCreate, consumePendingDragCreate, version }),
        [clearPendingDragCreate, consumePendingDragCreate, version],
    );

    React.useEffect(() => {
        if (!enabled) {
            pendingRef.current = null;
            return undefined;
        }

        let attachedViewer: ViewerHandle | null = null;
        let pollId = 0;

        const openActivity = () => {
            const navigation = navigationRef.current;
            if (navigation.routerDisabled) {
                navigation.internalSidebarNavigationHandler?.(
                    { open: true, sidebar: ViewType.ACTIVITY },
                    isExactActivityNavigation(navigation.internalSidebarNavigation),
                );
                return;
            }
            if (!navigation.history) {
                return;
            }
            const nextLocation = { pathname: ACTIVITY_PATH, state: { open: true } };
            if (navigation.location?.pathname === ACTIVITY_PATH) {
                navigation.history.replace(nextLocation);
                return;
            }
            navigation.history.push(nextLocation);
        };

        const handleDragCreate = (payload: unknown) => {
            const change = readRangeChange(payload);
            if (!change) {
                return;
            }
            publishPendingDragCreate(change);
            openActivity();
        };

        const handleDismiss = () => {
            dropPendingDragCreate();
        };

        const detach = (viewer: ViewerHandle) => {
            viewer.removeListener(EVENT_RANGE_DRAG_CREATE, handleDragCreate);
            viewer.removeListener(EVENT_RANGE_DRAFT_DISMISS, handleDismiss);
        };

        const tryAttach = (): boolean => {
            const viewer = resolveViewer(getViewerRef.current, getPreviewRef.current);
            if (!viewer) {
                return false;
            }
            if (viewer === attachedViewer) {
                return true;
            }
            if (attachedViewer) {
                detach(attachedViewer);
            }
            viewer.addListener(EVENT_RANGE_DRAG_CREATE, handleDragCreate);
            viewer.addListener(EVENT_RANGE_DRAFT_DISMISS, handleDismiss);
            attachedViewer = viewer;
            return true;
        };

        if (!tryAttach()) {
            pollId = window.setInterval(() => {
                if (tryAttach()) {
                    window.clearInterval(pollId);
                    pollId = 0;
                }
            }, VIEWER_POLL_MS);
        }

        return () => {
            if (pollId) {
                window.clearInterval(pollId);
            }
            if (attachedViewer) {
                detach(attachedViewer);
            }
        };
        // fileId rebinds after preview swaps the viewer for a different file.
    }, [dropPendingDragCreate, enabled, fileId, publishPendingDragCreate]);

    return (
        <CommentRangeDragCreateContext.Provider value={contextValue}>{children}</CommentRangeDragCreateContext.Provider>
    );
};

export default CommentRangeDragCreateProvider;
