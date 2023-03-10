// @flow

import React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render, screen } from '@testing-library/react';
import BaseComment from '../BaseComment';

jest.mock('../../Avatar', () => () => 'Avatar');
jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

const TIME_STRING_SEPT_27_2017 = '2017-09-27T10:40:41-07:00';
const TIME_STRING_SEPT_28_2017 = '2017-09-28T10:40:41-07:00';
const comment = {
    created_at: TIME_STRING_SEPT_27_2017,
    tagged_message: 'test',
    created_by: { name: '50 Cent', id: 10 },
    permissions: { can_delete: true, can_edit: true, can_resolve: true },
};
const currentUser = {
    name: 'testuser',
    id: 11,
};

const getWrapper = props =>
    render(
        <IntlProvider locale="en">
            <BaseComment
                id="123"
                {...comment}
                approverSelectorContacts={[]}
                currentUser={currentUser}
                mentionSelectorContacts={[]}
                onSelect={jest.fn()}
                {...props}
            />
        </IntlProvider>,
    );

describe('elements/content-sidebar/ActivityFeed/comment/BaseComment', () => {
    test('should correctly render comment', () => {
        getWrapper();
        // validating that the Tooltip and the comment posted time are properly set
        expect(screen.getByText(comment.tagged_message)).toBeInTheDocument();
        expect(screen.getByText(comment.created_by.name)).toBeInTheDocument();
        expect(screen.getByText('Sep 27, 2017')).toBeInTheDocument();
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
        permissions                                                  | onEdit       | showDelete | showEdit | showResolve
        ${{ can_delete: true, can_edit: true, can_resolve: true }}   | ${jest.fn()} | ${true}    | ${true}  | ${true}
        ${{ can_delete: true, can_edit: false, can_resolve: true }}  | ${jest.fn()} | ${true}    | ${false} | ${true}
        ${{ can_delete: false, can_edit: true, can_resolve: true }}  | ${jest.fn()} | ${false}   | ${true}  | ${true}
        ${{ can_delete: true, can_edit: false, can_resolve: true }}  | ${undefined} | ${true}    | ${false} | ${true}
        ${{ can_delete: false, can_edit: true, can_resolve: true }}  | ${undefined} | ${false}   | ${true}  | ${true}
        ${{ can_delete: true, can_edit: true, can_resolve: true }}   | ${undefined} | ${true}    | ${true}  | ${true}
        ${{ can_delete: true, can_edit: true, can_resolve: false }}  | ${jest.fn()} | ${true}    | ${true}  | ${false}
        ${{ can_delete: true, can_edit: false, can_resolve: false }} | ${jest.fn()} | ${true}    | ${false} | ${false}
        ${{ can_delete: false, can_edit: true, can_resolve: false }} | ${jest.fn()} | ${false}   | ${true}  | ${false}
        ${{ can_delete: true, can_edit: false, can_resolve: false }} | ${undefined} | ${true}    | ${false} | ${false}
        ${{ can_delete: false, can_edit: true, can_resolve: false }} | ${undefined} | ${false}   | ${true}  | ${false}
        ${{ can_delete: true, can_edit: true, can_resolve: false }}  | ${undefined} | ${true}    | ${true}  | ${false}
    `(
        `show menu for a comment with permissions $permissions and onEdit ($onEdit), should showDelete: $showDelete, showEdit: $showEdit, showResolve: $showResolve`,
        ({ permissions, onEdit, showDelete, showEdit, showResolve }) => {
            getWrapper({ onEdit, permissions });

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

    test('should allow user to edit if they have edit permissions on the task and edit handler is defined', async () => {
        const mockOnEdit = jest.fn();

        getWrapper({ type: 'task', onEdit: mockOnEdit });

        const menuItem = screen.queryByTestId('comment-actions-menu');

        fireEvent.click(menuItem);

        expect(screen.getByTestId('edit-comment')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('edit-comment'));

        expect(screen.queryByTestId('edit-comment')).not.toBeInTheDocument();
        expect(screen.getByTestId('bcs-CommentForm-body')).toBeInTheDocument();

        await fireEvent.click(screen.getByRole('button', { name: 'Post' }));
        expect(mockOnEdit).toBeCalledWith('123', 'test', undefined, false, {
            can_delete: true,
            can_edit: true,
            can_resolve: true,
        });
    });

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
                onEdit: mockOnEdit,
            });

            const menuItem = screen.queryByTestId('comment-actions-menu');

            fireEvent.click(menuItem);

            expect(screen.getByTestId(menuItemTestId)).toBeInTheDocument();
            fireEvent.click(screen.getByTestId(menuItemTestId));

            expect(screen.queryByTestId(menuItemTestId)).not.toBeInTheDocument();

            expect(mockOnEdit).toBeCalledWith('123', undefined, expectedNewStatus, false, {
                can_delete: false,
                can_edit: false,
                can_resolve: true,
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
});
