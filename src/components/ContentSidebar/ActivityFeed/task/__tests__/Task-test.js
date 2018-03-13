import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import Task from '../';

const sandbox = sinon.sandbox.create();

const inputState = {
    currentUser: { name: 'Kanye West', id: 10 }
};

const allHandlers = {
    tasks: {
        edit: sinon.stub()
    },
    contacts: {
        getApproverWithQuery: sinon.stub(),
        getMentionWithQuery: sinon.stub()
    }
};

describe('features/activity-feed/task/Task', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const task = {
        createdAt: Date.now(),
        dueDate: Date.now(),
        id: '123125',
        taggedMessage: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
        createdBy: { name: 'Tarrence van As', id: 10 },
        assignees: [
            {
                id: 0,
                user: { name: 'Jake Thomas', id: 1 },
                status: 'incomplete'
            },
            {
                id: 1,
                user: { name: 'Peter Pan', id: 2 },
                status: 'completed'
            }
        ]
    };
    const currentUser = { name: 'Jake Thomas', id: 1 };

    test('should correctly render task', () => {
        const wrapper = shallow(<Task currentUser={currentUser} {...task} />);

        expect(wrapper.hasClass('box-ui-task')).toBe(true);
        expect(wrapper.find('Comment').length).toEqual(1);
        expect(
            wrapper
                .find('.box-ui-task-assignees')
                .children()
                .getElements().length
        ).toEqual(2);
        expect(wrapper.find('.box-ui-task-due-date').length).toEqual(1);
    });

    test('should correctly render task', () => {
        const myTask = {
            createdAt: Date.now(),
            dueDate: Date.now(),
            id: '123125',
            taggedMessage: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            createdBy: { name: 'Tarrence van As', id: 10 },
            assignees: [
                {
                    id: 0,
                    user: { name: 'Jake Thomas', id: 1 },
                    status: 'incomplete'
                },
                {
                    id: 1,
                    user: { name: 'Peter Pan', id: 2 },
                    status: 'completed'
                }
            ],
            isPending: true
        };
        const wrapper = shallow(<Task currentUser={currentUser} {...myTask} />);

        expect(wrapper.hasClass('is-pending')).toBe(true);
    });

    test('should show actions for current user and if onTaskAssignmentUpdate is defined', () => {
        const wrapper = shallow(<Task currentUser={currentUser} {...task} onTaskAssignmentUpdate={sandbox.stub()} />);

        expect(
            wrapper
                .find('.box-ui-task-assignees')
                .children()
                .getElements()[0].props.shouldShowActions
        ).toBe(true);
        expect(
            !!wrapper
                .find('.box-ui-task-assignees')
                .children()
                .getElements()[1].props.shouldShowActions
        ).toBe(false);
    });

    test('should show tooltips when actions are shown', () => {
        const wrapper = shallow(<Task currentUser={currentUser} {...task} onTaskAssignmentUpdate={sandbox.stub()} />);
        const assignment = shallow(
            wrapper
                .find('.box-ui-task-assignees')
                .children()
                .getElements()[0]
        );

        expect(assignment.find('Tooltip').length).toBe(2);
    });

    test('should not show actions for current user if onTaskAssignmentUpdate is not defined', () => {
        const wrapper = shallow(<Task currentUser={currentUser} {...task} />);

        expect(
            !!wrapper
                .find('.box-ui-task-assignees')
                .children()
                .getElements()[0].props.shouldShowActions
        ).toBe(false);
    });

    test('should call onTaskAssignmentUpdate with approved status when check is clicked', () => {
        const onTaskAssignmentUpdateSpy = sandbox.spy();
        const wrapper = mount(
            <Task
                currentUser={currentUser}
                {...task}
                onTaskAssignmentUpdate={onTaskAssignmentUpdateSpy}
                inputState={inputState}
            />
        );

        const checkButton = wrapper.find('.box-ui-task-check-btn').hostNodes();
        checkButton.simulate('click');

        expect(onTaskAssignmentUpdateSpy.calledWith('123125', 0, 'approved')).toBe(true);
    });

    test('should call onTaskAssignmentUpdate with rejected status when check is clicked', () => {
        const onTaskAssignmentUpdateSpy = sandbox.spy();
        const wrapper = mount(
            <Task
                currentUser={currentUser}
                {...task}
                onTaskAssignmentUpdate={onTaskAssignmentUpdateSpy}
                inputState={inputState}
            />
        );

        const checkButton = wrapper.find('.box-ui-task-x-btn').hostNodes();
        checkButton.simulate('click');

        expect(onTaskAssignmentUpdateSpy.calledWith('123125', 0, 'rejected')).toBe(true);
    });

    test('should not allow user to delete if they lack delete permissions on the comment', () => {
        const myTask = {
            createdAt: Date.now(),
            dueDate: Date.now(),
            id: '123125',
            taggedMessage: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            createdBy: { name: 'Tarrence van As', id: 10 },
            permissions: {},
            assignees: [
                {
                    id: 0,
                    user: { name: 'Jake Thomas', id: 1 },
                    status: 'incomplete'
                },
                {
                    id: 1,
                    user: { name: 'Peter Pan', id: 2 },
                    status: 'completed'
                }
            ]
        };

        const wrapper = shallow(
            <Task
                {...myTask}
                currentUser={currentUser}
                inputState={inputState}
                handlers={allHandlers}
                onDelete={sandbox.stub()}
            />
        );

        expect(wrapper.find('InlineDelete').length).toEqual(0);
    });

    test('should not allow user to edit if they lack edit permissions on the comment', () => {
        const myTask = {
            createdAt: Date.now(),
            dueDate: Date.now(),
            id: '123125',
            taggedMessage: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            createdBy: { name: 'Tarrence van As', id: 10 },
            permissions: {},
            assignees: [
                {
                    id: 0,
                    user: { name: 'Jake Thomas', id: 1 },
                    status: 'incomplete'
                },
                {
                    id: 1,
                    user: { name: 'Peter Pan', id: 2 },
                    status: 'completed'
                }
            ]
        };

        const wrapper = mount(
            <Task
                {...myTask}
                currentUser={currentUser}
                inputState={inputState}
                handlers={allHandlers}
                onEdit={sandbox.stub()}
            />
        );

        expect(wrapper.find('InlineEdit').length).toEqual(0);
    });

    test('should not allow task creator to delete if onDelete handler is undefined', () => {
        const myTask = {
            createdAt: Date.now(),
            dueDate: Date.now(),
            id: '123125',
            taggedMessage: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            createdBy: { name: 'Tarrence van As', id: 10 },
            permissions: {},
            assignees: [
                {
                    id: 0,
                    user: { name: 'Jake Thomas', id: 1 },
                    status: 'incomplete'
                },
                {
                    id: 1,
                    user: { name: 'Peter Pan', id: 2 },
                    status: 'completed'
                }
            ]
        };

        const wrapper = shallow(<Task {...myTask} currentUser={currentUser} inputState={inputState} />);

        expect(wrapper.find('InlineDelete').length).toEqual(0);
    });

    test('should not allow task creator to edit if onEdit handler is undefined', () => {
        const myTask = {
            createdAt: Date.now(),
            dueDate: Date.now(),
            id: '123125',
            taggedMessage: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
            createdBy: { name: 'Tarrence van As', id: 10 },
            permissions: {},
            assignees: [
                {
                    id: 0,
                    user: { name: 'Jake Thomas', id: 1 },
                    status: 'incomplete'
                },
                {
                    id: 1,
                    user: { name: 'Peter Pan', id: 2 },
                    status: 'completed'
                }
            ]
        };

        const wrapper = shallow(
            <Task {...myTask} currentUser={currentUser} inputState={inputState} handlers={allHandlers} />
        );

        expect(wrapper.find('InlineEdit').length).toEqual(0);
    });

    test('should not render due date when not passed in', () => {
        const taskWithNoDueDate = {
            ...task,
            dueDate: null
        };

        const wrapper = shallow(<Task currentUser={currentUser} {...taskWithNoDueDate} />);

        expect(wrapper.hasClass('box-ui-task')).toBe(true);
        expect(wrapper.find('.box-ui-task-due-date').length).toEqual(0);
    });
});
