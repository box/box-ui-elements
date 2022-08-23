// @flow
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ActivityThread from '../ActivityThread.js';
import ActivityCard from '../../ActivityCard';

describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThread', () => {
    const getWrapper = (props = {}): ShallowWrapper => shallow(<ActivityThread {...props}>Test</ActivityThread>);

    test('should render children component wrapped in ActivityCard', () => {
        const wrapper = getWrapper();

        expect(wrapper.find(ActivityCard)).toHaveLength(1);
        expect(wrapper.text()).toEqual('Test');
    });
});
