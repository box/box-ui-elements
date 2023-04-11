// @flow

import React from 'react';
import { IntlProvider } from 'react-intl';
import { ContentState, EditorState } from 'draft-js';
import { fireEvent, render, screen } from '@testing-library/react';
import { Replies } from '../BaseComment';

jest.mock('../../Avatar', () => () => 'Avatar');
jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

const TIME_STRING_SEPT_27_2017 = '2017-09-27T10:40:41-07:00';
const TIME_STRING_SEPT_28_2017 = '2017-09-28T10:40:41-07:00';
const comment = {
    id: 1,
    type: 'comment',
    created_at: TIME_STRING_SEPT_27_2017,
    tagged_message: 'test',
    created_by: { name: '50 Cent', id: 10 },
    permissions: { can_delete: true, can_edit: true, can_resolve: true },
};
const comment2 = {
    id: 2,
    type: 'comment',
    created_at: TIME_STRING_SEPT_27_2017,
    tagged_message: 'test 2',
    created_by: { name: 'Eminem', id: 11 },
    permissions: { can_delete: true, can_edit: true, can_resolve: true },
};
const comment3 = {
    id: 3,
    type: 'comment',
    created_at: TIME_STRING_SEPT_28_2017,
    tagged_message: 'test 3',
    created_by: { name: 'Snoop Dogg', id: 12 },
    permissions: { can_delete: true, can_edit: true, can_resolve: true },
};

const currentUser = {
    name: 'testuser',
    id: 9,
};

const mockUserProfileUrl = jest.fn();

const commentProps = {
    currentUser,
    getAvatarUrl: jest.fn(),
    getMentionWithQuery: jest.fn(),
    getUserProfileUrl: mockUserProfileUrl,
    mentionSelectorContacts: [],
    translations: jest.fn(),
};

const replySelect = jest.fn();
const replyCreate = jest.fn();

const getWrapper = props =>
    render(
        <IntlProvider locale="en">
            <Replies
                {...commentProps}
                parentID="123"
                hasReplies
                isRepliesLoading={false}
                isParentPending={false}
                replies={[comment, comment2, comment3]}
                onReplySelect={replySelect}
                onReplyCreate={replyCreate}
                {...props}
            />
        </IntlProvider>,
    );

describe('elements/content-sidebar/ActivityFeed/comment/Replies', () => {
    beforeAll(() => {
        mockUserProfileUrl.mockResolvedValue('https://www.test.com/');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should correctly render replies', () => {
        getWrapper();

        expect(screen.getByText(comment.tagged_message)).toBeVisible();
        expect(screen.getByText(comment.created_by.name)).toBeVisible();
        expect(screen.getByText(comment2.tagged_message)).toBeVisible();
        expect(screen.getByText(comment2.created_by.name)).toBeVisible();
        expect(screen.getByText(comment3.tagged_message)).toBeVisible();
        expect(screen.getByText(comment3.created_by.name)).toBeVisible();
        expect(screen.getAllByText('Sep 27, 2017').length).toBe(2);
        expect(screen.getByText('Sep 28, 2017')).toBeVisible();
        expect(screen.queryByTestId('replies-loading')).not.toBeInTheDocument();
    });

    test('should render loading spinner with replies', () => {
        getWrapper({ isRepliesLoading: true });

        expect(screen.getByText(comment.tagged_message)).toBeVisible();
        expect(screen.getByText(comment2.tagged_message)).toBeVisible();
        expect(screen.getByText(comment3.tagged_message)).toBeVisible();
        expect(screen.getByTestId('replies-loading')).toBeVisible();
    });

    test.each`
        replyIndex
        ${0}
        ${1}
        ${2}
    `(`should be able to select reply #$replyIndex`, ({ replyIndex }) => {
        getWrapper();

        expect(screen.getByText(comment.tagged_message)).toBeVisible();
        expect(screen.getByText(comment2.tagged_message)).toBeVisible();
        expect(screen.getByText(comment3.tagged_message)).toBeVisible();

        expect(screen.getAllByTestId('comment-actions-menu').length).toBe(3);
        fireEvent.click(screen.getAllByTestId('comment-actions-menu')[replyIndex]);

        expect(replySelect).toBeCalledTimes(1);
        expect(replySelect).toBeCalledWith(true);
    });

    test('should not be able to click reply if parent is pending', () => {
        // Mock DraftJS editor and intercept onChange since DraftJS doesn't have a value setter
        getWrapper({ isParentPending: true });

        const replyButton = screen.getByRole('button', { name: 'Reply' });

        expect(replyButton).toHaveAttribute('aria-disabled', 'true');
        expect(replyButton).toBeVisible();
        fireEvent.click(replyButton);

        expect(replySelect).not.toBeCalled();
    });

    test('should call onReplyCreate when reply is created', () => {
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

        getWrapper();

        const replyButton = screen.getByRole('button', { name: 'Reply' });

        expect(replyButton).toBeVisible();
        fireEvent.click(replyButton);

        expect(replySelect).toBeCalledTimes(1);
        expect(replySelect).toBeCalledWith(true);

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Batman' } });

        fireEvent.click(screen.getByText('Post'));
        expect(replyCreate).toBeCalledTimes(1);
        expect(replyCreate).toBeCalledWith('Batman');
    });
});
