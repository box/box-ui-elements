import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import { seekMediaToMs, useMediaTimestamp } from '../useMediaTimestamp';
import type { TimeFormat } from '../useTimeFormat';
import type { ViewerHandle } from '../types';

const createMediaElement = (tag: 'video' | 'audio' = 'video', currentTime: number = 0): HTMLMediaElement => {
    const media = document.createElement(tag);
    Object.defineProperty(media, 'currentTime', {
        configurable: true,
        get: () => currentTime,
        set: (value: number) => {
            currentTime = value;
        },
    });
    Object.defineProperty(media, 'paused', {
        configurable: true,
        value: true,
        writable: true,
    });
    media.pause = jest.fn(() => {
        Object.defineProperty(media, 'paused', { configurable: true, value: true, writable: true });
    });
    return media;
};

const createVideoElement = (currentTime: number = 0): HTMLVideoElement =>
    createMediaElement('video', currentTime) as HTMLVideoElement;

const mountMediaInDom = (media: HTMLMediaElement) => {
    const container = document.createElement('div');
    container.className = 'bp-media-container';
    container.appendChild(media);
    document.body.appendChild(container);
    return () => container.remove();
};

const mountVideoInDom = (video: HTMLVideoElement) => mountMediaInDom(video);

const TestHarness = ({
    enabled,
    fps = 24,
    getViewer,
    isAudioPlayerV2 = false,
    timeFormat = 'standard',
}: {
    enabled: boolean;
    fps?: number;
    getViewer?: () => ViewerHandle | null;
    isAudioPlayerV2?: boolean;
    timeFormat?: TimeFormat;
}) => {
    const { formattedTimestamp, isPressed, onPressedChange, resetRange, timestampEndMs, timestampMs } =
        useMediaTimestamp(enabled, timeFormat, fps, { getViewer, isAudioPlayerV2 });
    return (
        <div>
            <span data-testid="timestamp">{formattedTimestamp}</span>
            <span data-testid="ms">{String(timestampMs)}</span>
            <span data-testid="end-ms">{String(timestampEndMs)}</span>
            <span data-testid="pressed">{String(isPressed)}</span>
            <button onClick={() => onPressedChange(true)} type="button">
                press
            </button>
            <button onClick={() => onPressedChange(false)} type="button">
                unpress
            </button>
            <button onClick={() => resetRange()} type="button">
                reset
            </button>
        </div>
    );
};

type ViewerListeners = Record<string, ((payload: unknown) => void) | undefined>;

const createViewer = () => {
    const listeners: ViewerListeners = {};
    const viewer: ViewerHandle = {
        addListener: (event, handler) => {
            listeners[event] = handler;
        },
        emit: jest.fn(),
        removeListener: event => {
            delete listeners[event];
        },
    };
    return {
        emitFromViewer: (event: string, payload: unknown) => listeners[event]?.(payload),
        getViewer: () => viewer,
        hasListener: (event: string) => Boolean(listeners[event]),
        viewer,
    };
};

const emittedEvents = (viewer: ViewerHandle) => (viewer.emit as jest.Mock).mock.calls;

