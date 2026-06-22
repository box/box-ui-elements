import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import { formatByTimeFormat, useTimeFormat } from '../useTimeFormat';

const TestHarness = ({ enabled }: { enabled: boolean }) => {
    const { timeFormat, fps } = useTimeFormat(enabled);
    return (
        <div>
            <span data-testid="format">{timeFormat}</span>
            <span data-testid="fps">{String(fps)}</span>
        </div>
    );
};

describe('useTimeFormat', () => {
    afterEach(() => {
        document.querySelectorAll('.bp-media-container').forEach(node => node.remove());
    });

    test('should return standard format and default fps when disabled', () => {
        render(<TestHarness enabled={false} />);
        expect(screen.getByTestId('format').textContent).toBe('standard');
        expect(screen.getByTestId('fps').textContent).toBe('24');
    });

    test('should return standard format when no media container exists', () => {
        render(<TestHarness enabled />);
        expect(screen.getByTestId('format').textContent).toBe('standard');
        expect(screen.getByTestId('fps').textContent).toBe('24');
    });

    test('should read initial data attributes from media container', () => {
        const container = document.createElement('div');
        container.className = 'bp-media-container';
        container.setAttribute('data-time-format', 'timecode');
        container.setAttribute('data-fps', '30');
        document.body.appendChild(container);

        render(<TestHarness enabled />);
        expect(screen.getByTestId('format').textContent).toBe('timecode');
        expect(screen.getByTestId('fps').textContent).toBe('30');
    });

    test('should update when data-time-format attribute changes', async () => {
        const container = document.createElement('div');
        container.className = 'bp-media-container';
        container.setAttribute('data-time-format', 'standard');
        container.setAttribute('data-fps', '24');
        document.body.appendChild(container);

        render(<TestHarness enabled />);
        expect(screen.getByTestId('format').textContent).toBe('standard');

        await act(async () => {
            container.setAttribute('data-time-format', 'frames');
        });
        expect(screen.getByTestId('format').textContent).toBe('frames');
    });

    test('should update when data-fps attribute changes', async () => {
        const container = document.createElement('div');
        container.className = 'bp-media-container';
        container.setAttribute('data-time-format', 'timecode');
        container.setAttribute('data-fps', '24');
        document.body.appendChild(container);

        render(<TestHarness enabled />);
        expect(screen.getByTestId('fps').textContent).toBe('24');

        await act(async () => {
            container.setAttribute('data-fps', '60');
        });
        expect(screen.getByTestId('fps').textContent).toBe('60');
    });

    test('should observe a late-appearing media container', async () => {
        render(<TestHarness enabled />);
        expect(screen.getByTestId('format').textContent).toBe('standard');

        await act(async () => {
            const container = document.createElement('div');
            container.className = 'bp-media-container';
            container.setAttribute('data-time-format', 'frames');
            container.setAttribute('data-fps', '30');
            document.body.appendChild(container);
        });

        expect(screen.getByTestId('format').textContent).toBe('frames');
        expect(screen.getByTestId('fps').textContent).toBe('30');
    });

    test('should fall back to default fps when attribute is invalid', () => {
        const container = document.createElement('div');
        container.className = 'bp-media-container';
        container.setAttribute('data-time-format', 'timecode');
        container.setAttribute('data-fps', 'bad');
        document.body.appendChild(container);

        render(<TestHarness enabled />);
        expect(screen.getByTestId('fps').textContent).toBe('24');
    });

    test('should fall back to standard when data-time-format is absent', () => {
        const container = document.createElement('div');
        container.className = 'bp-media-container';
        document.body.appendChild(container);

        render(<TestHarness enabled />);
        expect(screen.getByTestId('format').textContent).toBe('standard');
    });

    test('should reset to defaults when transitioning from enabled to disabled', async () => {
        const container = document.createElement('div');
        container.className = 'bp-media-container';
        container.setAttribute('data-time-format', 'timecode');
        container.setAttribute('data-fps', '30');
        document.body.appendChild(container);

        const { rerender } = render(<TestHarness enabled />);
        expect(screen.getByTestId('format').textContent).toBe('timecode');
        expect(screen.getByTestId('fps').textContent).toBe('30');

        rerender(<TestHarness enabled={false} />);
        expect(screen.getByTestId('format').textContent).toBe('standard');
        expect(screen.getByTestId('fps').textContent).toBe('24');
    });
});

describe('formatByTimeFormat', () => {
    test('should format as standard time', () => {
        expect(formatByTimeFormat(43500, 'standard', 24)).toBe('0:43');
        expect(formatByTimeFormat(3661000, 'standard', 24)).toBe('1:01:01');
    });

    test('should format as timecode', () => {
        expect(formatByTimeFormat(61500, 'timecode', 30)).toBe('00:01:01:15');
        expect(formatByTimeFormat(0, 'timecode', 24)).toBe('00:00:00:00');
    });

    test('should format as frame number string', () => {
        expect(formatByTimeFormat(10000, 'frames', 24)).toBe('240');
        expect(formatByTimeFormat(1000, 'frames', 30)).toBe('30');
        expect(formatByTimeFormat(0, 'frames', 24)).toBe('0');
    });
});
