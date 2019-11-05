import * as React from 'react';
import { shallow } from 'enzyme';

import ActiveState from '../ActiveState';

const currentUser = {
    id: 'user_123445',
    name: 'Rihanna',
};

const otherUser = { name: 'Akon', id: 11 };

const comment = {
    type: 'comment',
    id: 'c_123',
    created_at: '2018-07-03T14:43:52-07:00',
    tagged_message: 'test @[123:Jeezy] @[10:Kanye West]',
    created_by: otherUser,
};

const fileVersion = {
    type: 'file_version',
    id: 'f_123',
    created_at: '2018-07-03T14:43:52-07:00',
    trashed_at: '2018-07-03T14:43:52-07:00',
    modified_at: '2018-07-03T14:43:52-07:00',
    modified_by: otherUser,
};

const taskWithAssignment = {
    type: 'task',
    id: 't_345',
    created_at: '2018-07-03T14:43:52-07:00',
    created_by: otherUser,
    modified_at: '2018-07-03T14:43:52-07:00',
    description: 'test',
    due_at: '2018-07-03T14:43:52-07:00',
    assigned_to: {
        entries: [
            {
                id: 'ta_123',
                permissions: { can_delete: true, can_update: true },
                role: 'ASSIGNEE',
                status: 'NOT_STARTED',
                target: otherUser,
                type: 'task_collaborator',
            },
        ],
        limit: 20,
        next_marker: null,
    },
    status: 'NOT_STARTED',
    permissions: {
        can_create_task_collaborator: true,
        can_create_task_link: true,
        can_delete: true,
        can_update: true,
    },
    task_type: 'GENERAL',
    task_links: {
        entries: [
            {
                target: {
                    id: 'f_123',
                    type: 'file',
                },
            },
        ],
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
    currentUser,
};

const activityFeedError = { title: 't', content: 'm' };
const getWrapper = (params = {}) =>
    mount(
        <ActiveState
            items={[comment, fileVersion, taskWithAssignment, appActivity]}
            currentUser={currentUser}
            {...params}
        />,
    );

describe('elements/content-sidebar/ActiveState/activity-feed/ActiveState', () => {
    test('should render empty state', () => {
        const wrapper = shallow(<ActiveState items={[]} currentUser={currentUser} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render items', () => {
        const wrapper = shallow(
            <ActiveState items={[comment, fileVersion, taskWithAssignment, appActivity]} currentUser={currentUser} />,
        ).dive();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render card for item type', () => {
        const wrapper = getWrapper();
        expect(wrapper.find('[data-testid="comment"]')).toHaveLength(1);
        expect(wrapper.find('[data-testid="version"]')).toHaveLength(1);
        expect(wrapper.find('[data-testid="task"]')).toHaveLength(1);
        expect(wrapper.find('[data-testid="app-activity"]')).toHaveLength(1);
    });

    test('should correctly render with an inline error if some feed items fail to fetch', () => {
        const wrapper = shallow(<ActiveState inlineError={activityFeedError} items={[]} currentUser={currentUser} />);
        expect(wrapper).toMatchSnapshot();
    });
});
