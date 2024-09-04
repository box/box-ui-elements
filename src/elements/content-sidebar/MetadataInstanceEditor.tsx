import { MetadataInstanceForm, MetadataTemplateInstance, UnsavedChangesModal } from '@box/metadata-editor';
import React from 'react';

export interface MetadataInstanceEditorProps {
    isAiLoading: boolean;
    isBoxAiSuggestionsEnabled: boolean;
    isDismissModalOpen: boolean;
    template: MetadataTemplateInstance;
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    isAiLoading,
    isBoxAiSuggestionsEnabled,
    isDismissModalOpen,
    template,
}) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const handleSave = () => {}; // ADOPT-4412
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onCancel = () => {}; // ADOPT-4413
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onDelete = () => {}; // ADOPT-4416

    return (
        <>
            <MetadataInstanceForm
                isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                isLoading={isAiLoading}
                selectedTemplateInstance={template}
                onCancel={onCancel}
                onDelete={onDelete}
                onSubmit={handleSave}
            />
            {isDismissModalOpen && <UnsavedChangesModal onDismiss={onCancel} onSaveAndContinue={handleSave} />}
        </>
    );
};

export default MetadataInstanceEditor;
