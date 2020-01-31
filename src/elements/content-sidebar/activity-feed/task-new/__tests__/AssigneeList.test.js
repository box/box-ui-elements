import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_NOT_STARTED } from '../../../../../constants';
import messages from '../messages';

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
const onCollapse = jest.fn(() => {});

describe('elements/content-sidebar/ActivityFeed/task-new/AssigneeList', () => {
    describe('render()', () => {
        test('should render avatars for each assignee up to initialAssigneeCount', () => {
            const initialCount = 2;
            const wrapper = shallow(
                <AssigneeList
                    onExpand={onExpand}
                    onCollapse={onCollapse}
                    isOpen={false}
                    users={assignees}
                    initialAssigneeCount={initialCount}
                    getAvatarUrl={mockGetAvatarUrl}
                />,
            );
            const assigneeList = global.queryAllByTestId(wrapper, 'assignee-list-item');

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
            const expandBtn = global.queryAllByTestId(wrapper, 'show-more-assignees');
            const hideBtn = global.queryAllByTestId(wrapper, 'show-less-assignees');

            expect(expandBtn).toHaveLength(1);
            expect(hideBtn).toHaveLength(0);
            expect(expandBtn.find('FormattedMessage').prop('values')).toEqual({ additionalAssigneeCount: 1 });
        });

        test.each`
            numAssignees | next_marker | count | messageId
            ${20}        | ${null}     | ${17} | ${messages.taskShowMoreAssignees.id}
            ${20}        | ${'abc'}    | ${17} | ${messages.taskShowMoreAssigneesOverflow.id}
            ${25}        | ${null}     | ${17} | ${messages.taskShowMoreAssigneesOverflow.id}
        `(
            'should show overflow message (N+) when there are more assignees and/or another page of results',
            ({ numAssignees, next_marker, count, messageId }) => {
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
                        onCollapse={onCollapse}
                        users={paginatedAssignees}
                        initialAssigneeCount={initialCount}
                        getAvatarUrl={mockGetAvatarUrl}
                        isOpen={false}
                    />,
                );
                const expandBtn = global.queryAllByTestId(wrapper, 'show-more-assignees');
                const hideBtn = global.queryAllByTestId(wrapper, 'show-less-assignees');

                expect(expandBtn).toHaveLength(1);
                expect(hideBtn).toHaveLength(0);
                expect(expandBtn.find('FormattedMessage').prop('id')).toEqual(messageId);
                expect(expandBtn.find('FormattedMessage').prop('values')).toEqual({ additionalAssigneeCount: count });
            },
        );

        test('should show not show overflow icon when there are fewer assignees than initialAssigneeCount', () => {
            const initialCount = 3;
            const wrapper = shallow(
                <AssigneeList
                    onExpand={onExpand}
                    onCollapse={onCollapse}
                    users={assignees}
                    isOpen={false}
                    initialAssigneeCount={initialCount}
                    getAvatarUrl={mockGetAvatarUrl}
                />,
            );
            expect(global.queryAllByTestId(wrapper, 'show-more-assignees')).toHaveLength(0);
            expect(global.queryAllByTestId(wrapper, 'show-less-assignees')).toHaveLength(0);
        });

        test('should call onExpand when expand button is clicked', () => {
            const initialCount = 2;
            const wrapper = mount(
                <AssigneeList
                    isOpen={false}
                    onExpand={onExpand}
                    onCollapse={onCollapse}
                    users={assignees}
                    initialAssigneeCount={initialCount}
                    getAvatarUrl={mockGetAvatarUrl}
                />,
            );

            const expandBtn = global.queryAllByTestId(wrapper, 'show-more-assignees').first();
            expandBtn.simulate('click');

            expect(onExpand).toHaveBeenCalled();
        });

        test('should call onCollapse when hide button is clicked', () => {
            const initialCount = 2;
            const wrapper = mount(
                <AssigneeList
                    isOpen
                    onExpand={onExpand}
                    onCollapse={onCollapse}
                    users={assignees}
                    initialAssigneeCount={initialCount}
                    getAvatarUrl={mockGetAvatarUrl}
                />,
            );

            const hideBtn = global.queryAllByTestId(wrapper, 'show-less-assignees').first();
            hideBtn.simulate('click');

            expect(onCollapse).toHaveBeenCalled();
        });
    });
});
