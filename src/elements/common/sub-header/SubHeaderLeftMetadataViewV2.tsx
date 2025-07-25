import React, { useMemo } from 'react';
import { Selection } from 'react-aria-components';
import CloseButton from '../../../components/close-button/CloseButton';
import type { Collection } from '../../../common/types/core';

import './SubHeaderLeftMetadataViewV2.scss';

interface SubHeaderLeftMetadataViewV2Props {
    currentCollection: Collection;
    title?: string;
    selectedKeys: Selection;
    onClearSelectedKeys?: () => void;
}

const SubHeaderLeftMetadataViewV2 = (props: SubHeaderLeftMetadataViewV2Props) => {
    const { currentCollection, title, selectedKeys, onClearSelectedKeys } = props;

    const selectedItemText = useMemo(() => {
        const selectedCount = selectedKeys === 'all' ? currentCollection.items.length : selectedKeys.size;

        if (selectedCount === 0) {
            return '';
        }

        // Case 1: Single selected item - show item name
        if (selectedCount === 1) {
            const selectedKey =
                selectedKeys === 'all' ? currentCollection.items[0].id : selectedKeys.values().next().value;
            const selectedItem = currentCollection.items.find(item => item.id === selectedKey);
            return selectedItem?.name;
        }
        // Case 2: Multiple selected items - show count
        if (selectedCount > 1) {
            return `${selectedCount} files selected`;
        }
        return '';
    }, [currentCollection.items, selectedKeys]);

    // Case 1 and 2: selected item text with X button
    if (selectedItemText) {
        return (
            <div className="be-sub-header-left-selected">
                <CloseButton onClick={onClearSelectedKeys} className="be-sub-header-left-selected-close-button" />
                <span>{selectedItemText}</span>
            </div>
        );
    }

    // Case 3: No selected items - show title if provided
    return (
        <div className="be-sub-header-left-title">
            <span>{title || 'Metadata View'}</span>
        </div>
    );
};

export default SubHeaderLeftMetadataViewV2;
