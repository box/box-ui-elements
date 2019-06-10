import * as React from 'react';
import { mount, shallow } from 'enzyme';

import Task from '..';

jest.mock('../../comment/Comment', () => 'mock-comment');

const allHandlers = {
    tasks: {
        edit: jest.fn(),
    },
    contacts: {
        getApproverWithQuery: jest.fn(),
        getMentionWithQuery: jest.fn(),
    },
};

const approverSelectorContacts = [];
const mentionSelectorContacts = [];

describe('elements/content-sidebar/ActivityFeed/task/Task', () => {
    const currentUser = { name: 'Jake Thomas', id: 1 };
    const otherUser = { name: 'Patrick Paul', id: 3 };

    const task = {
        created_at: 12345678,
        created_by: currentUser,
        due_at: 87654321,
        id: '123125',
        message: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
        modified_by: { name: 'Tarrence van As', id: 10 },
        task_assignment_collection: {
            total_count: 2,
            entries: [
                {
                    id: 0,
                    assigned_to: { name: 'Jake Thomas', id: 1 },
                    status: 'incomplete',
                },
                {
                    id: 1,
                    assigned_to: { name: 'Peter Pan', id: 2 },
                    status: 'completed',
                },
            ],
        },
    };

    test('should correctly render task', () => {
        const wrapper = shallow(<Task currentUser={currentUser} onDelete={jest.fn()} onEdit={jest.fn()} {...task} />);

        expect(wrapper.find('mock-comment').getElements()[0].props.permissions.can_edit).toBe(true);
        expect(wrapper.find('mock-comment').getElements()[0].props.permissions.can_delete).toBe(true);
        expect(wrapper.hasClass('bcs-task')).toBe(true);
        expect(wrapper.find('mock-comment').length).toEqual(1);
        expect(
            wrapper
                .find('.bcs-task-assignees')
                .children()
                .getElements().length,
        ).toEqual(2);
        expect(wrapper.find('.bcs-TaskDueDate').length).toEqual(1);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a pending task for task creators', () => {
        const myTask = {
            created_at: Date.now(),
            created_by: currentUser,
            due_at: Date.now(),
            id: '123125',
            message: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            modified_by: { name: 'Tarrence van As', id: 10 },
            task_assignment_collection: {
                total_count: 2,
                entries: [
                    {
                        id: 0,
                        assigned_to: { name: 'Jake Thomas', id: 1 },
                        status: 'incomplete',
                    },
                    {
                        id: 1,
                        assigned_to: { name: 'Peter Pan', id: 2 },
                        status: 'completed',
                    },
                    ``,
                ],
            },
            isPending: true,
        };

        const wrapper = shallow(<Task currentUser={currentUser} onDelete={jest.fn()} onEdit={jest.fn()} {...myTask} />);
        expect(wrapper.hasClass('bcs-is-pending')).toBe(true);
    });

    test('should show actions for current user and if onAssignmentUpdate is defined', () => {
        task.isPending = false;
        const wrapper = shallow(<Task currentUser={currentUser} {...task} onAssignmentUpdate={jest.fn()} />);

        expect(
            wrapper
                .find('.bcs-task-assignees')
                .children()
                .getElements()[0].props.shouldShowActions,
        ).toBe(true);
        expect(
            !!wrapper
                .find('.bcs-task-assignees')
                .children()
                .getElements()[1].props.shouldShowActions,
        ).toBe(false);

        expect(wrapper).toMatchSnapshot();
    });

    test('should show tooltips when actions are shown', () => {
        const wrapper = mount(<Task currentUser={currentUser} {...task} onAssignmentUpdate={jest.fn()} />);
        const assignment = shallow(
            wrapper
                .find('.bcs-task-assignees')
                .children()
                .getElements()[0],
        );

        expect(assignment).toMatchSnapshot();
    });

    test('should not show actions for current user if onAssignmentUpdate is not defined', () => {
        const wrapper = shallow(<Task currentUser={currentUser} {...task} />);

        expect(
            !!wrapper
                .find('.bcs-task-assignees')
                .children()
                .getElements()[0].props.shouldShowActions,
        ).toBe(false);
    });

    test('should call onAssignmentUpdate with approved status when check is clicked', () => {
        const onAssignmentUpdateSpy = jest.fn();
        const wrapper = mount(
            <Task
                currentUser={currentUser}
                {...task}
                approverSelectorContacts={approverSelectorContacts}
                mentionSelectorContacts={mentionSelectorContacts}
                onAssignmentUpdate={onAssignmentUpdateSpy}
            />,
        );

        const checkButton = wrapper.find('.bcs-task-check-btn').hostNodes();
        checkButton.simulate('click');

        expect(onAssignmentUpdateSpy).toHaveBeenCalledWith('123125', 0, 'approved');
    });

    test('should call onAssignmentUpdate with rejected status when check is clicked', () => {
        const onAssignmentUpdateSpy = jest.fn();
        const wrapper = mount(
            <Task
                currentUser={currentUser}
                {...task}
                approverSelectorContacts={approverSelectorContacts}
                mentionSelectorContacts={mentionSelectorContacts}
                onAssignmentUpdate={onAssignmentUpdateSpy}
            />,
        );

        const checkButton = wrapper.find('.bcs-task-x-btn').hostNodes();
        checkButton.simulate('click');

        expect(onAssignmentUpdateSpy).toHaveBeenCalledWith('123125', 0, 'rejected');
    });

    test('should not allow user to delete if they are not the task creator', () => {
        const myTask = {
            created_at: Date.now(),
            created_by: otherUser,
            due_at: Date.now(),
            id: '123125',
            message: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            modified_by: { name: 'Tarrence van As', id: 10 },
            task_assignment_collection: {
                total_count: 2,
                entries: [
                    {
                        id: 0,
                        assigned_to: { name: 'Jake Thomas', id: 1 },
                        status: 'incomplete',
                    },
                    {
                        id: 1,
                        assigned_to: { name: 'Peter Pan', id: 2 },
                        status: 'completed',
                    },
                ],
            },
        };

        const wrapper = shallow(
            <Task
                {...myTask}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                onDelete={jest.fn()}
            />,
        );

        expect(wrapper.find('mock-comment').getElements()[0].props.permissions.can_delete).toBe(false);
    });

    test('should not allow user to edit if they are not the task creator', () => {
        const myTask = {
            created_at: Date.now(),
            created_by: otherUser,
            due_at: Date.now(),
            id: '123125',
            message: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            modified_by: { name: 'Tarrence van As', id: 10 },
            task_assignment_collection: {
                total_count: 2,
                entries: [
                    {
                        id: 0,
                        assigned_to: { name: 'Jake Thomas', id: 1 },
                        status: 'incomplete',
                    },
                    {
                        id: 1,
                        assigned_to: { name: 'Peter Pan', id: 2 },
                        status: 'completed',
                    },
                ],
            },
        };

        const wrapper = mount(
            <Task
                {...myTask}
                approverSelectorContacts={approverSelectorContacts}
                currentUser={currentUser}
                handlers={allHandlers}
                mentionSelectorContacts={mentionSelectorContacts}
                onEdit={jest.fn()}
            />,
        );

        expect(wrapper.find('mock-comment').getElements()[0].props.permissions.can_edit).toBe(false);
    });

    test('should not render due date when not passed in', () => {
        const taskWithNoDueDate = {
            ...task,
            due_at: null,
        };

        const wrapper = shallow(<Task currentUser={currentUser} {...taskWithNoDueDate} />);

        expect(wrapper).toMatchSnapshot();
    });
});
