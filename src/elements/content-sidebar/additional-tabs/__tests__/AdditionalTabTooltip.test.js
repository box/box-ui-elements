import React from 'react';
import { shallow } from 'enzyme';

import AdditionalTabTooltip from '../AdditionalTabTooltip';
import Tooltip from '../../../common/Tooltip';
import TargetedClickThroughGuideTooltip from '../../../../features/targeting/TargetedClickThroughGuideTooltip';

describe('elements/content-sidebar/additional-tabs/AdditionalTabTooltip', () => {
    const getWrapper = (props, children) => shallow(<AdditionalTabTooltip {...props}>{children}</AdditionalTabTooltip>);

    test('should render the FTUX tooltip when isFtuxVisible is true and the FTUX can be shown', () => {
        const children = <div data-testid="additional-tab-tooltip-children">Child content</div>;
        const targetingApi = () => ({
            canShow: true,
        });
        const text = 'FTUX Text';

        const wrapper = getWrapper({ isFtuxVisible: true, ftuxTooltipData: { targetingApi, text } }, children);

        const ftuxTooltip = wrapper.find(TargetedClickThroughGuideTooltip);
        expect(ftuxTooltip.exists()).toBeTruthy();
        expect(ftuxTooltip.prop('body')).toBe(text);
        expect(ftuxTooltip.prop('useTargetingApi')).toBe(targetingApi);
        expect(
            ftuxTooltip
                .children()
                .find('[data-testid="additional-tab-tooltip-children"]')
                .exists(),
        ).toBeTruthy();
        expect(wrapper.find(Tooltip).exists()).toBeFalsy();
    });

    test('should render the children with the default tooltip when isFtuxVisible is false', () => {
        const children = <div data-testid="additional-tab-tooltip-children">Child content</div>;

        const wrapper = getWrapper({ isFtuxVisible: false }, children);

        expect(wrapper.find(TargetedClickThroughGuideTooltip).exists()).toBeFalsy();
        expect(wrapper.find(Tooltip).exists()).toBeTruthy();
        expect(wrapper.find('[data-testid="additional-tab-tooltip-children"]').exists()).toBeTruthy();
    });

    test('should render the children with the default tooltip when canShow is false', () => {
        const children = <div data-testid="additional-tab-tooltip-children">Child content</div>;
        const targetingApi = () => ({
            canShow: false,
        });
        const text = 'FTUX Text';

        const wrapper = getWrapper({ isFtuxVisible: true, ftuxTooltipData: { targetingApi, text } }, children);

        expect(wrapper.find(TargetedClickThroughGuideTooltip).exists()).toBeFalsy();
        expect(wrapper.find(Tooltip).exists()).toBeTruthy();
        expect(wrapper.find('[data-testid="additional-tab-tooltip-children"]').exists()).toBeTruthy();
    });
});
