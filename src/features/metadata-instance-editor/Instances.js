// @flow
import * as React from 'react';

import Instance from './Instance';
import type { MetadataEditor, MetadataCascadingPolicyData } from '../../common/types/metadata';
import type { JSONPatchOperations } from '../../common/types/api';

type Props = {
    canUseAIFolderExtraction?: boolean,
    editors?: Array<MetadataEditor>,
    isCascadingPolicyApplicable?: boolean,
    onModification?: (id: string, isDirty: boolean) => void,
    onRemove?: (id: string) => void,
    onSave?: (
        id: string,
        data: JSONPatchOperations,
        cascadingPolicy?: MetadataCascadingPolicyData,
        rawData: Object,
    ) => void,
    selectedTemplateKey?: string,
};

const Instances = ({
    canUseAIFolderExtraction = false,
    isCascadingPolicyApplicable = false,
    editors = [],
    onModification,
    onRemove,
    onSave,
    selectedTemplateKey,
}: Props) =>
    editors.map<React.Element<typeof Instance>>(
        ({ isDirty = false, instance, hasError = false, template }: MetadataEditor) => {
            const { templateKey } = template;
            const isOpen = editors.length === 1 || templateKey === selectedTemplateKey;
            return (
                <Instance
                    canEdit={instance.canEdit}
                    canUseAIFolderExtraction={canUseAIFolderExtraction}
                    cascadePolicy={instance.cascadePolicy}
                    data={instance.data}
                    hasError={hasError}
                    id={instance.id}
                    isCascadingPolicyApplicable={isCascadingPolicyApplicable}
                    isDirty={isDirty}
                    isOpen={isOpen}
                    key={`${instance.id}-${templateKey}`}
                    onModification={onModification}
                    onSave={onSave}
                    onRemove={onRemove}
                    template={template}
                />
            );
        },
    );

export default Instances;
