import React from 'react';
import { shallow } from 'enzyme';

import IconMagicWand from '../IconMagicWand';

describe('icons/general/IconMagicWand', () => {
    const getWrapper = (props = {}) => shallow(<IconMagicWand {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
