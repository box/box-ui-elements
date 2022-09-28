import { mount, ReactWrapper, shallow } from 'enzyme';
import * as React from 'react';

import InfiniteScroll, { InfiniteScrollProps } from '../InfiniteScroll';

const mockOnLoadMore = jest.fn();

const threshold = 100;
const propsList: InfiniteScrollProps = {
    children: null,
    isLoading: false,
    hasMore: false,
    useWindow: true,
    onLoadMore: mockOnLoadMore,
    threshold,
    throttle: 2,
};

describe('components/infinite-scroll/InfiniteScroll', () => {
    const items = new Array(20).fill('ITEM');

    let attachTo: HTMLDivElement;
    let component: ReactWrapper;

    const getSentinel = () => {
        return component?.find('[data-testid="sentinel"]').getDOMNode();
    };

    beforeEach(() => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        attachTo = container;

        // Element initializes with sentinel above threshold (no initial load).
        // Without this, top will always be 0 due to jest limitation.
        jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
            top: window.innerHeight + (threshold + 1),
        } as DOMRect);
    });

    afterEach(() => {
        component?.unmount();

        document.body.innerHTML = '';
        document.head.innerHTML = '';

        jest.restoreAllMocks();
    });

    it('should render with default props', () => {
        const wrapper = shallow(<InfiniteScroll {...propsList} />);
        expect(wrapper).toMatchInlineSnapshot(`
              <div>
                <div
                  data-testid="sentinel"
                />
              </div>
        `);
    });

    it('should render sentinel to calculate scroll position', () => {
        const wrapper = shallow(<InfiniteScroll {...propsList} />);
        expect(wrapper.find('[data-testid="sentinel"]').length).toEqual(1);
    });

    describe('using window', () => {
        beforeEach(() => {
            component = mount(
                <InfiniteScroll {...propsList} hasMore>
                    <div>
                        {items.map((item, i) => (
                            <div key={i} style={{ height: '100px' }}>
                                {item}
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>,
                { attachTo },
            );
        });

        it('should call onLoadMore if sentinel is in threshold range and window is not scrollable', () => {
            const sentinel = getSentinel();
            sentinel.getBoundingClientRect = jest
                .fn()
                .mockReturnValue({ top: window.innerHeight + (threshold - 1) } as DOMRect);

            // update prop to trigger useEffect
            component.setProps({ throttle: 1 });
            expect(mockOnLoadMore).toBeCalledTimes(1);
        });

        it('should call onLoadMore if sentinel is in threshold range while scrolling in window', () => {
            const sentinel = getSentinel();
            sentinel.getBoundingClientRect = jest
                .fn()
                .mockReturnValue({ top: window.innerHeight + (threshold - 1) } as DOMRect);

            window.dispatchEvent(new Event('scroll'));
            expect(mockOnLoadMore).toBeCalledTimes(1);
        });

        it('should not call onLoadMore if sentinel is not in threshold range while scrolling in window', () => {
            window.dispatchEvent(new Event('scroll'));
            expect(mockOnLoadMore).toBeCalledTimes(0);
        });
    });

    describe('using scrollContainerNode', () => {
        let scrollContainer: HTMLDivElement;

        beforeEach(() => {
            scrollContainer = document.createElement('div');
            scrollContainer.getBoundingClientRect = jest.fn().mockReturnValue({ bottom: 500 } as DOMRect);

            component = mount(
                <InfiniteScroll {...propsList} hasMore scrollContainerNode={scrollContainer} useWindow={false}>
                    <div>
                        {items.map((item, i) => (
                            <div key={i} style={{ height: '100px' }}>
                                {item}
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>,
                { attachTo },
            );
        });

        it('should call onLoadMore if sentinel is in threshold range and window is not scrollable', () => {
            const sentinel = getSentinel();
            sentinel.getBoundingClientRect = jest.fn().mockReturnValue({ top: 500 + (threshold - 1) } as DOMRect);

            // update prop to trigger useEffect
            component.setProps({ throttle: 1 });
            expect(mockOnLoadMore).toBeCalledTimes(1);
        });

        it('should call onLoadMore if sentinel is in threshold range while scrolling scrollContainerNode', () => {
            const sentinel = getSentinel();
            sentinel.getBoundingClientRect = jest.fn().mockReturnValue({ top: 500 + (threshold - 1) } as DOMRect);

            scrollContainer.dispatchEvent(new Event('scroll'));
            expect(mockOnLoadMore).toBeCalledTimes(1);
        });

        it('should not call onLoadMore if sentinel is not in threshold range while scrolling scrollContainerNode', () => {
            scrollContainer.dispatchEvent(new Event('scroll'));
            expect(mockOnLoadMore).not.toBeCalled();
        });
    });

    describe('with sentinel in range', () => {
        beforeEach(() => {
            component = mount(
                <InfiniteScroll {...propsList} hasMore useWindow>
                    <div>
                        {items.map((item, i) => (
                            <div key={i} style={{ height: '100px' }}>
                                {item}
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>,
                { attachTo },
            );

            const sentinel = getSentinel();
            sentinel.getBoundingClientRect = jest
                .fn()
                .mockReturnValue({ top: window.innerHeight + (threshold - 1) } as DOMRect);

            jest.resetAllMocks();
        });

        it('should not call onLoadMore if isLoading', () => {
            component.setProps({ isLoading: true }, () => {
                window.dispatchEvent(new Event('scroll'));
                expect(mockOnLoadMore).not.toBeCalled();
            });
        });

        it('should not call onLoadMore if !hasMore', () => {
            component.setProps({ hasMore: false }, () => {
                window.dispatchEvent(new Event('scroll'));
                expect(mockOnLoadMore).not.toBeCalled();
            });
        });
    });

    describe('event handlers', () => {
        function assertScrollAndResizeEvents(spyInstance: jest.SpyInstance, numberOfCalls = 1) {
            // there are a lot of 'error' event listeners, we're only interested in scroll and resize
            const scrollEvents = spyInstance.mock.calls.filter(([event]) => event === 'scroll');
            const resizeEvents = spyInstance.mock.calls.filter(([event]) => event === 'resize');
            expect(scrollEvents).toHaveLength(numberOfCalls);
            expect(resizeEvents).toHaveLength(numberOfCalls);
        }

        it('should check if listeners are added and removed', () => {
            const addEventListenerWindow = jest.spyOn(window, 'addEventListener');
            const removeEventListenerWindow = jest.spyOn(window, 'removeEventListener');

            const scrollContainerNode = document.createElement('div');

            const addEventListenerScrollContainer = jest.spyOn(scrollContainerNode, 'addEventListener');
            const removeEventListenerScrollContainer = jest.spyOn(scrollContainerNode, 'removeEventListener');

            assertScrollAndResizeEvents(addEventListenerWindow, 0);
            assertScrollAndResizeEvents(removeEventListenerWindow, 0);
            assertScrollAndResizeEvents(addEventListenerScrollContainer, 0);
            assertScrollAndResizeEvents(removeEventListenerScrollContainer, 0);

            component = mount(<InfiniteScroll {...propsList} />);

            assertScrollAndResizeEvents(addEventListenerWindow);

            component.setProps({ useWindow: false });

            assertScrollAndResizeEvents(removeEventListenerWindow);

            component.setProps({
                scrollContainerNode,
            });

            assertScrollAndResizeEvents(addEventListenerScrollContainer);

            component.setProps({
                useWindow: true,
            });

            assertScrollAndResizeEvents(removeEventListenerScrollContainer);

            // we should have another pair of addEventsListeners on window
            assertScrollAndResizeEvents(addEventListenerWindow, 2);
        });
    });
});
