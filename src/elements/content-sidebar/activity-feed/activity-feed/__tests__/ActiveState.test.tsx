import * as React from 'react';
import { shallow } from 'enzyme';

import ActiveState from '../ActiveState';
import AnnotationActivity from '../../annotations';
import {
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_APP_ACTIVITY,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_TASK,
    FEED_ITEM_TYPE_VERSION,
} from '../../../../../constants';
import { AppActivityItem, Comment, Task } from '../../../../../common/types/feed';
import { BoxItemVersion, User } from '../../../../../common/types/core';
import { Annotation } from '../../../../../common/types/annotations';

const currentUser = {
    id: 'user_123445',
    name: 'Rihanna',
} as User;

const otherUser: User = { name: 'Akon', id: 11 };

const annotation: Annotation = {
    type: FEED_ITEM_TYPE_ANNOTATION,
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

const comment: Comment = {
    type: FEED_ITEM_TYPE_COMMENT,
    id: 'c_123',
    created_at: '2018-07-03T14:43:52-07:00',
    modified_at: '2018-07-03T14:43:52-07:00',
    tagged_message: 'test @[123:Jeezy] @[10:Kanye West]',
    created_by: otherUser,
    permissions: {},
};

const fileVersion = {
    type: FEED_ITEM_TYPE_VERSION,
    id: 'f_123',
    created_at: '2018-07-03T14:43:52-07:00',
    trashed_at: '2018-07-03T14:43:52-07:00',
    modified_at: '2018-07-03T14:43:52-07:00',
    modified_by: otherUser,
} as BoxItemVersion;

const taskWithAssignment: Task = {
    type: FEED_ITEM_TYPE_TASK,
    id: 't_345',
    created_at: '2018-07-03T14:43:52-07:00',
    created_by: { target: otherUser },
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
        type: 'activity_template',
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
    type: FEED_ITEM_TYPE_APP_ACTIVITY,
    currentUser,
} as AppActivityItem;

const activityFeedError = { title: 't', content: 'm' };
const getShallowWrapper = (params: Partial<React.ComponentProps<typeof ActiveState>> = {}) =>
    shallow(
        <ActiveState
            items={[annotation, comment, fileVersion, taskWithAssignment, appActivity]}
            currentUser={currentUser}
            currentFileVersionId="123"
            onAnnotationSelect={() => null}
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
        expect(wrapper.find('[role="article"][aria-label="Comment"]')).toHaveLength(1);
        expect(wrapper.find('[role="article"][aria-label="Version"]')).toHaveLength(1);
        expect(wrapper.find('[role="article"][aria-label="Task"]')).toHaveLength(1);
        expect(wrapper.find('[role="article"][aria-label="App Activity"]')).toHaveLength(1);
        expect(wrapper.find('[role="article"][aria-label="Annotation"]')).toHaveLength(1);
    });

    test('should correctly render ActivityThread for annotations and comments if has replies', () => {
        const wrapper = getShallowWrapper({
            hasReplies: true,
        }).dive();
        expect(wrapper.find('[role="article"][aria-label="Activity Thread"]')).toHaveLength(2);
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

            expect(wrapper.dive().find(AnnotationActivity).prop('isCurrentVersion')).toBe(isCurrentVersion);
        },
    );

    test.each`
        hasNewThreadedReplies | component
        ${true}               | ${'BaseComment'}
        ${false}              | ${'Comment'}
    `('should show $component when hasNewThreadedReplies is $hasNewThreadedReplies', ({ hasNewThreadedReplies }) => {
        const wrapper = getShallowWrapper({ hasNewThreadedReplies }).dive();
        expect(wrapper.find('BaseComment')).toHaveLength(hasNewThreadedReplies ? 2 : 0);
        expect(wrapper.find('Comment')).toHaveLength(hasNewThreadedReplies ? 0 : 1);
        expect(wrapper.find('AnnotationActivity')).toHaveLength(hasNewThreadedReplies ? 0 : 1);
    });

    test('Annotation BaseComment has onCommentEdit to edit replies', () => {
        const onCommentEdit = () => {
            /* intentionally empty for testing */
        };
        const wrapper = getShallowWrapper({ hasNewThreadedReplies: true, items: [annotation], onCommentEdit }).dive();
        const baseComment = wrapper.find('BaseComment');
        expect((baseComment.props() as { onCommentEdit: Function }).onCommentEdit).toEqual(onCommentEdit);
    });

    test('Annotation BaseComment has onStatusChange from onAnnotationStatusChange', () => {
        const onAnnotationStatusChange = () => {
            /* intentionally empty for testing */
        };
        const wrapper = getShallowWrapper({
            hasNewThreadedReplies: true,
            items: [annotation],
            onAnnotationStatusChange,
        }).dive();
        const baseComment = wrapper.find('BaseComment');
        expect((baseComment.props() as { onStatusChange: Function }).onStatusChange).toEqual(onAnnotationStatusChange);
    });

    test('Comment BaseComment has onStatusChange from onCommentEdit', () => {
        const onCommentEdit = jest.fn();

        const props = {
            hasNewThreadedReplies: true,
            items: [comment],
            onCommentEdit,
        };

        const wrapper = getShallowWrapper(props).dive();
        const baseComment = wrapper.find('BaseComment');
        const onStatusChangeProp = (baseComment.props() as { onStatusChange: Function }).onStatusChange;
        const expectedProps = { hasMention: false, ...props };

        onStatusChangeProp(expectedProps);
        expect(onCommentEdit).toHaveBeenCalledWith(expectedProps);
    });
});
