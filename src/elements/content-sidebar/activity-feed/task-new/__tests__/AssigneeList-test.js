import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_NOT_STARTED } from '../../../../../constants';

import AssigneeList from '../AssigneeList';

const entries = [
    {
        id: '0001',
        target: {
            type: 'user',
            id: '111',
            name: 'AL',
        },
        status: TASK_NEW_REJECTED,
    },
    {
        id: '0002',
        target: {
            type: 'user',
            id: '222',
            name: 'AK',
        },
        status: TASK_NEW_APPROVED,
    },
    {
        id: '0003',
        target: {
            type: 'user',
            id: '333',
            name: 'AJ',
        },
        status: TASK_NEW_NOT_STARTED,
    },
];
const assignees = {
    entries,
    limit: null,
    next_marker: null,
};

const mockGetAvatarUrl = () => Promise.resolve('url.jpg');
const onExpand = jest.fn(() => {});

describe('elements/content-sidebar/ActivityFeed/task-new/AssigneeList', () => {
    describe('render()', () => {
        test('should render avatars for each assignee up to initialAssigneeCount', () => {
            const initialCount = 2;
            const wrapper = shallow(
                <AssigneeList
                    onExpand={onExpand}
                    users={assignees}
                    initialAssigneeCount={initialCount}
                    getAvatarUrl={mockGetAvatarUrl}
                />,
            );
            const assigneeList = global.queryAllByTestId(wrapper.dive(), 'assignee-list-item');

            expect(assigneeList).toHaveLength(2);
        });

        test('should show expand button with N additional assignees when there are more assignees than initialAssigneeCount', () => {
            const initialCount = 2;
            const wrapper = shallow(
                <AssigneeList
                    onExpand={onExpand}
                    users={assignees}
                    initialAssigneeCount={initialCount}
                    getAvatarUrl={mockGetAvatarUrl}
                />,
            );
            const expandBtn = global.queryAllByTestId(wrapper.dive(), 'show-more-assignees');
            const hideBtn = global.queryAllByTestId(wrapper.dive(), 'show-less-assignees');

            expect(expandBtn).toHaveLength(1);
            expect(hideBtn).toHaveLength(0);
            expect(expandBtn.find('FormattedMessage').prop('values')).toEqual({ additionalAssigneeCount: '1' });
        });

        test.each`
            numAssignees | next_marker | overflowValue
            ${20}        | ${null}     | ${'17'}
            ${20}        | ${'abc'}    | ${'17+'}
            ${25}        | ${null}     | ${'17+'}
        `(
            'should show $overflowValue when there are more assignees and/or another page of results',
            ({ numAssignees, next_marker, overflowValue }) => {
                const initialCount = 3;
                const pageSize = 20;
                const paginatedAssignees = {
                    entries: Array(numAssignees).fill({
                        id: '0001',
                        target: {
                            type: 'user',
                            id: '111',
                            name: 'AL',
                        },
                        status: TASK_NEW_REJECTED,
                    }),
                    next_marker,
                    limit: pageSize,
                };
                const wrapper = shallow(
                    <AssigneeList
                        onExpand={onExpand}
                        users={paginatedAssignees}
                        initialAssigneeCount={initialCount}
                        getAvatarUrl={mockGetAvatarUrl}
                    />,
                );
                const expandBtn = global.queryAllByTestId(wrapper.dive(), 'show-more-assignees');
                const hideBtn = global.queryAllByTestId(wrapper.dive(), 'show-less-assignees');

                expect(expandBtn).toHaveLength(1);
                expect(hideBtn).toHaveLength(0);
                expect(expandBtn.find('FormattedMessage').prop('values')).toEqual({
                    additionalAssigneeCount: overflowValue,
                });
            },
        );

        test('should show not show overflow icon when there are fewer assignees than initialAssigneeCount', () => {
            const initialCount = 3;
            const wrapper = shallow(
                <AssigneeList
                    onExpand={onExpand}
                    users={assignees}
                    initialAssigneeCount={initialCount}
                    getAvatarUrl={mockGetAvatarUrl}
                />,
            );
            expect(global.queryAllByTestId(wrapper.dive(), 'show-more-assignees')).toHaveLength(0);
            expect(global.queryAllByTestId(wrapper.dive(), 'show-less-assignees')).toHaveLength(0);
        });

        test('should open assignee list when expand button is clicked', () => {
            const initialCount = 2;
            const wrapper = mount(
                <AssigneeList
                    onExpand={onExpand}
                    users={assignees}
                    initialAssigneeCount={initialCount}
                    getAvatarUrl={mockGetAvatarUrl}
                />,
            );
            const expandBtn = global.queryAllByTestId(wrapper, 'show-more-assignees').first();
            expandBtn.simulate('click');

            const assigneeList = global.queryAllByTestId(wrapper, 'assignee-list-item');
            expect(assigneeList).toHaveLength(3);
        });

        test('should hide assignee list when hide button is clicked', () => {
            const initialCount = 2;
            const wrapper = mount(
                <AssigneeList
                    onExpand={onExpand}
                    users={assignees}
                    initialAssigneeCount={initialCount}
                    getAvatarUrl={mockGetAvatarUrl}
                />,
            );

            const expandBtn = global.queryAllByTestId(wrapper, 'show-more-assignees').first();
            expandBtn.simulate('click');

            let assigneeList = global.queryAllByTestId(wrapper, 'assignee-list-item');
            expect(assigneeList).toHaveLength(3);

            const hideBtn = global.queryAllByTestId(wrapper, 'show-less-assignees').first();
            hideBtn.simulate('click');

            assigneeList = global.queryAllByTestId(wrapper, 'assignee-list-item');
            expect(assigneeList).toHaveLength(2);

            expect(onExpand).not.toHaveBeenCalled();
        });

        test('should call onExpand when marker is present in user list', () => {
            const initialCount = 2;
            assignees.next_marker = 'abc';
            const wrapper = mount(
                <AssigneeList
                    onExpand={onExpand}
                    users={assignees}
                    initialAssigneeCount={initialCount}
                    getAvatarUrl={mockGetAvatarUrl}
                />,
            );

            const expandBtn = global.queryAllByTestId(wrapper, 'show-more-assignees').first();
            expandBtn.simulate('click');

            expect(onExpand).toHaveBeenCalled();
        });
    });
});
