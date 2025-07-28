import React, { useMemo, useState, useEffect } from 'react';
import { Selection } from 'react-aria-components';
import { FormattedMessage } from 'react-intl';
import { Text } from '@box/blueprint-web';

import type API from '../../../api';
import type { Collection } from '../../../common/types/core';
import type { MetadataQuery } from '../../../common/types/metadataQueries';
import CloseButton from '../../../components/close-button/CloseButton';
import messages from '../../../features/content-explorer/messages';

import './SubHeaderLeftMetadataViewV2.scss';

interface SubHeaderLeftMetadataViewV2Props {
    api?: API;
    currentCollection: Collection;
    metadataQuery?: MetadataQuery;
    metadataViewTitle?: string;
    onClearSelectedKeys?: () => void;
    selectedKeys: Selection;
}

const SubHeaderLeftMetadataViewV2 = (props: SubHeaderLeftMetadataViewV2Props) => {
    const { api, currentCollection, metadataQuery, metadataViewTitle, selectedKeys, onClearSelectedKeys } = props;
    const [ancestorFolderName, setAncestorFolderName] = useState<string | null>(null);

    // Fetch ancestor folder name with metadataQuery.ancestor_folder_id
    useEffect(() => {
        if (api && metadataQuery?.ancestor_folder_id) {
            if (metadataQuery.ancestor_folder_id === '0') {
                setAncestorFolderName('All Files');
            } else {
                const folderAPI = api.getFolderAPI(false);

                folderAPI.getFolderFields(
                    metadataQuery.ancestor_folder_id,
                    (folderInfo: { name?: string }) => {
                        setAncestorFolderName(folderInfo.name ?? null);
                    },
                    () => {
                        setAncestorFolderName(null);
                    },
                    { fields: ['name'] },
                );
            }
        } else {
            setAncestorFolderName(null);
        }
    }, [api, metadataQuery?.ancestor_folder_id]);

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
            return selectedItem?.name;
        }
        // Case 2: Multiple selected items - show count
        if (selectedCount > 1) {
            return <FormattedMessage {...messages.numFilesSelected} values={{ numSelected: selectedCount }} />;
        }
        return '';
    }, [currentCollection.items, selectedKeys]);

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
            {metadataViewTitle ?? ancestorFolderName}
        </Text>
    );
};

export default SubHeaderLeftMetadataViewV2;
