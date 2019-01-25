import React from 'react';

import SelectButton from '..';

describe('components/select-button/SelectButton', () => {
    test('should correctly render children in select button', () => {
        const children = 'yooo';

        const wrapper = shallow(<SelectButton>{children}</SelectButton>);

        expect(wrapper.hasClass('select-button')).toBe(true);
        expect(wrapper.contains(children)).toBe(true);
        expect(wrapper.prop('disabled')).toBe(false);
    });
});
