import React from 'react';
import { shallow } from 'enzyme';

import IconSmallClose from '../IconSmallClose';

describe('icons/general/IconSmallClose', () => {
    const getWrapper = (props = {}) => shallow(<IconSmallClose {...props} />);

    test('should correctly render default component', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render component with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#123456',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
