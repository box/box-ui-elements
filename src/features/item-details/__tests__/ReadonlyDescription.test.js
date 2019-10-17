import React from 'react';

import ReadonlyDescription from '../ReadonlyDescription';

describe('features/item-details/ReadonlyDescription', () => {
    const getWrapper = (props = {}) =>
        shallow(<ReadonlyDescription value="Hi\ntesting this link https://box.com" {...props} />);

    test('should render default component', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });
});
