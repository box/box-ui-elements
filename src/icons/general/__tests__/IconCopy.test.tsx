import React from 'react';
import { shallow } from 'enzyme';

import IconCopy from '../IconCopy';

describe('icons/general/IconCopy', () => {
    const getWrapper = (props = {}) => shallow(<IconCopy {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: 'green',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
