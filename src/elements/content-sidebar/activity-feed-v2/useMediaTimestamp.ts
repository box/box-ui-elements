import * as React from 'react';

import { formatByTimeFormat, MEDIA_CONTAINER_SELECTOR, MEDIA_ELEMENT_SELECTOR } from './useTimeFormat';
import type { TimeFormat } from './useTimeFormat';
import type { CommentRangeDraft, ViewerHandle } from './types';

export const EVENT_RANGE_DRAFT = 'comment_range_draft';
export const EVENT_RANGE_DRAFT_CHANGE = 'comment_range_draft_change';
export const EVENT_RANGE_DRAFT_CLEAR = 'comment_range_draft_clear';

const findMediaElement = (): HTMLMediaElement | null => {
    if (typeof document === 'undefined') {
        return null;
    }
    const container = document.querySelector(MEDIA_CONTAINER_SELECTOR);
    return container?.querySelector<HTMLMediaElement>(MEDIA_ELEMENT_SELECTOR) ?? null;
};

const captureCurrentMs = (media: HTMLMediaElement | null): number => {
    if (!media) {
        return 0;
    }
    return Math.floor(media.currentTime * 1000);
};

export const seekMediaToMs = (ms: number, getViewer?: () => ViewerHandle | null): void => {
    const viewer = getViewer?.();
    if (viewer?.setMediaTime) {
        viewer.pause?.();
        viewer.setMediaTime(ms / 1000);
        return;
    }

    const media = findMediaElement();
    if (!media) return;
    media.currentTime = ms / 1000;
    media.pause();
};

export interface UseMediaTimestampResult {
    /** Defaults to "0:00" until the first capture. */
    formattedTimestamp: string;
    isPressed: boolean;
    onPressedChange: (pressed: boolean) => void;
    /** Drops back to a collapsed single timestamp. Call after a comment is posted. */
    resetRange: () => void;
    /** End of the composer's selected range. Undefined until the user drags a waveform handle. */
    timestampEndMs?: number;
    timestampMs: number;
}

export interface UseMediaTimestampOptions {
    getViewer?: () => ViewerHandle | null;
    isAudioPlayerV2?: boolean;
}

const readRangeChange = (payload: unknown): { endMs?: number; startMs: number } | null => {
    const { endMs, startMs } = (payload ?? {}) as Partial<CommentRangeDraft>;
    if (!Number.isSafeInteger(startMs) || (startMs as number) < 0) {
        return null;
    }
    const start = startMs as number;
    const hasEnd = Number.isSafeInteger(endMs) && (endMs as number) > start;
    return { endMs: hasEnd ? (endMs as number) : undefined, startMs: start };
};

/**
 * Behavior:
 * - Pressed off: captured value never updates.
 * - Pressed on while media is playing: captured value frozen until pause/seek.
 * - Pressed on while media is paused: captured value updates on pause/seek.
 * - Toggle off->on: captures current time and pauses the media if it was playing.
 * - New media src: captured value resets to 0; pressed state persists. A dragged range survives
 *   untouched, since a src change on the same element is a token refresh, not different content.
 * - New media element: any selected range is dropped.
 */
