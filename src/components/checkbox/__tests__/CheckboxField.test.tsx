/* eslint-disable no-console */
import React from 'react';
import { shallow } from 'enzyme';

import CheckboxField, { CheckboxFieldProps } from '../CheckboxField';

describe('components/checkbox/CheckboxField', () => {
    const getWrapper = (props: CheckboxFieldProps) => shallow(<CheckboxField {...props} />);

    test.each([
        [true, 'value'],
        [false, null],
        [false, undefined],
    ])('should render isChecked=%s with value=%s', (expected, value) => {
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
        expect(wrapper.prop('isChecked')).toBe(expected);
    });

    test('should render a basic Checkbox when no field property is provided', () => {
        const wrapper = getWrapper({
            label: 'Pistachio',
            name: 'pistachio',
        });
        expect(wrapper).toMatchSnapshot();
    });
});