describe('useMediaTimestamp', () => {
    afterEach(() => {
        document.querySelectorAll('.bp-media-container').forEach(node => node.remove());
    });

    test('should return defaults when disabled', () => {
        render(<TestHarness enabled={false} />);
        expect(screen.getByTestId('timestamp').textContent).toBe('0:00');
        expect(screen.getByTestId('ms').textContent).toBe('0');
        expect(screen.getByTestId('pressed').textContent).toBe('false');
    });

    test('should ignore press attempts when disabled', () => {
        const video = createVideoElement(15);
        Object.defineProperty(video, 'paused', { configurable: true, value: false, writable: true });
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled={false} />);
            act(() => {
                screen.getByText('press').click();
            });
            expect(video.pause).not.toHaveBeenCalled();
            expect(screen.getByTestId('pressed').textContent).toBe('false');
            expect(screen.getByTestId('timestamp').textContent).toBe('0:00');
        } finally {
            cleanup();
        }
    });

    test('should capture current time and pause the media when toggled on while playing', () => {
        const video = createVideoElement(43.5);
        Object.defineProperty(video, 'paused', { configurable: true, value: false, writable: true });
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            expect(video.pause).toHaveBeenCalled();
            expect(screen.getByTestId('pressed').textContent).toBe('true');
            expect(screen.getByTestId('timestamp').textContent).toBe('0:43');
            expect(screen.getByTestId('ms').textContent).toBe('43500');
        } finally {
            cleanup();
        }
    });

    test('should keep the captured value frozen while playing (no pause/seek listeners apart from those)', () => {
        const video = createVideoElement(0);
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            // currentTime advances during playback but no pause/seek fires.
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 30, writable: true });
            // Sanity: a non-subscribed event must not trigger a capture.
            act(() => {
                video.dispatchEvent(new Event('timeupdate'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:00');
            expect(screen.getByTestId('ms').textContent).toBe('0');
        } finally {
            cleanup();
        }
    });

    test('should update captured value when pressed and the media pauses', () => {
        const video = createVideoElement(0);
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 12, writable: true });
            act(() => {
                video.dispatchEvent(new Event('pause'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:12');
            expect(screen.getByTestId('ms').textContent).toBe('12000');
        } finally {
            cleanup();
        }
    });

    test('should update captured value when pressed and the media is seeked', () => {
        const video = createVideoElement(0);
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 7, writable: true });
            act(() => {
                video.dispatchEvent(new Event('seeked'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:07');
        } finally {
            cleanup();
        }
    });

    test('should not update captured value on pause when toggle is off', () => {
        const video = createVideoElement(0);
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 5, writable: true });
            act(() => {
                video.dispatchEvent(new Event('pause'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:05');
            act(() => {
                screen.getByText('unpress').click();
            });
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 90, writable: true });
            act(() => {
                video.dispatchEvent(new Event('pause'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:05');
        } finally {
            cleanup();
        }
    });

    test('should reset captured value to 0 on loadstart while preserving pressed state', () => {
        const video = createVideoElement(0);
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 18, writable: true });
            act(() => {
                video.dispatchEvent(new Event('pause'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:18');
            act(() => {
                video.dispatchEvent(new Event('loadstart'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:00');
            expect(screen.getByTestId('pressed').textContent).toBe('true');
        } finally {
            cleanup();
        }
    });

    test('should ignore pause/seek captures while loadstart -> loadeddata is in progress', () => {
        const video = createVideoElement(0);
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 25, writable: true });
            act(() => {
                video.dispatchEvent(new Event('pause'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:25');

            act(() => {
                video.dispatchEvent(new Event('loadstart'));
            });
            // Mid-load currentTime jitter must not get captured.
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 99, writable: true });
            act(() => {
                video.dispatchEvent(new Event('seeked'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:00');

            act(() => {
                video.dispatchEvent(new Event('loadeddata'));
            });
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 4, writable: true });
            act(() => {
                video.dispatchEvent(new Event('seeked'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:04');
        } finally {
            cleanup();
        }
    });

    test('should reset state when transitioning from enabled to disabled', () => {
        const video = createVideoElement(0);
        const cleanup = mountVideoInDom(video);
        try {
            const { rerender } = render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 33, writable: true });
            act(() => {
                video.dispatchEvent(new Event('pause'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:33');
            expect(screen.getByTestId('pressed').textContent).toBe('true');

            rerender(<TestHarness enabled={false} />);
            expect(screen.getByTestId('timestamp').textContent).toBe('0:00');
            expect(screen.getByTestId('pressed').textContent).toBe('false');
            expect(screen.getByTestId('ms').textContent).toBe('0');
        } finally {
            cleanup();
        }
    });

    test('should not capture from a pause/seek that fires after onPressedChange(false) in the same tick', () => {
        const video = createVideoElement(0);
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 10, writable: true });
            act(() => {
                video.dispatchEvent(new Event('pause'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:10');

            // Unpress and synchronously dispatch a pause event before any
            // useEffect would run. The captured value must not change.
            act(() => {
                screen.getByText('unpress').click();
                Object.defineProperty(video, 'currentTime', { configurable: true, value: 50, writable: true });
                video.dispatchEvent(new Event('pause'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:10');
        } finally {
            cleanup();
        }
    });
});

describe('useMediaTimestamp time format integration', () => {
    afterEach(() => {
        document.querySelectorAll('.bp-media-container').forEach(node => node.remove());
    });

    test('should format timestamp as timecode when timeFormat is timecode', () => {
        const video = createVideoElement(8.055);
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled timeFormat="timecode" fps={24} />);
            act(() => {
                screen.getByText('press').click();
            });

            expect(screen.getByTestId('timestamp').textContent).toBe('00:00:08:01');
        } finally {
            cleanup();
        }
    });

    test('should format timestamp as frame number when timeFormat is frames', () => {
        const video = createVideoElement(10);
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled timeFormat="frames" fps={24} />);
            act(() => {
                screen.getByText('press').click();
            });

            expect(screen.getByTestId('timestamp').textContent).toBe('240');
        } finally {
            cleanup();
        }
    });

    test('should update formatted timestamp when timeFormat prop changes after capture', () => {
        const video = createVideoElement(10);
        const cleanup = mountVideoInDom(video);
        try {
            const { rerender } = render(<TestHarness enabled timeFormat="standard" fps={24} />);
            act(() => {
                screen.getByText('press').click();
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:10');

            rerender(<TestHarness enabled timeFormat="frames" fps={24} />);
            expect(screen.getByTestId('timestamp').textContent).toBe('240');
        } finally {
            cleanup();
        }
    });

    test('should default to standard format', () => {
        const video = createVideoElement(43.5);
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:43');
        } finally {
            cleanup();
        }
    });
});

describe('seekMediaToMs', () => {
    afterEach(() => {
        document.querySelectorAll('.bp-media-container').forEach(node => node.remove());
    });

    test('should set currentTime in seconds and pause when a video is present', () => {
        const video = createVideoElement(0);
        Object.defineProperty(video, 'paused', { configurable: true, value: false, writable: true });
        const cleanup = mountVideoInDom(video);
        try {
            seekMediaToMs(8055);
            expect(video.currentTime).toBe(8.055);
            expect(video.pause).toHaveBeenCalled();
        } finally {
            cleanup();
        }
    });

    test('should be a no-op when no media element is present', () => {
        expect(() => seekMediaToMs(1000)).not.toThrow();
    });

    test('should set currentTime in seconds and pause when an audio element is present', () => {
        const audio = createMediaElement('audio', 0);
        Object.defineProperty(audio, 'paused', { configurable: true, value: false, writable: true });
        const cleanup = mountMediaInDom(audio);
        try {
            seekMediaToMs(8055);
            expect(audio.currentTime).toBe(8.055);
            expect(audio.pause).toHaveBeenCalled();
        } finally {
            cleanup();
        }
    });

    test('should seek via the viewer when setMediaTime is available', () => {
        const audio = createMediaElement('audio', 0);
        const cleanup = mountMediaInDom(audio);
        const pause = jest.fn();
        const setMediaTime = jest.fn();
        const getViewer = jest.fn(() => ({
            addListener: jest.fn(),
            emit: jest.fn(),
            pause,
            removeListener: jest.fn(),
            setMediaTime,
        }));
        try {
            seekMediaToMs(8055, getViewer);
            expect(pause).toHaveBeenCalled();
            expect(setMediaTime).toHaveBeenCalledWith(8.055);
            expect(audio.currentTime).toBe(0);
            expect(audio.pause).not.toHaveBeenCalled();
        } finally {
            cleanup();
        }
    });

    test('should fall back to the media element when the viewer has no setMediaTime', () => {
        const audio = createMediaElement('audio', 0);
        Object.defineProperty(audio, 'paused', { configurable: true, value: false, writable: true });
        const cleanup = mountMediaInDom(audio);
        const getViewer = jest.fn(() => ({
            addListener: jest.fn(),
            emit: jest.fn(),
            removeListener: jest.fn(),
        }));
        try {
            seekMediaToMs(8055, getViewer);
            expect(audio.currentTime).toBe(8.055);
            expect(audio.pause).toHaveBeenCalled();
        } finally {
            cleanup();
        }
    });

    test('should fall back to the media element when getViewer returns null', () => {
        const audio = createMediaElement('audio', 0);
        Object.defineProperty(audio, 'paused', { configurable: true, value: false, writable: true });
        const cleanup = mountMediaInDom(audio);
        try {
            seekMediaToMs(8055, () => null);
            expect(audio.currentTime).toBe(8.055);
            expect(audio.pause).toHaveBeenCalled();
        } finally {
            cleanup();
        }
    });
});

describe('useMediaTimestamp range selection', () => {
    afterEach(() => {
        document.querySelectorAll('.bp-media-container').forEach(node => node.remove());
    });

    const renderWithRange = (currentTime = 43.5) => {
        const audio = createMediaElement('audio', currentTime);
        const cleanup = mountMediaInDom(audio);
        const harness = createViewer();
        const view = render(<TestHarness enabled getViewer={harness.getViewer} isAudioPlayerV2 />);
        return { audio, cleanup, ...harness, ...view };
    };

    test('should emit a collapsed draft when the toggle is pressed', () => {
        const { cleanup, viewer } = renderWithRange();
        try {
            expect(emittedEvents(viewer)).toHaveLength(0);
            act(() => screen.getByText('press').click());
            expect(emittedEvents(viewer)).toEqual([['comment_range_draft', { endMs: null, startMs: 43500 }]]);
        } finally {
            cleanup();
        }
    });

    test('should clear the draft when the toggle is released', () => {
        const { cleanup, viewer } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());
            act(() => screen.getByText('unpress').click());
            expect(emittedEvents(viewer)[1]).toEqual(['comment_range_draft_clear', undefined]);
        } finally {
            cleanup();
        }
    });

    test('should hold the range reported by a committed drag', () => {
        const { cleanup, emitFromViewer } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());
            act(() => emitFromViewer('comment_range_draft_change', { endMs: 50000, startMs: 44000 }));

            expect(screen.getByTestId('ms').textContent).toBe('44000');
            expect(screen.getByTestId('end-ms').textContent).toBe('50000');
        } finally {
            cleanup();
        }
    });

    test('should pin the start against pause and seek once a drag commits', () => {
        const { audio, cleanup, emitFromViewer, viewer } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());
            act(() => emitFromViewer('comment_range_draft_change', { endMs: 50000, startMs: 44000 }));
            const afterDrag = emittedEvents(viewer).length;

            Object.defineProperty(audio, 'currentTime', { configurable: true, value: 90, writable: true });
            act(() => {
                audio.dispatchEvent(new Event('seeked'));
                audio.dispatchEvent(new Event('pause'));
            });

            expect(screen.getByTestId('ms').textContent).toBe('44000');
            expect(screen.getByTestId('end-ms').textContent).toBe('50000');
            // Scrubbing to re-listen must not drag the user's chosen boundaries along with it.
            expect(emittedEvents(viewer)).toHaveLength(afterDrag);
        } finally {
            cleanup();
        }
    });

    test('should let the start follow pause and seek before any drag', () => {
        const { audio, cleanup, viewer } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());
            Object.defineProperty(audio, 'currentTime', { configurable: true, value: 12, writable: true });
            act(() => audio.dispatchEvent(new Event('pause')));

            expect(screen.getByTestId('ms').textContent).toBe('12000');
            // The handles have to be told: they stayed put while the media played.
            expect(emittedEvents(viewer).pop()).toEqual(['comment_range_draft', { endMs: null, startMs: 12000 }]);
        } finally {
            cleanup();
        }
    });

    test('should ignore a drag reported while the toggle is off', () => {
        const { cleanup, emitFromViewer } = renderWithRange();
        try {
            act(() => emitFromViewer('comment_range_draft_change', { endMs: 50000, startMs: 44000 }));
            expect(screen.getByTestId('ms').textContent).toBe('0');
            expect(screen.getByTestId('end-ms').textContent).toBe('undefined');
        } finally {
            cleanup();
        }
    });

    test.each([
        ['a malformed payload', undefined],
        ['a non-numeric start', { endMs: 50000, startMs: 'nope' }],
        ['a negative start', { endMs: 50000, startMs: -1 }],
    ])('should ignore %s', (_label, payload) => {
        const { cleanup, emitFromViewer } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());
            act(() => emitFromViewer('comment_range_draft_change', payload));

            expect(screen.getByTestId('ms').textContent).toBe('43500');
            expect(screen.getByTestId('end-ms').textContent).toBe('undefined');
        } finally {
            cleanup();
        }
    });

    test.each([
        ['an end before the start', 40000],
        ['an end equal to the start', 44000],
    ])('should drop %s back to a single timestamp', (_label, endMs) => {
        const { cleanup, emitFromViewer } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());
            act(() => emitFromViewer('comment_range_draft_change', { endMs, startMs: 44000 }));

            expect(screen.getByTestId('ms').textContent).toBe('44000');
            expect(screen.getByTestId('end-ms').textContent).toBe('undefined');
        } finally {
            cleanup();
        }
    });

    test('should stay a single timestamp when the viewer never reports a drag', () => {
        const { cleanup, viewer } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());

            expect(screen.getByTestId('end-ms').textContent).toBe('undefined');
            expect(emittedEvents(viewer)).toEqual([['comment_range_draft', { endMs: null, startMs: 43500 }]]);
        } finally {
            cleanup();
        }
    });

    test('should drop back to a collapsed draft after the range is reset', () => {
        const { cleanup, emitFromViewer, viewer } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());
            act(() => emitFromViewer('comment_range_draft_change', { endMs: 50000, startMs: 44000 }));
            act(() => screen.getByText('reset').click());

            expect(screen.getByTestId('end-ms').textContent).toBe('undefined');
            expect(emittedEvents(viewer).pop()).toEqual(['comment_range_draft', { endMs: null, startMs: 44000 }]);
        } finally {
            cleanup();
        }
    });

    test('should let the start follow playback again after the range is reset', () => {
        const { audio, cleanup, emitFromViewer } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());
            act(() => emitFromViewer('comment_range_draft_change', { endMs: 50000, startMs: 44000 }));
            act(() => screen.getByText('reset').click());

            Object.defineProperty(audio, 'currentTime', { configurable: true, value: 61, writable: true });
            act(() => audio.dispatchEvent(new Event('pause')));

            expect(screen.getByTestId('ms').textContent).toBe('61000');
        } finally {
            cleanup();
        }
    });

    test('should keep a dragged range across a new src on the same element', () => {
        // Same element, new src means a token refresh, which is meant to be invisible to the user.
        const { audio, cleanup, emitFromViewer, viewer } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());
            act(() => emitFromViewer('comment_range_draft_change', { endMs: 50000, startMs: 44000 }));
            const afterDrag = emittedEvents(viewer).length;

            act(() => audio.dispatchEvent(new Event('loadstart')));
            act(() => audio.dispatchEvent(new Event('loadeddata')));
            Object.defineProperty(audio, 'currentTime', { configurable: true, value: 44, writable: true });
            act(() => audio.dispatchEvent(new Event('seeked')));

            expect(screen.getByTestId('ms').textContent).toBe('44000');
            expect(screen.getByTestId('end-ms').textContent).toBe('50000');
            expect(emittedEvents(viewer)).toHaveLength(afterDrag);
        } finally {
            cleanup();
        }
    });

    test('should reset an undragged start when a new media src loads', () => {
        const { audio, cleanup } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());
            act(() => audio.dispatchEvent(new Event('loadstart')));

            expect(screen.getByTestId('ms').textContent).toBe('0');
            expect(screen.getByTestId('end-ms').textContent).toBe('undefined');
        } finally {
            cleanup();
        }
    });

    test('should clear the draft on unmount', () => {
        const { cleanup, unmount, viewer } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());
            unmount();

            expect(emittedEvents(viewer).pop()).toEqual(['comment_range_draft_clear', undefined]);
        } finally {
            cleanup();
        }
    });

    test('should not touch the viewer when range selection is disabled', () => {
        const audio = createMediaElement('audio', 43.5);
        const cleanup = mountMediaInDom(audio);
        const { getViewer, hasListener, viewer } = createViewer();
        try {
            render(<TestHarness enabled getViewer={getViewer} />);
            act(() => screen.getByText('press').click());

            expect(emittedEvents(viewer)).toHaveLength(0);
            expect(hasListener('comment_range_draft_change')).toBe(false);
            expect(screen.getByTestId('ms').textContent).toBe('43500');
        } finally {
            cleanup();
        }
    });

    test('should drop the range when preview swaps in a new media element', async () => {
        const { cleanup, emitFromViewer } = renderWithRange();
        try {
            act(() => screen.getByText('press').click());
            act(() => emitFromViewer('comment_range_draft_change', { endMs: 50000, startMs: 44000 }));
            expect(screen.getByTestId('end-ms').textContent).toBe('50000');

            await act(async () => {
                cleanup();
                mountMediaInDom(createMediaElement('audio', 0));
            });

            expect(screen.getByTestId('end-ms').textContent).toBe('undefined');
        } finally {
            document.querySelectorAll('.bp-media-container').forEach(node => node.remove());
        }
    });
});

describe('useMediaTimestamp with audio', () => {
    afterEach(() => {
        document.querySelectorAll('.bp-media-container').forEach(node => node.remove());
    });

    test('should capture current time and pause the audio when toggled on while playing', () => {
        const audio = createMediaElement('audio', 43.5);
        Object.defineProperty(audio, 'paused', { configurable: true, value: false, writable: true });
        const cleanup = mountMediaInDom(audio);
        try {
            render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            expect(audio.pause).toHaveBeenCalled();
            expect(screen.getByTestId('pressed').textContent).toBe('true');
            expect(screen.getByTestId('timestamp').textContent).toBe('0:43');
            expect(screen.getByTestId('ms').textContent).toBe('43500');
        } finally {
            cleanup();
        }
    });

    test('should update captured value when pressed and the audio is seeked', () => {
        const audio = createMediaElement('audio', 0);
        const cleanup = mountMediaInDom(audio);
        try {
            render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            Object.defineProperty(audio, 'currentTime', { configurable: true, value: 7, writable: true });
            act(() => {
                audio.dispatchEvent(new Event('seeked'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:07');
        } finally {
            cleanup();
        }
    });
});
