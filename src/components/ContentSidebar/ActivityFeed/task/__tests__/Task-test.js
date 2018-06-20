import * as React from 'react';
import { mount, shallow } from 'enzyme';

import Task from '../';

jest.mock('../../comment/Comment', () => 'mock-comment');

const allHandlers = {
    tasks: {
        edit: jest.fn()
    },
    contacts: {
        getApproverWithQuery: jest.fn(),
        getMentionWithQuery: jest.fn()
    }
};

const approverSelectorContacts = [];
const mentionSelectorContacts = [];

describe('components/ContentSidebar/ActivityFeed/task/Task', () => {
    const task = {
        created_at: 12345678,
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
                    resolution_state: 'incomplete'
                },
                {
                    id: 1,
                    assigned_to: { name: 'Peter Pan', id: 2 },
                    resolution_state: 'completed'
                }
            ]
        },
        permissions: {
            can_delete: true,
            can_edit: true
        }
    };
    const currentUser = { name: 'Jake Thomas', id: 1 };

    test('should correctly render task', () => {
        const wrapper = shallow(<Task currentUser={currentUser} {...task} />);

        expect(wrapper.hasClass('bcs-task')).toBe(true);
        expect(wrapper.find('mock-comment').length).toEqual(1);
        expect(
            wrapper
                .find('.bcs-task-assignees')
                .children()
                .getElements().length
        ).toEqual(2);
        expect(wrapper.find('.bcs-task-due-date').length).toEqual(1);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a pending task', () => {
        const myTask = {
            created_at: Date.now(),
            due_at: Date.now(),
            id: '123125',
            message: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            modified_by: { name: 'Tarrence van As', id: 10 },
            permissions: {},
            task_assignment_collection: {
                total_count: 2,
                entries: [
                    {
                        id: 0,
                        assigned_to: { name: 'Jake Thomas', id: 1 },
                        resolution_state: 'incomplete'
                    },
                    {
                        id: 1,
                        assigned_to: { name: 'Peter Pan', id: 2 },
                        resolution_state: 'completed'
                    }
                ]
            },
            isPending: true
        };

        const wrapper = shallow(<Task currentUser={currentUser} {...myTask} />);
        expect(wrapper.hasClass('bcs-is-pending')).toBe(true);
    });

    test('should show actions for current user and if onTaskAssignmentUpdate is defined', () => {
        const wrapper = shallow(<Task currentUser={currentUser} {...task} onTaskAssignmentUpdate={jest.fn()} />);

        expect(
            wrapper
                .find('.bcs-task-assignees')
                .children()
                .getElements()[0].props.shouldShowActions
        ).toBe(true);
        expect(
            !!wrapper
                .find('.bcs-task-assignees')
                .children()
                .getElements()[1].props.shouldShowActions
        ).toBe(false);

        expect(wrapper).toMatchSnapshot();
    });

    test('should show tooltips when actions are shown', () => {
        const wrapper = shallow(<Task currentUser={currentUser} {...task} onTaskAssignmentUpdate={jest.fn()} />);
        const assignment = shallow(
            wrapper
                .find('.bcs-task-assignees')
                .children()
                .getElements()[0]
        );

        expect(assignment).toMatchSnapshot();
    });

    test('should not show actions for current user if onTaskAssignmentUpdate is not defined', () => {
        const wrapper = shallow(<Task currentUser={currentUser} {...task} />);

        expect(
            !!wrapper
                .find('.bcs-task-assignees')
                .children()
                .getElements()[0].props.shouldShowActions
        ).toBe(false);
    });

    test('should call onTaskAssignmentUpdate with approved status when check is clicked', () => {
        const onTaskAssignmentUpdateSpy = jest.fn();
        const wrapper = mount(
            <Task
                currentUser={currentUser}
                {...task}
                onTaskAssignmentUpdate={onTaskAssignmentUpdateSpy}
                approverSelectorContacts={approverSelectorContacts}
                mentionSelectorContacts={mentionSelectorContacts}
            />
        );

        const checkButton = wrapper.find('.bcs-task-check-btn').hostNodes();
        checkButton.simulate('click');

        expect(onTaskAssignmentUpdateSpy).toHaveBeenCalledWith('123125', 0, 'approved');
    });

    test('should call onTaskAssignmentUpdate with rejected status when check is clicked', () => {
        const onTaskAssignmentUpdateSpy = jest.fn();
        const wrapper = mount(
            <Task
                currentUser={currentUser}
                {...task}
                onTaskAssignmentUpdate={onTaskAssignmentUpdateSpy}
                approverSelectorContacts={approverSelectorContacts}
                mentionSelectorContacts={mentionSelectorContacts}
            />
        );

        const checkButton = wrapper.find('.bcs-task-x-btn').hostNodes();
        checkButton.simulate('click');

        expect(onTaskAssignmentUpdateSpy).toHaveBeenCalledWith('123125', 0, 'rejected');
    });

    test('should not allow user to delete if they lack delete permissions on the comment', () => {
        const myTask = {
            created_at: Date.now(),
            due_at: Date.now(),
            id: '123125',
            message: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            modified_by: { name: 'Tarrence van As', id: 10 },
            permissions: {},
            task_assignment_collection: {
                total_count: 2,
                entries: [
                    {
                        id: 0,
                        assigned_to: { name: 'Jake Thomas', id: 1 },
                        resolution_state: 'incomplete'
                    },
                    {
                        id: 1,
                        assigned_to: { name: 'Peter Pan', id: 2 },
                        resolution_state: 'completed'
                    }
                ]
            }
        };

        const wrapper = shallow(
            <Task
                {...myTask}
                currentUser={currentUser}
                approverSelectorContacts={approverSelectorContacts}
                mentionSelectorContacts={mentionSelectorContacts}
                handlers={allHandlers}
                onDelete={jest.fn()}
            />
        );

        expect(wrapper.find('InlineDelete').length).toEqual(0);
    });

    test('should not allow user to edit if they lack edit permissions on the comment', () => {
        const myTask = {
            created_at: Date.now(),
            due_at: Date.now(),
            id: '123125',
            message: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            modified_by: { name: 'Tarrence van As', id: 10 },
            permissions: {},
            task_assignment_collection: {
                total_count: 2,
                entries: [
                    {
                        id: 0,
                        assigned_to: { name: 'Jake Thomas', id: 1 },
                        resolution_state: 'incomplete'
                    },
                    {
                        id: 1,
                        assigned_to: { name: 'Peter Pan', id: 2 },
                        resolution_state: 'completed'
                    }
                ]
            }
        };

        const wrapper = mount(
            <Task
                {...myTask}
                currentUser={currentUser}
                approverSelectorContacts={approverSelectorContacts}
                mentionSelectorContacts={mentionSelectorContacts}
                handlers={allHandlers}
                onEdit={jest.fn()}
            />
        );

        expect(wrapper.find('InlineEdit').length).toEqual(0);
    });

    test('should not allow task creator to delete if onDelete handler is undefined', () => {
        const myTask = {
            created_at: Date.now(),
            due_at: Date.now(),
            id: '123125',
            message: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            modified_by: { name: 'Tarrence van As', id: 10 },
            permissions: {},
            task_assignment_collection: {
                total_count: 2,
                entries: [
                    {
                        id: 0,
                        assigned_to: { name: 'Jake Thomas', id: 1 },
                        resolution_state: 'incomplete'
                    },
                    {
                        id: 1,
                        assigned_to: { name: 'Peter Pan', id: 2 },
                        resolution_state: 'completed'
                    }
                ]
            }
        };

        const wrapper = shallow(
            <Task
                {...myTask}
                currentUser={currentUser}
                approverSelectorContacts={approverSelectorContacts}
                mentionSelectorContacts={mentionSelectorContacts}
            />
        );

        expect(wrapper.find('InlineDelete').length).toEqual(0);
    });

    test('should not allow task creator to edit if onEdit handler is undefined', () => {
        const myTask = {
            created_at: Date.now(),
            due_at: Date.now(),
            id: '123125',
            message: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            modified_by: { name: 'Tarrence van As', id: 10 },
            permissions: {},
            task_assignment_collection: {
                total_count: 2,
                entries: [
                    {
                        id: 0,
                        assigned_to: { name: 'Jake Thomas', id: 1 },
                        resolution_state: 'incomplete'
                    },
                    {
                        id: 1,
                        assigned_to: { name: 'Peter Pan', id: 2 },
                        resolution_state: 'completed'
                    }
                ]
            }
        };

        const wrapper = shallow(
            <Task
                {...myTask}
                currentUser={currentUser}
                approverSelectorContacts={approverSelectorContacts}
                mentionSelectorContacts={mentionSelectorContacts}
                handlers={allHandlers}
            />
        );

        expect(wrapper.find('InlineEdit').length).toEqual(0);
    });

    test('should not render due date when not passed in', () => {
        const taskWithNoDueDate = {
            ...task,
            due_at: null
        };

        const wrapper = shallow(<Task currentUser={currentUser} {...taskWithNoDueDate} />);

        expect(wrapper).toMatchSnapshot();
    });
});
