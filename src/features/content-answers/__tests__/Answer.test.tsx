import React from 'react';
import { render, screen } from '@testing-library/react';

import Answer from '../Answer';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { ElementsXhrError } from '../../../common/types/api';

describe('features/content-answers/answer', () => {
    const renderComponent = (props: { answer: string; error: ElementsXhrError; isLoading: boolean }) =>
        render(<Answer {...props} />);

    test('should only render the answer', () => {
        renderComponent({ answer: 'some answer', error: undefined, isLoading: false });

        const answer = screen.getByText('some answer');
        expect(answer).toBeInTheDocument();
        expect(screen.queryByTestId('LoadingElement')).not.toBeInTheDocument();
        expect(screen.queryByTestId('InlineError')).not.toBeInTheDocument();
    });

    test('should only render the Loading Element', () => {
        renderComponent({ answer: '', error: undefined, isLoading: true });

        const loadingElement = screen.getByTestId('LoadingElement');
        expect(loadingElement).toBeInTheDocument();
        expect(screen.queryAllByTestId('content-answers-grid-card')).toHaveLength(1);
        expect(screen.queryByTestId('InlineError')).not.toBeInTheDocument();
    });

    test('should only render the InlineError', () => {
        renderComponent({ answer: '', error: new Error('error'), isLoading: false });

        const inlineError = screen.getByTestId('InlineError');
        expect(inlineError).toBeInTheDocument();
        expect(screen.queryByTestId('content-answers-grid-card')).not.toBeInTheDocument();
        expect(screen.queryByTestId('LoadingElement')).not.toBeInTheDocument();
    });
});
