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
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    isBoxAiSuggestionsEnabled,
    isUnsavedChangesModalOpen,
    template,
}) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const handleSubmit = () => {}; // TODO in a future PR
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const handleCancel = () => {}; // TODO in a future PR
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const handleDelete = () => {}; // TODO in a future PR

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
            {isUnsavedChangesModalOpen && (
                <UnsavedChangesModal onDismiss={handleCancel} onSaveAndContinue={handleSubmit} />
            )}
        </>
    );
};

export default MetadataInstanceEditor;
