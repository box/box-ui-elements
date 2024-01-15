// @flow
import * as React from 'react';

import { IntlProvider } from 'react-intl';

import ActivityFeed, { type ActivityFeedProps } from '../ActivityFeed';
import {
    TIME_STRING_SEPT_27_2017,
    TIME_STRING_SEPT_28_2017,
    currentUser,
    comment,
    replies,
    repliesProps,
} from '../../comment/stories/common';
import { FEED_ITEM_TYPE_VERSION } from '../../../../../constants';

import type { FeedItems, Comment } from '../../../../../common/types/feed';

const file = {
    id: '12345',
    permissions: {
        can_comment: true,
    },
    created_at: TIME_STRING_SEPT_27_2017,
    modified_at: TIME_STRING_SEPT_28_2017,
    file_version: {
        id: 987,
        type: FEED_ITEM_TYPE_VERSION,
        created_at: TIME_STRING_SEPT_28_2017,
        modified_at: null,
        modified_by: null,
        trashed_at: null,
        version_number: 1,
    },
    version_number: '3',
};

const activityFeedComment: Comment = {
    ...comment,
    replies,
};

const comments = {
    total_count: 1,
    entries: [activityFeedComment],
};

const feedItems: FeedItems = [...comments.entries];

const getTemplate = customProps => (props: ActivityFeedProps) => (
    <IntlProvider locale="en">
        <ActivityFeed
            currentUser={currentUser}
            feedItems={feedItems}
            file={file}
            {...repliesProps}
            {...props}
            {...customProps}
        />
    </IntlProvider>
);

export const LegacyComment = getTemplate({ hasNewThreadedReplies: false });

export const ThreadedRepliesComment = getTemplate({ hasNewThreadedReplies: true });

export default {
    title: 'Components/ActivityFeed',
    component: ActivityFeed,
};
