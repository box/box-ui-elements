import React from 'react';
import { shallow } from 'enzyme';

import IconGridView from '../IconGridView';

describe('icons/general/IconGridView', () => {
    const getWrapper = (props = {}) => shallow(<IconGridView {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#222',
            height: 100,
            opacity: 0.2,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
