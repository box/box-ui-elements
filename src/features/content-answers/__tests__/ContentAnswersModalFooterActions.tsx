import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ContentAnswersModalFooterActions from '../ContentAnswersModalFooterActions';

describe('features/content-answers/ContentAnswersModalFooterActions', () => {
    const stubs = {
        onRetryResponse: jest.fn(),
    };

    const renderComponent = (props = {}) => {
        return render(
            <ContentAnswersModalFooterActions hasError={false} onRetryResponse={stubs.onRetryResponse} {...props} />,
        );
    };

    test('should not show the retry response button', () => {
        renderComponent();
        const retryResponseButton = screen.queryByTestId('content-answers-retry-response-button');
        expect(retryResponseButton).not.toBeInTheDocument();
    });

    test('should show the retry response button', async () => {
        renderComponent({ hasError: true });
        const retryResponseButton = screen.getByTestId('content-answers-retry-response-button');
        expect(retryResponseButton).toBeInTheDocument();
        await waitFor(() => {
            expect(document.activeElement).toBe(retryResponseButton);
        });
    });

    test('should call the retry response function if the button is clicked', () => {
        renderComponent({ hasError: true });
        const retryResponseButton = screen.getByTestId('content-answers-retry-response-button');

        fireEvent.click(retryResponseButton);

        expect(stubs.onRetryResponse).toHaveBeenCalled();
    });
});
