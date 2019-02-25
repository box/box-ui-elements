import * as React from 'react';
import { shallow } from 'enzyme';

import ActiveState from '../ActiveState';

const comment = {
    type: 'comment',
    id: 'c_123',
    created_at: '2018-07-03T14:43:52-07:00',
    tagged_message: 'test @[123:Jeezy] @[10:Kanye West]',
    created_by: { name: 'Akon', id: 11 },
};

const fileVersion = {
    type: 'file_version',
    id: 'f_123',
    created_at: '2018-07-03T14:43:52-07:00',
    trashed_at: '2018-07-03T14:43:52-07:00',
    modified_at: '2018-07-03T14:43:52-07:00',
    modified_by: { name: 'Akon', id: 11 },
};

const taskWithoutAssignment = {
    type: 'task',
    id: 't_123',
    created_at: '2018-07-03T14:43:52-07:00',
    created_by: { name: 'Akon', id: 11 },
    modified_at: '2018-07-03T14:43:52-07:00',
    tagged_message: 'test',
    modified_by: { name: 'Jay-Z', id: 10 },
    dueAt: '2018-07-03T14:43:52-07:00',
    task_assignment_collection: {
        entries: [],
        total_count: 0,
    },
};

const taskWithAssignment = {
    type: 'task',
    id: 't_345',
    created_at: '2018-07-03T14:43:52-07:00',
    created_by: { name: 'Akon', id: 11 },
    modified_at: '2018-07-03T14:43:52-07:00',
    tagged_message: 'test',
    modified_by: { name: 'Jay-Z', id: 10 },
    dueAt: '2018-07-03T14:43:52-07:00',
    task_assignment_collection: {
        entries: [
            {
                assigned_to: { name: 'Akon', id: 11 },
                status: 'incomplete',
            },
        ],
        total_count: 1,
    },
};

const appActivity = {
    activity_template: {
        id: 'template_09887654',
    },
    app: {
        id: 'app_123456',
        icon_url: 'foo.jpg',
        name: 'My App',
    },
    created_at: '2018-07-03T14:43:52-07:00',
    created_by: {
        id: 'user_12345567',
    },
    id: 'app_activity_12344556',
    permissions: {
        can_delete: true,
    },
    rendered_text: 'this is text and a <a>link</a>',
    type: 'app_activity',
    currentUser: {
        id: 'user_123445',
    },
};

const activityFeedError = { title: 't', content: 'm' };

describe('elements/content-sidebar/ActiveState/activity-feed/ActiveState', () => {
    test('should render empty state', () => {
        const wrapper = shallow(<ActiveState items={[]} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render items', () => {
        const wrapper = shallow(<ActiveState items={[comment, fileVersion, taskWithAssignment, appActivity]} />).dive();
        expect(wrapper).toMatchSnapshot();
    });

    test('should render card for item type', () => {
        const wrapper = mount(<ActiveState items={[comment, fileVersion, taskWithAssignment, appActivity]} />);
        expect(wrapper.find('[data-testid="comment"]')).toHaveLength(1);
        expect(wrapper.find('[data-testid="version"]')).toHaveLength(1);
        expect(wrapper.find('[data-testid="task"]')).toHaveLength(1);
        expect(wrapper.find('[data-testid="app-activity"]')).toHaveLength(1);
    });

    test('should not render task without assignments', () => {
        const wrapper = mount(<ActiveState items={[taskWithoutAssignment]} />);
        expect(wrapper.find('[data-testid="task"]')).toHaveLength(0);
    });

    test('should correctly render with an inline error if some feed items fail to fetch', () => {
        const wrapper = shallow(<ActiveState inlineError={activityFeedError} items={[]} />);
        expect(wrapper).toMatchSnapshot();
    });
});
