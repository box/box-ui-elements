import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import { seekVideoToMs, useVideoTimestamp } from '../useVideoTimestamp';
import type { TimeFormat } from '../useTimeFormat';

const createVideoElement = (currentTime: number = 0): HTMLVideoElement => {
    const video = document.createElement('video');
    Object.defineProperty(video, 'currentTime', {
        configurable: true,
        get: () => currentTime,
        set: (value: number) => {
            currentTime = value;
        },
    });
    Object.defineProperty(video, 'paused', {
        configurable: true,
        value: true,
        writable: true,
    });
    video.pause = jest.fn(() => {
        Object.defineProperty(video, 'paused', { configurable: true, value: true, writable: true });
    });
    return video;
};

const mountVideoInDom = (video: HTMLVideoElement) => {
    const container = document.createElement('div');
    container.className = 'bp-media-container';
    container.appendChild(video);
    document.body.appendChild(container);
    return () => container.remove();
};

const TestHarness = ({
    enabled,
    fps = 24,
    timeFormat = 'standard',
}: {
    enabled: boolean;
    fps?: number;
    timeFormat?: TimeFormat;
}) => {
    const { formattedTimestamp, isPressed, onPressedChange, timestampMs } = useVideoTimestamp(enabled, timeFormat, fps);
    return (
        <div>
            <span data-testid="timestamp">{formattedTimestamp}</span>
            <span data-testid="ms">{String(timestampMs)}</span>
            <span data-testid="pressed">{String(isPressed)}</span>
            <button onClick={() => onPressedChange(true)} type="button">
                press
            </button>
            <button onClick={() => onPressedChange(false)} type="button">
                unpress
            </button>
        </div>
    );
};

describe('useVideoTimestamp', () => {
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

    test('should capture current time and pause the video when toggled on while playing', () => {
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

    test('should update captured value when pressed and the video pauses', () => {
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

    test('should update captured value when pressed and the video is seeked', () => {
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

describe('useVideoTimestamp time format integration', () => {
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

describe('seekVideoToMs', () => {
    afterEach(() => {
        document.querySelectorAll('.bp-media-container').forEach(node => node.remove());
    });

    test('should set currentTime in seconds and pause when a video is present', () => {
        const video = createVideoElement(0);
        Object.defineProperty(video, 'paused', { configurable: true, value: false, writable: true });
        const cleanup = mountVideoInDom(video);
        try {
            seekVideoToMs(8055);
            expect(video.currentTime).toBe(8.055);
            expect(video.pause).toHaveBeenCalled();
        } finally {
            cleanup();
        }
    });

    test('should be a no-op when no video element is present', () => {
        expect(() => seekVideoToMs(1000)).not.toThrow();
    });
});
