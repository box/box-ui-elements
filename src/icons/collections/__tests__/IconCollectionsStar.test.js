import React from 'react';

import IconCollectionsStar from '../IconCollectionsStar';

describe('icons/collections/IconCollectionsStar', () => {
    const getWrapper = (props = {}) => shallow(<IconCollectionsStar {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });
});
