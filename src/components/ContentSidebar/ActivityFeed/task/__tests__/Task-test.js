import React from 'react';
import { mount, shallow } from 'enzyme';

import Task from '../';

jest.mock('../../comment/Comment', () => 'mock-comment');

const inputState = {
    currentUser: { name: 'Kanye West', id: 10 }
};

const allHandlers = {
    tasks: {
        edit: jest.fn()
    },
    contacts: {
        getApproverWithQuery: jest.fn(),
        getMentionWithQuery: jest.fn()
    }
};

describe('features/activity-feed/task/Task', () => {
    const task = {
        createdAt: 12345678,
        dueDate: 87654321,
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
        expect(wrapper.find('mock-comment').length).toEqual(1);
        expect(
            wrapper
                .find('.box-ui-task-assignees')
                .children()
                .getElements().length
        ).toEqual(2);
        expect(wrapper.find('.box-ui-task-due-date').length).toEqual(1);

        expect(wrapper).toMatchSnapshot();
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
        const wrapper = shallow(<Task currentUser={currentUser} {...task} onTaskAssignmentUpdate={jest.fn()} />);

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

        expect(wrapper).toMatchSnapshot();
    });

    test('should show tooltips when actions are shown', () => {
        const wrapper = shallow(<Task currentUser={currentUser} {...task} onTaskAssignmentUpdate={jest.fn()} />);
        const assignment = shallow(
            wrapper
                .find('.box-ui-task-assignees')
                .children()
                .getElements()[0]
        );

        expect(assignment).toMatchSnapshot();
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
        const onTaskAssignmentUpdateSpy = jest.fn();
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

        expect(onTaskAssignmentUpdateSpy).toHaveBeenCalledWith('123125', 0, 'approved');
    });

    test('should call onTaskAssignmentUpdate with rejected status when check is clicked', () => {
        const onTaskAssignmentUpdateSpy = jest.fn();
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

        expect(onTaskAssignmentUpdateSpy).toHaveBeenCalledWith('123125', 0, 'rejected');
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
                onDelete={jest.fn()}
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
                onEdit={jest.fn()}
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
        
        expect(wrapper).toMatchSnapshot();
    });
});
