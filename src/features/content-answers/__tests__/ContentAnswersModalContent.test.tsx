import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import ContentAnswersModalContent from '../ContentAnswersModalContent';
import {
    mockCurrentUser,
    mockFile,
    mockQuestionsNoAnswer,
    mockQuestionsWithAnswer,
    mockQuestionsWithAnswerAndNoAnswer,
} from '../__mocks__/mocks';

describe('features/content-answers/ContentAnswersModalContent', () => {
    const scrollIntoViewMock = jest.fn();
    const renderComponent = (props?: {}) =>
        render(
            <ContentAnswersModalContent
                currentUser={mockCurrentUser}
                fileName={mockFile.name}
                isLoading={false}
                questions={[]}
                {...props}
            />,
        );

    beforeEach(() => {
        HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    });

    test('should render welcome message', () => {
        renderComponent();

        expect(screen.queryByTestId('content-answers-welcome-message')).toBeInTheDocument();
    });

    test('should render only the prompt while loading', () => {
        renderComponent({ isLoading: true, questions: mockQuestionsNoAnswer });

        expect(screen.getByText(mockQuestionsNoAnswer[0].prompt)).toBeInTheDocument();

        const loadingElement = screen.getByTestId('LoadingElement');
        expect(loadingElement).toBeInTheDocument();
    });

    test('should render only the prompt, answer and not loading', () => {
        renderComponent({ questions: mockQuestionsWithAnswer });
        const { answer = '', prompt } = mockQuestionsWithAnswer[0];

        expect(screen.getByText(prompt)).toBeInTheDocument();
        expect(screen.getByText(answer)).toBeInTheDocument();

        const loadingElement = screen.queryByTestId('LoadingElement');
        expect(loadingElement).not.toBeInTheDocument();
    });

    test('should render previous question with another new prompt without answer while loading', () => {
        renderComponent({ isLoading: true, questions: mockQuestionsWithAnswerAndNoAnswer });
        const { answer = '', prompt } = mockQuestionsWithAnswerAndNoAnswer[0];

        expect(screen.getByText(prompt)).toBeInTheDocument();
        expect(screen.getByText(answer)).toBeInTheDocument();
        expect(screen.getByText(mockQuestionsWithAnswerAndNoAnswer[1].prompt)).toBeInTheDocument();

        const loadingElement = screen.queryAllByTestId('LoadingElement');
        expect(loadingElement.length).toEqual(1);
    });

    test('handleScrollToBottom is called with instant behavior on component mount', async () => {
        renderComponent();

        await waitFor(() => {
            expect(scrollIntoViewMock).toBeCalledWith({ behavior: 'instant' });
        });
    });

    test('scrollIntoView function is called with smooth behavior when the answer is updated', () => {
        const { rerender } = renderComponent({ isLoading: true });

        rerender(
            <ContentAnswersModalContent
                currentUser={mockCurrentUser}
                fileName={mockFile.name}
                isLoading={false}
                questions={mockQuestionsWithAnswer}
            />,
        );

        expect(scrollIntoViewMock).toBeCalledWith({ behavior: 'smooth' });
        expect(scrollIntoViewMock).toBeCalledTimes(2);
    });
});
