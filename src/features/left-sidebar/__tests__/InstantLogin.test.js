// @flow
import * as React from 'react';

import InstantLogin from '../InstantLogin';

describe('feature/left-sidebar/InstantLogin', () => {
    const getWrapper = (props = {}) => shallow(<InstantLogin message="message" {...props} />);

    test('should render', () => {
        const htmlAttributes = { href: '/master' };
        const icon = () => <div />;
        const wrapper = getWrapper({ icon, htmlAttributes });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render without icon', () => {
        const htmlAttributes = { href: '/master' };
        const wrapper = getWrapper({ htmlAttributes });

        expect(wrapper).toMatchSnapshot();
    });
});
