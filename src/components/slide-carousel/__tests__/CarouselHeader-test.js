import React from 'react';

import CarouselHeader from '../CarouselHeader';

describe('components/slide-carousel/CarouselHeader', () => {
    const defaultProps = {
        title: 'Blah',
    };

    const getWrapper = props => shallow(<CarouselHeader {...defaultProps} {...props} />);

    test('should render a title', () => {
        const testTitle = 'LoveAndHappiness';
        const wrapper = getWrapper({ title: testTitle });
        expect(wrapper.find('h3.slide-carousel-title').text()).toBe(testTitle);
    });

    test('should render a container div', () => {
        const wrapper = getWrapper();
        expect(wrapper.is('div.slide-carousel-header')).toBe(true);
    });
});
