/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import Sort from './Sort';
import { VIEW_SELECTED, VIEW_ERROR } from '../../constants';
import type { View, Collection } from '../../flowTypes';

type Props = {
    onSortChange: Function,
    getLocalizedMessage: Function,
    currentCollection: Collection,
    view: View
};

const SubHeaderRight = ({ view, currentCollection, onSortChange, getLocalizedMessage }: Props) => {
    const { sortBy, sortDirection, percentLoaded, items = [] }: Collection = currentCollection;

    return view === VIEW_ERROR || view === VIEW_SELECTED || items.length === 0 || !sortBy || !sortDirection
        ? null
        : <Sort
            isLoaded={percentLoaded === 100}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={onSortChange}
            getLocalizedMessage={getLocalizedMessage}
          />;
};

export default SubHeaderRight;
