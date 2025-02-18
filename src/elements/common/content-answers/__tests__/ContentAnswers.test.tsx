import * as React from 'react';
import { Notification } from '@box/blueprint-web';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '../../../../test-utils/testing-library';

import ContentAnswers from '../ContentAnswers';
import { mockApi, mockFile } from '../__mocks__/mocks';
// @ts-ignore: no ts definition
import APIContext from '../../api-context';

describe('elements/common/content-answers/ContentAnswers', () => {
    const renderComponent = (props?: {}) =>
        render(
            <Notification.Provider>
                <Notification.Viewport />
                <APIContext.Provider value={mockApi}>
                    <ContentAnswers file={mockFile} {...props} />
                </APIContext.Provider>
            </Notification.Provider>,
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

        const textArea = screen.getByRole('textbox', { name: 'Ask Box AI' });
        fireEvent.change(textArea, { target: { value: prompt } });

        const submitButton = screen.getByRole('button', { name: 'Ask' });
        await userEvent.click(submitButton);

        expect(button).not.toHaveClass('be-ContentAnswersOpenButton--hasQuestions');

        const modalCloseButton = screen.getByLabelText('Close Modal');
        await userEvent.click(modalCloseButton);

        expect(button).toHaveClass('be-ContentAnswersOpenButton--hasQuestions');
    });

    test('should call onAsk when a question is asked', async () => {
        const onAskMock = jest.fn();
        renderComponent({ onAsk: onAskMock });

        const button = screen.getByRole('button', { name: 'Box AI' });
        await userEvent.click(button);

        const textArea = screen.getByRole('textbox', { name: 'Ask Box AI' });
        fireEvent.change(textArea, { target: { value: 'Sample question?' } });

        const submitButton = screen.getByRole('button', { name: 'Ask' });
        await userEvent.click(submitButton);

        expect(onAskMock).toHaveBeenCalled();
    });

    test('should call onRequestClose when the modal is closed', async () => {
        const onRequestCloseMock = jest.fn();
        renderComponent({ onRequestClose: onRequestCloseMock });

        const button = screen.getByRole('button', { name: 'Box AI' });
        await userEvent.click(button);

        const modalCloseButton = screen.getByLabelText('Close Modal');
        await userEvent.click(modalCloseButton);

        expect(onRequestCloseMock).toHaveBeenCalled();
    });
});
