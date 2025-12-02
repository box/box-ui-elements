import React, { act } from 'react';
import { mount, shallow } from 'enzyme';
import noop from 'lodash/noop';

import Comment from '../Comment';
import CommentForm from '../../comment-form/CommentForm';
import { FEED_ITEM_TYPE_TASK } from '../../../../../constants';

jest.mock('../../Avatar', () => () => 'Avatar');

const currentUser = {
    name: 'testuser',
    id: 11,
};
const approverSelectorContacts = [];
const mentionSelectorContacts = [];
const TIME_STRING_SEPT_27_2017 = '2017-09-27T10:40:41-07:00';
const TIME_STRING_SEPT_28_2017 = '2017-09-28T10:40:41-07:00';

const allHandlers = {
    tasks: {
        edit: jest.fn(),
    },
    contacts: {
        getApproverWithQuery: jest.fn(),
        getMentionWithQuery: jest.fn(),
    },
};

describe('elements/content-sidebar/ActivityFeed/comment/Comment', () => {
    beforeEach(() => {
        CommentForm.default = jest.fn().mockReturnValue(<div />);
    });

    test('should correctly render comment', () => {
        const unixTime = new Date(TIME_STRING_SEPT_27_2017).getTime();
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
            permissions: { can_delete: true, can_edit: true },
        };

        const wrapper = shallow(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
            />,
        );
        // validating that the Tooltip and the comment posted time are properly set
        expect(wrapper.find('ActivityTimestamp').prop('date')).toEqual(unixTime);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render comment when translation is enabled', () => {
        const translations = {
            translationEnabled: true,
            onTranslate: jest.fn(),
        };
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
        };

        const wrapper = shallow(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                translations={translations}
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should render commenter as a link', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
        };

        const wrapper = shallow(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test.each`
        permissions                               | onEdit       | showMenu | showDelete | showEdit
        ${{ can_delete: true, can_edit: false }}  | ${jest.fn()} | ${true}  | ${true}    | ${false}
        ${{ can_delete: false, can_edit: true }}  | ${jest.fn()} | ${true}  | ${false}   | ${true}
        ${{ can_delete: false, can_edit: true }}  | ${undefined} | ${false} | ${false}   | ${false}
        ${{ can_delete: false, can_edit: false }} | ${jest.fn()} | ${false} | ${false}   | ${false}
    `(
        `for a comment with permissions $permissions and onEdit ($onEdit), should showMenu: $showMenu, showDelete: $showDelete, showEdit: $showEdit`,
        ({ permissions, onEdit, showMenu, showDelete, showEdit }) => {
            const comment = {
                created_at: TIME_STRING_SEPT_27_2017,
                tagged_message: 'test',
                created_by: { name: '50 Cent', id: 10 },
            };

            const wrapper = mount(
                <Comment
                    id="123"
                    {...comment}
                    approverSelectorContacts={approverSelectorContacts}
                    currentUser={currentUser}
                    handlers={allHandlers}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={jest.fn()}
                    onEdit={onEdit}
                    permissions={permissions}
                />,
            );

            // Open the actions menu when it is expected to be visible so that menu items are rendered
            if (showMenu) {
                const menuButton = wrapper.find('button[data-testid="comment-actions-menu"]');
                if (menuButton.length) {
                    menuButton.simulate('click');
                }
            }

            expect(wrapper.find('[data-testid="delete-comment"]').exists()).toBe(showDelete);
            expect(wrapper.find('[data-testid="edit-comment"]').exists()).toBe(showEdit);
            expect(wrapper.find('[data-testid="comment-actions-menu"]').exists()).toBe(showMenu);
        },
    );

    test.each`
        can_resolve | onEdit       | expectedResolveMenuExistance
        ${false}    | ${noop}      | ${false}
        ${false}    | ${jest.fn()} | ${false}
        ${true}     | ${noop}      | ${false}
        ${true}     | ${jest.fn()} | ${true}
    `(
        `given can_resolve permission = $can_resolve and onEdit prop = $onEdit, resolve menu existance should be: $expectedResolveMenuExistance`,
        ({ can_resolve, onEdit, expectedResolveMenuExistance }) => {
            const comment = {
                created_at: TIME_STRING_SEPT_27_2017,
                created_by: { name: '50 Cent', id: 10 },
                id: '123',
                status: 'open',
                tagged_message: 'test',
            };

            const wrapper = mount(
                <Comment
                    {...comment}
                    approverSelectorContacts={approverSelectorContacts}
                    currentUser={currentUser}
                    handlers={allHandlers}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={jest.fn()}
                    onEdit={onEdit}
                    permissions={{ can_resolve }}
                />,
            );

            const menuButton = wrapper.find('button[data-testid="comment-actions-menu"]');
            if (menuButton.length) {
                menuButton.simulate('click');
            }

            expect(wrapper.find('[data-testid="resolve-comment"]').exists()).toBe(expectedResolveMenuExistance);
        },
    );

    test.each`
        status        | expectedResolveMenuExistance | expectedUnresolvedMenuExistance
        ${'open'}     | ${true}                      | ${false}
        ${'resolved'} | ${false}                     | ${true}
    `(
        `given status = $status, resolve menu existance should be: $expectedResolveMenuExistance and unresolve menu existance should be: $expectedUnresolvedMenuExistance`,
        ({ status, expectedResolveMenuExistance, expectedUnresolvedMenuExistance }) => {
            const comment = {
                created_at: TIME_STRING_SEPT_27_2017,
                created_by: { name: '50 Cent', id: 10 },
                id: '123',
                permissions: { can_resolve: true },
                tagged_message: 'test',
                status,
            };

            const wrapper = mount(
                <Comment
                    {...comment}
                    approverSelectorContacts={approverSelectorContacts}
                    currentUser={currentUser}
                    handlers={allHandlers}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={jest.fn()}
                    onEdit={jest.fn()}
                />,
            );

            const menuButton = wrapper.find('button[data-testid="comment-actions-menu"]');
            if (menuButton.length) {
                menuButton.simulate('click');
            }

            expect(wrapper.find('[data-testid="resolve-comment"]').exists()).toBe(expectedResolveMenuExistance);
            expect(wrapper.find('[data-testid="unresolve-comment"]').exists()).toBe(expectedUnresolvedMenuExistance);
        },
    );

    test('should not show actions menu when comment is pending', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
            permissions: { can_delete: true },
            isPending: true,
        };

        const wrapper = shallow(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                onDelete={jest.fn()}
            />,
        );

        expect(wrapper.find('[data-testid="comment-actions-menu"]').length).toEqual(0);
    });

    test('should allow user to edit if they have edit permissions on the task and edit handler is defined', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
            type: FEED_ITEM_TYPE_TASK,
            permissions: { can_edit: true, can_delete: true },
        };
        const mockOnEdit = jest.fn();
        const mockOnSelect = jest.fn();
        const wrapper = mount(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                onEdit={mockOnEdit}
                onSelect={mockOnSelect}
            />,
        );

        const instance = wrapper.instance();

        expect(wrapper.find('CommentForm').length).toEqual(0);
        expect(wrapper.find('ForwardRef(withFeatureConsumer(ActivityMessage))').length).toEqual(1);
        expect(wrapper.state('isEditing')).toBe(false);

        expect(wrapper.state('isEditing')).toBe(false);
        wrapper.find('button[data-testid="comment-actions-menu"]').simulate('click');
        wrapper.find('MenuItem[data-testid="edit-comment"]').simulate('click');
        wrapper.update();

        expect(wrapper.find('ForwardRef(withFeatureConsumer(ActivityMessage))').length).toEqual(0);
        expect(wrapper.state('isEditing')).toBe(true);

        instance.commentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        const updateMessagePayload = { id: '000', hasMention: true, text: 'updated message' };
        act(() => {
            instance.handleMessageUpdate(updateMessagePayload);
        });
        expect(wrapper.state('isEditing')).toBe(false);
        expect(wrapper.state('isInputOpen')).toBe(false);
        expect(mockOnEdit).toHaveBeenCalledWith({
            hasMention: updateMessagePayload.hasMention,
            id: updateMessagePayload.id,
            permissions: comment.permissions,
            text: updateMessagePayload.text,
        });
    });

    test.each`
        status        | menuItemTestId         | expectedNewStatus
        ${'open'}     | ${'resolve-comment'}   | ${'resolved'}
        ${'resolved'} | ${'unresolve-comment'} | ${'open'}
    `(
        `should allow user to resolve / unresolve if they have resolve permissions, edit handler is defined and given status is $status`,
        ({ status, menuItemTestId, expectedNewStatus }) => {
            const comment = {
                created_at: TIME_STRING_SEPT_27_2017,
                created_by: { name: '50 Cent', id: 10 },
                hasMention: false,
                id: '123',
                permissions: { can_resolve: true, can_edit: false, can_delete: false },
                tagged_message: 'test',
                type: FEED_ITEM_TYPE_TASK,
            };
            const onEdit = jest.fn();
            const onSelect = jest.fn();
            const wrapper = mount(
                <Comment
                    {...comment}
                    approverSelectorContacts={approverSelectorContacts}
                    currentUser={currentUser}
                    handlers={allHandlers}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onEdit={onEdit}
                    onSelect={onSelect}
                    status={status}
                />,
            );

            wrapper.find('button[data-testid="comment-actions-menu"]').simulate('click');
            wrapper.find(`MenuItem[data-testid="${menuItemTestId}"]`).simulate('click');

            expect(onEdit).toBeCalledWith({
                hasMention: comment.hasMention,
                id: comment.id,
                permissions: comment.permissions,
                status: expectedNewStatus,
            });
        },
    );

    test('should render an error when one is defined', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
        };

        const wrapper = shallow(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                error={{
                    title: 'error',
                    message: 'errorrrrr',
                }}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                onDelete={jest.fn()}
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should render an error cta when an action is defined', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
        };
        const onActionSpy = jest.fn();

        const wrapper = mount(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                error={{
                    title: 'error',
                    message: 'errorrrrr',
                    action: {
                        text: 'click',
                        onAction: onActionSpy,
                    },
                }}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                onDelete={jest.fn()}
            />,
        );
        const inlineErrorActionLink = wrapper.find('InlineError').find('button.bcs-ActivityError-action');
        expect(inlineErrorActionLink.length).toEqual(1);

        inlineErrorActionLink.simulate('click');

        expect(onActionSpy).toHaveBeenCalledTimes(1);
    });

    test.each`
        created_at                  | modified_at                 | status        | expectedIsEdited
        ${TIME_STRING_SEPT_27_2017} | ${undefined}                | ${'open'}     | ${false}
        ${TIME_STRING_SEPT_27_2017} | ${TIME_STRING_SEPT_27_2017} | ${'open'}     | ${false}
        ${TIME_STRING_SEPT_27_2017} | ${TIME_STRING_SEPT_28_2017} | ${'open'}     | ${true}
        ${TIME_STRING_SEPT_27_2017} | ${undefined}                | ${'resolved'} | ${false}
        ${TIME_STRING_SEPT_27_2017} | ${TIME_STRING_SEPT_27_2017} | ${'resolved'} | ${false}
        ${TIME_STRING_SEPT_27_2017} | ${TIME_STRING_SEPT_28_2017} | ${'resolved'} | ${false}
    `(
        `given created_at = $created_at, modified_at = $modified_at and status = $status, isEdited prop on ActivityMessage should be: $expectedIsEdited`,
        ({ created_at, modified_at, status, expectedIsEdited }) => {
            const comment = {
                created_at,
                modified_at,
                tagged_message: 'test',
                created_by: { name: '50 Cent', id: 10 },
                permissions: { can_delete: true, can_edit: true },
            };

            const wrapper = shallow(
                <Comment
                    id="123"
                    {...comment}
                    approverSelectorContacts={approverSelectorContacts}
                    currentUser={currentUser}
                    handlers={allHandlers}
                    mentionSelectorContacts={mentionSelectorContacts}
                    status={status}
                />,
            );

            expect(wrapper.find('ForwardRef(withFeatureConsumer(ActivityMessage))').prop('isEdited')).toEqual(
                expectedIsEdited,
            );
        },
    );
});
