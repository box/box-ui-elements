import * as React from 'react';
import { mount, shallow } from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';
import { FormattedMessage } from 'react-intl';

import { FEED_ITEM_TYPE_TASK } from '../../../../../constants';
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
    const placeholderUser = { nam: '', id: '0', type: 'user' };
    const currentUser = { name: 'Jake Thomas', id: '1', type: 'user' };
    const otherUser = { name: 'Patrick Paul', id: '3', type: 'user' };
    const creatorUser = { name: 'Steven Yang', id: '5', type: 'user' };
    const taskId = '123125';
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
        created_by: { id: '0', target: creatorUser, role: 'CREATOR', status: 'NOT_STARTED', type: 'task_collaborator' },
        due_at: null,
        id: taskId,
        description: 'This is where we tell each other what we need to do',
        status: 'NOT_STARTED',
        permissions: {
            can_update: true,
            can_delete: true,
            can_create_task_collaborator: true,
            can_create_task_link: true,
        },
        task_links: {
            entries: [
                {
                    type: 'task_link',
                    id: '6231775',
                    task: { id: taskId, type: FEED_ITEM_TYPE_TASK, due_at: null },
                    target: {
                        type: 'file',
                        id: '7895970959',
                        sequence_id: '1',
                        etag: '1',
                        sha1: '6cdf9453724469d11469d4f7c2f21dcb828073d5',
                        name: 'file1.csv',
                    },
                    description: '',
                    permissions: { can_update: true, can_delete: true },
                },
            ],
            limit: 1000,
            next_marker: null,
        },
        task_type: 'GENERAL',
        type: FEED_ITEM_TYPE_TASK,
    };

    const taskMultifile = cloneDeep(task);
    taskMultifile.task_links.entries.push({
        type: 'task_link',
        id: taskId,
        task: { id: '16431755', type: FEED_ITEM_TYPE_TASK, due_at: null },
        target: {
            type: 'file',
            id: '7895975164',
            sequence_id: '1',
            etag: '1',
            sha1: 'b02ef8e024b1e654d050733c5bb12e6c83a5586c',
            name: 'skynet-file2.csv',
        },
        description: '',
        permissions: { can_update: true, can_delete: true },
    });

    test('should correctly render task', () => {
        const wrapper = shallow(<Task currentUser={currentUser} onEdit={jest.fn()} onDelete={jest.fn()} {...task} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should show assignment status badges for each assignee', () => {
        const wrapper = mount(<Task currentUser={currentUser} onEdit={jest.fn()} onDelete={jest.fn()} {...task} />);
        expect(wrapper.find('[data-testid="avatar-group-avatar-container"]')).toHaveLength(2);
    });

    test('should show multifile badge if task has multiple files', () => {
        const wrapper = mount(<Task currentUser={currentUser} {...taskMultifile} />);
        expect(wrapper.find('[data-testid="multifile-badge"]').hostNodes()).toHaveLength(1);
    });

    test('should not show multifile badge if task does not have multiple files', () => {
        const wrapper = mount(<Task currentUser={currentUser} {...task} />);
        expect(wrapper.find('[data-testid="multifile-badge"]').hostNodes()).toHaveLength(0);
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

    test('should show prior collaborator text if created_by user is a placeholder user', () => {
        const completeWrapper = mount(
            <Task
                {...task}
                created_by={placeholderUser}
                currentUser={currentUser}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
                due_at={new Date() - 1000}
                status="COMPLETED"
            />,
        );
        const headline = completeWrapper.find('.bcs-Task-headline');
        expect(headline.find(FormattedMessage).prop('id')).toBe('be.priorCollaborator');
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
        expect(incompleteWrapper.render().find('[data-testid="task-overdue-date"]')).toHaveLength(1);
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
        expect(completeWrapper.find('[data-testid="task-overdue-date"]')).toHaveLength(0);
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
        [task, taskMultifile].forEach(eachTask => {
            const wrapper = shallow(
                <Task currentUser={currentUser} {...eachTask} isPending={false} onAssignmentUpdate={jest.fn()} />,
            );
            expect(wrapper.find('TaskActions')).toHaveLength(1);
        });
    });

    test('should not show actions when current user is assigned and task is complete', () => {
        [task, taskMultifile].forEach(eachTask => {
            const wrapper = shallow(
                <Task
                    currentUser={currentUser}
                    {...eachTask}
                    isPending={false}
                    onAssignmentUpdate={jest.fn()}
                    status="COMPLETED"
                />,
            );
            expect(wrapper.find('TaskActions')).toHaveLength(0);
        });
    });

    test('should not show actions when current user is not assigned', () => {
        [task, taskMultifile].forEach(eachTask => {
            const wrapper = shallow(
                <Task
                    currentUser={{ ...currentUser, id: 'something-else-1' }}
                    {...eachTask}
                    isPending={false}
                    onAssignmentUpdate={jest.fn()}
                />,
            );
            expect(wrapper.find('TaskActions')).toHaveLength(0);
        });
    });

    test.each`
        eachTask         | expected
        ${task}          | ${0}
        ${taskMultifile} | ${1}
    `('should show action for creator of task when task is multifile', ({ eachTask, expected }) => {
        const wrapper = shallow(<Task {...eachTask} currentUser={creatorUser} />);
        expect(wrapper.find('[data-testid="action-container"]')).toHaveLength(expected);
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

        expect(onAssignmentUpdateSpy).toHaveBeenCalledWith(taskId, 'current-user-assignment-id', 'COMPLETED');
    });

    test('should call onView when view-task-details button is clicked for multifile task', () => {
        const onViewSpy = jest.fn();
        const wrapper = mount(<Task {...taskMultifile} currentUser={currentUser} onView={onViewSpy} />);
        wrapper.find('[data-testid="view-task"]').hostNodes().simulate('click');
        expect(onViewSpy).toHaveBeenCalledWith(taskId, false);
    });

    test('should not show view-task-details button for multifile task when onView callback is undefined', () => {
        const wrapper = mount(<Task {...taskMultifile} currentUser={currentUser} />);
        expect(wrapper.find('[data-testid="view-task"]').hostNodes()).toHaveLength(0);
    });

    test('should not allow user to delete if the task permissions do not allow it', () => {
        const wrapper = mount(
            <Task
                {...task}
                permissions={{ can_delete: false, can_update: true }}
                currentUser={otherUser}
                approverSelectorContacts={approverSelectorContacts}
                handlers={allHandlers}
                onDelete={jest.fn()}
            />,
        );
        wrapper.find('button[data-testid="task-actions-menu"]').simulate('click');
        expect(wrapper.find('MenuItem[data-testid="delete-task"]').exists()).toBe(false);
        expect(wrapper.find('MenuItem[data-testid="edit-task"]').exists()).toBe(true);
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
        wrapper.find('button[data-testid="task-actions-menu"]').simulate('click');
        expect(wrapper.find('MenuItem[data-testid="edit-task"]').exists()).toBe(false);
        expect(wrapper.find('MenuItem[data-testid="delete-task"]').exists()).toBe(true);
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
