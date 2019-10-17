import * as React from 'react';
import sinon from 'sinon';

import InfiniteScroll from '../InfiniteScroll';

const sandbox = sinon.sandbox.create();

const mockOnLoadMore = jest.fn();

const threshold = 100;
const propsList = {
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
    let attachTo;
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
  throttle={64}
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
        sandbox.stub(sentinel, 'getBoundingClientRect').returns({ top: window.innerHeight + (threshold - 1) });

        window.dispatchEvent(new Event('scroll'));
        expect(mockOnLoadMore).toHaveBeenCalled();
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
        sandbox.stub(sentinel, 'getBoundingClientRect').returns({ top: window.innerHeight + (threshold + 1) });

        window.dispatchEvent(new Event('scroll'));
        expect(mockOnLoadMore).not.toHaveBeenCalled();
    });

    it('should call onLoadMore if sentinel is in threshold range while scrolling scrollContainerNode', () => {
        const scrollContainer = document.createElement('div');
        sandbox.stub(scrollContainer, 'getBoundingClientRect').returns({ bottom: 500 });

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
        sandbox.stub(sentinel, 'getBoundingClientRect').returns({ top: 500 + (threshold - 1) });

        scrollContainer.dispatchEvent(new Event('scroll'));
        expect(mockOnLoadMore).toHaveBeenCalled();
    });

    it('should call onLoadMore if sentinel is in threshold range while scrolling scrollContainerNode', () => {
        const scrollContainer = document.createElement('div');
        sandbox.stub(scrollContainer, 'getBoundingClientRect').returns({ bottom: 500 });

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
        sandbox.stub(sentinel, 'getBoundingClientRect').returns({ top: 500 + (threshold + 1) });

        scrollContainer.dispatchEvent(new Event('scroll'));
        expect(mockOnLoadMore).not.toHaveBeenCalled();
    });

    it('should reset event listeners on useWindow or scrollContainerNode update', () => {
        const component = mount(<InfiniteScroll {...propsList} />);
        const mockAddEventListeners = jest.spyOn(component.instance(), 'addEventListeners');
        const mockRemoveEventListeners = jest.spyOn(component.instance(), 'removeEventListeners');
        component.update();

        component.setProps({ useWindow: false });
        expect(mockAddEventListeners).toHaveBeenCalledTimes(1);
        expect(mockRemoveEventListeners).toHaveBeenCalledTimes(1);

        component.setProps({
            scrollContainerNode: document.createElement('div'),
        });
        expect(mockAddEventListeners).toHaveBeenCalledTimes(2);
        expect(mockRemoveEventListeners).toHaveBeenCalledTimes(2);
    });

    describe('with sentinel in range', () => {
        let component;
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
            sandbox.stub(sentinel, 'getBoundingClientRect').returns({ top: window.innerHeight + (threshold - 1) });
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
});
