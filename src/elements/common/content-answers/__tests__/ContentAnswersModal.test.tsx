import * as React from 'react';

import { Notification } from '@box/blueprint-web';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';

import ContentAnswersModal from '../ContentAnswersModal';
import {
    mockApi,
    mockApiReturnError,
    mockCurrentUser,
    mockFile,
    mockQuestionsWithAnswer,
    mockQuestionsWithError,
} from '../__mocks__/mocks';
// @ts-ignore: no ts definition
import APIContext from '../../api-context';

describe('elements/common/content-answers/ContentAnswersModal', () => {
    const mockQuestion = { isCompleted: false, isLoading: true, prompt: 'summarize another question' };
    const renderComponent = (api = mockApi, props?: {}) => {
        render(
            <Notification.Provider>
                <Notification.Viewport />
                <APIContext.Provider value={api}>
                    <ContentAnswersModal
                        currentUser={mockCurrentUser}
                        file={mockFile}
                        isOpen
                        onRequestClose={jest.fn()}
                        onAsk={jest.fn()}
                        {...props}
                    />
                </APIContext.Provider>
            </Notification.Provider>,
        );
    };

    test('should render the header icon', () => {
        renderComponent();

        const headerIcon = screen.queryByTestId('content-answers-icon-color');
        expect(headerIcon).toBeInTheDocument();
    });

    test('should ask for answer when prompt is submitted', async () => {
        const onAskMock = jest.fn();
        const { answer = '', prompt } = mockQuestionsWithAnswer[0];
        renderComponent(mockApi, { onAsk: onAskMock });

        const textArea = screen.getByRole('textbox', { name: 'Ask Box AI' });
        await userEvent.type(textArea, prompt);

        const submitButton = screen.getByRole('button', { name: 'Ask' });
        await userEvent.click(submitButton);

        expect(mockApi.getIntelligenceAPI().ask).toBeCalledWith(mockQuestion, [{ id: mockFile.id, type: 'file' }], [], {
            include_citations: true,
        });

        expect(onAskMock).toBeCalled();
        expect(screen.getByText(answer)).toBeInTheDocument();
    });

    test('should render inlineError when ask function failed', async () => {
        const { prompt } = mockQuestionsWithError[0];
        renderComponent(mockApiReturnError);

        const textArea = screen.getByRole('textbox', { name: 'Ask Box AI' });
        await userEvent.type(textArea, prompt);

        const submitButton = screen.getByRole('button', { name: 'Ask' });
        await userEvent.click(submitButton);

        expect(screen.getByText('The Box AI service was unavailable.')).toBeInTheDocument();
    });

    test('should render retry button when ask request fails', async () => {
        const { prompt } = mockQuestionsWithError[0];
        const apiMock = {
            ...mockApi,
            getIntelligenceAPI: jest.fn().mockReturnValue({
                ask: jest
                    .fn()
                    .mockImplementationOnce(() => {
                        throw new Error('error');
                    })
                    .mockResolvedValueOnce({
                        data: mockQuestionsWithAnswer[0],
                    }),
            }),
        };
        renderComponent(apiMock);

        const textArea = screen.getByRole('textbox', { name: 'Ask Box AI' });
        await userEvent.type(textArea, prompt);

        const submitButton = screen.getByRole('button', { name: 'Ask' });
        await userEvent.click(submitButton);

        const retryButton = screen.getByRole('button', { name: 'Retry' });
        await userEvent.click(retryButton);

        expect(screen.getByTestId('content-answers-question')).toBeInTheDocument();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(screen.getByText(mockQuestionsWithAnswer[0].answer!)).toBeInTheDocument();
    });

    test('should ask with dialogue history when prompt is submitted', async () => {
        const onAskMock = jest.fn();
        const { prompt } = mockQuestionsWithAnswer[0];

        renderComponent(mockApi, { onAsk: onAskMock });

        let textArea = screen.getByRole('textbox', { name: 'Ask Box AI' });
        await userEvent.type(textArea, prompt);

        let submitButton = screen.getByRole('button', { name: 'Ask' });
        await userEvent.click(submitButton);

        expect(mockApi.getIntelligenceAPI().ask).toBeCalledWith(mockQuestion, [{ id: mockFile.id, type: 'file' }], [], {
            include_citations: true,
        });

        textArea = screen.getByRole('textbox', { name: 'Ask Box AI' });

        await userEvent.type(textArea, 'Another question?');
        submitButton = screen.getByRole('button', { name: 'Ask' });
        await userEvent.click(submitButton);

        expect(mockApi.getIntelligenceAPI().ask).lastCalledWith(
            { isCompleted: false, isLoading: true, prompt: 'Another question?' },
            [{ id: mockFile.id, type: 'file' }],
            [{ answer: 'summarize answer', created_at: '', prompt: 'summarize another question' }],
            {
                include_citations: true,
            },
        );
    });

    test('renders suggested questions when provided', () => {
        const suggestedQuestions = [{ id: '1', label: 'Suggested Question 1', prompt: 'Prompt 1' }];
        renderComponent(mockApi, { suggestedQuestions });

        expect(screen.getByText('Suggested Question 1')).toBeInTheDocument();
    });

    test('renders localized questions when suggestedQuestions is not provided', () => {
        renderComponent();

        expect(screen.getByText('Summarize this document')).toBeInTheDocument();
    });

    test('should call onClearConversation when the conversation is cleared', async () => {
        const onClearConversationMock = jest.fn();
        renderComponent(mockApi, { onClearConversation: onClearConversationMock });

        const clearButton = screen.getByRole('button', { name: 'Clear conversation' });
        await userEvent.click(clearButton);

        expect(onClearConversationMock).toHaveBeenCalled();
    });

    test('should call onRequestClose when the modal is closed', async () => {
        const onRequestCloseMock = jest.fn();
        renderComponent(mockApi, { onRequestClose: onRequestCloseMock });

        const closeButton = screen.getByLabelText('Close Modal');
        await userEvent.click(closeButton);

        expect(onRequestCloseMock).toHaveBeenCalled();
    });
});
