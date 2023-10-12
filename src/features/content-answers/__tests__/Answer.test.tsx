import React from 'react';
import { render, screen } from '@testing-library/react';

import Answer from '../Answer';

describe('features/content-answers/answer', () => {
    const renderComponent = (props: { answer: string; handleScrollToBottom: Function; isLoading: boolean }) =>
        render(<Answer {...props} />);

    test('should render the answer', () => {
        renderComponent({ answer: 'some answer', handleScrollToBottom: jest.fn(), isLoading: false });

        const answer = screen.getByText('some answer');
        expect(answer).toBeInTheDocument();
    });

    test('should render the loading element', () => {
        renderComponent({ answer: '', handleScrollToBottom: jest.fn(), isLoading: true });

        const loadingElement = screen.getByTestId('LoadingElement');
        expect(loadingElement).toBeInTheDocument();
    });
});
