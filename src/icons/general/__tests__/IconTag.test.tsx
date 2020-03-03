import React from 'react';
import { shallow } from 'enzyme';

import IconTag from '../IconTag';

describe('icons/general/IconTag', () => {
    const getWrapper = (props = {}) => shallow(<IconTag {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#333',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
