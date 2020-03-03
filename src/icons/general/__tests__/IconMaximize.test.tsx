import React from 'react';
import { shallow } from 'enzyme';

import IconMaximize from '../IconMaximize';

describe('icons/general/IconMaximize', () => {
    const getWrapper = (props = {}) => shallow(<IconMaximize {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#782334',
            height: 15,
            title: 'title',
            width: 15,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
