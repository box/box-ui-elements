import React from 'react';

import IconEdit from '../IconEdit';

describe('icons/general/IconEdit', () => {
    const getWrapper = (props = {}) => shallow(<IconEdit {...props} />);

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
