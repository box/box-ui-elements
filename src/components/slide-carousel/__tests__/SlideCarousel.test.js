import React from 'react';
import range from 'lodash/range';
import sinon from 'sinon';

import SlideCarousel from '../SlideCarousel';
import SlideCarouselPrimitive from '../SlideCarouselPrimitive';
import Slide from '../Slide';

const getSlides = numSlides => range(numSlides).map(i => shallow(<Slide>`Slide ${i}`</Slide>));

describe('components/slide-carousel/SlideCarousel', () => {
    const sandbox = sinon.sandbox.create();

    const defaultProps = {
        children: getSlides(5),
        initialIndex: 1,
    };

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const getWrapper = props => shallow(<SlideCarousel {...defaultProps} {...props} />);

    describe('construction()', () => {
        test('should initialize selectedIndex as the initialIndex prop', () => {
            const wrapper = getWrapper({
                children: getSlides(5),
                initialIndex: 3,
            });

            expect(wrapper.state('selectedIndex')).toBe(3);
        });

        test('initial index should be 0 if no children and no initialIndex passed', () => {
            const wrapper = getWrapper({
                children: getSlides(0),
                initialIndex: undefined,
            });

            expect(wrapper.state('selectedIndex')).toBe(0);
        });

        test('initial index should default to 0', () => {
            const wrapper = getWrapper({ initialIndex: undefined });

            expect(wrapper.state('selectedIndex')).toBe(0);
        });

        test('initial index will be less than zero if initialIndex is smaller than 0', () => {
            const wrapper = getWrapper({ initialIndex: -5 });

            expect(wrapper.state('selectedIndex')).toBe(-5);
        });
    });

    describe('render()', () => {
        test('should render a SlideCarouselPrimitive', () => {
            const wrapper = getWrapper();

            expect(wrapper.is(SlideCarouselPrimitive)).toBe(true);
        });

        test('should generate ID and pass to child', () => {
            const wrapper = getWrapper();

            expect(wrapper.prop('idPrefix')).toEqual(wrapper.instance().id);
        });

        test('should pass to immediate child 0 if the number of children is zero', () => {
            const wrapper = getWrapper({
                id: undefined,
                children: getSlides(0),
            });

            expect(wrapper.find('SlideCarouselPrimitive').prop('selectedIndex')).toBe(0);
        });

        test('should pass to immediate child 0 if state.selectedIndex is less than 0', () => {
            const wrapper = getWrapper({ id: undefined });
            wrapper.setState({
                selectedIndex: -1,
            });

            expect(wrapper.find('SlideCarouselPrimitive').prop('selectedIndex')).toBe(0);
        });

        test('should pass to immediate child the number of children -1 if the number of children is less than state.selectedIndex', () => {
            const wrapper = getWrapper({ children: getSlides(5) });
            wrapper.setState({
                selectedIndex: 9999,
            });

            expect(wrapper.find('SlideCarouselPrimitive').prop('selectedIndex')).toBe(4);
        });

        test('should set the selectedIndex to a floored value if state.selectedIndex is a fraction', () => {
            const wrapper = getWrapper({ children: getSlides(5) });
            wrapper.setState({
                selectedIndex: 2.453,
            });

            expect(wrapper.find('SlideCarouselPrimitive').prop('selectedIndex')).toBe(2);
        });
    });

    describe('setSelectedIndex()', () => {
        test('should update selectedIndex when setSelectedIndex is called', () => {
            const wrapper = getWrapper({ children: getSlides(7) });
            wrapper.instance().setSelectedIndex(3);

            expect(wrapper.state('selectedIndex')).toBe(3);

            wrapper.instance().setSelectedIndex(1);

            expect(wrapper.state('selectedIndex')).toBe(1);
        });
    });
});
