// @flow

import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import ActivityThread from '../ActivityThread.js';
import ActivityThreadReplies from '../ActivityThreadReplies';
import PlainButton from '../../../../../components/plain-button';

describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThread', () => {
    const defaultProps = {
        replies: [
            {
                type: 'comment',
                id: '2485934',
                message: 'test reply',
            },
            {
                type: 'comment',
                id: '24835934',
                message: 'test reply',
            },
        ],
        total_reply_count: 2,
        hasReplies: true,
    };

    const getWrapper = (props = {}): ShallowWrapper =>
        shallow(
            <ActivityThread {...defaultProps} {...props}>
                Test
            </ActivityThread>,
        );

    test('should render children component wrapped in ActivityThread if hasReplies is true', () => {
        const wrapper = getWrapper();

        expect(wrapper.find('.bcs-ActivityThread')).toHaveLength(1);
        expect(wrapper.text()).toContain('Test');
    });

    test('should render children component if hasReplies is false', () => {
        const wrapper = getWrapper({ hasReplies: false });
        expect(wrapper.find('.bcs-ActivityThread')).toHaveLength(0);
        expect(wrapper.text()).toEqual('Test');
    });

    test('should call onGetReplies on button click', () => {
        const onGetReplies = jest.fn();
        const wrapper = getWrapper({ onGetReplies });

        const button = wrapper.find(PlainButton);
        button.simulate('click');

        expect(onGetReplies).toBeCalled();
    });

    test('should not render button if total_reply_count is 1 or less', () => {
        const wrapper = getWrapper({ total_reply_count: 1 });

        expect(wrapper.find("[data-testid='bcs-ActivityThread-link']")).toHaveLength(0);
    });

    test('should not render replies if there is no replies', () => {
        const wrapper = getWrapper({ replies: [] });

        expect(wrapper.find(ActivityThreadReplies)).toHaveLength(0);
    });
});
