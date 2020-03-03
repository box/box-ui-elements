import React from 'react';
import { shallow } from 'enzyme';

import IconGraduationHat from '../IconGraduationHat';

describe('icons/general/IconGraduationHat', () => {
    const getWrapper = (props = {}) => shallow(<IconGraduationHat {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            height: 15,
            title: 'title',
            width: 15,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
