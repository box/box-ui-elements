// @flow
import * as React from 'react';
import InfiniteLoader from '@box/react-virtualized/dist/commonjs/InfiniteLoader';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

type Props = {
    infiniteLoaderProps: {
        isRowLoaded: Function,
        loadMoreRows: Function,
        minimumBatchSize?: number,
        rowCount: number,
        threshold?: number,
    },
};

function withInfiniteLoader(WrappedComponent: Class<React.Component<{ onRowsRendered?: Function }, any>>) {
    const InfiniteLoaderComponent = ({
        infiniteLoaderProps: { isRowLoaded, loadMoreRows, minimumBatchSize, rowCount, threshold },
        ...rest
    }: Props) => (
        <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreRows}
            minimumBatchSize={minimumBatchSize}
            rowCount={rowCount}
            threshold={threshold}
        >
            {({ onRowsRendered, registerChild }) => (
                <WrappedComponent {...rest} ref={registerChild} onRowsRendered={onRowsRendered} />
            )}
        </InfiniteLoader>
    );

    InfiniteLoaderComponent.displayName = `WithInfiniteLoader(${getDisplayName(WrappedComponent)})`;

    return InfiniteLoaderComponent;
}

export default withInfiniteLoader;
