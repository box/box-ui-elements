import * as React from 'react';
import { mount, shallow } from 'enzyme';

import Comment from '../Comment';
import ApprovalCommentForm from '../../approval-comment-form/ApprovalCommentForm';
import InlineEdit from '../InlineEdit';

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
        InlineEdit.default = jest.fn().mockReturnValue(<div />);
    });

    const render = (props = {}) =>
        shallow(
            <Comment
                approverSelectorContacts={approverSelectorContacts}
                created_by={{ name: '50 Cent', id: 10 }}
                currentUser={currentUser}
                handlers={allHandlers}
                id="123"
                mentionSelectorContacts={mentionSelectorContacts}
                tagged_message="test"
                {...props}
            />,
        );

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

    test('should correctly add bcs-is-focused class when comment is focused', () => {
        const wrapper = render();
        const comment = wrapper.find('.bcs-comment');

        expect(comment.hasClass('bcs-is-focused')).toBe(false);
        comment.simulate('focus');
        expect(wrapper.find('.bcs-comment').hasClass('bcs-is-focused')).toBe(true);
        comment.simulate('blur');
        expect(wrapper.find('.bcs-comment').hasClass('bcs-is-focused')).toBe(false);
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

        expect(wrapper.find('InlineDelete').length).toEqual(0);
        expect(wrapper.find('InlineEdit').length).toEqual(0);
    });

    test('should allow user to delete if they have delete permissions on the comment and delete handler is defined', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
            permissions: { can_delete: true },
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

        expect(wrapper.find('InlineDelete').length).toEqual(1);
    });

    test('should allow user to delete if they have delete permissions on the task and delete handler is defined', () => {
        const task = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
            permissions: { can_delete: true },
        };

        const wrapper = shallow(
            <Comment
                id="123"
                {...task}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                onDelete={jest.fn()}
            />,
        );

        expect(wrapper.find('InlineDelete').length).toEqual(1);
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

        expect(wrapper.find('InlineEdit').length).toEqual(2);
        expect(wrapper.find('ApprovalCommentForm').length).toEqual(0);
        expect(wrapper.find('CommentText').length).toEqual(1);
        expect(wrapper.state('isEditing')).toBe(false);

        expect(wrapper.state('isEditing')).toBe(false);
        instance.toEdit();
        wrapper.update();
        expect(wrapper.find('CommentText').length).toEqual(0);
        expect(wrapper.state('isEditing')).toBe(true);

        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        instance.updateTaskHandler();
        expect(wrapper.state('isEditing')).toBe(false);
        expect(wrapper.state('isInputOpen')).toBe(false);
    });

    test('should not allow user to delete if they lack delete permissions on the comment', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
            permissions: {},
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

        expect(wrapper.find('InlineDelete').length).toEqual(0);
    });

    test('should not allow user to edit if they lack edit permissions on the comment', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
            permissions: {},
        };

        const wrapper = shallow(
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

        expect(wrapper.find('InlineEdit').length).toEqual(0);
    });

    test('should not allow comment creator to delete if onDelete handler is undefined', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 11 },
        };

        const wrapper = shallow(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                mentionSelectorContacts={mentionSelectorContacts}
            />,
        );

        expect(wrapper.find('InlineDelete').length).toEqual(0);
    });

    test('should not allow task creator to edit if onEdit handler is undefined', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 11 },
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

        expect(wrapper.find('InlineEdit').length).toEqual(0);
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

        expect(wrapper.find('InlineEdit').length).toEqual(2);
        expect(wrapper.find('ApprovalCommentForm').length).toEqual(0);
        expect(wrapper.find('CommentText').length).toEqual(1);
        expect(wrapper.state('isEditing')).toBe(false);
        expect(wrapper.find('UserLink').length).toEqual(2);
        expect(wrapper.state('isEditing')).toBe(false);

        wrapper.instance().toEdit();
        wrapper.update();
        expect(wrapper.state('isEditing')).toBe(true);
        expect(wrapper.find('InlineEdit').length).toEqual(2);
        expect(wrapper.find('UserLink').length).toEqual(1);
    });

    test('should render messageHeader if prop is passed in', () => {
        const comment = {
            created_at: TIME_STRING_SEPT_27_2017,
            tagged_message: 'test',
            created_by: { name: '50 Cent', id: 10 },
        };
        const messageHeader = <div>message header</div>;

        const wrapper = shallow(
            <Comment
                id="123"
                {...comment}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                messageHeader={messageHeader}
            />,
        );

        expect(wrapper).toMatchSnapshot();
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
});
