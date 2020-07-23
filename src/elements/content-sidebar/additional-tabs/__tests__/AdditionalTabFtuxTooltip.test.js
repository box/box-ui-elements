import React from 'react';
import { shallow } from 'enzyme';

import AdditionalTabFtuxTooltip from '../AdditionalTabFtuxTooltip';
import Tooltip from '../../../common/Tooltip';

describe('elements/content-sidebar/additional-tabs/AdditionalTabFtuxTooltip', () => {
    const getWrapper = (props, children) =>
        shallow(<AdditionalTabFtuxTooltip {...props}>{children}</AdditionalTabFtuxTooltip>);

    test('should render the FTUX tooltip when isFtuxVisible is true and the FTUX can be shown', () => {
        const children = <div>Child content</div>;
        const targetingApi = () => ({
            canShow: true,
        });
        const text = 'FTUX Text';

        const wrapper = getWrapper({ isFtuxVisible: true, ftuxTooltipData: { targetingApi, text } }, children);

        const ftuxTooltip = wrapper.find('.bdl-AdditionalTabFtuxTooltip');
        expect(ftuxTooltip.exists()).toBeTruthy();
        expect(ftuxTooltip.prop('body')).toBe(text);
        expect(ftuxTooltip.prop('useTargetingApi')).toBe(targetingApi);
        expect(
            ftuxTooltip
                .children()
                .find('div')
                .exists(),
        ).toBeTruthy();
        expect(wrapper.find(Tooltip).exists()).toBeFalsy();
    });

    test('should render the children with the default tooltip when isFtuxVisible is false', () => {
        const children = <div>Child content</div>;

        const wrapper = getWrapper({ isFtuxVisible: false }, children);

        expect(wrapper.find('.bdl-AdditionalTabFtuxTooltip').exists()).toBeFalsy();
        expect(wrapper.find(Tooltip).exists()).toBeTruthy();
        expect(wrapper.find('div').exists()).toBeTruthy();
    });

    test('should render the children with the default tooltip when canShow is false', () => {
        const children = <div>Child content</div>;
        const targetingApi = () => ({
            canShow: false,
        });
        const text = 'FTUX Text';

        const wrapper = getWrapper({ isFtuxVisible: true, ftuxTooltipData: { targetingApi, text } }, children);

        expect(wrapper.find('.bdl-AdditionalTabFtuxTooltip').exists()).toBeFalsy();
        expect(wrapper.find(Tooltip).exists()).toBeTruthy();
        expect(wrapper.find('div').exists()).toBeTruthy();
    });
});
