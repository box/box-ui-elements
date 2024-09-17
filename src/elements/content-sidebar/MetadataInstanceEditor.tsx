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
    template: MetadataTemplateInstance | MetadataTemplate;
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
