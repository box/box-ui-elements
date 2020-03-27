import React from 'react';
import { shallow } from 'enzyme';

import IconTrophyCup from '../IconTrophyCup';

describe('icons/general/IconTrophyCup', () => {
    const getWrapper = (props = {}) => shallow(<IconTrophyCup {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            height: 15,
            title: 'title',
            width: 18,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
