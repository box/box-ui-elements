// @flow

import React from 'react';
import RadioButtonField from '../RadioButtonField';

describe('components/radio/RadioButtonField', () => {
    const getWrapper = (props = {}) => shallow(<RadioButtonField {...props} />);

    test.each([[true, 'radioValue'], [false, 'value'], [false, null], [false, undefined]])(
        'should render isSelected=%s with value=%s',
        (expected, value) => {
            const wrapper = getWrapper({
                field: {
                    value,
                    name: 'radiobutton',
                    onBlur: 'onblur',
                    onChange: 'onchange',
                },
                label: 'Enter things',
                value: 'radioValue',
            });
            expect(wrapper).toMatchSnapshot();
            expect(wrapper.prop('isSelected')).toBe(expected);
        },
    );
});
