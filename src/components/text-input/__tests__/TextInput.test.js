import React from 'react';
import { shallow, mount } from 'enzyme';

import TextInput from '..';

describe('components/text-input/TextInput', () => {
    test('should correctly render default component', () => {
        const wrapper = shallow(<TextInput label="label" name="input" />);

        expect(wrapper.hasClass('text-input-container')).toBeTruthy();
        expect(wrapper.find('Label').length).toEqual(1);
        expect(wrapper.find('input').length).toEqual(1);
        expect(wrapper.find('Tooltip').length).toEqual(1);
    });

    test('should correctly render placeholder when defined', () => {
        const placeholder = 'a placeholder';
        const wrapper = shallow(<TextInput label="label" name="input" placeholder={placeholder} />);

        expect(wrapper.find('input').prop('placeholder')).toEqual(placeholder);
    });

    test('should correctly render value when defined', () => {
        const value = 'a value';
        const wrapper = shallow(<TextInput label="label" name="input" value={value} />);

        expect(wrapper.find('input').prop('value')).toEqual(value);
    });

    test('should correctly render the label', () => {
        const label = 'a label';
        const wrapper = shallow(<TextInput isRequired label={label} name="input" />);

        expect(wrapper.find('Label').prop('text')).toEqual(label);
    });

    test('should correctly render required optional if not required', () => {
        const wrapper = mount(<TextInput label="label" name="input" />);

        expect(wrapper.find('Label').prop('showOptionalText')).toBe(true);
    });

    test('should correctly render label tooltip when specified', () => {
        const labelTooltip = 'This is a label.';
        const wrapper = mount(<TextInput label="label" labelTooltip={labelTooltip} name="input" />);

        expect(wrapper.find('Label').prop('tooltip')).toEqual(labelTooltip);
    });

    test('should hide optional label text when specified', () => {
        const wrapper = mount(<TextInput hideOptionalLabel label="label" name="input" />);

        expect(wrapper.find('Label').prop('showOptionalText')).toBe(false);
    });

    test('should correctly render LoadingIndicator if it is loading', () => {
        const wrapper = shallow(<TextInput isLoading label="label" />);

        expect(wrapper.find('.text-input-loading').length).toBe(1);
    });

    test('should correctly render IconVerified if it is valid', () => {
        const wrapper = shallow(<TextInput isValid label="label" />);

        expect(wrapper.find('.text-input-verified').length).toBe(1);
    });

    test('should not render LoadingIndicator if not loading', () => {
        const wrapper = shallow(<TextInput label="label" />);

        expect(wrapper.find('.text-input-loading').length).toBe(0);
    });

    test('should not render IconVerified if not valid', () => {
        const wrapper = shallow(<TextInput label="label" />);

        expect(wrapper.find('.text-input-verified').length).toBe(0);
    });

    test('should not render LoadingIndicator or IconVerified if both loading and valid', () => {
        const wrapper = shallow(<TextInput isLoading isValid label="label" />);

        expect(wrapper.find('.text-input-loading').length).toBe(0);
        expect(wrapper.find('.text-input-verified').length).toBe(0);
    });

    test('should show Tooltip when error exists', () => {
        const wrapper = shallow(<TextInput error="error" label="label" />);

        const tooltip = wrapper.find('Tooltip');
        expect(tooltip.prop('isShown')).toBe(true);
    });

    test('should show Tooltip for an error at a custom position', () => {
        const wrapper = shallow(<TextInput error="error" errorPosition="bottom-center" label="label" />);

        const tooltip = wrapper.find('Tooltip');
        expect(tooltip.prop('position')).toBe('bottom-center');
    });

    test('should not show Tooltip when no error exists', () => {
        const wrapper = shallow(<TextInput label="label" />);

        const tooltip = wrapper.find('Tooltip');
        expect(tooltip.prop('isShown')).toBe(false);
    });

    test('should render text input with description', () => {
        const wrapper = shallow(<TextInput description="some description" />);

        expect(wrapper).toMatchSnapshot();
    });
});
