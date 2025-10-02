/**
 * @flow
 * @file Pagination component
 * @author Box
 */

import * as React from 'react';
import MarkerBasedPagination from './MarkerBasedPagination';
import OffsetBasedPagination from './OffsetBasedPagination';
import './Pagination.scss';

type Props = {
    hasNextMarker?: boolean,
    hasPrevMarker?: boolean,
    offset?: number,
    onMarkerBasedPageChange?: Function,
    onOffsetChange?: Function,
    pageSize?: number,
    totalCount?: number,
};

const Pagination = ({ hasNextMarker, hasPrevMarker, onMarkerBasedPageChange, ...rest }: Props) => {
    if (hasNextMarker || hasPrevMarker) {
        return (
            <MarkerBasedPagination
                hasNextMarker={hasNextMarker}
                hasPrevMarker={hasPrevMarker}
                onMarkerBasedPageChange={onMarkerBasedPageChange}
            />
        );
    }

    return <OffsetBasedPagination {...rest} />;
};

export default Pagination;
