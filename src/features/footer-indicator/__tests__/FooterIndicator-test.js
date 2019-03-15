import * as React from 'react';

import FooterIndicator from '../FooterIndicator';

describe('feature/footer-indicator/FooterIndicator', () => {
    const getWrapper = () => shallow(<FooterIndicator indicatorText="abcdefghijklmnopqrstuvwxyz" />);

    test('should render a FooterIndicator', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render a tooltip if isTextOverflowed is true', () => {
        const isTextOverflowed = true;
        const wrapper = getWrapper();
        wrapper.setState({ isTextOverflowed });

        expect(wrapper).toMatchSnapshot();
    });

    test('should not render a tooltip if isTextOverflowed is false', () => {
        const isTextOverflowed = false;
        const wrapper = getWrapper();
        wrapper.setState({ isTextOverflowed });

        expect(wrapper).toMatchSnapshot();
    });
});
