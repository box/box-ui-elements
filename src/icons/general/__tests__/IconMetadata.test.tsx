import React from 'react';
import { shallow } from 'enzyme';

import IconMetadata from '../IconMetadata';

describe('icons/general/IconMetadata', () => {
    const getWrapper = (props = {}) => shallow(<IconMetadata {...props} />);

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
