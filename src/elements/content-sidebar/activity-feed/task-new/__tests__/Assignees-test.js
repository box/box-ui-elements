import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_NOT_STARTED } from '../../../../../constants';

import Assignees from '../Assignees';

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

describe('elements/content-sidebar/ActivityFeed/task-new/Assignees', () => {
    test('should render avatars for each assignee up to maxAvatars', () => {
        const max = 2;
        const wrapper = mount(<Assignees assignees={assignees} maxAvatars={max} getAvatarUrl={mockGetAvatarUrl} />);
        expect(global.queryAllByTestId(wrapper.render(), 'task-assignment-status')).toHaveLength(max);
    });

    test('should show +N overflow when there are more assignees than maxAvatars', () => {
        const max = 2;
        const wrapper = shallow(<Assignees assignees={assignees} maxAvatars={max} getAvatarUrl={mockGetAvatarUrl} />);
        const overflowIcon = global.queryAllByTestId(wrapper.dive(), 'task-assignment-overflow');
        expect(overflowIcon).toHaveLength(1);
        expect(overflowIcon.text()).toBe('+1');
    });

    test('should show N+ overflow when there are more assignees and another page of results', () => {
        const max = 2;
        const assigneesWithPagination = { ...assignees, next_marker: 'abc', limit: 20 };
        const wrapper = shallow(
            <Assignees assignees={assigneesWithPagination} maxAvatars={max} getAvatarUrl={mockGetAvatarUrl} />,
        );
        const overflowIcon = global.queryAllByTestId(wrapper.dive(), 'task-assignment-overflow');
        expect(overflowIcon).toHaveLength(1);
        expect(overflowIcon.text()).toBe('1+');
    });

    test('should show not show overflow icon when there are fewer assignees than maxAvatars', () => {
        const max = 3;
        const wrapper = shallow(<Assignees assignees={assignees} maxAvatars={max} getAvatarUrl={mockGetAvatarUrl} />);
        expect(global.queryAllByTestId(wrapper.render(), 'task-assignment-overflow')).toHaveLength(0);
    });

    test('should open assignee list when overflow icon is clicked', () => {
        const max = 2;
        const wrapper = mount(<Assignees assignees={assignees} maxAvatars={max} getAvatarUrl={mockGetAvatarUrl} />);
        const overflowIcon = global.queryAllByTestId(wrapper, 'task-assignment-overflow').first();
        expect(wrapper.find('Overlay')).toHaveLength(0);
        overflowIcon.simulate('click');
        expect(wrapper.find('Overlay')).toHaveLength(1);
        const assignmentList = wrapper.find('.bcs-task-assignment-list');
        expect(assignmentList.find('.bcs-task-assignment-list-item')).toHaveLength(3);
    });
});
