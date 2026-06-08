// @flow
import * as React from 'react';
import noop from 'lodash/noop';

import type { AgentType } from '@box/box-ai-agent-selector';
import Form from '../../components/form-elements/form/Form';
import LoadingIndicatorWrapper from '../../components/loading-indicator/LoadingIndicatorWrapper';

import CascadePolicy from './CascadePolicy';
import TemplatedInstance from './TemplatedInstance';
import CustomInstance from './CustomInstance';
import MetadataInstanceConfirmDialog from './MetadataInstanceConfirmDialog';
import Footer from './Footer';
import type {
    MetadataCascadePolicy,
    MetadataFields,
    MetadataTemplate,
    MetadataFieldValue,
} from '../../common/types/metadata';

type Props = {
    canUseAIFolderExtraction: boolean,
    cascadePolicy: MetadataCascadePolicy,
    confirmationMessage: React.Node,
    data: MetadataFields,
    errors: { [string]: React.Node },
    isAIFolderExtractionEnabled: boolean,
    isBusy: boolean,
    isCascadingEnabled: boolean,
    isCascadingOverwritten: boolean,
    isCascadingPolicyApplicable?: boolean,
    isDirty: boolean,
    isEditing: boolean,
    isExistingCascadePolicy: boolean,
    isProperties: boolean,
    onAIAgentSelect: (agent: AgentType | null) => void,
    onAIFolderExtractionToggle: (value: boolean) => void,
    onCancel: () => void,
    onCascadeModeChange: (value: boolean) => void,
    onCascadeToggle: (value: boolean) => void,
    onConfirmCancel: () => void,
    onConfirmRemove: () => void,
    onFieldChange: (key: string, value: MetadataFieldValue, type: string) => void,
    onFieldRemove: (key: string) => void,
    onRemove: () => void,
    onSave: () => void,
    shouldConfirmRemove: boolean,
    shouldShowCascadeOptions: boolean,
    template: MetadataTemplate,
};

/**
 * Presentational interior for an editable metadata instance: the confirm-remove
 * dialog, the form with cascade policy + fields, and the save/remove footer.
 * All state and handlers are owned by the parent Instance and supplied via props.
 */
const EditableInstanceBody = ({
    canUseAIFolderExtraction,
    cascadePolicy = {},
    confirmationMessage,
    data,
    errors,
    isAIFolderExtractionEnabled,
    isBusy,
    isCascadingEnabled,
    isCascadingOverwritten,
    isCascadingPolicyApplicable,
    isDirty,
    isEditing,
    isExistingCascadePolicy,
    isProperties,
    onAIAgentSelect,
    onAIFolderExtractionToggle,
    onCancel,
    onCascadeModeChange,
    onCascadeToggle,
    onConfirmCancel,
    onConfirmRemove,
    onFieldChange,
    onFieldRemove,
    onRemove,
    onSave,
    shouldConfirmRemove,
    shouldShowCascadeOptions,
    template,
}: Props) => {
    if (shouldConfirmRemove) {
        return (
            <LoadingIndicatorWrapper isLoading={isBusy}>
                <MetadataInstanceConfirmDialog
                    confirmationMessage={confirmationMessage}
                    onCancel={onConfirmCancel}
                    onConfirm={onRemove}
                />
            </LoadingIndicatorWrapper>
        );
    }

    return (
        <LoadingIndicatorWrapper isLoading={isBusy}>
            <Form onValidSubmit={isDirty ? onSave : noop}>
                <div className="metadata-instance-editor-instance">
                    {isCascadingPolicyApplicable && (
                        <CascadePolicy
                            cascadePolicyConfiguration={cascadePolicy?.cascadePolicyConfiguration}
                            canEdit={isEditing && !!cascadePolicy.canEdit}
                            canUseAIFolderExtraction={canUseAIFolderExtraction}
                            isAIFolderExtractionEnabled={isAIFolderExtractionEnabled}
                            isCascadingEnabled={isCascadingEnabled}
                            isCascadingOverwritten={isCascadingOverwritten}
                            isCustomMetadata={isProperties}
                            isExistingCascadePolicy={isExistingCascadePolicy}
                            onAIAgentSelect={onAIAgentSelect}
                            onAIFolderExtractionToggle={onAIFolderExtractionToggle}
                            onCascadeModeChange={onCascadeModeChange}
                            onCascadeToggle={onCascadeToggle}
                            shouldShowCascadeOptions={shouldShowCascadeOptions}
                        />
                    )}
                    {isProperties ? (
                        <CustomInstance
                            canEdit={isEditing}
                            data={data}
                            onFieldChange={onFieldChange}
                            onFieldRemove={onFieldRemove}
                        />
                    ) : (
                        <TemplatedInstance
                            canEdit={isEditing}
                            data={data}
                            errors={errors}
                            isDisabled={isAIFolderExtractionEnabled}
                            onFieldChange={onFieldChange}
                            onFieldRemove={onFieldRemove}
                            template={template}
                        />
                    )}
                </div>
                {isEditing && <Footer onCancel={onCancel} onRemove={onConfirmRemove} showSave={isDirty} />}
            </Form>
        </LoadingIndicatorWrapper>
    );
};

export default EditableInstanceBody;
