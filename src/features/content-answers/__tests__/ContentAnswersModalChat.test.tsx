import React from 'react';
import { render, screen } from '@testing-library/react';

import ContentAnswersModalChat from '../ContentAnswersModalChat';

import {
    mockCurrentUser,
    mockQuestionsNoAnswer,
    mockQuestionsWithAnswer,
    mockQuestionsWithAnswerAndNoAnswer,
} from '../__mocks__/mocks';

jest.mock('../../../utils/dom', () => ({
    scrollIntoView: jest.fn(),
}));

describe('features/content-answers/ContentAnswersModalContent', () => {
    const renderComponent = (props?: {}) => {
        render(
            <ContentAnswersModalChat
                currentUser={mockCurrentUser}
                fileName="name"
                handleScrollToBottom={jest.fn()}
                isLoading={false}
                questions={mockQuestionsNoAnswer}
                {...props}
            />,
        );
    };

    test('should render welcome message', () => {
        renderComponent();
        expect(screen.queryByTestId('content-answers-welcome-message')).toBeInTheDocument();
    });

    test('should render only the prompt while loading', () => {
        renderComponent({ isLoading: true });

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

    test('should render original question with another the prompt, with no answer while loading', () => {
        renderComponent({ isLoading: true, questions: mockQuestionsWithAnswerAndNoAnswer });
        const { answer = '', prompt } = mockQuestionsWithAnswerAndNoAnswer[0];

        expect(screen.getByText(prompt)).toBeInTheDocument();
        expect(screen.getByText(answer)).toBeInTheDocument();
        expect(screen.getByText(mockQuestionsWithAnswerAndNoAnswer[1].prompt)).toBeInTheDocument();

        const loadingElement = screen.queryAllByTestId('LoadingElement');
        expect(loadingElement.length).toEqual(1);
    });
});
