import React from 'react';
import { shallow } from 'enzyme';

import IconNavigateRight from '../IconNavigateRight';

describe('icons/general/IconNavigateRight', () => {
    const getWrapper = (props = {}) => shallow(<IconNavigateRight {...props} />);

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
