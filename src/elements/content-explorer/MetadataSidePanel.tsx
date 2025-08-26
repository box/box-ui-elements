import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { IconButton, SidePanel, Text, useNotification } from '@box/blueprint-web';
import { XMark } from '@box/blueprint-web-assets/icons/Fill/index';
import { FileDefault } from '@box/blueprint-web-assets/icons/Line/index';
import {
    AutofillContextProvider,
    FormValues,
    JSONPatchOperations,
    MetadataInstance,
    MetadataInstanceForm,
    type MetadataTemplateField,
} from '@box/metadata-editor';

import type { Selection } from 'react-aria-components';
import type { BoxItem, Collection } from '../../common/types/core';
import type { MetadataTemplate } from '../../common/types/metadata';
import { useTemplateInstance, useSelectedItemText } from './utils';

import messages from '../common/messages';

import './MetadataSidePanel.scss';

export interface MetadataSidePanelProps {
    currentCollection: Collection;
    getOperations: (
        item: BoxItem,
        templateOldFields: MetadataTemplateField[],
        templateNewFields: MetadataTemplateField[],
    ) => JSONPatchOperations;
    metadataTemplate: MetadataTemplate;
    onClose: () => void;
    onUpdate: (
        file: BoxItem,
        operations: JSONPatchOperations,
        successCallback?: () => void,
        errorCallback?: ErrorCallback,
    ) => Promise<void>;
    refreshCollection: () => void;
    selectedItemIds: Selection;
}

const MetadataSidePanel = ({
    currentCollection,
    getOperations,
    metadataTemplate,
    onClose,
    onUpdate,
    refreshCollection,
    selectedItemIds,
}: MetadataSidePanelProps) => {
    const { addNotification } = useNotification();
    const { formatMessage } = useIntl();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState<boolean>(false);

    const selectedItemText = useSelectedItemText(currentCollection, selectedItemIds);
    const selectedItems =
        selectedItemIds === 'all'
            ? currentCollection.items
            : currentCollection.items.filter(item => selectedItemIds.has(item.id));
    const templateInstance = useTemplateInstance(metadataTemplate, selectedItems, isEditing);

    const handleMetadataInstanceEdit = () => {
        setIsEditing(true);
    };

    const handleMetadataInstanceFormCancel = () => {
        setIsEditing(false);
    };

    const handleMetadataInstanceFormDiscardUnsavedChanges = () => {
        setIsUnsavedChangesModalOpen(false);
        setIsEditing(false);
    };

    const handleUpdateMetadataSuccess = () => {
        addNotification({
            closeButtonAriaLabel: formatMessage(messages.close),
            sensitivity: 'foreground',
            styledText: formatMessage(messages.metadataUpdateSuccessNotification, {
                numSelected: selectedItems.length,
            }),
            typeIconAriaLabel: formatMessage(messages.success),
            variant: 'success',
        });
        setIsEditing(false);
        refreshCollection();
    };

    const handleUpdateMetadataError = () => {
        addNotification({
            closeButtonAriaLabel: formatMessage(messages.close),
            sensitivity: 'foreground',
            styledText: formatMessage(messages.metadataUpdateErrorNotification),
            typeIconAriaLabel: formatMessage(messages.error),
            variant: 'error',
        });
    };

    const handleMetadataInstanceFormSubmit = async (values: FormValues, operations: JSONPatchOperations) => {
        if (selectedItems.length === 1) {
            await onUpdate(selectedItems[0], operations, handleUpdateMetadataSuccess, handleUpdateMetadataError);
        } else {
            const { fields: templateNewFields } = values.metadata;
            const { fields: templateOldFields } = templateInstance;

            try {
                // Process items sequentially to avoid conflicts
                await selectedItems.reduce(async (previousPromise, item) => {
                    await previousPromise;

                    const ops = getOperations(item, templateOldFields, templateNewFields);
                    await onUpdate(item, ops);
                }, Promise.resolve());
                handleUpdateMetadataSuccess();
            } catch (error) {
                handleUpdateMetadataError();
            }
        }
    };

    return (
        <SidePanel variant="persistent">
            <SidePanel.Header>
                <div>
                    <Text as="span" variant="titleLarge">
                        {formatMessage(messages.sidebarMetadataTitle)}
                    </Text>
                    <div className="bce-MetadataSidePanel-subtitle">
                        <FileDefault />
                        <Text as="span" color="textOnLightSecondary" variant="subtitle">
                            {selectedItemText}
                        </Text>
                    </div>
                </div>
                <IconButton aria-label={formatMessage(messages.close)} icon={XMark} onClick={onClose} size="large" />
            </SidePanel.Header>
            <SidePanel.ScrollableContainer>
                <div className="bce-MetadataSidePanel-content">
                    <AutofillContextProvider fetchSuggestions={null} isAiSuggestionsFeatureEnabled={false}>
                        {isEditing ? (
                            <MetadataInstanceForm
                                areAiSuggestionsAvailable={false}
                                isAiSuggestionsFeatureEnabled={false}
                                isBetaLanguageEnabled={false}
                                isDeleteButtonDisabled={true}
                                isDeleteConfirmationModalCheckboxEnabled={false}
                                isLargeFile={false}
                                isMultilevelTaxonomyFieldEnabled={false}
                                isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                                selectedTemplateInstance={templateInstance}
                                onCancel={handleMetadataInstanceFormCancel}
                                onChange={null}
                                onDelete={null}
                                onDiscardUnsavedChanges={handleMetadataInstanceFormDiscardUnsavedChanges}
                                onSubmit={handleMetadataInstanceFormSubmit}
                                setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
                                taxonomyOptionsFetcher={null}
                            />
                        ) : (
                            <MetadataInstance
                                areAiSuggestionsAvailable={false}
                                isAiSuggestionsFeatureEnabled={false}
                                isBetaLanguageEnabled={false}
                                onEdit={handleMetadataInstanceEdit}
                                templateInstance={templateInstance}
                                taxonomyNodeFetcher={null}
                            />
                        )}
                    </AutofillContextProvider>
                </div>
            </SidePanel.ScrollableContainer>
        </SidePanel>
    );
};

export default MetadataSidePanel;
