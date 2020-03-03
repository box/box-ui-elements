import React from 'react';
import { shallow } from 'enzyme';

import IconSortChevron from '../IconSortChevron';

describe('icons/general/IconSortChevron', () => {
    const getWrapper = (props = {}) => shallow(<IconSortChevron {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#444',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
