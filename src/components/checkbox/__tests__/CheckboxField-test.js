// @flow

import React from 'react';
import CheckboxField from '../CheckboxField';

describe('components/checkbox/CheckboxField', () => {
    const getWrapper = (props = {}) => shallow(<CheckboxField {...props} />);

    test('should render properly when turned on', () => {
        const wrapper = getWrapper({
            field: {
                name: 'checkbox',
                value: 'value',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            label: 'Enter things',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render properly when turned off', () => {
        const wrapper = getWrapper({
            field: {
                name: 'checkbox',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            label: 'Enter things',
        });
        expect(wrapper).toMatchSnapshot();
    });
});
