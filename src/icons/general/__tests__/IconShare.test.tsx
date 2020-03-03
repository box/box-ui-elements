import React from 'react';
import { shallow } from 'enzyme';

import IconShare from '../IconShare';

describe('icons/general/IconShare', () => {
    const getWrapper = (props = {}) => shallow(<IconShare {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with additional props', () => {
        const wrapper = getWrapper({
            className: 'class',
            color: '#000',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
