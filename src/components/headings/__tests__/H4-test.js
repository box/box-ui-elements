// @flow
import * as React from 'react';

import H4 from '../H4';

describe('components/headings/H4', () => {
    const getWrapper = (props = {}) => shallow(<H4 {...props}>foo</H4>);

    test('should render H4', () => {
        const wrapper = getWrapper({ className: 'moo' });

        expect(wrapper).toMatchSnapshot();
    });
});
