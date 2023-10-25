import React from 'react';
import { render, screen } from '@testing-library/react';

import Answer from '../Answer';

describe('features/content-answers/answer', () => {
    const renderComponent = (props?: {}) =>
        render(<Answer handleScrollToBottom={jest.fn()} isLoading={false} {...props} />);

    test('should render the answer', () => {
        renderComponent({ answer: 'some answer', isLoading: false });

        const answer = screen.getByText('some answer');
        expect(answer).toBeInTheDocument();
    });

    test('should render the loading element', () => {
        renderComponent({ answer: '', isLoading: true });

        const loadingElement = screen.getByTestId('LoadingElement');
        expect(loadingElement).toBeInTheDocument();
    });

    test('should call handleScrollToBottom when there is an answer', () => {
        const mockHandleScrollToBottom = jest.fn();
        renderComponent({ answer: 'some answer', handleScrollToBottom: mockHandleScrollToBottom, isLoading: false });

        expect(mockHandleScrollToBottom).toBeCalledWith('smooth');
    });
});
