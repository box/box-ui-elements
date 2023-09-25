// @flow

import React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render, screen } from '@testing-library/react';
import { ContentState, EditorState } from 'draft-js';
import { BaseComment } from '../BaseComment';

import {
    annotation,
    annotationPreviousVersion,
    comment,
    currentUser,
    reply1,
    reply2,
    replies,
    TIME_STRING_SEPT_27_2017,
    TIME_STRING_SEPT_28_2017,
} from '../stories/common';
import messages from '../messages';
import localize from '../../../../../../test/support/i18n';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

const replyCreate = jest.fn();
const onSelect = jest.fn();
const hideReplies = jest.fn();
const showReplies = jest.fn();

const repliesProps = {
    hasReplies: true,
    onReplyCreate: replyCreate,
    replies,
    onHideReplies: hideReplies,
    onShowReplies: showReplies,
};

// eslint-disable-next-line import/prefer-default-export
export const getWrapper = props =>
    render(
        <IntlProvider locale="en">
            <BaseComment
                id="1"
                {...comment}
                approverSelectorContacts={[]}
                currentUser={currentUser}
                mentionSelectorContacts={[]}
                onSelect={onSelect}
                {...props}
            />
        </IntlProvider>,
    );

describe('elements/content-sidebar/ActivityFeed/comment/BaseComment', () => {
    test.each`
        activityItem
        ${annotation}
        ${comment}
    `(`should render activity item with replies`, ({ activityItem }) => {
        getWrapper({ ...activityItem, ...repliesProps });

        expect(screen.getByText(activityItem.tagged_message)).toBeInTheDocument();
        expect(screen.getByText(activityItem.created_by.name)).toBeInTheDocument();
        expect(screen.getByText('Sep 27, 2017')).toBeInTheDocument();

        expect(screen.getByText(reply1.tagged_message)).toBeInTheDocument();
        expect(screen.getByText(reply1.created_by.name)).toBeInTheDocument();
        expect(screen.getByText('Sep 28, 2017')).toBeInTheDocument();

        expect(screen.getByText(reply2.tagged_message)).toBeInTheDocument();
        expect(screen.getByText(reply2.created_by.name)).toBeInTheDocument();
        expect(screen.getByText('Sep 29, 2017')).toBeInTheDocument();
    });

    test('should render annotation badge when annotationActivityLink prop is defined', () => {
        getWrapper({ ...annotation, ...repliesProps });
        expect(screen.getByText(localize(messages.inlineCommentAnnotationAccessibleSVGTitle.id))).toBeInTheDocument();
    });

    test.each`
        annotationType               | linkText
        ${annotation}                | ${'Page 1'}
        ${annotationPreviousVersion} | ${'Version 1'}
    `(`should properly render AnnotationActivityLink`, ({ annotationType, linkText }) => {
        getWrapper({ ...annotationType, ...repliesProps });
        expect(screen.getByText(linkText)).toBeInTheDocument();
    });

    test('should correctly render comment when translation is enabled', () => {
        const translations = {
            translationEnabled: true,
            onTranslate: jest.fn(),
        };

        getWrapper({ translations });

        expect(screen.getByText(comment.tagged_message)).toBeInTheDocument();
        expect(screen.getByText(comment.created_by.name)).toBeInTheDocument();
        expect(screen.getByText('Sep 27, 2017')).toBeInTheDocument();
    });

    test('should render commenter as a link', async () => {
        const getUserProfileUrl = jest.fn().mockResolvedValue('https://www.test.com/');

        getWrapper({ getUserProfileUrl });

        await expect(screen.getByText(comment.created_by.name)).toBeInTheDocument();
        await expect(screen.getByRole('link')).toHaveAttribute('href', 'https://www.test.com/');
    });

    test.each`
        permissions                                                  | onCommentEdit | showDelete | showEdit | showResolve
        ${{ can_delete: true, can_edit: true, can_resolve: true }}   | ${jest.fn()}  | ${true}    | ${true}  | ${true}
        ${{ can_delete: true, can_edit: false, can_resolve: true }}  | ${jest.fn()}  | ${true}    | ${false} | ${true}
        ${{ can_delete: false, can_edit: true, can_resolve: true }}  | ${jest.fn()}  | ${false}   | ${true}  | ${true}
        ${{ can_delete: true, can_edit: false, can_resolve: true }}  | ${undefined}  | ${true}    | ${false} | ${true}
        ${{ can_delete: false, can_edit: true, can_resolve: true }}  | ${undefined}  | ${false}   | ${true}  | ${true}
        ${{ can_delete: true, can_edit: true, can_resolve: true }}   | ${undefined}  | ${true}    | ${true}  | ${true}
        ${{ can_delete: true, can_edit: true, can_resolve: false }}  | ${jest.fn()}  | ${true}    | ${true}  | ${false}
        ${{ can_delete: true, can_edit: false, can_resolve: false }} | ${jest.fn()}  | ${true}    | ${false} | ${false}
        ${{ can_delete: false, can_edit: true, can_resolve: false }} | ${jest.fn()}  | ${false}   | ${true}  | ${false}
        ${{ can_delete: true, can_edit: false, can_resolve: false }} | ${undefined}  | ${true}    | ${false} | ${false}
        ${{ can_delete: false, can_edit: true, can_resolve: false }} | ${undefined}  | ${false}   | ${true}  | ${false}
        ${{ can_delete: true, can_edit: true, can_resolve: false }}  | ${undefined}  | ${true}    | ${true}  | ${false}
    `(
        `show menu for a comment with permissions $permissions and onCommentEdit ($onCommentEdit), should showDelete: $showDelete, showEdit: $showEdit, showResolve: $showResolve`,
        ({ permissions, onCommentEdit, showDelete, showEdit, showResolve }) => {
            getWrapper({ onCommentEdit, permissions });

            const menuItem = screen.queryByTestId('comment-actions-menu');

            expect(menuItem).toBeInTheDocument();

            fireEvent.click(menuItem);
            showDelete
                ? expect(screen.getByTestId('delete-comment')).toBeInTheDocument()
                : expect(screen.queryByTestId('delete-comment')).not.toBeInTheDocument();
            showEdit
                ? expect(screen.getByTestId('edit-comment')).toBeInTheDocument()
                : expect(screen.queryByTestId('edit-comment')).not.toBeInTheDocument();
            showResolve
                ? expect(screen.getByTestId('resolve-comment')).toBeInTheDocument()
                : expect(screen.queryByTestId('resolve-comment')).not.toBeInTheDocument();
        },
    );

    test.each`
        permissions                                                    | onEdit
        ${{ can_delete: false, can_edit: false, show_resolve: false }} | ${undefined}
        ${{ can_delete: false, can_edit: false, show_resolve: false }} | ${jest.fn()}
        ${{ can_delete: false, can_edit: false, show_resolve: true }}  | ${undefined}
        ${{ can_delete: false, can_edit: false, show_resolve: true }}  | ${jest.fn()}
    `(
        `show not show menu for a comment with permissions $permissions and onEdit ($onEdit)`,
        ({ permissions, onEdit }) => {
            getWrapper({ onEdit, permissions });

            const menuItem = screen.queryByTestId('comment-actions-menu');

            expect(menuItem).not.toBeInTheDocument();
            expect(screen.queryByTestId('delete-comment')).not.toBeInTheDocument();
            expect(screen.queryByTestId('edit-comment')).not.toBeInTheDocument();
        },
    );

    test('should render unresolve menu option', () => {
        getWrapper({ status: 'resolved' });

        const menuItem = screen.queryByTestId('comment-actions-menu');

        expect(menuItem).toBeInTheDocument();
        fireEvent.click(menuItem);
        expect(screen.getByTestId('unresolve-comment')).toBeInTheDocument();
        expect(screen.queryByTestId('resolve-comment')).not.toBeInTheDocument();
    });

    test('should not show actions menu when comment is pending', () => {
        getWrapper({ isPending: true });

        const menuItem = screen.queryByTestId('comment-actions-menu');

        expect(menuItem).not.toBeInTheDocument();
    });

    test.each`
        activityItem  | activityItemType
        ${comment}    | ${'comment'}
        ${annotation} | ${'annotation'}
    `(
        'should allow user to edit if they have edit permissions on the $activityItemType and edit handler is defined',
        async ({ activityItem, activityItemType }) => {
            const mockOnCommentEdit = jest.fn();
            const mockOnAnnotationEdit = jest.fn();

            const isComment = activityItemType === 'comment';
            const isAnnotation = activityItemType === 'annotation';

            getWrapper({
                ...activityItem,
                onCommentEdit: isComment ? mockOnCommentEdit : undefined,
                onAnnotationEdit: isAnnotation ? mockOnAnnotationEdit : undefined,
            });

            const menuItem = screen.queryByTestId('comment-actions-menu');

            fireEvent.click(menuItem);

            expect(screen.getByTestId('edit-comment')).toBeInTheDocument();
            fireEvent.click(screen.getByTestId('edit-comment'));

            expect(screen.queryByTestId('edit-comment')).not.toBeInTheDocument();
            expect(screen.getByTestId('bcs-CommentForm-body')).toBeInTheDocument();

            await fireEvent.click(screen.getByRole('button', { name: 'Post' }));

            if (isComment) {
                expect(mockOnCommentEdit).toBeCalledWith({
                    hasMention: false,
                    id: '1',
                    permissions: { can_delete: true, can_edit: true, can_resolve: true, can_reply: true },
                    text: comment.tagged_message,
                });
                expect(mockOnAnnotationEdit).not.toBeCalled();
            }

            if (isAnnotation) {
                expect(mockOnAnnotationEdit).toBeCalledWith({
                    id: '1',
                    permissions: { can_delete: true, can_edit: true, can_resolve: true, can_reply: true },
                    text: comment.tagged_message,
                });
                expect(mockOnCommentEdit).not.toBeCalled();
            }
        },
    );

    test.each`
        status        | menuItemTestId         | expectedNewStatus
        ${'open'}     | ${'resolve-comment'}   | ${'resolved'}
        ${'resolved'} | ${'unresolve-comment'} | ${'open'}
    `(
        `should allow user to resolve / unresolve if they have resolve permissions, edit handler is defined and given status is $status`,
        ({ status, menuItemTestId, expectedNewStatus }) => {
            const mockOnEdit = jest.fn();

            getWrapper({
                hasMention: false,
                permissions: { can_resolve: true, can_edit: false, can_delete: false },
                type: 'task',
                status,
                onCommentEdit: mockOnEdit,
            });

            const menuItem = screen.queryByTestId('comment-actions-menu');

            fireEvent.click(menuItem);

            expect(screen.getByTestId(menuItemTestId)).toBeInTheDocument();
            fireEvent.click(screen.getByTestId(menuItemTestId));

            expect(screen.queryByTestId(menuItemTestId)).not.toBeInTheDocument();

            expect(mockOnEdit).toBeCalledWith({
                hasMention: false,
                id: '1',
                permissions: {
                    can_delete: false,
                    can_edit: false,
                    can_resolve: true,
                },
                status: expectedNewStatus,
            });
        },
    );

    test('should render an error when one is defined', () => {
        getWrapper({
            error: { title: { defaultMessage: 'Test Error' }, message: { defaultMessage: 'An error has occurred.' } },
        });

        expect(screen.getByText(comment.tagged_message)).toBeInTheDocument();
        expect(screen.getByText(comment.created_by.name)).toBeInTheDocument();
        expect(screen.getByText('Sep 27, 2017')).toBeInTheDocument();
        expect(screen.getByText('Test Error')).toBeInTheDocument();
        expect(screen.getByText('An error has occurred.')).toBeInTheDocument();
    });

    test('should render an error cta when an action is defined', () => {
        const onAction = jest.fn();

        getWrapper({
            error: {
                title: { defaultMessage: 'Test Error' },
                message: { defaultMessage: 'An error has occurred.' },
                action: {
                    text: 'Action Button',
                    onAction,
                },
            },
        });

        expect(screen.getByText(comment.tagged_message)).toBeInTheDocument();
        expect(screen.getByText('Test Error')).toBeInTheDocument();
        expect(screen.getByText('An error has occurred.')).toBeInTheDocument();
        expect(screen.getByText('Action Button')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Action Button'));

        expect(onAction).toHaveBeenCalledTimes(1);
    });

    test('should show edited in ActivityMessage', () => {
        getWrapper({ modified_at: TIME_STRING_SEPT_28_2017, status: 'open' });

        expect(screen.getByText('\\ (edited)')).toBeInTheDocument();
    });

    test.each`
        modified_at                 | status
        ${undefined}                | ${'open'}
        ${undefined}                | ${'resolved'}
        ${TIME_STRING_SEPT_27_2017} | ${'resolved'}
    `(
        `given modified_at = $modified_at and status = $status, edited should not be shown in ActivityMessage`,
        ({ modified_at, status }) => {
            getWrapper({ modified_at, status });

            expect(screen.queryByText('\\ (edited)')).not.toBeInTheDocument();
        },
    );

    test.each`
        index
        ${0}
        ${1}
        ${2}
    `(`should call onSelect when More Options is clicked for comment/reply #$index`, ({ index }) => {
        getWrapper({ ...repliesProps });

        expect(screen.getByText(comment.tagged_message)).toBeInTheDocument();
        fireEvent.click(screen.getByText(comment.tagged_message));
        expect(onSelect).not.toBeCalled();

        expect(screen.getAllByTestId('comment-actions-menu').length).toBe(3);
        fireEvent.click(screen.getAllByTestId('comment-actions-menu')[index]);
        expect(onSelect).toBeCalledTimes(1);
        expect(onSelect).toBeCalledWith(true);
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

        getWrapper({ ...repliesProps });

        const replyButton = screen.getByRole('button', { name: 'Reply' });

        expect(replyButton).toBeVisible();
        fireEvent.click(replyButton);

        expect(onSelect).toBeCalledTimes(1);
        expect(onSelect).toBeCalledWith(true);

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Batman' } });

        fireEvent.click(screen.getByText('Post'));
        expect(replyCreate).toBeCalledTimes(1);
        expect(replyCreate).toBeCalledWith('Batman');
    });

    test('should show Hide Replies and call onHideReplies when clicked', () => {
        getWrapper({ ...repliesProps, repliesTotalCount: 2 });

        expect(screen.getByText('Hide replies')).toBeVisible();
        fireEvent.click(screen.getByText('Hide replies'));

        expect(hideReplies).toBeCalledTimes(1);
        expect(hideReplies).toBeCalledWith([reply2]);
        expect(showReplies).not.toBeCalled();
    });

    test('should show Show Replies and call onShowReplies when clicked', () => {
        const totalCount = 5;

        getWrapper({ ...repliesProps, repliesTotalCount: totalCount });

        // react-intl mocking problem with variables
        expect(screen.getByText(/See/i)).toBeVisible();
        expect(screen.queryByText('Hide replies')).not.toBeInTheDocument();
        fireEvent.click(screen.getByText(/See/i));

        expect(showReplies).toBeCalledTimes(1);
        expect(hideReplies).not.toBeCalled();
    });
});
