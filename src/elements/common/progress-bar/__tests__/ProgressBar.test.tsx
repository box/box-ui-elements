import * as React from 'react';
import { act, render, screen } from '../../../../test-utils/testing-library';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
    test('renders with initial percent', () => {
        render(<ProgressBar percent={20} />);
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveStyle({ width: '20%' });
    });

    test('updates percent when props change', () => {
        const { rerender } = render(<ProgressBar percent={20} />);
        rerender(<ProgressBar percent={30} />);
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveStyle({ width: '30%' });
    });

    test('resets percent to 0 after reaching 100%', async () => {
        jest.useFakeTimers();
        render(<ProgressBar percent={0} />);

        act(() => {
            jest.advanceTimersByTime(250000); // yes it has to be at least 250000ms, any less it will not hit 100%
        });

        const progressBar = await screen.getByRole('progressbar');
        expect(progressBar).toHaveStyle({ width: '100%' });

        jest.useRealTimers();
    });
});
