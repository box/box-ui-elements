import React from 'react';

import RelayFullEmptyState from '../RelayFullEmptyState';

describe('icons/states/RelayFullEmptyState', () => {
    const getWrapper = (props = {}) => shallow(<RelayFullEmptyState {...props} />);

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
