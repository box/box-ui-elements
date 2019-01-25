import * as React from 'react';

import ScrollWrapper from '../ScrollWrapper';

describe('components/scroll-wrapper/ScrollWrapper', () => {
    test('should render with default properties intact', () => {
        const wrapper = shallow(<ScrollWrapper />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should respect custom class names passed in', () => {
        const wrapper = shallow(<ScrollWrapper className="test-classname" />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render children as specified', () => {
        const wrapper = mount(
            <ScrollWrapper>
                <p>lorem ipsum dolor sit amet</p>
            </ScrollWrapper>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    describe('getClickShadowState', () => {
        test('should set shouldShowBottomScrollShadow state to be true if scrollTop is 0 and scrollHeight equals clientHeight', () => {
            const wrapper = mount(
                <ScrollWrapper>
                    <p>lorem ipsum dolor sit amet</p>
                </ScrollWrapper>,
            );

            const scrollRef = {
                scrollTop: 0,
                scrollHeight: 100,
                clientHeight: 100,
            };

            const expectedState = {
                shouldShowBottomScrollShadow: true,
                isScrollHeightEqualClientHeight: true,
            };

            wrapper.instance().scrollRef = scrollRef;
            const newState = wrapper.instance().getClickShadowState();
            expect(newState).toEqual(expectedState);
        });

        test('should set shouldShowBottomScrollShadow state to be false if scrollTop is 0 and scrollHeight is greater than clientHeight', () => {
            const wrapper = mount(
                <ScrollWrapper>
                    <p>lorem ipsum dolor sit amet</p>
                </ScrollWrapper>,
            );

            const scrollRef = {
                scrollTop: 0,
                scrollHeight: 200,
                clientHeight: 100,
            };

            const expectedState = {
                isScrollHeightEqualClientHeight: false,
            };

            wrapper.instance().scrollRef = scrollRef;
            const newState = wrapper.instance().getClickShadowState();
            expect(newState).toEqual(expectedState);
        });

        test('should set shouldShowBottomScrollShadow state to be false if scrollTop is greater than 0 and scrollHeight is greater than clientHeight', () => {
            const wrapper = mount(
                <ScrollWrapper>
                    <p>lorem ipsum dolor sit amet</p>
                </ScrollWrapper>,
            );

            const scrollRef = {
                scrollTop: 100,
                scrollHeight: 300,
                clientHeight: 100,
            };

            const expectedState = {
                shouldShowBottomScrollShadow: false,
            };

            wrapper.instance().scrollRef = scrollRef;
            const newState = wrapper.instance().getClickShadowState();
            expect(newState).toEqual(expectedState);
        });

        test('should set shouldShowBottomScrollShadow state to be true if scrollTop is greater than 0 and if the sum of scrollTop and clientHeight is scrollHeight', () => {
            const wrapper = mount(
                <ScrollWrapper>
                    <p>lorem ipsum dolor sit amet</p>
                </ScrollWrapper>,
            );

            const scrollRef = {
                scrollTop: 100,
                scrollHeight: 200,
                clientHeight: 100,
            };

            const expectedState = {
                shouldShowBottomScrollShadow: true,
            };

            wrapper.instance().scrollRef = scrollRef;
            const newState = wrapper.instance().getClickShadowState();
            expect(newState).toEqual(expectedState);
        });
    });
});
