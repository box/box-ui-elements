import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ContentAnswersModalFooterActions from '../ContentAnswersModalFooterActions';
import { mockQuestionsWithAnswer, mockQuestionsWithError } from '../__mocks__/mocks';

describe('features/content-answers/ContentAnswersModalFooterActions', () => {
    const stubs = {
        onRetryResponse: jest.fn(),
    };

    const renderComponent = (props = {}) => {
        return render(
            <ContentAnswersModalFooterActions
                lastQuestion={mockQuestionsWithAnswer[0]}
                onRetryResponse={stubs.onRetryResponse}
                {...props}
            />,
        );
    };

    test('should not show the retry response button', () => {
        renderComponent();
        const retryResponseButton = screen.queryByTestId('content-answers-retry-response-button');
        expect(retryResponseButton).not.toBeInTheDocument();
    });

    test('should show the retry response button', async () => {
        renderComponent({ lastQuestion: mockQuestionsWithError[0] });
        const retryResponseButton = screen.getByTestId('content-answers-retry-response-button');
        expect(retryResponseButton).toBeInTheDocument();
        await waitFor(() => {
            expect(document.activeElement).toBe(retryResponseButton);
        });
    });

    test('should call the retry response function if the button is clicked', () => {
        renderComponent({ lastQuestion: mockQuestionsWithError[0] });
        const retryResponseButton = screen.getByTestId('content-answers-retry-response-button');

        fireEvent.click(retryResponseButton);

        expect(stubs.onRetryResponse).toHaveBeenCalledWith(mockQuestionsWithError[0]);
    });
});
