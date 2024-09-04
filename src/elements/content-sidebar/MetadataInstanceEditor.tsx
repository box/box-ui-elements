import { MetadataInstanceForm, type MetadataTemplateInstance, UnsavedChangesModal } from '@box/metadata-editor';
import React from 'react';

export interface MetadataInstanceEditorProps {
    isBoxAiSuggestionsEnabled: boolean;
    isDismissModalOpen: boolean;
    template: MetadataTemplateInstance;
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    isBoxAiSuggestionsEnabled,
    isDismissModalOpen,
    template,
}) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const handleSave = () => {}; // TODO in a future PR
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onCancel = () => {}; // TODO in a future PR
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onDelete = () => {}; // TODO in a future PR

    return (
        <>
            <MetadataInstanceForm
                isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                isLoading={false}
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
