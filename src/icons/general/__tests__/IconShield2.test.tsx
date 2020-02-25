import React from 'react';
import { shallow } from 'enzyme';

import IconShield2 from '../IconShield2';

describe('icons/general/IconShield2', () => {
    const getWrapper = (props = {}) => shallow(<IconShield2 {...props} />);

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
