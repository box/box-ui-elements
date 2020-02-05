import React from 'react';
import { shallow } from 'enzyme';

import RadioButton from '../RadioButton';

describe('components/radio/RadioButton', () => {
    const renderRadioButtons = (props?: Record<string, string | boolean>) => (
        <RadioButton description="radio1desc" label="Select things" name="name1" value="1" {...props} />
    );

    test('should correctly render default component', () => {
        const component = shallow(renderRadioButtons());

        expect(component.find('.radio-container')).toBeTruthy();
        expect(component.find('label')).toBeTruthy();
        expect(component.find('input').prop('name')).toEqual('name1');
        expect(component.find('input').prop('checked')).toEqual(false);
        expect(component.find('input').prop('type')).toEqual('radio');
        expect(component.find('input').prop('value')).toEqual('1');
        expect(component.find('input').prop('value')).toEqual('1');
        expect(component.find('.radio-description').text()).toEqual('radio1desc');
        expect(
            component
                .find('span')
                .at(1)
                .text(),
        ).toEqual('Select things');
    });

    test('should be selected on when isSelected is true', () => {
        const component = shallow(renderRadioButtons({ isSelected: true }));

        expect(component.find('input').prop('checked')).toEqual(true);
    });

    test('should pass rest of props to input', () => {
        const resinTarget = 'resin';
        const component = shallow(
            renderRadioButtons({
                'data-resin-target': resinTarget,
            }),
        );

        expect(component.find('input').prop('data-resin-target')).toEqual(resinTarget);
    });

    test('should add accessibility-hidden class when hideLabel is true', () => {
        const component = shallow(renderRadioButtons({ hideLabel: true }));
        expect(component.find('.accessibility-hidden').length).toBe(1);
    });
});
