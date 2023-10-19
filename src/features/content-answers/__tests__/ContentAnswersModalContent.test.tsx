import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import ContentAnswersModalContent from '../ContentAnswersModalContent';
import { mockCurrentUser, mockFile, mockQuestionsWithAnswer } from '../__mocks__/mocks';

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

    afterEach(() => {
        // Restore the original implementation of scrollIntoView
        delete HTMLElement.prototype.scrollIntoView;
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

    test('should not call scrollIntoView if scroll distance is higher than threshold the next time an answer is updated', () => {
        const { container, rerender } = renderComponent({ questions: [] });
        const modalContent = container.firstChild;

        // @ts-ignore should be here
        modalContent.scrollTop = -10;
        // @ts-ignore should be available
        fireEvent.scroll(modalContent);

        rerender(
            <ContentAnswersModalContent
                currentUser={mockCurrentUser}
                fileName={mockFile.name}
                isLoading={false}
                questions={mockQuestionsWithAnswer}
            />,
        );

        expect(scrollIntoViewMock).not.toBeCalled();
    });
});
