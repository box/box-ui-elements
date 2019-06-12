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
        expect(wrapper.find('ReadableTime').prop('timestamp')).toEqual(unixTime);

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
        permissions
        ${{ can_delete: true, can_edit: false }}
        ${{ can_delete: false, can_edit: true }}
    `('should render comment menu based on permissions', ({ permissions }) => {
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
                onDelete={jest.fn()}
                permissions={permissions}
            />,
        );

        expect(wrapper.find('CommentMenu').length).toEqual(1);
    });

    test('should not allow actions when comment is pending', () => {
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

        expect(wrapper.find('CommentMenu').length).toEqual(0);
    });

    test('should allow user to edit if they have edit permissions on the task and edit handler is defined', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
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

        const instance = wrapper.instance();

        expect(wrapper.find('CommentMenu').length).toEqual(2);
        expect(wrapper.find('ApprovalCommentForm').length).toEqual(0);
        expect(wrapper.find('CommentText').length).toEqual(1);
        expect(wrapper.state('isEditing')).toBe(false);

        expect(wrapper.state('isEditing')).toBe(false);
        instance.handleEditClick();
        wrapper.update();
        expect(wrapper.find('CommentText').length).toEqual(0);
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

        expect(wrapper.find('CommentMenu').length).toEqual(2);
        expect(wrapper.find('ApprovalCommentForm').length).toEqual(0);
        expect(wrapper.find('CommentText').length).toEqual(1);
        expect(wrapper.state('isEditing')).toBe(false);

        expect(wrapper.state('isEditing')).toBe(false);
        instance.handleEditClick();
        wrapper.update();
        expect(wrapper.find('CommentText').length).toEqual(1);
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
        const inlineErrorActionLink = wrapper.find('InlineError').find('PlainButton.lnk');
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

        expect(wrapper.find('CommentMenu').length).toEqual(2);
        expect(wrapper.find('ApprovalCommentForm').length).toEqual(0);
        expect(wrapper.find('CommentText').length).toEqual(1);
        expect(wrapper.state('isEditing')).toBe(false);
        expect(wrapper.find('UserLink').length).toEqual(2);
        expect(wrapper.state('isEditing')).toBe(false);

        wrapper.instance().handleEditClick();
        wrapper.update();
        expect(wrapper.state('isEditing')).toBe(true);
        expect(wrapper.find('CommentMenu').length).toEqual(2);
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
