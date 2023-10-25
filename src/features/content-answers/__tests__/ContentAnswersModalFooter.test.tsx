import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

// @ts-ignore flow import
import localize from '../../../../test/support/i18n';
import ContentAnswersModalFooter from '../ContentAnswersModalFooter';
import { MOCK_LONG_PROMPT, TEXT_AREA } from '../constants';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import APIContext from '../../../elements/common/api-context';

import messages from '../messages';
import { mockApi, mockCurrentUser } from '../__mocks__/mocks';

describe('features/content-answers/ContentAnswersModalFooter', () => {
    const renderComponent = (props?: {}) =>
        render(
            <APIContext.Provider value={mockApi}>
                <ContentAnswersModalFooter
                    currentUser={mockCurrentUser}
                    isLoading={false}
                    onAsk={jest.fn()}
                    {...props}
                />
            </APIContext.Provider>,
        );

    test('should disable submit button if input is empty', () => {
        renderComponent();
        const submitButton = screen.getByTestId('content-answers-submit-button');
        expect(submitButton).toHaveClass('is-disabled');
    });

    test('should enable submit button if there is any input', () => {
        renderComponent();
        const submitButton = screen.getByTestId('content-answers-submit-button');
        const input = screen.getByTestId('content-answers-question-input');

        fireEvent.change(input, { target: { value: 'Test' } });
        expect(submitButton).not.toHaveClass('is-disabled');
    });

    test('should clear the prompt when ask button is clicked', () => {
        renderComponent();
        const submitButton = screen.getByTestId('content-answers-submit-button');
        const input = screen.getByTestId('content-answers-question-input');

        fireEvent.change(input, { target: { value: 'Test' } });
        expect(input).toHaveValue('Test');

        fireEvent.click(submitButton);
        expect(input).toHaveValue('');
    });

    test('should show an error if the character limit is reached', () => {
        renderComponent();
        const input = screen.getByTestId('content-answers-question-input');

        fireEvent.change(input, { target: { value: MOCK_LONG_PROMPT } });

        const error = screen.queryAllByText(
            localize(messages.maxCharactersReachedError.id, { characterLimit: TEXT_AREA.MAX_LENGTH }),
        );
        expect(error.length).not.toBe(0);
    });

    test('should render avatar', () => {
        renderComponent();

        const initials = screen.getByText('GW');
        expect(initials).toBeInTheDocument();
    });

    test.each`
        keyCode | shiftKey | value     | result   | title
        ${13}   | ${false} | ${'Test'} | ${true}  | ${'submit if enter is hit and shift is not held'}
        ${13}   | ${true}  | ${''}     | ${false} | ${'not submit if enter is hit and shift is held'}
        ${13}   | ${false} | ${''}     | ${false} | ${'not submit if enter is hit but no value is there'}
    `('should $title', ({ keyCode, shiftKey, value, result }) => {
        const mockOnAsk = jest.fn();
        renderComponent({ onAsk: mockOnAsk });

        const input = screen.getByTestId('content-answers-question-input');

        fireEvent.change(input, { target: { value } });
        fireEvent.keyDown(input, { keyCode, shiftKey });

        if (result) {
            expect(mockOnAsk).toBeCalledWith(value);
        } else {
            expect(mockOnAsk).not.toBeCalled();
        }
    });
});
