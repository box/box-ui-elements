/**
 * From https://github.com/jaredpalmer/react-simple-infinite-scroll
 * Updated to accept a scroll container React ref as the "window"
 */
import * as React from 'react';
import throttleFn from 'lodash/throttle';

export interface InfiniteScrollProps {
    /** Components to render, should include entities/loading states/end message */
    children: React.ReactNode;
    /** Does the resource have more entities */
    hasMore: boolean;
    /** Are more entities being loaded */
    isLoading: boolean;
    /** Callback to load more entities */
    onLoadMore: () => void;
    /** React ref of the scroll container.
     * Used to listen to scroll events and calculate onLoadMore calls.
     * Set useWindow to true to use the window as scroll container.
     */
    scrollContainerNode?: HTMLElement;
    /** Scroll threshold */
    threshold?: number;
    /** Throttle rate */
    throttle?: number;
    /** Set useWindow to true to use the window as scroll container. If set to true, will ignore scrollContainerNode. */
    useWindow?: boolean;
}

type OnContainerScrollParams = Pick<Required<InfiniteScrollProps>, 'threshold' | 'useWindow'> &
    Pick<InfiniteScrollProps, 'isLoading' | 'hasMore' | 'scrollContainerNode' | 'onLoadMore'> & {
        sentinelRef: React.RefObject<HTMLDivElement>;
    };

function onContainerScroll({
    hasMore,
    isLoading,
    onLoadMore,
    scrollContainerNode,
    sentinelRef,
    threshold,
    useWindow,
}: OnContainerScrollParams) {
    if (isLoading || !hasMore) return;

    if (sentinelRef.current === null) return;
    const { top: sentinelTop } = sentinelRef.current.getBoundingClientRect();

    if (useWindow) {
        if (sentinelTop - window.innerHeight < threshold) {
            onLoadMore();
        }
    } else {
        if (!scrollContainerNode) return;

        const { bottom: containerBottom } = scrollContainerNode.getBoundingClientRect();
        if (sentinelTop - containerBottom < threshold) {
            onLoadMore();
        }
    }
}

function InfiniteScroll({
    children,
    hasMore,
    isLoading,
    onLoadMore,
    scrollContainerNode,
    threshold = 100,
    throttle = 64,
    useWindow = false,
}: InfiniteScrollProps) {
    const sentinelRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const params = {
            hasMore,
            isLoading,
            onLoadMore,
            scrollContainerNode,
            sentinelRef,
            threshold,
            useWindow,
        };

        const scrollHandler = throttleFn(() => onContainerScroll(params), throttle);
        const resizeHandler = throttleFn(() => onContainerScroll(params), throttle);

        const container = useWindow ? window : scrollContainerNode;

        if (container) {
            container.addEventListener('scroll', scrollHandler);
            container.addEventListener('resize', resizeHandler);
        }

        // loads more content until page becomes scrollable, or until there is no more data to fetch
        onContainerScroll(params);

        return function removeEventListeners() {
            if (container) {
                container.removeEventListener('scroll', scrollHandler);
                container.removeEventListener('resize', resizeHandler);
            }
        };
    }, [hasMore, isLoading, onLoadMore, scrollContainerNode, sentinelRef, threshold, throttle, useWindow]);

    return (
        <div>
            {children}
            <div ref={sentinelRef} data-testid="sentinel" />
        </div>
    );
}

export default InfiniteScroll;
