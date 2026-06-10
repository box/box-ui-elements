import * as React from 'react';

import { convertMillisecondsToTimestamp } from '../../../utils/timestamp';

const VIDEO_CONTAINER_SELECTOR = '.bp-media-container';

const findVideoElement = (): HTMLVideoElement | null => {
    if (typeof document === 'undefined') {
        return null;
    }
    const container = document.querySelector(VIDEO_CONTAINER_SELECTOR);
    return container?.querySelector<HTMLVideoElement>('video') ?? null;
};

const captureCurrentMs = (video: HTMLVideoElement | null): number => {
    if (!video) {
        return 0;
    }
    return Math.floor(video.currentTime * 1000);
};

export const seekVideoToMs = (ms: number): void => {
    const video = findVideoElement();
    if (!video) return;
    video.currentTime = ms / 1000;
    video.pause();
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
 * - Pressed on while video is playing: captured value frozen until pause/seek.
 * - Pressed on while video is paused: captured value updates on pause/seek.
 * - Toggle off->on: captures current time and pauses the video if it was playing.
 * - New video src: captured value resets to 0; pressed state persists.
 */
export const useVideoTimestamp = (enabled: boolean): UseVideoTimestampResult => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [timestampMs, setTimestampMs] = React.useState(0);
    const isPressedRef = React.useRef(isPressed);
    const isLoadingRef = React.useRef(false);

    // Reset state when disabled (e.g. switching from a video to a non-video file)
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
            const video = findVideoElement();
            if (!video) {
                return;
            }
            if (!video.paused) {
                video.pause();
            }
            isPressedRef.current = true;
            setIsPressed(true);
            setTimestampMs(captureCurrentMs(video));
        },
        [enabled],
    );

    React.useEffect(() => {
        if (!enabled || typeof document === 'undefined') {
            return undefined;
        }

        let observer: MutationObserver | null = null;
        let attached: HTMLVideoElement | null = null;

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
            const video = findVideoElement();
            if (!video) {
                return false;
            }
            if (video === attached) {
                return true;
            }
            detach();
            video.addEventListener('pause', handlePauseOrSeek);
            video.addEventListener('seeked', handlePauseOrSeek);
            video.addEventListener('loadstart', handleLoadStart);
            video.addEventListener('loadeddata', handleLoadedData);
            attached = video;
            return true;
        };

        // Keep observing so listeners migrate when preview replaces the <video>
        // element (different file). Element-replacement is invisible to loadstart,
        // which only fires for src changes on the same element.
        if (typeof MutationObserver !== 'undefined') {
            observer = new MutationObserver(() => {
                if (findVideoElement() !== attached) {
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
        formattedTimestamp: convertMillisecondsToTimestamp(timestampMs),
        isPressed,
        onPressedChange,
        timestampMs,
    };
};
