// @flow
import * as React from 'react';

import H5 from '../H5';

describe('components/headings/H5', () => {
    const getWrapper = (props = {}) => shallow(<H5 {...props}>foo</H5>);

    test('should render H5', () => {
        const wrapper = getWrapper({ className: 'moo' });

        expect(wrapper).toMatchSnapshot();
    });
});
