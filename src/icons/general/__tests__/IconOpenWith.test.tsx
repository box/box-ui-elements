import React from 'react';
import { shallow } from 'enzyme';

import IconOpenWith from '../IconOpenWith';

describe('icons/general/IconOpenWith', () => {
    const getWrapper = (props = {}) => shallow(<IconOpenWith {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#222',
            height: 150,
            title: 'title',
            width: 160,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
