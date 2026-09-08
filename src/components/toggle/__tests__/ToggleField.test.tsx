import * as React from 'react';
import { shallow } from 'enzyme';

import ToggleField from '../ToggleField';

describe('components/toggle/ToggleField', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getWrapper = (props: any = {}) => shallow(<ToggleField {...props} />);

    test.each([
        [true, 'value'],
        [false, null],
        [false, undefined],
    ])('should render isOn=%s with value=%s', (expected, value) => {
        const wrapper = getWrapper({
            field: {
                value,
                name: 'toggle',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            label: 'Enter things',
        });
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.prop('isOn')).toBe(expected);
    });
});
