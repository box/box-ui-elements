import {
    AutofillContextProvider,
    MetadataInstanceForm,
    type FormValues,
    type JSONPatchOperations,
    type MetadataTemplateInstance,
} from '@box/metadata-editor';
import React from 'react';

export interface MetadataInstanceEditorProps {
    isBoxAiSuggestionsEnabled: boolean;
    isDeleteButtonDisabled: boolean;
    isUnsavedChangesModalOpen: boolean;
    onCancel: () => void;
    onDelete: (metadataInstance: MetadataTemplateInstance) => void;
    template: MetadataTemplateInstance;
    onSubmit: (values: FormValues, operations: JSONPatchOperations) => Promise<void>;
    setIsUnsavedChangesModalOpen: (isUnsavedChangesModalOpen: boolean) => void;
    onUnsavedChangesModalCancel: () => void;
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    isBoxAiSuggestionsEnabled,
    isDeleteButtonDisabled,
    isUnsavedChangesModalOpen,
    onDelete,
    onSubmit,
    setIsUnsavedChangesModalOpen,
    template,
    onCancel,
    onUnsavedChangesModalCancel,
}) => {
    const handleCancel = () => {
        onCancel();
    };

    console.log('template', template);

    return (
        <AutofillContextProvider isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}>
            <MetadataInstanceForm
                isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                isDeleteButtonDisabled={isDeleteButtonDisabled}
                isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                selectedTemplateInstance={template}
                onCancel={handleCancel}
                onSubmit={onSubmit}
                setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
                onDelete={onDelete}
                onUnsavedChangesModalCancel={onUnsavedChangesModalCancel}
            />
        </AutofillContextProvider>
    );
};

export default MetadataInstanceEditor;
