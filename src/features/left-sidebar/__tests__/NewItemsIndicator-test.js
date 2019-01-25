// @flow
import * as React from 'react';

import NewItemsIndicator from '../NewItemsIndicator';

describe('feature/left-sidebar/NewItemsIndicator', () => {
    test('has base classes/tags used in SASS', () => {
        const wrapper = shallow(<NewItemsIndicator />);

        expect(wrapper).toMatchSnapshot();
    });

    test('can receive arbitrary class names as needed', () => {
        const wrapper = shallow(<NewItemsIndicator className="test" />);

        expect(wrapper).toMatchSnapshot();
    });
});
