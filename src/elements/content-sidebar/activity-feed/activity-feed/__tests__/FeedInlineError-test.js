import * as React from 'react';
import { mount } from 'enzyme';
import FeedInlineError from '../FeedInlineError';

const COMMENT_TYPE = 'comment';
const TASK_TYPE = 'task';

describe('elements/content-sidebar/FeedInlineError/activity-feed/FeedInlineError', () => {
    test('should render InlineError for @mention comment', () => {
        const wrapper = mount(<FeedInlineError activeFeedEntryType={COMMENT_TYPE} />);

        expect(wrapper.find('InlineError').length).toBe(1);
    });

    test('should render InlineError for task', () => {
        const wrapper = mount(<FeedInlineError activeFeedEntryType={TASK_TYPE} />);

        expect(wrapper.find('InlineError').length).toBe(1);
    });

    test('should not render InlineError if activeFeedEntryType is not a task or comment', () => {
        const wrapper = mount(<FeedInlineError activeFeedEntryType={0} />);

        expect(wrapper.find('InlineError').length).toBe(0);
    });
});
