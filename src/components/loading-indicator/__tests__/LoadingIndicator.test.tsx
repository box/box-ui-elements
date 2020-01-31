import React from 'react';
import { shallow } from 'enzyme';

import LoadingIndicator, { LoadingIndicatorSize } from '..';

describe('components/loading-indicator/LoadingIndicator', () => {
    test('should correctly render default loading indicator', () => {
        const wrapper = shallow(<LoadingIndicator />);

        expect(wrapper.hasClass('crawler')).toBe(true);
        expect(wrapper.hasClass('is-default')).toBe(true);
        expect(wrapper.children().length).toBe(3);
    });

    test('should correctly render small loading indicator', () => {
        const wrapper = shallow(<LoadingIndicator size={LoadingIndicatorSize.SMALL} />);

        expect(wrapper.hasClass('crawler')).toBe(true);
        expect(wrapper.hasClass('is-small')).toBe(true);
    });

    test('should correctly render large loading indicator', () => {
        const wrapper = shallow(<LoadingIndicator size={LoadingIndicatorSize.LARGE} />);

        expect(wrapper.hasClass('crawler')).toBe(true);
        expect(wrapper.hasClass('is-large')).toBe(true);
    });
});