export const useMediaTimestamp = (
    enabled: boolean,
    timeFormat: TimeFormat,
    fps: number,
    { getViewer, isAudioPlayerV2 = false }: UseMediaTimestampOptions = {},
): UseMediaTimestampResult => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [timestampMs, setTimestampMs] = React.useState(0);
    const isPressedRef = React.useRef(isPressed);
    const isLoadingRef = React.useRef(false);

    const isRangeEnabled = enabled && isAudioPlayerV2;
    const isRangePinnedRef = React.useRef(false);
    const [timestampEndMs, setTimestampEndMs] = React.useState<number | undefined>(undefined);

    /** Tells the viewer to show range handles at these positions. An absent end draws them collapsed. */
    const emitDraft = React.useCallback(
        (startMs: number, endMs?: number) => {
            if (!isRangeEnabled) {
                return;
            }
            getViewer?.()?.emit(EVENT_RANGE_DRAFT, { endMs: endMs ?? null, startMs });
        },
        [getViewer, isRangeEnabled],
    );

    /** Tells the viewer to hide the range handles. */
    const emitClear = React.useCallback(() => {
        if (!isRangeEnabled) {
            return;
        }
        getViewer?.()?.emit(EVENT_RANGE_DRAFT_CLEAR, undefined);
    }, [getViewer, isRangeEnabled]);

    const resetRange = React.useCallback(() => {
        isRangePinnedRef.current = false;
        setTimestampEndMs(undefined);
        if (isPressedRef.current) {
            emitDraft(timestampMs);
        }
    }, [emitDraft, timestampMs]);

    // Reset state when disabled (e.g. switching from a media file to a non-media file)
    // so a re-enable does not leak the previous file's pressed state or captured ms.
    React.useEffect(() => {
        if (!enabled) {
            isPressedRef.current = false;
            setIsPressed(false);
            setTimestampMs(0);
            isLoadingRef.current = false;
            isRangePinnedRef.current = false;
            setTimestampEndMs(undefined);
        }
    }, [enabled]);

    const onPressedChange = React.useCallback(
        (pressed: boolean) => {
            if (!enabled) {
                return;
            }
            if (!pressed) {
                isPressedRef.current = false;
                setIsPressed(false);
                isRangePinnedRef.current = false;
                setTimestampEndMs(undefined);
                emitClear();
                return;
            }
            const media = findMediaElement();
            if (!media) {
                return;
            }
            if (!media.paused) {
                media.pause();
            }
            const capturedMs = captureCurrentMs(media);
            isPressedRef.current = true;
            setIsPressed(true);
            setTimestampMs(capturedMs);
            isRangePinnedRef.current = false;
            setTimestampEndMs(undefined);
            emitDraft(capturedMs);
        },
        [emitClear, emitDraft, enabled],
    );

    React.useEffect(() => {
        if (!enabled || typeof document === 'undefined') {
            return undefined;
        }

        let observer: MutationObserver | null = null;
        let attached: HTMLMediaElement | null = null;

        const handlePauseOrSeek = () => {
            // Skip captures during a fresh-src load: currentTime is mid-reset and
            // would clobber the value handleLoadStart already set to 0.
            if (isLoadingRef.current) {
                return;
            }
            // The user has dragged handles, so playhead no longer moves the start value.
            if (isRangePinnedRef.current) {
                return;
            }
            if (isPressedRef.current && attached) {
                const capturedMs = captureCurrentMs(attached);
                setTimestampMs(capturedMs);
                emitDraft(capturedMs); // Update position of handles to the current paused/seeked time.
            }
        };

        const handleLoadStart = () => {
            isLoadingRef.current = true;
            if (isRangePinnedRef.current) {
                return;
            }
            setTimestampMs(0);
        };

        const handleLoadedData = () => {
            isLoadingRef.current = false;
        };

        const detach = () => {
            if (!attached) return;
            attached.removeEventListener('pause', handlePauseOrSeek);
            attached.removeEventListener('seeked', handlePauseOrSeek);
            attached.removeEventListener('loadstart', handleLoadStart);
            attached.removeEventListener('loadeddata', handleLoadedData);
            attached = null;
        };

        const tryAttach = (): boolean => {
            const media = findMediaElement();
            if (!media) {
                return false;
            }
            if (media === attached) {
                return true;
            }
            // A replaced element is a different file or version, so the selected range no longer applies.
            if (attached) {
                isRangePinnedRef.current = false;
                setTimestampEndMs(undefined);
            }
            detach();
            media.addEventListener('pause', handlePauseOrSeek);
            media.addEventListener('seeked', handlePauseOrSeek);
            media.addEventListener('loadstart', handleLoadStart);
            media.addEventListener('loadeddata', handleLoadedData);
            attached = media;
            return true;
        };

        // Keep observing so listeners migrate when preview replaces the media
        // element (different file). Element-replacement is invisible to loadstart,
        // which only fires for src changes on the same element.
        if (typeof MutationObserver !== 'undefined') {
            observer = new MutationObserver(() => {
                if (findMediaElement() !== attached) {
                    tryAttach();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        tryAttach();

        return () => {
            observer?.disconnect();
            detach();
        };
    }, [emitDraft, enabled]);

    React.useEffect(() => {
        if (!isRangeEnabled) {
            return undefined;
        }
        const viewer = getViewer?.();
        if (!viewer) {
            return undefined;
        }

        const handleRangeChange = (payload: unknown) => {
            const change = readRangeChange(payload);
            if (!change || !isPressedRef.current) {
                return;
            }
            isRangePinnedRef.current = change.endMs !== undefined;
            setTimestampMs(change.startMs);
            setTimestampEndMs(change.endMs);
        };

        viewer.addListener(EVENT_RANGE_DRAFT_CHANGE, handleRangeChange);
        return () => viewer.removeListener(EVENT_RANGE_DRAFT_CHANGE, handleRangeChange);
    }, [getViewer, isRangeEnabled]);

    // Take down any handles still up for a composer that is going away.
    React.useEffect(
        () => () => {
            if (isPressedRef.current) {
                emitClear();
            }
        },
        [emitClear],
    );

    return {
        formattedTimestamp: formatByTimeFormat(timestampMs, timeFormat, fps),
        isPressed,
        onPressedChange,
        resetRange,
        timestampEndMs,
        timestampMs,
    };
};
