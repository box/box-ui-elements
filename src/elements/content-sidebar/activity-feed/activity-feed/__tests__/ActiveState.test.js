import * as React from 'react';
import { shallow } from 'enzyme';

import ActiveState from '../ActiveState';
import AnnotationActivity from '../../annotations';

const currentUser = {
    id: 'user_123445',
    name: 'Rihanna',
};

const otherUser = { name: 'Akon', id: 11 };

const annotation = {
    type: 'annotation',
    id: 'anno_123',
    created_at: '2018-07-03T14:43:52-07:00',
    description: {
        message: 'This is an annotation',
    },
    file_version: {
        id: '123',
    },
    target: {
        location: {
            type: 'page',
            value: 1,
        },
        type: 'region',
    },
    created_by: currentUser,
};

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
    created_by: { target: otherUser },
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
const getShallowWrapper = (params = {}) =>
    shallow(
        <ActiveState
            items={[annotation, comment, fileVersion, taskWithAssignment, appActivity]}
            currentUser={currentUser}
            currentFileVersionId="123"
            {...params}
        />,
    );

describe('elements/content-sidebar/ActiveState/activity-feed/ActiveState', () => {
    test('should render empty state', () => {
        const wrapper = getShallowWrapper({ items: [] });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render items', () => {
        const wrapper = getShallowWrapper().dive();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render card for item type', () => {
        const wrapper = getShallowWrapper().dive();
        expect(wrapper.find('[data-testid="comment"]')).toHaveLength(1);
        expect(wrapper.find('[data-testid="version"]')).toHaveLength(1);
        expect(wrapper.find('[data-testid="task"]')).toHaveLength(1);
        expect(wrapper.find('[data-testid="app-activity"]')).toHaveLength(1);
        expect(wrapper.find('[data-testid="annotation-activity"]')).toHaveLength(1);
    });

    test('should correctly render with an inline error if some feed items fail to fetch', () => {
        const wrapper = getShallowWrapper({ inlineError: activityFeedError, items: [] });
        expect(wrapper).toMatchSnapshot();
    });

    test.each`
        currentFileVersionId | isCurrentVersion
        ${'123'}             | ${true}
        ${'456'}             | ${false}
    `(
        'should correctly reflect annotation activity isCurrentVersion as $isCurrentVersion based on file version id as $currentFileVersionId',
        ({ currentFileVersionId, isCurrentVersion }) => {
            const wrapper = getShallowWrapper({ currentFileVersionId });

            expect(
                wrapper
                    .dive()
                    .find(AnnotationActivity)
                    .prop('isCurrentVersion'),
            ).toBe(isCurrentVersion);
        },
    );
});
