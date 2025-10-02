import { shallow, mount } from 'enzyme';
import * as React from 'react';
import TetherComponent from 'react-tether';

import ClockBadge16 from '../../../icon/line/ClockBadge16';
import IconVerified from '../../../icons/general/IconVerified';
import LoadingIndicator from '../../loading-indicator';
import TextInput from '..';

jest.mock('lodash/uniqueId', () => () => 'description20');

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

    test('should render Tooltip with tetherElementClassName', () => {
        const className = 'tether-element-class-name';
        const wrapper = mount(<TextInput error="error" label="label" tooltipTetherClassName={className} />);
        const tetherEl = wrapper.find(TetherComponent);

        expect(tetherEl.prop('className')).toBe(className);
    });

    test('should render text input with description', () => {
        const wrapper = shallow(<TextInput description="some description" />);

        expect(wrapper).toMatchSnapshot();
    });

    test.each`
        isLoading | isValid  | icon                  | loadingIndicatorExists | validIconExists | customIconExists | description
        ${true}   | ${false} | ${(<ClockBadge16 />)} | ${true}                | ${false}        | ${false}         | ${'LoadingIndicator if a custom icon is provided but isLoading is true'}
        ${false}  | ${true}  | ${(<ClockBadge16 />)} | ${false}               | ${true}         | ${false}         | ${'IconVerified if a custom icon is provided but isValid is true'}
        ${false}  | ${false} | ${(<ClockBadge16 />)} | ${false}               | ${false}        | ${true}          | ${'custom icon if provided and neither isLoading nor isValid is true'}
        ${true}   | ${false} | ${null}               | ${true}                | ${false}        | ${false}         | ${'LoadingIndicator if isLoading is true'}
        ${false}  | ${true}  | ${null}               | ${false}               | ${true}         | ${false}         | ${'IconVerified if isValid is true'}
        ${true}   | ${true}  | ${null}               | ${false}               | ${false}        | ${false}         | ${'no icons if both isLoading and isValid are true'}
        ${true}   | ${true}  | ${(<ClockBadge16 />)} | ${false}               | ${false}        | ${false}         | ${'no icons if both isLoading and isValid are true and a custom icon is provided'}
    `(
        'should render $description',
        ({ isLoading, isValid, icon, loadingIndicatorExists, validIconExists, customIconExists }) => {
            const wrapper = shallow(<TextInput icon={icon} isLoading={isLoading} isValid={isValid} />);
            if (icon) {
                expect(wrapper.exists(ClockBadge16)).toBe(customIconExists);
            }
            expect(wrapper.exists(LoadingIndicator)).toBe(loadingIndicatorExists);
            expect(wrapper.exists(IconVerified)).toBe(validIconExists);
        },
    );
});
