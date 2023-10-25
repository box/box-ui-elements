import React from 'react';
import { render, screen } from '@testing-library/react';

import Answer from '../Answer';

describe('features/content-answers/answer', () => {
    const renderComponent = (props?: {}) =>
        render(<Answer handleScrollToBottom={jest.fn()} isLoading={false} {...props} />);

    test('should only render the answer', () => {
        renderComponent({ answer: 'some answer' });

        const answer = screen.getByText('some answer');
        expect(answer).toBeInTheDocument();
        expect(screen.queryByTestId('LoadingElement')).not.toBeInTheDocument();
    });

    test('should only render the Loading Element', () => {
        renderComponent({ answer: '', isLoading: true });

        const loadingElement = screen.getByTestId('LoadingElement');
        expect(loadingElement).toBeInTheDocument();
        // expect there is only one element at Answer Component which is loading element
        expect(screen.getByTestId('Answer').children.length).toBe(1);
    });

    test('should call handleScrollToBottom when there is an answer', () => {
        const mockHandleScrollToBottom = jest.fn();
        renderComponent({ answer: 'some answer', handleScrollToBottom: mockHandleScrollToBottom });

        expect(mockHandleScrollToBottom).toBeCalledWith('smooth');
    });
});
