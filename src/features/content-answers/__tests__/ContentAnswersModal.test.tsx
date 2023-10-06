import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ContentAnswersModal from '../ContentAnswersModal';
import { mockApi, mockCurrentUser, mockFile, mockQuestionsWithAnswer } from '../__mocks__/mocks';
// @ts-ignore: no ts definition
import APIContext from '../../../elements/common/api-context';

describe('features/content-answers/ContentAnswersModal', () => {
    const renderComponent = (props?: {}) =>
        render(
            <APIContext.Provider value={mockApi}>
                <ContentAnswersModal
                    currentUser={mockCurrentUser}
                    file={mockFile}
                    isOpen
                    onRequestClose={jest.fn()}
                    {...props}
                />
            </APIContext.Provider>,
        );

    test('should render the header icon', () => {
        renderComponent();

        const headerIcon = screen.queryByTestId('content-answers-icon-color');
        expect(headerIcon).toBeInTheDocument();
    });

    test('should ask for answer when prompt is submitted', async () => {
        const { answer = '', prompt } = mockQuestionsWithAnswer[0];
        renderComponent();

        const textArea = screen.getByTestId('content-answers-question-input');
        fireEvent.change(textArea, { target: { value: prompt } });

        const submitButton = screen.getByTestId('content-answers-submit-button');
        fireEvent.click(submitButton);

        await waitFor(() =>
            expect(mockApi.getIntelligenceAPI().ask).toBeCalledWith(prompt, [{ id: mockFile.id, type: 'file' }]),
        );

        expect(screen.getByTestId('content-answers-question')).toBeInTheDocument();
        expect(screen.getByText(answer)).toBeInTheDocument();
    });
});
