## Description

Simple InfiniteScroll adapted from https://github.com/jaredpalmer/react-simple-infinite-scroll.

Use case: handle infinite scrolling when the total number of items is unknown until all items have been fetched.

NOTE: These examples aren't functional and are just meant to serve as an example on how to use it.

## Examples

### Using window as scroll container

```js
const InfiniteScroll = require('./InfiniteScroll').default;

let items = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
const onLoadMore = () => {
  // add more "things" to items
};
const isLoading = false;
const hasMore = true;

<InfiniteScroll
  hasMore={hasMore}
  isLoading={isLoading}
  onLoadMore={onLoadMore}
  useWindow={true}
>
  <React.Fragment>
    {items.map((item, i) => (
      <div key={i}>{item}</div>
    ))}
  </React.Fragment>
  {isLoading && <div>Loading Indicator...</div>}
  {!hasMore && <div>End of items message...</div>}
</InfiniteScroll>;
```

### Using custom scroll container

```js
const ScrollWrapper = require('../scroll-wrapper/ScrollWrapper').default;
const InfiniteScroll = require('./InfiniteScroll').default;

let items = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
const onLoadMore = () => {
  // add more "things" to items
};
let scrollRef = null;
const isLoading = false;
const hasMore = true;

// Parent div should have set height and overflow: scroll
<div style={{ height: '200px', overflow: 'scroll' }}>
  <ScrollWrapper scrollRefFn={el => (scrollRef = el)}>
    <InfiniteScroll
      hasMore={hasMore}
      isLoading={isLoading}
      onLoadMore={onLoadMore}
      useWindow={false}
      scrollContainerRef={scrollRef}
    >
      <React.Fragment>
        {items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </React.Fragment>
      {isLoading && <div>Loading Indicator...</div>}
      {!hasMore && <div>End of items message...</div>}
    </InfiniteScroll>
  </ScrollWrapper>
</div>;
```
