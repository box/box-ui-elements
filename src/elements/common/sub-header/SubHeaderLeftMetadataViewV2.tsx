import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Text } from '@box/blueprint-web';
import type { Selection } from 'react-aria-components';
import type API from '../../../api';
import type { Collection } from '../../../common/types/core';
import CloseButton from '../../../components/close-button/CloseButton';
import messages from '../messages';
import './SubHeaderLeftMetadataViewV2.scss';

interface SubHeaderLeftMetadataViewV2Props {
    api?: API;
    currentCollection: Collection;
    metadataAncestorFolderName?: string | null;
    metadataViewTitle?: string;
    onClearSelectedKeys?: () => void;
    selectedKeys: Selection;
}

const SubHeaderLeftMetadataViewV2 = (props: SubHeaderLeftMetadataViewV2Props) => {
    const { currentCollection, metadataAncestorFolderName, metadataViewTitle, onClearSelectedKeys, selectedKeys } =
        props;
    const { formatMessage } = useIntl();

    // Generate selected item text based on selected keys
    const selectedItemText = useMemo(() => {
        const selectedCount = selectedKeys === 'all' ? currentCollection.items.length : selectedKeys.size;

        if (typeof selectedCount !== 'number' || selectedCount === 0) {
            return '';
        }

        // Case 1: Single selected item - show item name
        if (selectedCount === 1) {
            const selectedKey =
                selectedKeys === 'all' ? currentCollection.items[0].id : selectedKeys.values().next().value;
            const selectedItem = currentCollection.items.find(item => item.id === selectedKey);
            if (typeof selectedItem?.name === 'string') {
                return selectedItem.name as string;
            }
        }
        // Case 2: Multiple selected items - show count
        if (selectedCount > 1) {
            return formatMessage(messages.numFilesSelected, { numSelected: selectedCount });
        }
        return '';
    }, [currentCollection.items, formatMessage, selectedKeys]);

    // Case 1 and 2: selected item text with X button
    if (selectedItemText) {
        return (
            <div className="be-sub-header-left-selected-container">
                <CloseButton onClick={onClearSelectedKeys} className="be-sub-header-left-selected-close-button" />
                <Text as="p">{selectedItemText}</Text>
            </div>
        );
    }

    // Case 3: No selected items - show title if provided, otherwise show ancestor folder name
    return (
        <Text className="be-sub-header-left-title" as="h1" variant="titleXLarge">
            {metadataViewTitle ?? metadataAncestorFolderName}
        </Text>
    );
};

export default SubHeaderLeftMetadataViewV2;
