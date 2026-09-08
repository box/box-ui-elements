import * as React from 'react';
import { shallow } from 'enzyme';
import range from 'lodash/range';

import CarouselHeader from '../CarouselHeader';
import Slide from '../Slide';
import SlideCarouselPrimitive, { type SlideCarouselPrimitiveProps } from '../SlideCarouselPrimitive';
import SlideNavigator from '../SlideNavigator';

const getSlides = (numSlides: number) =>
    range(numSlides).map(i => shallow(<Slide>`Slide ${i}`</Slide>)) as unknown as React.ReactNode;

describe('components/slide-carousel/SlideCarouselPrimitive', () => {
    const defaultProps: Partial<SlideCarouselPrimitiveProps> = {
        children: getSlides(5),
        selectedIndex: 1,
    };

    const getWrapper = (props: Partial<SlideCarouselPrimitiveProps> = {}) => {
        const componentProps = { ...defaultProps, ...props } as SlideCarouselPrimitiveProps;
        return shallow(<SlideCarouselPrimitive {...componentProps} />);
    };

    test('should add the given class to the containing div', () => {
        expect(getWrapper({ className: 'someClass' }).first().hasClass('someClass')).toBe(true);
    });

    test('should render a CarouselHeader with a given title', () => {
        const testTitle = 'Carousel Title';
        const wrapper = getWrapper({ title: testTitle });
        expect(wrapper.find(CarouselHeader).prop('title')).toBe(testTitle);
    });

    test('should not render a CarouselHeader when no title is given', () => {
        const wrapper = getWrapper({ title: '' });
        expect(wrapper.find(CarouselHeader)).toHaveLength(0);
    });

    test('should pass 0 as numOptions to navigator when childless', () => {
        const wrapper = getWrapper({ children: getSlides(0) });
        expect(wrapper.find(SlideNavigator).prop('numOptions')).toBe(0);
    });

    test('should pass 1 as numOptions to navigator for a single child', () => {
        const wrapper = getWrapper({ children: <Slide>Single slide</Slide> });
        expect(wrapper.find(SlideNavigator).prop('numOptions')).toBe(1);
    });

    test('should pass number of children to navigator', () => {
        const wrapper = getWrapper({ children: getSlides(4) });
        expect(wrapper.find(SlideNavigator).prop('numOptions')).toBe(4);
    });
});
