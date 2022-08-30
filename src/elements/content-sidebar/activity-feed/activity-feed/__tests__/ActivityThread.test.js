// @flow
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ActivityThread from '../ActivityThread.js';

describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThread', () => {
    const getWrapper = (props = {}): ShallowWrapper => shallow(<ActivityThread {...props}>Test</ActivityThread>);

    test('should render children component wrapped in ActivityCard if hasReplies is true', () => {
        const wrapper = getWrapper({ hasReplies: true });

        expect(wrapper.find('.bcs-ActivityThread')).toHaveLength(1);
        expect(wrapper.text()).toEqual('Test');
    });
    test('should render children component if hasReplies if false', () => {
        const wrapper = getWrapper({ hasReplies: false });

        expect(wrapper.find('bcs-ActivityThread')).toHaveLength(0);
        expect(wrapper.text()).toEqual('Test');
    });
});
