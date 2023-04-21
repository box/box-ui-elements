// @flow

import React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render, screen } from '@testing-library/react';
import { ContentState, EditorState } from 'draft-js';
import CreateReply from '../CreateReply';
import localize from '../../../../../../test/support/i18n';
import messages from '../messages';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

const onCancel = jest.fn();
const onFocus = jest.fn();
const onSubmit = jest.fn();
const onClick = jest.fn();

const replyInThreadMessage = localize(messages.replyInThread.id);
const replyMessage = localize(messages.reply.id);

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
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should correctly render CreateReply button', () => {
        getWrapper();

        expect(screen.getByText(replyMessage)).toBeVisible();
        expect(screen.queryByText(replyInThreadMessage)).not.toBeInTheDocument();
    });

    test('should correctly render CreateReply form with default placeholder', () => {
        getWrapper({ showReplyForm: true });

        expect(screen.getByText(replyInThreadMessage)).toBeVisible();
        expect(screen.queryByText(replyMessage)).not.toBeInTheDocument();
    });

    test('should correctly render CreateReply form with a passed in placeholder', () => {
        getWrapper({ showReplyForm: true, placeholder: 'Reply to Task' });

        expect(screen.getByText('Reply to Task')).toBeVisible();
        expect(screen.queryByText(replyInThreadMessage)).not.toBeInTheDocument();
        expect(screen.queryByText(replyMessage)).not.toBeInTheDocument();
    });

    test('should disable Reply button if isDisabled property is true', () => {
        getWrapper({ isDisabled: true });

        const replyButton = screen.getByRole('button', { name: replyMessage });
        expect(replyButton).toHaveAttribute('aria-disabled', 'true');

        fireEvent.click(replyButton);
        expect(onClick).not.toBeCalled();
    });

    test('should call onClick when reply button is clicked', () => {
        getWrapper();

        fireEvent.click(screen.getByText(replyMessage));
        expect(onClick).toBeCalledTimes(1);
        expect(onSubmit).not.toBeCalled();
        expect(onFocus).not.toBeCalled();
        expect(onCancel).not.toBeCalled();
    });

    test('should not show form when isDisabled property is true', () => {
        getWrapper({ showReplyForm: true, isDisabled: true });

        const replyButton = screen.getByRole('button', { name: replyMessage });
        expect(screen.queryByText(replyInThreadMessage)).not.toBeInTheDocument();
        expect(replyButton).toHaveAttribute('aria-disabled', 'true');

        fireEvent.click(replyButton);
        expect(onClick).not.toBeCalled();
    });

    test('should call onCancel when form cancel is clicked', () => {
        getWrapper({ showReplyForm: true });

        fireEvent.click(screen.getByText('Cancel'));
        expect(onCancel).toBeCalledTimes(1);
        expect(onSubmit).not.toBeCalled();
        expect(onFocus).not.toBeCalled();
        expect(onClick).not.toBeCalled();
    });

    test('should call onSubmit when reply is posted', () => {
        // Mock DraftJS editor and intercept onChange since DraftJS doesn't have a value setter
        const draftjs = require('draft-js');
        draftjs.Editor = jest.fn(props => {
            const modifiedOnchange = e => {
                const text = e.target.value;
                const content = ContentState.createFromText(text);
                props.onChange(EditorState.createWithContent(content));
            };
            return <input className="editor" onChange={e => modifiedOnchange(e)} />;
        });

        getWrapper({ showReplyForm: true });

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Batman' } });

        fireEvent.click(screen.getByText('Post'));
        expect(onSubmit).toBeCalledTimes(1);
        expect(onSubmit).toBeCalledWith('Batman');
    });
});
