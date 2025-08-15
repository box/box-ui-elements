import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { IconButton, SidePanel, Text } from '@box/blueprint-web';
import { XMark } from '@box/blueprint-web-assets/icons/Fill/index';
import { FileDefault } from '@box/blueprint-web-assets/icons/Line/index';
import {
    AutofillContextProvider,
    FormValues,
    JSONPatchOperations,
    MetadataInstance,
    MetadataInstanceForm,
} from '@box/metadata-editor';

import type { Selection } from 'react-aria-components';
import type { Collection } from '../../common/types/core';
import type { MetadataTemplate } from '../../common/types/metadata';
import { getTemplateInstance, useSelectedItemText } from './utils';

import messages from '../common/messages';

import './MetadataSidePanel.scss';

export interface MetadataSidePanelProps {
    currentCollection: Collection;
    closeMetadataSidePanel: () => void;
    metadataTemplate: MetadataTemplate;
    selectedItemIds: Selection;
}

const MetadataSidePanel = ({
    currentCollection,
    closeMetadataSidePanel,
    selectedItemIds,
    metadataTemplate,
}: MetadataSidePanelProps) => {
    const { formatMessage } = useIntl();
    const [editingTemplate, setEditingTemplate] = useState<boolean>(false);
    const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState<boolean>(false);

    const selectedItemText = useSelectedItemText(currentCollection, selectedItemIds);
    const selectedItems =
        selectedItemIds === 'all'
            ? currentCollection.items
            : currentCollection.items.filter(item => selectedItemIds.has(item.id));
    const templateInstance = getTemplateInstance(metadataTemplate, selectedItems);

    const handleMetadataInstanceEdit = () => {
        setEditingTemplate(true);
    };

    const handleMetadataInstanceFormCancel = () => {
        setEditingTemplate(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleMetadataInstanceFormChange = (values: FormValues) => {
        // TODO: Implement on form change
    };

    const handleMetadataInstanceFormDiscardUnsavedChanges = () => {
        setIsUnsavedChangesModalOpen(false);
        setEditingTemplate(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleMetadataInstanceFormSubmit = async (values: FormValues, operations: JSONPatchOperations) => {
        // TODO: Implement onSave callback
    };

    return (
        <SidePanel variant="persistent">
            <SidePanel.Header>
                <div className="bce-sidepanel-header">
                    <div className="bce-sidepanel-title-container">
                        <Text as="span" variant="titleLarge">
                            {formatMessage(messages.sidebarMetadataTitle)}
                        </Text>
                        <div className="bce-sidepanel-subtitle">
                            <FileDefault />
                            <Text as="span" color="textOnLightSecondary" variant="subtitle">
                                {selectedItemText}
                            </Text>
                        </div>
                    </div>
                    <IconButton
                        aria-label={formatMessage(messages.clearSelection)}
                        icon={XMark}
                        onClick={closeMetadataSidePanel}
                        size="large"
                    />
                </div>
            </SidePanel.Header>
            <SidePanel.ScrollableContainer>
                <div className="bce-sidepanel-content">
                    <AutofillContextProvider fetchSuggestions={null} isAiSuggestionsFeatureEnabled={false}>
                        {editingTemplate ? (
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
                                onChange={handleMetadataInstanceFormChange}
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
