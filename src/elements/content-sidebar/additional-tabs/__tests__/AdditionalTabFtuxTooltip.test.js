import React from 'react';
import { shallow } from 'enzyme';

import AdditionalTabFtuxTooltip from '../AdditionalTabFtuxTooltip';

describe('elements/content-sidebar/additional-tabs/AdditionalTabFtuxTooltip', () => {
    const getWrapper = (props, children) =>
        shallow(<AdditionalTabFtuxTooltip {...props}>{children}</AdditionalTabFtuxTooltip>);

    test('should render the tooltip when isVisible is true', () => {
        const children = <div>Child content</div>;
        const targetingApi = () => {};
        const text = 'FTUX Text';

        const wrapper = getWrapper({ isVisible: true, targetingApi, text }, children);

        const tooltip = wrapper.find('.bdl-AdditionalTabFtuxTooltip');
        expect(tooltip.exists()).toBeTruthy();
        expect(tooltip.prop('body')).toBe(text);
        expect(tooltip.prop('useTargetingApi')).toBe(targetingApi);
        expect(
            tooltip
                .children()
                .find('div')
                .exists(),
        ).toBeTruthy();
    });

    test('should only render the children when isVisible is false', () => {
        const children = <div>Child content</div>;

        const wrapper = getWrapper({ isVisible: false }, children);

        expect(wrapper.find('.bdl-AdditionalTabFtuxTooltip').exists()).toBeFalsy();
        expect(wrapper.find('div').exists()).toBeTruthy();
    });
});
