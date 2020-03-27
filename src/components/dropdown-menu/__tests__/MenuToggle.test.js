import React from 'react';

import MenuToggle from '../MenuToggle';

describe('components/dropdown-menu/MenuToggle', () => {
    test('should correctly render toggle', () => {
        const wrapper = shallow(<MenuToggle>hi</MenuToggle>);

        expect(wrapper).toMatchSnapshot();
    });
});
