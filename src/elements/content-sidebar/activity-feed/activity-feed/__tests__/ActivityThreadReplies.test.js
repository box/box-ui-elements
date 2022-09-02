// @flow

import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import ActivityThreadReplies from '../ActivityThreadReplies.js';

describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThread', () => {
    const defaultProps = {
        replies: [
            {
                type: 'comment',
                id: '1',
                message: 'test reply',
            },
            {
                type: 'comment',
                id: '2',
                message: 'second test reply',
            },
        ],
        total_reply_count: 2,
        isExpanded: false,
    };

    const getWrapper = (props = {}): ShallowWrapper => shallow(<ActivityThreadReplies {...defaultProps} {...props} />);

    test('should render last reply by dafeult', () => {
        const wrapper = getWrapper();

        const reply = wrapper.find('[data-testid="reply"]');
        expect(reply).toHaveLength(1);
        expect(reply.key()).toContain('comment2');
    });

    test('should render all replies if isExpanded is true', () => {
        const wrapper = getWrapper({ isExpanded: true });

        expect(wrapper.find('[data-testid="reply"]')).toHaveLength(2);
    });
});
