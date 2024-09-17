import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '../../../../test-utils/testing-library';

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

describe('common/content-answers/ContentAnswersModal', () => {
    const mockQuestion = { isCompleted: false, isLoading: true, prompt: 'summarize another question' };
    const renderComponent = (api = mockApi, props?: {}) => {
        render(
            <APIContext.Provider value={api}>
                <ContentAnswersModal
                    currentUser={mockCurrentUser}
                    file={mockFile}
                    isOpen
                    onRequestClose={jest.fn()}
                    onAsk={jest.fn()}
                    {...props}
                />
            </APIContext.Provider>,
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

        const textArea = screen.getByRole('textbox', { name: 'Ask anything about this doc' });
        fireEvent.change(textArea, { target: { value: prompt } });

        const submitButton = screen.getByRole('button', { name: 'Ask' });
        await userEvent.click(submitButton);

        expect(mockApi.getIntelligenceAPI().ask).toBeCalledWith(mockQuestion, [{ id: mockFile.id, type: 'file' }]);

        expect(onAskMock).toBeCalled();
        expect(screen.getByText(answer)).toBeInTheDocument();
    });

    test('should render inlineError when ask function failed', async () => {
        const { prompt } = mockQuestionsWithError[0];
        renderComponent(mockApiReturnError);

        const textArea = screen.getByRole('textbox', { name: 'Ask anything about this doc' });
        fireEvent.change(textArea, { target: { value: prompt } });

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

        const textArea = screen.getByRole('textbox', { name: 'Ask anything about this doc' });
        fireEvent.change(textArea, { target: { value: prompt } });

        const submitButton = screen.getByRole('button', { name: 'Ask' });
        await userEvent.click(submitButton);

        const retryButton = screen.getByRole('button', { name: 'Retry' });
        await userEvent.click(retryButton);

        expect(screen.getByTestId('content-answers-question')).toBeInTheDocument();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(screen.getByText(mockQuestionsWithAnswer[0].answer!)).toBeInTheDocument();
    });
});
