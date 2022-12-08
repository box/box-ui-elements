import React from 'react';
import { shallow } from 'enzyme';
import AdvancedContentInsightsToggle from '../AdvancedContentInsightsToggle';

describe('features/advanced-content-insights/AdvancedContentInsightsToggle', () => {
    const getWrapper = (props = {}) => shallow(<AdvancedContentInsightsToggle isDisabled={false} {...props} />);

    test('should render default component', () => {
        expect(getWrapper({ isActive: true })).toMatchSnapshot();
    });

    test('should render the description inside a tooltip', () => {
        const wrapper = getWrapper({ isActive: true });
        const toggle = wrapper.find('Toggle').dive();
        expect(toggle.find('Tooltip').exists()).toBe(true);
    });

    test('should not render the description inside a tooltip', () => {
        const wrapper = getWrapper({ hasTooltip: false, isActive: true });
        const toggle = wrapper.find('Toggle').dive();
        expect(toggle.find('Tooltip').exists()).toBe(false);
    });

    test('should call the callback function if the toggle changes', () => {
        const onChange = jest.fn();
        const wrapper = getWrapper({ onChange, isActive: true });
        const toggle = wrapper.find('Toggle').dive();
        expect(toggle.length).toBe(1);
        toggle.find('input').simulate('change');
        expect(onChange).toBeCalled();
    });
});
