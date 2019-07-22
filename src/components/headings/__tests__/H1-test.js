// @flow
import * as React from 'react';

import H1 from '../H1';

describe('components/headings/H1', () => {
    const getWrapper = (props = {}) => shallow(<H1 {...props}>foo</H1>);

    test('should render H1', () => {
        const wrapper = getWrapper({ className: 'moo' });

        expect(wrapper).toMatchSnapshot();
    });
});
