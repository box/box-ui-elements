import React from 'react';
import { shallow } from 'enzyme';

import IconWatermark from '../IconWatermark';

describe('icons/general/IconWatermark', () => {
    const getWrapper = (props = {}) => shallow(<IconWatermark {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#000',
            height: 150,
            title: 'title',
            width: 160,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
