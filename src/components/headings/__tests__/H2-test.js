// @flow
import * as React from 'react';

import H2 from '../H2';

describe('components/headings/H2', () => {
    const getWrapper = (props = {}) => shallow(<H2 {...props}>foo</H2>);

    test('should render H2', () => {
        const wrapper = getWrapper({ className: 'moo' });

        expect(wrapper).toMatchSnapshot();
    });
});
