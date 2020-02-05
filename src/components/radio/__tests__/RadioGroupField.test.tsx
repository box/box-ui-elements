/* eslint-disable no-console */
import React from 'react';
import { shallow } from 'enzyme';

import RadioGroupField, { RadioGroupFieldProps } from '../RadioGroupField';

describe('components/radio/RadioGroupField', () => {
    const getWrapper = (props: RadioGroupFieldProps) => shallow(<RadioGroupField {...props} />);

    test('should render properly', () => {
        const wrapper = getWrapper({
            children: [],
            className: 'bdl-CupcakeFlavors',
            field: {
                name: 'radiogroup',
                value: 'value',
                onBlur: () => console.log('blur'),
                onChange: () => console.log('change'),
            },
            name: 'Cupcake Flavors',
        });
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.prop('value')).toBe('value');
    });

    test('should render a basic RadioGroup when no field property is provided', () => {
        const wrapper = getWrapper({
            children: [],
            className: '',
        });
        expect(wrapper).toMatchSnapshot();
    });
});
