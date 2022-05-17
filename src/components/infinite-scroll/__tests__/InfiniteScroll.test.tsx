import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import sinon from 'sinon';

import InfiniteScroll, { InfiniteScrollProps } from '../InfiniteScroll';

const sandbox = sinon.sandbox.create();

const mockOnLoadMore = jest.fn();

const threshold = 100;
const propsList: InfiniteScrollProps = {
    children: null,
    isLoading: false,
    hasMore: false,
    useWindow: true,
    onLoadMore: mockOnLoadMore,
    threshold,
};

const getSentinel = () => {
    const nodes = document.querySelectorAll('[data-testid="sentinel"]');
    return nodes[nodes.length - 1];
};

describe('components/infinite-scroll/InfiniteScroll', () => {
    let attachTo: HTMLDivElement;
    beforeEach(() => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        attachTo = container;
    });

    afterEach(() => {
        mockOnLoadMore.mockReset();
        sandbox.verifyAndRestore();
    });

    it('should render with default props', () => {
        const component = mount(<InfiniteScroll {...propsList} />);
        expect(component).toMatchInlineSnapshot(`
            <InfiniteScroll
              hasMore={false}
              isLoading={false}
              onLoadMore={[MockFunction]}
              threshold={100}
              useWindow={true}
            >
              <div>
                <div
                  data-testid="sentinel"
                />
              </div>
            </InfiniteScroll>
        `);
    });

    it('should render sentinel to calculate scroll position', () => {
        const component = mount(<InfiniteScroll {...propsList} />);
        expect(component.find('[data-testid="sentinel"]').length).toEqual(1);
    });

    it('should call onLoadMore if sentinel is in threshold range while scrolling in window', () => {
        const items = new Array(20).fill('ITEM');
        mount(
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

        const sentinel = getSentinel();
        sandbox
            .stub(sentinel, 'getBoundingClientRect')
            .returns({ top: window.innerHeight + (threshold - 1) } as DOMRect);

        window.dispatchEvent(new Event('scroll'));
        expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
    });

    it('should not call onLoadMore if sentinel is not in threshold range while scrolling in window', () => {
        const items = new Array(20).fill('ITEM');
        mount(
            <InfiniteScroll {...propsList} hasMore>
                <div>
                    {items.map((item, i) => (
                        <div key={i}>{item}</div>
                    ))}
                </div>
            </InfiniteScroll>,
            { attachTo },
        );

        const sentinel = getSentinel();
        sandbox
            .stub(sentinel, 'getBoundingClientRect')
            .returns({ top: window.innerHeight + (threshold + 1) } as DOMRect);

        window.dispatchEvent(new Event('scroll'));
        expect(mockOnLoadMore).not.toHaveBeenCalled();
    });

    it('should call onLoadMore if sentinel is in threshold range while scrolling scrollContainerNode', () => {
        const scrollContainer = document.createElement('div');
        sandbox.stub(scrollContainer, 'getBoundingClientRect').returns({ bottom: 500 } as DOMRect);

        const items = new Array(20).fill('ITEM');
        mount(
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

        const sentinel = getSentinel();
        sandbox.stub(sentinel, 'getBoundingClientRect').returns({ top: 500 + (threshold - 1) } as DOMRect);

        scrollContainer.dispatchEvent(new Event('scroll'));
        expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
    });

    it('should call onLoadMore if sentinel is in threshold range while scrolling scrollContainerNode', () => {
        const scrollContainer = document.createElement('div');
        sandbox.stub(scrollContainer, 'getBoundingClientRect').returns({ bottom: 500 } as DOMRect);

        const items = new Array(20).fill('ITEM');
        mount(
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

        const sentinel = getSentinel();
        sandbox.stub(sentinel, 'getBoundingClientRect').returns({ top: 500 + (threshold + 1) } as DOMRect);

        scrollContainer.dispatchEvent(new Event('scroll'));
        expect(mockOnLoadMore).not.toHaveBeenCalled();
    });

    describe('with sentinel in range', () => {
        let component: ReactWrapper;
        const mockedOnLoadMore = jest.fn();
        beforeEach(() => {
            const items = new Array(20).fill('ITEM');

            component = mount(
                <InfiniteScroll {...propsList} hasMore onLoadMore={mockedOnLoadMore} useWindow>
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
            sandbox
                .stub(sentinel, 'getBoundingClientRect')
                .returns({ top: window.innerHeight + (threshold - 1) } as DOMRect);
        });

        afterEach(() => {
            mockedOnLoadMore.mockReset();
        });

        it('should not call onLoadMore if isLoading', () => {
            component.setProps({ isLoading: true }, () => {
                window.dispatchEvent(new Event('scroll'));
                expect(mockedOnLoadMore).not.toHaveBeenCalled();
            });
        });

        it('should not call onLoadMore if !hasMore', () => {
            component.setProps({ hasMore: false }, () => {
                window.dispatchEvent(new Event('scroll'));
                expect(mockedOnLoadMore).not.toHaveBeenCalled();
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

            const component = mount(<InfiniteScroll {...propsList} />);

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
