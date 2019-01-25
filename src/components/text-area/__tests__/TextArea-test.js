import React from 'react';

import TextArea from '../TextArea';

describe('components/text-area/TextArea', () => {
    test('should correctly render default component', () => {
        const component = shallow(<TextArea label="label" name="name" />);

        expect(component.hasClass('text-area-container')).toBe(true);
    });

    test('should correctly render placeholder when defined', () => {
        const placeholder = 'a placeholder';

        const component = shallow(<TextArea label="label" name="name" placeholder={placeholder} />);

        expect(component.find('textarea').prop('placeholder')).toEqual(placeholder);
    });

    test('should correctly render value when defined', () => {
        const value = 'a value';

        const component = shallow(<TextArea label="label" name="name" value={value} />);

        expect(component.find('textarea').prop('value')).toEqual(value);
    });

    test('should correctly render label with hideLabel when hideLabel is passed', () => {
        const component = shallow(<TextArea label="hidden label" name="name" hideLabel />);

        expect(component.find('Label').prop('hideLabel')).toEqual(true);
    });

    test('should correctly render label when defined and required', () => {
        const label = 'a label';

        const component = shallow(<TextArea label={label} name="name" isRequired />);

        expect(component.find('Label').prop('text')).toEqual(label);
    });

    test('should correctly render optional label when not required', () => {
        const label = 'a label';

        const component = shallow(<TextArea label={label} name="name" />);

        expect(component.find('Label').prop('showOptionalText')).toBe(true);
    });

    test('should correctly render name', () => {
        const name = 'a name';

        const component = shallow(<TextArea label="label" name={name} />);

        expect(component.find('textarea').prop('name')).toEqual(name);
    });

    test('should show Tooltip when error exists', () => {
        const wrapper = shallow(<TextArea label="label" error="error" />);

        const tooltip = wrapper.find('Tooltip');
        expect(tooltip.prop('isShown')).toBe(true);
    });

    test('should not show Tooltip when no error exists', () => {
        const wrapper = shallow(<TextArea label="label" />);

        const tooltip = wrapper.find('Tooltip');
        expect(tooltip.prop('isShown')).toBe(false);
    });
});
