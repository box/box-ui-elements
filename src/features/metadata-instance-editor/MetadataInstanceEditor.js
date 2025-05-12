// @flow
import * as React from 'react';

import ScrollWrapper from '../../components/scroll-wrapper';

import Header from './Header';
import Instances from './Instances';
import EmptyContent from './EmptyContent';
import type { MetadataEditor, MetadataTemplate, MetadataCascadingPolicyData } from '../../common/types/metadata';
import type { JSONPatchOperations } from '../../common/types/api';
import MetadataInstanceEditorContext from './MetadataInstanceEditorContext';
import './MetadataInstanceEditor.scss';

type Props = {
    blurExceptionClassNames?: Array<string>,
    canAdd: boolean,
    canUseAIFolderExtraction?: boolean,
    canUseAIFolderExtractionAgentSelector?: Boolean,
    editors?: Array<MetadataEditor>,
    isCascadingPolicyApplicable?: boolean,
    isDropdownBusy?: boolean,
    onAdd?: (template: MetadataTemplate) => void,
    onModification?: (id: string, isDirty: boolean) => void,
    onRemove?: (id: string) => void,
    onSave?: (
        id: string,
        data: JSONPatchOperations,
        cascadingPolicy?: MetadataCascadingPolicyData,
        rawData: Object,
    ) => void,
    selectedTemplateKey?: string,
    templateFilters?: Array<string> | string,
    templates: Array<MetadataTemplate>,
    title?: React.Node,
};

const MetadataInstanceEditor = ({
    blurExceptionClassNames,
    canAdd,
    canUseAIFolderExtraction = false,
    canUseAIFolderExtractionAgentSelector = false,
    isCascadingPolicyApplicable = false,
    isDropdownBusy,
    editors = [],
    onModification,
    onRemove,
    onAdd,
    onSave,
    selectedTemplateKey,
    templates,
    title,
}: Props) => (
    <MetadataInstanceEditorContext.Provider value={{ blurExceptionClassNames }}>
        <div className="metadata-instance-editor">
            <Header
                canAdd={canAdd}
                editors={editors}
                isDropdownBusy={isDropdownBusy}
                onAdd={onAdd}
                templates={templates}
                title={title}
            />
            {editors.length === 0 ? (
                <EmptyContent canAdd={canAdd} />
            ) : (
                <ScrollWrapper>
                    <Instances
                        canUseAIFolderExtraction={canUseAIFolderExtraction}
                        canUseAIFolderExtractionAgentSelector={canUseAIFolderExtractionAgentSelector}
                        editors={editors}
                        isCascadingPolicyApplicable={isCascadingPolicyApplicable}
                        onModification={onModification}
                        onRemove={onRemove}
                        onSave={onSave}
                        selectedTemplateKey={selectedTemplateKey}
                    />
                </ScrollWrapper>
            )}
        </div>
    </MetadataInstanceEditorContext.Provider>
);

export default MetadataInstanceEditor;
