import React from 'react';
import { shallow } from 'enzyme';

import IconPhone from '../IconPhone';

describe('icons/general/IconPhone', () => {
    const getWrapper = (props = {}) => shallow(<IconPhone {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            height: 150,
            title: 'title',
            width: 160,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
