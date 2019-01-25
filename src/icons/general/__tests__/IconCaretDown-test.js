import React from 'react';

import IconCaretDown from '../IconCaretDown';

describe('icons/general/IconCaretDown', () => {
    test('should correctly render default caret down icon', () => {
        const wrapper = shallow(<IconCaretDown />);

        expect(wrapper.hasClass('icon-caret-down')).toBe(true);
    });
});
