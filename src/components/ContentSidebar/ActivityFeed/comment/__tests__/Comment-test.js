import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import Comment from '../Comment';

const sandbox = sinon.sandbox.create();
const currentUser = {
    name: 'testuser',
    id: 11
};
const approverSelectorContacts = [];
const mentionSelectorContacts = [];
const TIME_STRING_SEPT_27_2017 = '2017-09-27T10:40:41-07:00';

const allHandlers = {
    tasks: {
        edit: sinon.stub()
    },
    contacts: {
        getApproverWithQuery: sinon.stub(),
        getMentionWithQuery: sinon.stub()
    }
};

describe('features/activity-feed/comment/Comment', () => {
    const InlineEditMock = () => <div />;
    const ApprovalCommentFormMock = () => <div />;

    const render = (props = {}) =>
        shallow(
            <Comment
                createdBy={{ name: '50 Cent', id: 10 }}
                id='123'
                taggedMessage='test'
                handlers={allHandlers}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                {...props}
            />
        );

    beforeEach(() => {
        Comment.__Rewire__('InlineEdit', InlineEditMock);
        Comment.__Rewire__('ApprovalCommentForm', ApprovalCommentFormMock);
    });

    afterEach(() => {
        sandbox.verifyAndRestore();

        Comment.__ResetDependency__('InlineEdit');
        Comment.__ResetDependency__('ApprovalCommentForm');
    });

    test('should correctly render comment', () => {
        const unixTime = new Date(TIME_STRING_SEPT_27_2017).getTime();
        const comment = {
            createdAt: TIME_STRING_SEPT_27_2017,
            taggedMessage: 'test',
            createdBy: { name: '50 Cent', id: 10 }
        };

        const wrapper = shallow(
            <Comment
                id='123'
                {...comment}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                handlers={allHandlers}
            />
        );

        expect(wrapper.hasClass('box-ui-comment-container')).toBe(true);
        expect(wrapper.find('Avatar').length).toEqual(1);
        expect(wrapper.find('.box-ui-comment-user-name').length).toEqual(1);
        expect(wrapper.find('CommentText').length).toEqual(1);
        expect(wrapper.find('CommentText').prop('taggedMessage')).toEqual(comment.taggedMessage);
        expect(wrapper.find('CommentText').prop('translationEnabled')).toBe(false);
        expect(wrapper.find('CommentText').prop('translationFailed')).toBeNull();

        // validating that the Tooltip and the comment posted time are properly set
        expect(wrapper.find('Tooltip').length).toEqual(1);
        expect(wrapper.find('ReadableTime').length).toEqual(1);
        expect(wrapper.find('ReadableTime').prop('timestamp')).toEqual(unixTime);
    });

    test('should correctly add is-focused class when comment is focused', () => {
        const wrapper = render();
        const comment = wrapper.find('.box-ui-comment');

        expect(comment.hasClass('is-focused')).toBe(false);
        comment.simulate('focus');
        expect(wrapper.find('.box-ui-comment').hasClass('is-focused')).toBe(true);
        comment.simulate('blur');
        expect(wrapper.find('.box-ui-comment').hasClass('is-focused')).toBe(false);
    });

    test('should correctly render comment when translation is enabled', () => {
        const translations = {
            translationEnabled: true,
            onTranslate: sandbox.stub()
        };
        const comment = {
            createdAt: TIME_STRING_SEPT_27_2017,
            taggedMessage: 'test',
            createdBy: { name: '50 Cent', id: 10 }
        };

        const wrapper = shallow(
            <Comment
                id='123'
                {...comment}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                handlers={allHandlers}
                translations={translations}
            />
        );

        expect(wrapper.hasClass('box-ui-comment-container')).toBe(true);
        expect(wrapper.find('Avatar').length).toEqual(1);
        expect(wrapper.find('.box-ui-comment-user-name').length).toEqual(1);
        expect(wrapper.find('CommentText').length).toEqual(1);
        expect(wrapper.find('CommentText').prop('taggedMessage')).toEqual(comment.taggedMessage);
        expect(wrapper.find('CommentText').prop('translationEnabled')).toBe(true);
        expect(wrapper.find('CommentText').prop('translationFailed')).toBeNull();
    });

    test('should render commenter as a link', () => {
        const comment = {
            createdAt: TIME_STRING_SEPT_27_2017,
            taggedMessage: 'test',
            createdBy: { name: '50 Cent', id: 10 }
        };

        const wrapper = shallow(
            <Comment
                id='123'
                {...comment}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                handlers={allHandlers}
            />
        );

        expect(wrapper.find('.box-ui-comment-user-name').length).toEqual(1);
        expect(wrapper.find('.box-ui-comment-user-name').name()).toEqual('Link');
        expect(wrapper.find('.box-ui-comment-user-name').prop('href')).toEqual(`/profile/${comment.createdBy.id}`);
        expect(wrapper.find('.box-ui-comment-user-name').prop('children')).toEqual(comment.createdBy.name);
    });

    test('should allow user to delete if they have delete permissions on the comment and delete handler is defined', () => {
        const comment = {
            createdAt: TIME_STRING_SEPT_27_2017,
            taggedMessage: 'test',
            createdBy: { name: '50 Cent', id: 10 },
            permissions: { comment_delete: true }
        };

        const wrapper = shallow(
            <Comment
                id='123'
                {...comment}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                handlers={allHandlers}
                onDelete={sandbox.stub()}
            />
        );

        expect(wrapper.find('InlineDelete').length).toEqual(1);
    });

    test('should allow user to delete if they have delete permissions on the task and delete handler is defined', () => {
        const task = {
            createdAt: TIME_STRING_SEPT_27_2017,
            taggedMessage: 'test',
            createdBy: { name: '50 Cent', id: 10 },
            permissions: { task_delete: true }
        };

        const wrapper = shallow(
            <Comment
                id='123'
                {...task}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                handlers={allHandlers}
                onDelete={sandbox.stub()}
            />
        );

        expect(wrapper.find('InlineDelete').length).toEqual(1);
    });

    test('should allow user to edit if they have edit permissions on the task and edit handler is defined', () => {
        const comment = {
            createdAt: TIME_STRING_SEPT_27_2017,
            taggedMessage: 'test',
            createdBy: { name: '50 Cent', id: 10 },
            permissions: { task_edit: true }
        };
        const wrapper = mount(
            <Comment
                id='123'
                {...comment}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                handlers={allHandlers}
                onEdit={sandbox.stub()}
            />
        );

        const instance = wrapper.instance();

        expect(wrapper.find(InlineEditMock).length).toEqual(1);
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
            createdAt: TIME_STRING_SEPT_27_2017,
            taggedMessage: 'test',
            createdBy: { name: '50 Cent', id: 10 },
            permissions: {}
        };

        const wrapper = shallow(
            <Comment
                id='123'
                {...comment}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                handlers={allHandlers}
                onDelete={sandbox.stub()}
            />
        );

        expect(wrapper.find('InlineDelete').length).toEqual(0);
    });

    test('should not allow user to edit if they lack edit permissions on the comment', () => {
        const comment = {
            createdAt: TIME_STRING_SEPT_27_2017,
            taggedMessage: 'test',
            createdBy: { name: '50 Cent', id: 10 },
            permissions: {}
        };

        const wrapper = shallow(
            <Comment
                id='123'
                {...comment}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                handlers={allHandlers}
                onEdit={sandbox.stub()}
            />
        );

        expect(wrapper.find('InlineEdit').length).toEqual(0);
    });

    test('should not allow comment creator to delete if onDelete handler is undefined', () => {
        const comment = {
            createdAt: TIME_STRING_SEPT_27_2017,
            taggedMessage: 'test',
            createdBy: { name: '50 Cent', id: 11 }
        };

        const wrapper = shallow(
            <Comment
                id='123'
                {...comment}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
            />
        );

        expect(wrapper.find('InlineDelete').length).toEqual(0);
    });

    test('should not allow task creator to edit if onEdit handler is undefined', () => {
        const comment = {
            createdAt: TIME_STRING_SEPT_27_2017,
            taggedMessage: 'test',
            createdBy: { name: '50 Cent', id: 11 }
        };

        const wrapper = shallow(
            <Comment
                id='123'
                {...comment}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                handlers={allHandlers}
            />
        );

        expect(wrapper.find('InlineEdit').length).toEqual(0);
    });

    test('should render an error when one is defined', () => {
        const comment = {
            createdAt: TIME_STRING_SEPT_27_2017,
            taggedMessage: 'test',
            createdBy: { name: '50 Cent', id: 10 }
        };

        const wrapper = mount(
            <Comment
                id='123'
                {...comment}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                handlers={allHandlers}
                onDelete={sandbox.stub()}
                error={{
                    title: 'error',
                    message: 'errorrrrr'
                }}
            />
        );

        const inlineError = wrapper.find('InlineError');
        expect(inlineError.length).toEqual(1);
        expect(inlineError.find('.lnk').length).toEqual(0);
        expect(wrapper.find('CommentText').prop('translationFailed')).toBe(true);
    });

    test('should render an error cta when an action is defined', () => {
        const comment = {
            createdAt: TIME_STRING_SEPT_27_2017,
            taggedMessage: 'test',
            createdBy: { name: '50 Cent', id: 10 }
        };
        const onActionSpy = sandbox.spy();

        const wrapper = mount(
            <Comment
                id='123'
                {...comment}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                handlers={allHandlers}
                onDelete={sandbox.stub()}
                error={{
                    title: 'error',
                    message: 'errorrrrr',
                    action: {
                        text: 'click',
                        onAction: onActionSpy
                    }
                }}
            />
        );
        const inlineErrorActionLink = wrapper.find('InlineError').find('PlainButton.lnk');
        expect(inlineErrorActionLink.length).toEqual(1);

        inlineErrorActionLink.simulate('click');

        expect(onActionSpy.calledOnce).toBe(true);
    });

    test('should not have Mention object when shouldReturnString is true', () => {
        const comment = {
            createdAt: '2016-11-02T11:35:14-07:00',
            taggedMessage: 'test @[3203255873:test user] ',
            createdBy: { name: '50 Cent', id: 10 },
            permissions: { task_edit: true }
        };
        const wrapper = mount(
            <Comment
                id='123'
                {...comment}
                currentUser={currentUser}
                inputState={{
                    currentUser,
                    approverSelectorContacts,
                    mentionSelectorContacts
                }}
                handlers={allHandlers}
                onEdit={sandbox.stub()}
            />
        );

        expect(wrapper.find(InlineEditMock).length).toEqual(1);
        expect(wrapper.find('ApprovalCommentForm').length).toEqual(0);
        expect(wrapper.find('CommentText').length).toEqual(1);
        expect(wrapper.state('isEditing')).toBe(false);
        expect(wrapper.find('Mention').length).toEqual(1);

        expect(wrapper.state('isEditing')).toBe(false);
        wrapper.instance().toEdit();
        wrapper.update();
        expect(wrapper.state('isEditing')).toBe(true);
        expect(wrapper.find(ApprovalCommentFormMock).length).toEqual(1);
        expect(wrapper.find('Mention').length).toEqual(0);
    });
});
