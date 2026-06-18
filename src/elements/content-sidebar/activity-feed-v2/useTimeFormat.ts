import * as React from 'react';

import {
    convertMillisecondsToFrames,
    convertMillisecondsToTimecode,
    convertMillisecondsToTimestamp,
} from '../../../utils/timestamp';
import { DEFAULT_VIDEO_FPS } from '../../../constants';

export const VIDEO_CONTAINER_SELECTOR = '.bp-media-container';

export type TimeFormat = 'standard' | 'timecode' | 'frames';

export function formatByTimeFormat(ms: number, format: TimeFormat, fps: number): string {
    switch (format) {
        case 'timecode':
            return convertMillisecondsToTimecode(ms, fps);
        case 'frames':
            return String(convertMillisecondsToFrames(ms, fps));
        case 'standard':
        default:
            return convertMillisecondsToTimestamp(ms);
    }
}

export interface UseTimeFormatResult {
    timeFormat: TimeFormat;
    fps: number;
}

export const useTimeFormat = (enabled: boolean): UseTimeFormatResult => {
    const [timeFormat, setTimeFormat] = React.useState<TimeFormat>('standard');
    const [fps, setFps] = React.useState(DEFAULT_VIDEO_FPS);

    React.useEffect(() => {
        if (!enabled) {
            setTimeFormat('standard');
            setFps(DEFAULT_VIDEO_FPS);
            return undefined;
        }

        if (typeof document === 'undefined') {
            return undefined;
        }

        let attrObserver: MutationObserver | null = null;
        let bodyObserver: MutationObserver | null = null;
        let observedContainer: Element | null = null;

        const readAttributes = (container: Element): void => {
            const format = (container.getAttribute('data-time-format') as TimeFormat) || 'standard';
            const fpsAttr = Number(container.getAttribute('data-fps'));
            setTimeFormat(format);
            setFps(fpsAttr > 0 ? fpsAttr : DEFAULT_VIDEO_FPS);
        };

        const observeContainer = (container: Element): void => {
            if (container === observedContainer) return;
            attrObserver?.disconnect();
            readAttributes(container);
            if (typeof MutationObserver !== 'undefined') {
                attrObserver = new MutationObserver(() => readAttributes(container));
                attrObserver.observe(container, {
                    attributes: true,
                    attributeFilter: ['data-time-format', 'data-fps'],
                });
            }
            observedContainer = container;
        };

        const tryObserve = (): void => {
            const container = document.querySelector(VIDEO_CONTAINER_SELECTOR);
            if (container) {
                observeContainer(container);
            }
        };

        tryObserve();

        // Watch for late-appearing container
        if (typeof MutationObserver !== 'undefined') {
            bodyObserver = new MutationObserver(() => {
                const container = document.querySelector(VIDEO_CONTAINER_SELECTOR);
                if (container && container !== observedContainer) {
                    observeContainer(container);
                }
            });
            bodyObserver.observe(document.body, { childList: true, subtree: true });
        }

        return () => {
            attrObserver?.disconnect();
            bodyObserver?.disconnect();
        };
    }, [enabled]);

    return { timeFormat, fps };
};
