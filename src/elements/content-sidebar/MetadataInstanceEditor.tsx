import { MetadataInstanceForm, type MetadataTemplateInstance } from '@box/metadata-editor';
import noop from 'lodash/noop';
import React from 'react';

export interface MetadataInstanceEditorProps {
    isBoxAiSuggestionsEnabled: boolean;
    isUnsavedChangesModalOpen: boolean;
    template: MetadataTemplateInstance;
    onCancel: () => void;
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    isBoxAiSuggestionsEnabled,
    isUnsavedChangesModalOpen,
    template,
    onCancel,
}) => {
    const handleSubmit = () => {
        // TODO in a future PR
    };
    const handleCancel = () => {
        onCancel();
    };
    const handleDelete = () => {
        // TODO in a future PR
    };

    return (
        <>
            <MetadataInstanceForm
                isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                isLoading={false}
                selectedTemplateInstance={template}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onSubmit={handleSubmit}
                isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                setIsUnsavedChangesModalOpen={noop}
            />
        </>
    );
};

export default MetadataInstanceEditor;
