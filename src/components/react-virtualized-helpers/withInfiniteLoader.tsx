import * as React from 'react';
import InfiniteLoader from '@box/react-virtualized/dist/commonjs/InfiniteLoader';

/** A single row index, as passed to `isRowLoaded`. */
interface Index {
    index: number;
}

/** An inclusive range of row indices, as passed to `loadMoreRows` and `onRowsRendered`. */
interface IndexRange {
    startIndex: number;
    stopIndex: number;
}

type OnRowsRendered = (params: IndexRange) => void;

type WithOnRowsRendered = {
    onRowsRendered?: OnRowsRendered;
};

function getDisplayName(WrappedComponent: React.ComponentClass<WithOnRowsRendered>) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export interface InfiniteLoaderConfig {
    /** Returns a truthy value when the requested row has loaded. */
    isRowLoaded: (params: Index) => unknown;
    /** Callback invoked when more rows must be loaded. Its result may resolve after loading finishes. */
    loadMoreRows: (params: IndexRange) => PromiseLike<unknown> | void;
    /** Minimum number of rows to load in each batch. */
    minimumBatchSize?: number;
    /** Total number of rows in the list. */
    rowCount: number;
    /** Number of rows from the rendered range at which to start loading. */
    threshold?: number;
}

export interface WithInfiniteLoaderProps {
    /** Configuration passed to the react-virtualized InfiniteLoader. */
    infiniteLoaderProps: InfiniteLoaderConfig;
}

function withInfiniteLoader<P extends WithOnRowsRendered>(WrappedComponent: React.ComponentClass<P>) {
    const InfiniteLoaderComponent = ({
        infiniteLoaderProps: { isRowLoaded, loadMoreRows, minimumBatchSize, rowCount, threshold },
        ...rest
    }: WithInfiniteLoaderProps & Omit<P, keyof WithOnRowsRendered>) => (
        <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreRows}
            minimumBatchSize={minimumBatchSize}
            rowCount={rowCount}
            threshold={threshold}
        >
            {({ onRowsRendered, registerChild }) => (
                <WrappedComponent {...(rest as unknown as P)} ref={registerChild} onRowsRendered={onRowsRendered} />
            )}
        </InfiniteLoader>
    );

    InfiniteLoaderComponent.displayName = `WithInfiniteLoader(${getDisplayName(WrappedComponent)})`;

    return InfiniteLoaderComponent;
}

export default withInfiniteLoader;
