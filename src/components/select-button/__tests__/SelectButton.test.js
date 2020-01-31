import React from 'react';

import SelectButton from '..';

describe('components/select-button/SelectButton', () => {
    test('should correctly render children in select button', () => {
        const children = 'yooo';

        const wrapper = shallow(<SelectButton>{children}</SelectButton>).find('button');

        expect(wrapper.hasClass('select-button')).toBe(true);
        expect(wrapper.contains(children)).toBe(true);
        expect(wrapper.prop('disabled')).toBe(false);
    });
    test('should not show error tooltip on button by default', () => {
        const wrapper = shallow(<SelectButton>Button Text</SelectButton>);
        expect(wrapper).toMatchSnapshot();
    });
    test('should show error tooltip on button when error is has some value', () => {
        const wrapper = shallow(<SelectButton error="error">Button Text</SelectButton>);
        expect(wrapper).toMatchSnapshot();
    });
});
