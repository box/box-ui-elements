import * as React from 'react';
import noop from 'lodash/noop';

import type { TransformedFeedItem, ViewerHandle } from './types';

type CommentMarkerPayload = {
    avatarUrl?: string;
    colorIndex?: number;
    /** End of a ranged timestamp comment, in seconds. Omitted for a point comment. */
    endTime?: number;
    id: string;
    initial?: string;
    isSelected?: boolean;
    /** Set when the user selects this same comment again. Absent on the first select and on feed refreshes. */
    selectionSeq?: number;
    time: number;
    type: 'annotation' | 'comment';
};

/** ContentPreview.getViewer() waits for playable. The waveform shell exists earlier. */
const COMMENT_MARKERS_VIEWER_POLL_MS = 100;

/** Items without a recorded version stay on every version. */
const isOnVersion = (itemVersionId: string | null | undefined, versionId: string | undefined): boolean =>
    !itemVersionId || !versionId || itemVersionId === versionId;

const buildCommentMarkers = (
    items: readonly TransformedFeedItem[],
    selectedFeedItemId: string | null,
    selectionSeq = 0,
    versionId?: string,
): CommentMarkerPayload[] => {
    const markers: CommentMarkerPayload[] = [];
    for (const item of items) {
        if (
            item.type === 'comment' &&
            item.annotationTimestampMs != null &&
            isOnVersion(item.annotationTimestampVersionId, versionId)
        ) {
            const author = item.messages[0]?.author;
            const endMs = item.annotationTimestampEndMs;
            const endTime = endMs != null && endMs > item.annotationTimestampMs ? endMs / 1000 : undefined;
            markers.push({
                avatarUrl: author?.avatarUrl ?? undefined,
                colorIndex: author?.id ?? 0,
                ...(endTime != null ? { endTime } : {}),
                id: item.id,
                initial: author?.name?.[0] ?? undefined,
                isSelected: item.id === selectedFeedItemId,
                ...(item.id === selectedFeedItemId && selectionSeq > 0 ? { selectionSeq } : {}),
                time: item.annotationTimestampMs / 1000,
                type: 'comment',
            });
        } else if (item.type === 'annotation' && isOnVersion(item.annotation?.file_version?.id, versionId)) {
            const loc = item.annotation?.target?.location;
            if (loc?.type === 'frame' && loc.value != null) {
                const author = item.messages[0]?.author;
                markers.push({
                    avatarUrl: author?.avatarUrl ?? undefined,
                    colorIndex: author?.id ?? 0,
                    id: item.id,
                    initial: author?.name?.[0] ?? undefined,
                    isSelected: item.id === selectedFeedItemId,
                    ...(item.id === selectedFeedItemId && selectionSeq > 0 ? { selectionSeq } : {}),
                    time: loc.value / 1000,
                    type: 'annotation',
                });
            }
        }
    }
    return markers;
};

type CommentMarkerViewerOptions = {
    enabled: boolean;
    filteredItems: readonly TransformedFeedItem[];
    getVersionId: () => string | undefined;
    markerSelectedId: string | null;
    onMarkerSelect: (id: string) => void;
    resolveViewer: () => ViewerHandle | null;
    selectionSeq: number;
};

/**
 * Keeps one preview pane's viewer showing the markers for the version in that pane.
 * Returns that version id once a viewer is attached, or the version loading after that viewer is destroyed.
 */
export const useCommentMarkerViewer = ({
    enabled,
    filteredItems,
    getVersionId,
    markerSelectedId,
    onMarkerSelect,
    resolveViewer,
    selectionSeq,
}: CommentMarkerViewerOptions): string | undefined => {
    const [attachedVersionId, setAttachedVersionId] = React.useState<string | undefined>();
    const attachedViewerRef = React.useRef<ViewerHandle | null>(null);
    const syncMarkerViewerRef = React.useRef<() => void>(noop);
    const latestRef = React.useRef({
        filteredItems,
        getVersionId,
        markerSelectedId,
        onMarkerSelect,
        resolveViewer,
        selectionSeq,
    });

    React.useLayoutEffect(() => {
        latestRef.current = {
            filteredItems,
            getVersionId,
            markerSelectedId,
            onMarkerSelect,
            resolveViewer,
            selectionSeq,
        };
    }, [filteredItems, getVersionId, markerSelectedId, onMarkerSelect, resolveViewer, selectionSeq]);

    const emitMarkers = React.useCallback((viewer: ViewerHandle) => {
        const latest = latestRef.current;
        const versionId = latest.getVersionId();
        setAttachedVersionId(versionId);
        viewer.emit(
            'comment_markers',
            buildCommentMarkers(latest.filteredItems, latest.markerSelectedId, latest.selectionSeq, versionId),
        );
    }, []);

    React.useEffect(() => {
        if (!enabled) return undefined;

        const handleMarkerSelect = ({ id }: { id: string }) => latestRef.current.onMarkerSelect(id);

        const detachMarkerViewer = () => {
            const attachedViewer = attachedViewerRef.current;
            attachedViewerRef.current = null;
            if (!attachedViewer) {
                return;
            }
            attachedViewer.removeListener('comment_marker_select', handleMarkerSelect);
            if (!attachedViewer.isDestroyed?.()) {
                attachedViewer.emit('comment_markers', []);
            }
        };

        // Keeps polling after the first attach: opening another version replaces the viewer.
        const syncMarkerViewer = () => {
            const viewer = latestRef.current.resolveViewer();
            if (viewer === attachedViewerRef.current) {
                return;
            }
            if (!viewer) {
                // Between versions Preview has no viewer yet, but already reports the version it is loading.
                if (attachedViewerRef.current?.isDestroyed?.()) {
                    detachMarkerViewer();
                    setAttachedVersionId(latestRef.current.getVersionId());
                }
                return;
            }
            detachMarkerViewer();
            attachedViewerRef.current = viewer;
            emitMarkers(viewer);
            viewer.addListener('comment_marker_select', handleMarkerSelect);
        };

        syncMarkerViewerRef.current = syncMarkerViewer;
        syncMarkerViewer();
        const pollId = window.setInterval(syncMarkerViewer, COMMENT_MARKERS_VIEWER_POLL_MS);

        return () => {
            window.clearInterval(pollId);
            syncMarkerViewerRef.current = noop;
            detachMarkerViewer();
            setAttachedVersionId(undefined);
        };
    }, [emitMarkers, enabled]);

    React.useEffect(() => {
        syncMarkerViewerRef.current();
    }, [getVersionId, resolveViewer]);

    React.useEffect(() => {
        const viewer = attachedViewerRef.current;
        if (viewer && !viewer.isDestroyed?.()) {
            emitMarkers(viewer);
        }
    }, [emitMarkers, filteredItems, getVersionId, markerSelectedId, selectionSeq]);

    return attachedVersionId;
};
