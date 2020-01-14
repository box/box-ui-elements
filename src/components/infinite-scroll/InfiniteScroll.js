// @flow
/**
 * From https://github.com/jaredpalmer/react-simple-infinite-scroll
 * Updated to accept a scroll container React ref as the "window"
 */
import * as React from 'react';
import throttle from 'lodash/throttle';

type Props = {
    /** Components to render, should include entities/loading states/end message */
    children: React.Node,
    /** Does the resource have more entities */
    hasMore: boolean,
    /** Are more entities being loaded */
    isLoading: boolean,
    /** Callback to load more entities */
    onLoadMore: () => void,
    /** React ref of the scroll container.
     * Used to listen to scroll events and calculate onLoadMore calls.
     * Set useWindow to true to use the window as scroll container.
     */
    scrollContainerNode?: ?HTMLElement,
    /** Scroll threshold */
    threshold: number,
    /** Throttle rate */
    throttle: number,
    /** Set useWindow to true to use the window as scroll container. If set to true, will ignore scrollContainerRef. */
    useWindow: boolean,
};

type State = {
    activeListenerNode: ?HTMLElement,
};

class InfiniteScroll extends React.Component<Props, State> {
    static defaultProps = {
        threshold: 100,
        throttle: 64,
        useWindow: false,
    };

    sentinel: { current: null | HTMLDivElement } = React.createRef();

    scrollHandler: () => void;

    resizeHandler: () => void;

    constructor(props: Props) {
        super(props);

        this.scrollHandler = throttle(this.onContainerScroll, props.throttle);
        this.resizeHandler = throttle(this.onContainerScroll, props.throttle);

        this.state = {
            activeListenerNode: null,
        };
    }

    componentDidMount() {
        this.addEventListeners();
    }

    componentDidUpdate(prevProps: Props) {
        const { useWindow, scrollContainerNode } = this.props;
        if (useWindow !== prevProps.useWindow || scrollContainerNode !== prevProps.scrollContainerNode) {
            this.removeEventListeners();
            this.addEventListeners();
        }
    }

    componentWillUnmount() {
        this.removeEventListeners();
    }

    addEventListeners = () => {
        const { useWindow } = this.props;
        if (useWindow) {
            window.addEventListener('scroll', this.scrollHandler);
            window.addEventListener('resize', this.resizeHandler);
            this.setState({ activeListenerNode: window });
        } else {
            const { scrollContainerNode } = this.props;
            if (scrollContainerNode == null) return;
            scrollContainerNode.addEventListener('scroll', this.scrollHandler);
            scrollContainerNode.addEventListener('resize', this.resizeHandler);
            this.setState({ activeListenerNode: scrollContainerNode });
        }
    };

    removeEventListeners = () => {
        const { activeListenerNode } = this.state;
        if (activeListenerNode == null) return;
        activeListenerNode.removeEventListener('scroll', this.scrollHandler);
        activeListenerNode.removeEventListener('resize', this.resizeHandler);
    };

    onContainerScroll = () => {
        const { isLoading, hasMore, threshold, useWindow, onLoadMore } = this.props;

        if (isLoading || !hasMore) return;

        if (this.sentinel.current == null) return;
        const { top: sentinelTop } = this.sentinel.current.getBoundingClientRect();

        if (useWindow) {
            if (sentinelTop - window.innerHeight < threshold) {
                onLoadMore();
            }
        } else {
            const { scrollContainerNode } = this.props;
            if (scrollContainerNode == null) return;

            const { bottom: containerBottom } = scrollContainerNode.getBoundingClientRect();
            if (sentinelTop - containerBottom < threshold) {
                onLoadMore();
            }
        }
    };

    render() {
        const sentinel = <div ref={this.sentinel} data-testid="sentinel" />;

        return (
            <div>
                {this.props.children}
                {sentinel}
            </div>
        );
    }
}

export default InfiniteScroll;
