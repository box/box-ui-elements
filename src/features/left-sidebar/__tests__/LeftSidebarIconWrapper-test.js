// @flow
import React from 'react';

import LeftSidebarIconWrapper from '../LeftSidebarIconWrapper';

describe('feature/left-sidebar/LeftSidebarIconWrapper', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <LeftSidebarIconWrapper {...props}>
                <div />
            </LeftSidebarIconWrapper>,
        );

    test('should render a LeftSidebarIconWrapper component', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should use passed in className value', () => {
        const wrapper = getWrapper({ className: 'custom-class' });

        expect(wrapper).toMatchSnapshot();
    });
});
