// @flow

import React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render, screen } from '@testing-library/react';
import CreateReply from '../CreateReply';
import localize from '../../../../../../test/support/i18n';
import messages from '../messages';

jest.mock('../../Avatar', () => () => 'Avatar');
jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

const onCancel = jest.fn();
const onFocus = jest.fn();
const onSubmit = jest.fn();
const onClick = jest.fn();

const getWrapper = props =>
    render(
        <IntlProvider locale="en">
            <CreateReply
                isDisabled={false}
                onCancel={onCancel}
                onFocus={onFocus}
                onSubmit={onSubmit}
                onClick={onClick}
                showReplyForm={false}
                {...props}
            />
        </IntlProvider>,
    );

describe('elements/content-sidebar/ActivityFeed/comment/CreateReply', () => {
    const replyMessage = localize(messages.reply.id);
    const replyInThreadMessage = localize(messages.replyInThread.id);

    test('should correctly render CreateReply button', () => {
        getWrapper();

        expect(screen.getByText(replyMessage)).toBeVisible();
        expect(screen.queryByPlaceholderText(replyInThreadMessage)).not.toBeInTheDocument();
    });

    test('should correctly render CreateReply form', () => {
        getWrapper({ showReplyForm: true });

        expect(screen.getByText(replyInThreadMessage)).toBeVisible();
        expect(screen.queryByText(replyMessage)).not.toBeInTheDocument();
    });

    test('should call onClick when reply button is clicked', () => {
        getWrapper();

        fireEvent.click(screen.getByText(replyMessage));
        expect(onClick).toBeCalledTimes(1);
        expect(onSubmit).toBeCalledTimes(0);
        expect(onFocus).toBeCalledTimes(0);
        expect(onCancel).toBeCalledTimes(0);
    });

    test('should call onClick when reply button is clicked', () => {
        getWrapper();

        fireEvent.click(screen.getByText(replyMessage));
        expect(onClick).toBeCalledTimes(1);
        expect(onSubmit).toBeCalledTimes(0);
        expect(onFocus).toBeCalledTimes(0);
        expect(onCancel).toBeCalledTimes(0);
    });
});
