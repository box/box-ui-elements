import React from 'react';
import { shallow } from 'enzyme';

import IconUnsync from '../IconUnsync';

describe('icons/general/IconUnsync', () => {
    const getWrapper = (props = {}) => shallow(<IconUnsync {...props} />);

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
