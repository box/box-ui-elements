/**
 * From https://github.com/jaredpalmer/react-simple-infinite-scroll
 * Updated to accept a scroll container React ref as the "window"
 */
import * as React from 'react';
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
declare function InfiniteScroll({ children, hasMore, isLoading, onLoadMore, scrollContainerNode, threshold, throttle, useWindow, }: InfiniteScrollProps): React.JSX.Element;
export default InfiniteScroll;
