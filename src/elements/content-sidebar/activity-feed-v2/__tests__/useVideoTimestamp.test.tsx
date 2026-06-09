import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import { useVideoTimestamp } from '../useVideoTimestamp';

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

const TestHarness = ({ enabled }: { enabled: boolean }) => {
    const { formattedTimestamp, getTimestampMs, isPressed, onPressedChange } = useVideoTimestamp(enabled);
    return (
        <div>
            <span data-testid="timestamp">{formattedTimestamp}</span>
            <span data-testid="ms">{String(getTimestampMs())}</span>
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

    test('should not change captured value when pressed and the video is playing', () => {
        const video = createVideoElement(0);
        const cleanup = mountVideoInDom(video);
        try {
            render(<TestHarness enabled />);
            act(() => {
                screen.getByText('press').click();
            });
            // simulate playback advancing then a play event (no pause/seek yet)
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 30, writable: true });
            act(() => {
                video.dispatchEvent(new Event('playing'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:00');
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
            // capture an initial value
            Object.defineProperty(video, 'currentTime', { configurable: true, value: 5, writable: true });
            act(() => {
                video.dispatchEvent(new Event('pause'));
            });
            expect(screen.getByTestId('timestamp').textContent).toBe('0:05');
            // unpress and continue playback past it
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
});
