import * as React from 'react';

import FooterIndicator from '../FooterIndicator';

describe('feature/footer-indicator/FooterIndicator', () => {
    const getWrapper = () => shallow(<FooterIndicator indicatorText="abcdefghijklmnopqrstuvwxyz" />);

    test('should render a FooterIndicator and a tooltip', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });
});
