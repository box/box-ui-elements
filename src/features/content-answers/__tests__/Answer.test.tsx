import React from 'react';
import { render, screen } from '@testing-library/react';

import Answer from '../Answer';

describe('features/content-answers/answer', () => {
    const renderComponent = (props: { answer: string; isLoading: boolean }) => render(<Answer {...props} />);

    test('should only render the answer', () => {
        renderComponent({ answer: 'some answer', isLoading: false });

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
});
