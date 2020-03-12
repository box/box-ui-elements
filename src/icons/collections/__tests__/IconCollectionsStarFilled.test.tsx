import React from 'react';
import { shallow } from 'enzyme';

import IconCollectionsStarFilled from '../IconCollectionsStarFilled';

describe('icons/collections/IconCollectionsStarFilled', () => {
    const getWrapper = (props = {}) => shallow(<IconCollectionsStarFilled {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });
});
