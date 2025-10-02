/**
 * From https://github.com/jaredpalmer/react-simple-infinite-scroll
 * Updated to accept a scroll container React ref as the "window"
 */
import * as React from 'react';
import throttleFn from 'lodash/throttle';
function onContainerScroll({
  hasMore,
  isLoading,
  onLoadMore,
  scrollContainerNode,
  sentinelRef,
  threshold,
  useWindow
}) {
  if (isLoading || !hasMore) return;
  if (sentinelRef.current === null) return;
  const {
    top: sentinelTop
  } = sentinelRef.current.getBoundingClientRect();
  if (useWindow) {
    if (sentinelTop - window.innerHeight < threshold) {
      onLoadMore();
    }
  } else {
    if (!scrollContainerNode) return;
    const {
      bottom: containerBottom
    } = scrollContainerNode.getBoundingClientRect();
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
  useWindow = false
}) {
  const sentinelRef = React.useRef(null);
  React.useEffect(() => {
    const params = {
      hasMore,
      isLoading,
      onLoadMore,
      scrollContainerNode,
      sentinelRef,
      threshold,
      useWindow
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
  return /*#__PURE__*/React.createElement("div", null, children, /*#__PURE__*/React.createElement("div", {
    ref: sentinelRef,
    "data-testid": "sentinel"
  }));
}
export default InfiniteScroll;
//# sourceMappingURL=InfiniteScroll.js.map