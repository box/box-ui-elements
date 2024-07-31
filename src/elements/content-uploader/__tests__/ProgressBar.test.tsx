import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

describe('elements/content-uploader/ProgressBar', () => {
    test('initializes with default percent if not provided', () => {
        render(<ProgressBar />);
        expect(screen.getByRole('progressbar').style.width).toEqual('0%');
    });

    test('handles progress percent correctly when updated to 100%', () => {
        const { rerender } = render(<ProgressBar percent={50} />);
        rerender(<ProgressBar percent={100} />);
        expect(screen.getByRole('progressbar').style.width).toEqual('100%');
    });

    test('does not exceed 100% width when percent is over 100', () => {
        render(<ProgressBar percent={150} />);
        expect(screen.getByRole('progressbar').style.width).toEqual('100%');
    });

    test('does not go below 0% width when percent is negative', () => {
        render(<ProgressBar percent={-20} />);
        expect(screen.getByRole('progressbar').style.width).toEqual('0%');
    });

    test('updates transition delay based on percent', () => {
        const { rerender } = render(<ProgressBar percent={0} />);
        // @ts-ignore style does exsist
        expect(screen.getByRole('progressbar').parentNode.style.transitionDelay).toEqual('0.4s');
        rerender(<ProgressBar percent={50} />);
        // @ts-ignore style does exist
        expect(screen.getByRole('progressbar').parentNode.style.transitionDelay).toEqual('0');
    });
});
