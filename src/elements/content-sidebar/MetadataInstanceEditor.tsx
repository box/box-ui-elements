import {
    MetadataInstanceForm,
    type MetadataTemplateInstance,
    UnsavedChangesModal,
    type MetadataTemplate,
} from '@box/metadata-editor';
import React from 'react';

export interface MetadataInstanceEditorProps {
    isBoxAiSuggestionsEnabled: boolean;
    isUnsavedChangesModalOpen: boolean;
    onDelete: (metadataInstance: MetadataTemplateInstance) => void;
    template: MetadataTemplateInstance | MetadataTemplate;
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    isBoxAiSuggestionsEnabled,
    isUnsavedChangesModalOpen,
    onDelete,
    template,
}) => {
    const handleSubmit = () => {
        // TODO in a future PR
    };
    const handleCancel = () => {
        // TODO in a future PR
    };

    return (
        <>
            <MetadataInstanceForm
                isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                isLoading={false}
                selectedTemplateInstance={template}
                onCancel={handleCancel}
                onDelete={onDelete}
                onSubmit={handleSubmit}
            />
            <UnsavedChangesModal
                onDismiss={handleCancel}
                onSaveAndContinue={handleSubmit}
                open={isUnsavedChangesModalOpen}
            />
        </>
    );
};

export default MetadataInstanceEditor;
