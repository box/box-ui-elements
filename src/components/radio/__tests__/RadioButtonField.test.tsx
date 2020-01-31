/* eslint-disable no-console */
import React from 'react';
import { shallow } from 'enzyme';

import RadioButtonField, { RadioButtonFieldProps } from '../RadioButtonField';

describe('components/radio/RadioButtonField', () => {
    const getWrapper = (props: RadioButtonFieldProps) => shallow(<RadioButtonField {...props} />);

    test.each([
        [true, 'redVelvet'],
        [false, 'chocolate'],
        [false, 'pumpkin'],
        [false, null],
        [false, undefined],
    ])('should render isSelected=%s with value=%s', (expected, value) => {
        const wrapper = getWrapper({
            field: {
                value,
                name: 'redVelvet',
                onBlur: () => console.log('blur'),
                onChange: () => console.log('change'),
            },
            label: 'Red Velvet',
            name: 'redVelvet',
            value: 'redVelvet',
        });
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.prop('isSelected')).toBe(expected);
    });

    test('should render a basic RadioButton when no field property is provided', () => {
        const wrapper = getWrapper({
            label: 'Pistachio',
            value: 'pistachio',
        });
        expect(wrapper).toMatchSnapshot();
    });
});
