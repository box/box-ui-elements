// @flow

import React from 'react';
import RadioGroupField from '../RadioGroupField';

describe('components/radio/RadioGroupField', () => {
    const getWrapper = (props = {}) => shallow(<RadioGroupField {...props} />);

    test('should render properly', () => {
        const wrapper = getWrapper({
            field: {
                name: 'radiogroup',
                value: 'value',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            label: 'Enter things',
        });
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.prop('value')).toBe('value');
    });
});
