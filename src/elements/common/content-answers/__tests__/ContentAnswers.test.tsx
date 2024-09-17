import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '../../../../test-utils/testing-library';

import ContentAnswers from '../ContentAnswers';
import { mockApi, mockFile } from '../__mocks__/mocks';
// @ts-ignore: no ts definition
import APIContext from '../../api-context';

describe('common/content-answers/ContentAnswers', () => {
    const renderComponent = (props?: {}) =>
        render(
            <APIContext.Provider value={mockApi}>
                <ContentAnswers file={mockFile} {...props} />
            </APIContext.Provider>,
        );

    test('should render the content answers', async () => {
        renderComponent();

        const button = screen.getByRole('button', { name: 'Box AI' });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);
        const modal = screen.getByTestId('content-answers-modal');
        expect(modal).toBeInTheDocument();
    });

    test('should highlight open button when there is a question asked and the modal has closed', async () => {
        renderComponent();

        const button = screen.getByRole('button', { name: 'Box AI' });
        await userEvent.click(button);

        const modal = screen.getByTestId('content-answers-modal');
        expect(modal).toBeInTheDocument();

        const textArea = screen.getByRole('textbox', { name: 'Ask anything about this doc' });
        fireEvent.change(textArea, { target: { value: prompt } });

        const submitButton = screen.getByRole('button', { name: 'Ask' });
        await userEvent.click(submitButton);

        expect(button).not.toHaveClass('bdl-ContentAnswersOpenButton--hasQuestions');

        const modalCloseButton = screen.getByLabelText('Close Modal');
        await userEvent.click(modalCloseButton);

        expect(button).toHaveClass('bdl-ContentAnswersOpenButton--hasQuestions');
    });
});
