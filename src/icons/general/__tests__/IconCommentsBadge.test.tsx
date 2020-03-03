import React from 'react';
import { shallow } from 'enzyme';

import IconCommentsBadge from '../IconCommentsBadge';

describe('icons/general/IconCommentsBadge', () => {
    const getWrapper = (props = {}) => shallow(<IconCommentsBadge {...props} />);

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
