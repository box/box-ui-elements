// @flow

import React from 'react';
import CheckboxField from '../CheckboxField';

describe('components/checkbox/CheckboxField', () => {
    const getWrapper = (props = {}) => shallow(<CheckboxField {...props} />);

    test.each([[true, 'value'], [false, null], [false, undefined]])(
        'should render isChecked=%s with value=%s',
        (expected, value) => {
            const wrapper = getWrapper({
                field: {
                    value,
                    name: 'checkbox',
                    onBlur: 'onblur',
                    onChange: 'onchange',
                },
                label: 'Enter things',
            });
            expect(wrapper).toMatchSnapshot();
            expect(wrapper.prop('isChecked')).toBe(expected);
        },
    );
});
