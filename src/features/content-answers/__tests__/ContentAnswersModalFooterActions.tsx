import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ContentAnswersModalFooterActions from '../ContentAnswersModalFooterActions';

describe('features/content-answers/ContentAnswersModalFooterActions', () => {
    const stubs = {
        onRetry: jest.fn(),
    };

    const renderComponent = (props = {}) => {
        return render(<ContentAnswersModalFooterActions hasError={false} onRetry={stubs.onRetry} {...props} />);
    };

    test('should not show the retry button', () => {
        renderComponent();
        const retryButton = screen.queryByTestId('content-answers-retry-button');
        expect(retryButton).not.toBeInTheDocument();
    });

    test('should show the retry button', async () => {
        renderComponent({ hasError: true });
        const retryButton = screen.getByTestId('content-answers-retry-button');
        expect(retryButton).toBeInTheDocument();
        await waitFor(() => {
            expect(document.activeElement).toBe(retryButton);
        });
    });

    test('should call the retry response function if the button is clicked', () => {
        renderComponent({ hasError: true });
        const retryButton = screen.getByTestId('content-answers-retry-button');

        fireEvent.click(retryButton);

        expect(stubs.onRetry).toBeCalled();
    });
});
