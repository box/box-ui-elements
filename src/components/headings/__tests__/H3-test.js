// @flow
import * as React from 'react';

import H3 from '../H3';

describe('components/headings/H3', () => {
    const getWrapper = (props = {}) => shallow(<H3 {...props}>foo</H3>);

    test('should render H3', () => {
        const wrapper = getWrapper({ className: 'moo' });

        expect(wrapper).toMatchSnapshot();
    });
});
