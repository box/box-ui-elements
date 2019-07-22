// @flow
import * as React from 'react';

import H6 from '../H6';

describe('components/headings/H6', () => {
    const getWrapper = (props = {}) => shallow(<H6 {...props}>foo</H6>);

    test('should render H6', () => {
        const wrapper = getWrapper({ className: 'moo' });

        expect(wrapper).toMatchSnapshot();
    });
});
