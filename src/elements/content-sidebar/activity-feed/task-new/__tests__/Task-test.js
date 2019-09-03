import * as React from 'react';
import { mount, shallow } from 'enzyme';

import { TaskComponent as Task } from '..';

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

describe('elements/content-sidebar/ActivityFeed/task-new/Task', () => {
    const currentUser = { name: 'Jake Thomas', id: '1', type: 'user' };
    const otherUser = { name: 'Patrick Paul', id: '3', type: 'user' };

    const task = {
        assigned_to: {
            entries: [
                {
                    id: 'current-user-assignment-id',
                    target: currentUser,
                    status: 'NOT_STARTED',
                    role: 'ASSIGNEE',
                    permissions: {
                        can_update: true,
                        can_delete: true,
                    },
                    type: 'task_collaborator',
                },
                {
                    id: 'other-user-assignment-id',
                    target: otherUser,
                    status: 'COMPLETED',
                    role: 'ASSIGNEE',
                    permissions: {
                        can_update: true,
                        can_delete: true,
                    },
                    type: 'task_collaborator',
                },
            ],
            limit: 10,
            next_marker: null,
        },
        completion_rule: 'ALL_ASSIGNEES',
        created_at: '2010-01-01',
        created_by: { id: '0', target: currentUser, role: 'CREATOR', status: 'NOT_STARTED', type: 'task_collaborator' },
        due_at: null,
        id: '123125',
        description: 'This is where we tell each other what we need to do',
        status: 'NOT_STARTED',
        permissions: {
            can_update: true,
            can_delete: true,
            can_create_task_collaborator: true,
            can_create_task_link: true,
        },
        task_links: {
            entries: [],
            limit: 1000,
            next_marker: null,
        },
        task_type: 'GENERAL',
        type: 'task',
    };

    test('should correctly render task', () => {
        const wrapper = shallow(<Task currentUser={currentUser} onEdit={jest.fn()} onDelete={jest.fn()} {...task} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should show assignment status badges for each assignee', () => {
        const wrapper = mount(<Task currentUser={currentUser} onEdit={jest.fn()} onDelete={jest.fn()} {...task} />);
        expect(wrapper.find('[data-testid="avatar-group-avatar-container"]')).toHaveLength(2);
    });

    test('should not show due date container if not set', () => {
        const wrapper = shallow(<Task currentUser={currentUser} onEdit={jest.fn()} onDelete={jest.fn()} {...task} />);
        expect(wrapper.find('[data-testid="task-due-date"]')).toHaveLength(0);
    });

    test('should show due date if set', () => {
        const wrapper = mount(
            <Task
                currentUser={currentUser}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
                {...task}
                due_at={new Date() + 1000}
            />,
        );
        expect(wrapper.find('[data-testid="task-due-date"]')).toHaveLength(1);
    });

    test('due date should have overdue class if task is incomplete and due date is in past', () => {
        const incompleteWrapper = mount(
            <Task
                {...task}
                currentUser={currentUser}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
                due_at={new Date() - 1000}
                status="NOT_STARTED"
            />,
        );
        expect(incompleteWrapper.find('.bcs-is-taskOverdue')).toHaveLength(1);
    });

    test('due date should not have overdue class if task is complete and due date is in past', () => {
        const completeWrapper = mount(
            <Task
                {...task}
                currentUser={currentUser}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
                due_at={new Date() - 1000}
                status="COMPLETED"
            />,
        );
        expect(completeWrapper.find('.bcs-is-taskOverdue')).toHaveLength(0);
    });

    test('should add pending class for isPending prop', () => {
        // this is for optimistic UI updates in the activity feed card list
        const myTask = {
            ...task,
            isPending: true,
        };

        const wrapper = shallow(<Task currentUser={currentUser} onEdit={jest.fn()} onDelete={jest.fn()} {...myTask} />);
        expect(wrapper.find('[data-testid="task-card"]').hasClass('bcs-is-pending')).toBe(true);
    });

    test('should show actions when current user is assigned and task is incomplete', () => {
        const wrapper = shallow(
            <Task currentUser={currentUser} {...task} isPending={false} onAssignmentUpdate={jest.fn()} />,
        );

        expect(wrapper.find('TaskActions')).toHaveLength(1);
    });

    test('should not show actions when current user is assigned and task is complete', () => {
        const wrapper = shallow(
            <Task
                currentUser={currentUser}
                {...task}
                isPending={false}
                onAssignmentUpdate={jest.fn()}
                status="COMPLETED"
            />,
        );

        expect(wrapper.find('TaskActions')).toHaveLength(0);
    });

    test('should not show actions when current user is not assigned', () => {
        const wrapper = shallow(
            <Task
                currentUser={{ ...currentUser, id: 'something-else-1' }}
                {...task}
                isPending={false}
                onAssignmentUpdate={jest.fn()}
            />,
        );

        expect(wrapper.find('TaskActions')).toHaveLength(0);
    });

    test('should show actions for task type', () => {
        const approvalTask = mount(<Task {...task} task_type="APPROVAL" currentUser={currentUser} />).render();
        const approvalBtns = global.queryAllByTestId(approvalTask, 'approve-task');
        const rejectBtns = global.queryAllByTestId(approvalTask, 'reject-task');
        expect(approvalBtns).toHaveLength(1);
        expect(rejectBtns).toHaveLength(1);

        const generalTask = mount(<Task {...task} task_type="GENERAL" currentUser={currentUser} />).render();
        const completeBtns = global.queryAllByTestId(generalTask, 'complete-task');
        expect(completeBtns).toHaveLength(1);
    });

    test('should show proper icons for task avatar based on task type', () => {
        const approvalTask = mount(<Task {...task} task_type="APPROVAL" currentUser={currentUser} />);
        expect(approvalTask.find('IconTaskApproval')).toHaveLength(1);

        const generalTask = mount(<Task {...task} task_type="GENERAL" currentUser={currentUser} />);
        expect(generalTask.find('IconTaskGeneral')).toHaveLength(1);
    });

    test('should call onAssignmentUpdate with completed status when task action complete is clicked', () => {
        const onAssignmentUpdateSpy = jest.fn();
        const wrapper = mount(
            <Task
                {...task}
                currentUser={currentUser}
                onAssignmentUpdate={onAssignmentUpdateSpy}
                approverSelectorContacts={approverSelectorContacts}
            />,
        );

        const checkButton = wrapper.find('[data-testid="complete-task"]').hostNodes();
        checkButton.simulate('click');

        expect(onAssignmentUpdateSpy).toHaveBeenCalledWith('123125', 'current-user-assignment-id', 'COMPLETED');
    });

    test('should not allow user to delete if the task permissions do not allow it', () => {
        const wrapper = shallow(
            <Task
                {...task}
                permissions={{ can_delete: false, can_update: true }}
                currentUser={otherUser}
                approverSelectorContacts={approverSelectorContacts}
                handlers={allHandlers}
                onDelete={jest.fn()}
            />,
        );
        wrapper.find('MediaMenu[data-testid="task-actions-menu"]').simulate('click');
        wrapper.update();
        expect(wrapper.find('MenuItem[data-testid="delete-task"]')).toHaveLength(0);
        expect(wrapper.find('MenuItem[data-testid="edit-task"]')).toHaveLength(1);
    });

    test('should not allow user to edit if the permissions do not allow it', () => {
        const wrapper = mount(
            <Task
                {...task}
                permissions={{ can_delete: true, can_update: false }}
                currentUser={otherUser}
                approverSelectorContacts={approverSelectorContacts}
                handlers={allHandlers}
                onEdit={jest.fn()}
            />,
        );
        wrapper.find('MediaMenu[data-testid="task-actions-menu"]').simulate('click');
        wrapper.update();
        expect(wrapper.find('MenuItem[data-testid="edit-task"]')).toHaveLength(0);
        expect(wrapper.find('MenuItem[data-testid="delete-task"]')).toHaveLength(1);
    });

    test('should show inline error for error prop', () => {
        const wrapper = mount(
            <Task
                {...task}
                currentUser={currentUser}
                error={{ title: 'blah', message: 'blah' }}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />,
        );

        expect(wrapper.find('ActivityError')).toHaveLength(1);
    });

    test('should call getAllTaskCollaborators on modal open if there is a next_marker', async () => {
        const taskWithMarker = {
            ...task,
            assigned_to: {
                next_marker: 'foo',
                entries: [],
            },
        };

        const wrapper = mount(
            <Task
                {...taskWithMarker}
                currentUser={currentUser}
                error={{ title: 'blah', message: 'blah' }}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />,
        );
        const instance = wrapper.instance();
        instance.getAllTaskCollaborators = jest.fn();

        await instance.handleEditClick();

        expect(instance.getAllTaskCollaborators).toBeCalled();
    });

    test('should be able to toggle expanded state', () => {
        const COUNT = 30;
        const INITIAL_DISPLAY_COUNT = 3;
        let assigneeList;

        const taskWithThirtyAssignees = {
            ...task,
            assigned_to: {
                next_marker: null,
                entries: Array.from({ length: COUNT }, (_, idx) => ({
                    id: `current-user-assignment-id-${idx}`,
                    target: currentUser,
                    status: 'NOT_STARTED',
                    role: 'ASSIGNEE',
                    permissions: {
                        can_update: true,
                        can_delete: true,
                    },
                    type: 'task_collaborator',
                })),
            },
        };

        const wrapper = mount(
            <Task
                currentUser={currentUser}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
                {...taskWithThirtyAssignees}
                due_at={new Date() + 1000}
            />,
        );

        assigneeList = global.queryAllByTestId(wrapper, 'assignee-list-item');
        expect(assigneeList).toHaveLength(INITIAL_DISPLAY_COUNT);

        const expandBtn = global.queryAllByTestId(wrapper, 'show-more-assignees').first();
        expandBtn.simulate('click');

        assigneeList = global.queryAllByTestId(wrapper, 'assignee-list-item');
        expect(assigneeList).toHaveLength(COUNT);

        const collapseBtn = global.queryAllByTestId(wrapper, 'show-less-assignees').first();
        collapseBtn.simulate('click');

        assigneeList = global.queryAllByTestId(wrapper, 'assignee-list-item');
        expect(assigneeList).toHaveLength(INITIAL_DISPLAY_COUNT);
    });

    test('should call onModalClose prop when modal is closed', () => {
        const onModalClose = jest.fn();

        const wrapper = mount(<Task {...task} currentUser={currentUser} onModalClose={onModalClose} />);

        const instance = wrapper.instance();
        instance.handleEditModalClose();

        expect(onModalClose).toBeCalled();
    });
});
