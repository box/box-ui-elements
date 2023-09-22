import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

// @ts-ignore flow import
import localize from '../../../../test/support/i18n';
import ContentAnswersModalFooter from '../ContentAnswersModalFooter';
import { MOCK_LONG_PROMPT, TEXT_AREA } from '../constants';

import messages from '../messages';

describe('features/content-answers/ContentAnswersModalFooter', () => {
    const renderComponent = (props?: {}) => render(<ContentAnswersModalFooter {...props} />);

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

    test('should show an error if the character limit is reached', () => {
        renderComponent();
        const input = screen.getByTestId('content-answers-question-input');

        fireEvent.change(input, { target: { value: MOCK_LONG_PROMPT } });

        const error = screen.queryAllByText(
            localize(messages.maxCharactersReachedError.id, { characterLimit: TEXT_AREA.MAX_LENGTH }),
        );
        expect(error.length).not.toBe(0);
    });
});
