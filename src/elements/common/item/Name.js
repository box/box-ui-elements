// @flow
import React from 'react';
import ItemName from './ItemName';
import ItemDetails from './ItemDetails';
import { VIEW_SEARCH } from '../../../constants';
import type { View, BoxItem } from '../../../common/types/core';

import './NameCell.scss';

type Props = {
    canPreview: boolean,
    isTouch: boolean,
    item: BoxItem,
    onItemClick: (item: BoxItem | string) => void,
    onItemSelect?: (item: BoxItem, callback: Function) => void,
    rootId: string,
    setRef?: Function,
    showDetails: boolean,
    view: View,
};

const Name = ({
    canPreview = false,
    isTouch = false,
    item,
    onItemClick,
    onItemSelect,
    showDetails = true,
    rootId,
    setRef,
    view,
}: Props) => (
    <div className="be-item-name">
        <ItemName
            setRef={setRef}
            canPreview={canPreview}
            isTouch={isTouch}
            item={item}
            onClick={onItemClick}
            onFocus={onItemSelect}
        />
        {view === VIEW_SEARCH || showDetails ? (
            <ItemDetails item={item} onItemClick={onItemClick} rootId={rootId} view={view} />
        ) : null}
    </div>
);

export default Name;
