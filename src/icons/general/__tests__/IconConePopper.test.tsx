import React from 'react';
import { shallow } from 'enzyme';

import IconConePopper from '../IconConePopper';

describe('icons/general/IconConePopper', () => {
    const getWrapper = (props = {}) => shallow(<IconConePopper {...props} />);

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
