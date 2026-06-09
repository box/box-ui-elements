/**
 * @file Hook that tracks video playback time for the timestamped-comment toggle.
 * @author Box
 */

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

export interface UseVideoTimestampResult {
    /** Display string (e.g. "0:43"). "0:00" until first capture. */
    formattedTimestamp: string;
    /** Toggle pressed state. */
    isPressed: boolean;
    /** Read the current captured ms - used when posting. */
    getTimestampMs: () => number;
    /** Pressed-state setter passed to the editor toggle. */
    onPressedChange: (pressed: boolean) => void;
}

/**
 * Tracks video playback time for the editor timestamp toggle.
 *
 * Behavior:
 * - Pressed off: captured value never updates (last selected value preserved).
 * - Pressed on while video is playing: captured value frozen until pause/seek.
 * - Pressed on while video is paused: captured value updates on pause/seek.
 * - Toggle off->on: captures current time and pauses the video if it was playing.
 * - New video src: captured value resets to 0; pressed state persists.
 *
 * `enabled` should be true only for video files where timestamped comments are
 * allowed; the hook returns inert defaults otherwise.
 */
export const useVideoTimestamp = (enabled: boolean): UseVideoTimestampResult => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [timestampMs, setTimestampMs] = React.useState(0);
    const isPressedRef = React.useRef(isPressed);

    React.useEffect(() => {
        isPressedRef.current = isPressed;
    }, [isPressed]);

    const getTimestampMs = React.useCallback(() => timestampMs, [timestampMs]);

    const onPressedChange = React.useCallback((pressed: boolean) => {
        setIsPressed(pressed);
        if (!pressed) {
            return;
        }
        const video = findVideoElement();
        if (!video) {
            return;
        }
        if (!video.paused) {
            video.pause();
        }
        setTimestampMs(captureCurrentMs(video));
    }, []);

    React.useEffect(() => {
        if (!enabled || typeof document === 'undefined') {
            return undefined;
        }

        let observer: MutationObserver | null = null;
        let attached: HTMLVideoElement | null = null;

        const handlePauseOrSeek = () => {
            if (isPressedRef.current && attached) {
                setTimestampMs(captureCurrentMs(attached));
            }
        };

        const handleLoadStart = () => {
            setTimestampMs(0);
        };

        const detach = () => {
            if (!attached) return;
            attached.removeEventListener('pause', handlePauseOrSeek);
            attached.removeEventListener('seeked', handlePauseOrSeek);
            attached.removeEventListener('loadstart', handleLoadStart);
            attached = null;
        };

        const tryAttach = () => {
            const video = findVideoElement();
            if (!video || video === attached) {
                return Boolean(attached);
            }
            detach();
            video.addEventListener('pause', handlePauseOrSeek);
            video.addEventListener('seeked', handlePauseOrSeek);
            video.addEventListener('loadstart', handleLoadStart);
            attached = video;
            return true;
        };

        if (!tryAttach() && typeof MutationObserver !== 'undefined') {
            observer = new MutationObserver(() => {
                tryAttach();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        return () => {
            observer?.disconnect();
            detach();
        };
    }, [enabled]);

    return {
        formattedTimestamp: convertMillisecondsToTimestamp(timestampMs),
        getTimestampMs,
        isPressed,
        onPressedChange,
    };
};
