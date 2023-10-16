import React from 'react';
import { render, screen } from '@testing-library/react';

import Answer from '../Answer';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { ElementsXhrError } from '../../../common/types/api';

describe('features/content-answers/answer', () => {
    const renderComponent = (props: { answer: string; error: ElementsXhrError; isLoading: boolean }) =>
        render(<Answer {...props} />);

    test('should render the answer', () => {
        renderComponent({ answer: 'some answer', error: undefined, isLoading: false });

        const answer = screen.getByText('some answer');
        expect(answer).toBeInTheDocument();
    });

    test('should render the loading element', () => {
        renderComponent({ answer: '', error: undefined, isLoading: true });

        const loadingElement = screen.getByTestId('LoadingElement');
        expect(loadingElement).toBeInTheDocument();
    });

    test('should render inline error', () => {
        renderComponent({ answer: '', error: new Error('error'), isLoading: true });

        const inlineError = screen.getByTestId('InlineError');
        expect(inlineError).toBeInTheDocument();
    });
});
