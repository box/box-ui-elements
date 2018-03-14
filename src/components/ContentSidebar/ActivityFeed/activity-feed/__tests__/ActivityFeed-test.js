import React from 'react';
import { mount, shallow } from 'enzyme';

import ActivityFeed from '../ActivityFeed';

const feedState = [
    {
        type: 'comment',
        id: '123',
        createdAt: Date.now(),
        taggedMessage: 'test @[123:Jeezy] @[10:Kanye West]',
        createdBy: { name: 'Akon', id: 11 }
    },
    {
        type: 'task',
        id: '1234',
        createdAt: Date.now(),
        taggedMessage: 'test',
        createdBy: { name: 'JayZ', id: 10 },
        assignees: []
    }
];
const currentUser = { name: 'Kanye West', id: 10 };

const allHandlers = {
    comments: {
        create: jest.fn()
    },
    tasks: {
        create: jest.fn()
    },
    contacts: {
        getApproverWithQuery: jest.fn(),
        getMentionWithQuery: jest.fn()
    }
};

describe('features/activity-feed/activity-feed/ActivityFeed', () => {
    test('should correctly render empty state', () => {
        const wrapper = shallow(<ActivityFeed inputState={{ currentUser }} />);

        expect(wrapper.find('EmptyState').length).toEqual(1);
        expect(wrapper.find('ApprovalCommentForm').length).toEqual(0);
    });

    test('should correctly render empty state with loading indicator', () => {
        const wrapper = shallow(<ActivityFeed inputState={{ currentUser }} isLoading />);

        expect(wrapper.find('EmptyState').length).toEqual(1);
        expect(wrapper.find('LoadingIndicator').length).toEqual(0);
    });

    test('should render approval comment form if comment submit handler is passed', () => {
        const wrapper = shallow(<ActivityFeed inputState={{ currentUser }} handlers={allHandlers} />);

        expect(wrapper.find('ApprovalCommentForm').length).toEqual(1);
    });

    test('should correctly render activity state', () => {
        const wrapper = shallow(<ActivityFeed inputState={{ currentUser }} feedState={feedState} />);

        expect(wrapper.find('ActiveState').length).toEqual(1);
    });

    test('should not expose add approval ui if task submit handler is not passed', () => {
        const noTaskHandler = {
            ...allHandlers,
            tasks: null
        };
        const wrapper = shallow(<ActivityFeed inputState={{ currentUser }} handlers={noTaskHandler} />);

        expect(wrapper.find('[name="addApproval"]').length).toEqual(0);
    });

    test('should show input when approvalCommentFormFocusHandler is called', () => {
        const wrapper = shallow(<ActivityFeed inputState={{ currentUser }} handlers={allHandlers} />);

        const instance = wrapper.instance();
        instance.approvalCommentFormFocusHandler();

        expect(wrapper.state('isInputOpen')).toBe(true);
    });

    test('should hide input when approvalCommentFormCancelHandler is called', () => {
        const wrapper = shallow(<ActivityFeed inputState={{ currentUser }} handlers={allHandlers} />);

        const instance = wrapper.instance();
        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        instance.approvalCommentFormCancelHandler();
        expect(wrapper.state('isInputOpen')).toBe(false);
    });

    test('should call create comment handler and close input on valid comment submit', () => {
        const createCommentSpy = jest.fn();
        allHandlers.comments.create = createCommentSpy;
        const wrapper = mount(<ActivityFeed inputState={{ currentUser }} handlers={allHandlers} />);

        const instance = wrapper.instance();
        const approvalCommentForm = wrapper.find('ApprovalCommentForm').at(0);

        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        approvalCommentForm.prop('createComment')();
        expect(wrapper.state('isInputOpen')).toBe(false);
        expect(createCommentSpy.mock.calls).toEqual(1);
    });

    test('should call create task handler and close input on valid task submit', () => {
        const createTaskSpy = jest.fn();
        allHandlers.tasks.create = createTaskSpy;
        const wrapper = mount(<ActivityFeed inputState={{ currentUser }} handlers={allHandlers} />);

        const instance = wrapper.instance();
        const approvalCommentForm = wrapper.find('ApprovalCommentForm').at(0);

        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        approvalCommentForm.prop('createTask')();
        expect(wrapper.state('isInputOpen')).toBe(false);
        expect(createTaskSpy.mock.calls).toEqual(1);
    });

    test('should stop event propagation onKeyDown', () => {
        const wrapper = shallow(<ActivityFeed inputState={{ currentUser }} handlers={allHandlers} />);
        const stopPropagationSpy = jest.fn();
        wrapper.find('.box-ui-activity-feed').simulate('keydown', {
            nativeEvent: {
                stopImmediatePropagation: stopPropagationSpy
            }
        });
        expect(stopPropagationSpy).toHaveBeenCalled();
    });
});
