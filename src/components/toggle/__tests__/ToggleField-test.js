// @flow

import React from 'react';
import ToggleField from '../ToggleField';

describe('components/toggle/ToggleField', () => {
    const getWrapper = (props = {}) => shallow(<ToggleField {...props} />);

    test('should render properly when turned on', () => {
        const wrapper = getWrapper({
            field: {
                name: 'toggle',
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
                name: 'toggle',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            label: 'Enter things',
        });
        expect(wrapper).toMatchSnapshot();
    });
});
