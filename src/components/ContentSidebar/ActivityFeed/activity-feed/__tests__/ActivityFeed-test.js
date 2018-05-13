import * as React from 'react';
import { mount, shallow } from 'enzyme';

import ActivityFeed from '../ActivityFeed';

const comments = [
    {
        type: 'comment',
        id: '123',
        createdAt: 1234567890,
        taggedMessage: 'test @[123:Jeezy] @[10:Kanye West]',
        createdBy: { name: 'Akon', id: 11 }
    }
];

const tasks = [
    {
        type: 'task',
        id: '1234',
        createdAt: 1234567891,
        taggedMessage: 'test',
        createdBy: { name: 'JayZ', id: 10 },
        assignees: []
    }
];

const versions = [
    {
        id: '148953',
        onInfo: () => {},
        versionNumber: 1,
        modifiedBy: { name: '50 Cent', id: 10 },
        action: 'upload'
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
        approver: jest.fn(),
        mention: jest.fn()
    }
};

describe('components/ContentSidebar/ActivityFeed/activity-feed/ActivityFeed', () => {
    test('should correctly render empty state', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render empty state with loading indicator', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} isLoading />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render approval comment form if comment submit handler is passed', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} handlers={allHandlers} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render activity state', () => {
        const wrapper = shallow(
            <ActivityFeed currentUser={currentUser} comments={comments} tasks={tasks} versions={versions} />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should not expose add approval ui if task submit handler is not passed', () => {
        const noTaskHandler = {
            ...allHandlers,
            tasks: null
        };
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} handlers={noTaskHandler} />);

        expect(wrapper.find('[name="addApproval"]').length).toEqual(0);
    });

    test('should show input when approvalCommentFormFocusHandler is called', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} handlers={allHandlers} />);

        const instance = wrapper.instance();
        instance.approvalCommentFormFocusHandler();

        expect(wrapper.state('isInputOpen')).toBe(true);
    });

    test('should hide input when approvalCommentFormCancelHandler is called', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} handlers={allHandlers} />);

        const instance = wrapper.instance();
        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        instance.approvalCommentFormCancelHandler();
        expect(wrapper.state('isInputOpen')).toBe(false);
    });

    test('should call create comment handler and close input on valid comment submit', () => {
        const createCommentSpy = jest.fn();
        allHandlers.comments.create = createCommentSpy;
        const permissions = {
            comments: true
        };
        const wrapper = mount(
            <ActivityFeed permissions={permissions} currentUser={currentUser} handlers={allHandlers} />
        );

        const instance = wrapper.instance();
        const approvalCommentForm = wrapper.find('ApprovalCommentForm').at(0);

        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        approvalCommentForm.prop('createComment')();
        expect(wrapper.state('isInputOpen')).toBe(false);
        expect(createCommentSpy).toHaveBeenCalledTimes(1);
    });

    test('should call create task handler and close input on valid task submit', () => {
        const createTaskSpy = jest.fn();
        allHandlers.tasks.create = createTaskSpy;
        const permissions = {
            tasks: true
        };
        const wrapper = mount(
            <ActivityFeed permissions={permissions} currentUser={currentUser} handlers={allHandlers} />
        );

        const instance = wrapper.instance();
        const approvalCommentForm = wrapper.find('ApprovalCommentForm').at(0);

        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        approvalCommentForm.prop('createTask')();
        expect(wrapper.state('isInputOpen')).toBe(false);
        expect(createTaskSpy).toHaveBeenCalledTimes(1);
    });

    test('should stop event propagation onKeyDown', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} handlers={allHandlers} />);
        const stopPropagationSpy = jest.fn();
        wrapper.find('.bcs-activity-feed').simulate('keydown', {
            nativeEvent: {
                stopImmediatePropagation: stopPropagationSpy
            }
        });
        expect(stopPropagationSpy).toHaveBeenCalled();
    });
});
