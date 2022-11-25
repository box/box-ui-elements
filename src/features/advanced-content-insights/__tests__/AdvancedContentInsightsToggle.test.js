import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import AdvancedContentInsightsToggle from '../AdvancedContentInsightsToggle';

describe('features/advanced-content-insights/AdvancedContentInsightsToggle', () => {
    const getWrapper = (props = {}, isActive = true) =>
        mount(<AdvancedContentInsightsToggle isActive={isActive} {...props} />);

    test('should render default component', () => {
        expect(getWrapper()).toMatchSnapshot();
    });

    test('should render the description inside a tooltip', () => {
        const wrapper = getWrapper();
        expect(wrapper.find('Tooltip').exists()).toBe(true);
    });

    test('should not render the description inside a tooltip', () => {
        const wrapper = getWrapper({ hasDescriptionInTooltip: false });
        expect(wrapper.find('Tooltip').exists()).toBe(false);
    });

    test('should call the callback function if the toggle changes', () => {
        const onChange = sinon.spy();
        const wrapper = getWrapper({ onChange }, { isActive: true });
        const toggle = wrapper.find('[data-testid="insights-toggle"]').at(1);
        toggle.simulate('change');
        expect(onChange.calledOnce).toBe(true);
    });
});
