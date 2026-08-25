import * as React from 'react';

import { formatByTimeFormat, MEDIA_ELEMENT_SELECTOR, VIDEO_CONTAINER_SELECTOR } from './useTimeFormat';
import type { TimeFormat } from './useTimeFormat';

const findMediaElement = (): HTMLMediaElement | null => {
    if (typeof document === 'undefined') {
        return null;
    }
    const container = document.querySelector(VIDEO_CONTAINER_SELECTOR);
    return container?.querySelector<HTMLMediaElement>(MEDIA_ELEMENT_SELECTOR) ?? null;
};

const captureCurrentMs = (media: HTMLMediaElement | null): number => {
    if (!media) {
        return 0;
    }
    return Math.floor(media.currentTime * 1000);
};

export const seekVideoToMs = (ms: number): void => {
    const media = findMediaElement();
    if (!media) return;
    media.currentTime = ms / 1000;
    media.pause();
};

export interface UseVideoTimestampResult {
    /** Defaults to "0:00" until the first capture. */
    formattedTimestamp: string;
    isPressed: boolean;
    onPressedChange: (pressed: boolean) => void;
    timestampMs: number;
}

/**
 * Behavior:
 * - Pressed off: captured value never updates.
 * - Pressed on while media is playing: captured value frozen until pause/seek.
 * - Pressed on while media is paused: captured value updates on pause/seek.
 * - Toggle off->on: captures current time and pauses the media if it was playing.
 * - New media src: captured value resets to 0; pressed state persists.
 */
export const useVideoTimestamp = (enabled: boolean, timeFormat: TimeFormat, fps: number): UseVideoTimestampResult => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [timestampMs, setTimestampMs] = React.useState(0);
    const isPressedRef = React.useRef(isPressed);
    const isLoadingRef = React.useRef(false);

    // Reset state when disabled (e.g. switching from a media file to a non-media file)
    // so a re-enable does not leak the previous file's pressed state or captured ms.
    React.useEffect(() => {
        if (!enabled) {
            isPressedRef.current = false;
            setIsPressed(false);
            setTimestampMs(0);
            isLoadingRef.current = false;
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
                return;
            }
            const media = findMediaElement();
            if (!media) {
                return;
            }
            if (!media.paused) {
                media.pause();
            }
            isPressedRef.current = true;
            setIsPressed(true);
            setTimestampMs(captureCurrentMs(media));
        },
        [enabled],
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
            if (isPressedRef.current && attached) {
                setTimestampMs(captureCurrentMs(attached));
            }
        };

        const handleLoadStart = () => {
            isLoadingRef.current = true;
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
    }, [enabled]);

    return {
        formattedTimestamp: formatByTimeFormat(timestampMs, timeFormat, fps),
        isPressed,
        onPressedChange,
        timestampMs,
    };
};
