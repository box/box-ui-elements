import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ContentAnswers from '../ContentAnswers';
import { mockApi, mockFile } from '../__mocks__/mocks';
// @ts-ignore: no ts definition
import APIContext from '../../../elements/common/api-context';

describe('common/content-answers/ContentAnswers', () => {
    const renderComponent = (props?: {}) =>
        render(
            <APIContext.Provider value={mockApi}>
                <ContentAnswers file={mockFile} {...props} />
            </APIContext.Provider>,
        );

    test('should render the content answers', () => {
        renderComponent();

        const button = screen.getByTestId('content-answers-open-button');
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        const modal = screen.getByTestId('content-answers-modal');
        expect(modal).toBeInTheDocument();
    });

    test('should highlight open button when there is a question asked and the modal has closed', async () => {
        renderComponent();

        const button = screen.getByTestId('content-answers-open-button');
        fireEvent.click(button);

        const modal = screen.getByTestId('content-answers-modal');
        expect(modal).toBeInTheDocument();

        const textArea = screen.getByTestId('content-answers-question-input');
        fireEvent.change(textArea, { target: { value: prompt } });

        const submitButton = screen.getByTestId('content-answers-submit-button');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(button).not.toHaveClass('bdl-ContentAnswersOpenButton--hasQuestions');
        });

        const modalCloseButton = screen.getByLabelText('Close Modal');
        fireEvent.click(modalCloseButton);

        await waitFor(() => {
            expect(button).toHaveClass('bdl-ContentAnswersOpenButton--hasQuestions');
        });
    });
});
