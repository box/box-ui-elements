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

describe('features/content-answers/ContentAnswersModalFooter', () => {
    const usersAPI = {
        getUser: (id: string, success: Function) => {
            success({ id: '123', name: 'Greg Wong' });
        },
    };
    const api = {
        getUsersAPI: () => usersAPI,
    };
    const file = { id: '123' };
    const renderComponent = (props?: {}) =>
        render(
            <APIContext.Provider value={api}>
                <ContentAnswersModalFooter file={file} {...props} />
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
});
