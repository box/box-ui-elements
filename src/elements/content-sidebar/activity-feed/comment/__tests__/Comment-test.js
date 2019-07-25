import * as React from 'react';
import { mount, shallow } from 'enzyme';

import Comment from '../Comment';
import ApprovalCommentForm from '../../approval-comment-form/ApprovalCommentForm';

jest.mock('../../Avatar', () => () => 'Avatar');

const currentUser = {
    name: 'testuser',
    id: 11,
};
const approverSelectorContacts = [];
const mentionSelectorContacts = [];
const TIME_STRING_SEPT_27_2017 = '2017-09-27T10:40:41-07:00';

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
        ApprovalCommentForm.default = jest.fn().mockReturnValue(<div />);
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
        permissions                               | type         | showMenu | showDelete | showEdit
        ${{ can_delete: true, can_edit: false }}  | ${'task'}    | ${true}  | ${true}    | ${false}
        ${{ can_delete: false, can_edit: true }}  | ${'task'}    | ${true}  | ${false}   | ${true}
        ${{ can_delete: false, can_edit: false }} | ${'task'}    | ${false} | ${false}   | ${false}
        ${{ can_delete: true, can_edit: false }}  | ${'comment'} | ${true}  | ${true}    | ${false}
        ${{ can_delete: false, can_edit: true }}  | ${'comment'} | ${false} | ${false}   | ${false}
        ${{ can_delete: false, can_edit: false }} | ${'comment'} | ${false} | ${false}   | ${false}
    `(
        `for a $type with permissions $permissions, should showMenu: $showMenu, showDelete: $showDelete, showEdit: $showEdit`,
        ({ permissions, type, showMenu, showDelete, showEdit }) => {
            const comment = {
                created_at: TIME_STRING_SEPT_27_2017,
                tagged_message: 'test',
                created_by: { name: '50 Cent', id: 10 },
            };

            const wrapper = shallow(
                <Comment
                    id="123"
                    {...comment}
                    type={type}
                    approverSelectorContacts={approverSelectorContacts}
                    currentUser={currentUser}
                    handlers={allHandlers}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={jest.fn()}
                    permissions={permissions}
                />,
            );

            expect(wrapper.find('[data-testid="delete-comment"]').length).toEqual(showDelete ? 1 : 0);
            expect(wrapper.find('[data-testid="edit-comment"]').length).toEqual(showEdit ? 1 : 0);
            expect(wrapper.find('[data-testid="comment-actions-menu"]').length).toEqual(showMenu ? 1 : 0);
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
            type: 'task',
            permissions: { can_edit: true, can_delete: true },
        };
        const wrapper = mount(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                onEdit={jest.fn()}
            />,
        );

        const instance = wrapper.instance();

        expect(wrapper.find('ApprovalCommentForm').length).toEqual(0);
        expect(wrapper.find('ActivityMessage').length).toEqual(1);
        expect(wrapper.state('isEditing')).toBe(false);

        expect(wrapper.state('isEditing')).toBe(false);
        wrapper.find('button[data-testid="comment-actions-menu"]').simulate('click');
        wrapper.find('MenuItem[data-testid="edit-comment"]').simulate('click');
        wrapper.update();

        expect(wrapper.find('ActivityMessage').length).toEqual(0);
        expect(wrapper.state('isEditing')).toBe(true);

        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        instance.updateTaskHandler();
        expect(wrapper.state('isEditing')).toBe(false);
        expect(wrapper.state('isInputOpen')).toBe(false);
    });

    test('should handle custom edit click handling if edit permissions exist and the handler is defined', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
            permissions: { can_edit: true },
            onEditClick: jest.fn(),
        };
        const wrapper = mount(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                onEdit={jest.fn()}
            />,
        );

        const instance = wrapper.instance();

        expect(wrapper.find('ApprovalCommentForm').length).toEqual(0);
        expect(wrapper.find('ActivityMessage').length).toEqual(1);
        expect(wrapper.state('isEditing')).toBe(false);

        expect(wrapper.state('isEditing')).toBe(false);
        instance.handleEditClick();
        wrapper.update();
        expect(wrapper.find('ActivityMessage').length).toEqual(1);
        expect(wrapper.state('isEditing')).toBe(false);
        expect(wrapper.state('isInputOpen')).toBe(false);

        expect(comment.onEditClick).toHaveBeenCalledTimes(1);
    });

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

    test('should not have UserLink mention object when shouldReturnString is true', () => {
        const comment = {
            created_at: '2016-11-02T11:35:14-07:00',
            tagged_message: 'test @[3203255873:test user] ',
            created_by: { name: '50 Cent', id: 10 },
            permissions: { can_edit: true },
        };
        const wrapper = mount(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                onEdit={jest.fn()}
            />,
        );
        expect(wrapper.find('ApprovalCommentForm').length).toEqual(0);
        expect(wrapper.find('ActivityMessage').length).toEqual(1);
        expect(wrapper.state('isEditing')).toBe(false);
        expect(wrapper.find('UserLink').length).toEqual(2);
        expect(wrapper.state('isEditing')).toBe(false);

        wrapper.instance().handleEditClick();
        wrapper.update();
        expect(wrapper.state('isEditing')).toBe(true);
        expect(wrapper.find('UserLink').length).toEqual(1);
    });

    test('should use userHeadlineRenderer if prop is passed in', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
        };
        const userHeadlineRenderer = userLink => <div className="userHeadlineRenderer">{userLink}</div>;

        const wrapper = shallow(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                userHeadlineRenderer={userHeadlineRenderer}
            />,
        );

        expect(wrapper.find('.userHeadlineRenderer')).toHaveLength(1);
    });

    test('should use avatarRenderer if prop is passed in', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
        };
        const avatarRenderer = avatar => <div className="avatar-test">{avatar}</div>;

        const wrapper = shallow(
            <Comment
                id="123"
                {...comment}
                avatarRenderer={avatarRenderer}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
            />,
        );

        expect(wrapper.find('.avatar-test')).toHaveLength(1);
    });
});
