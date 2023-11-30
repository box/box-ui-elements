// @flow
import * as React from 'react';

import Instance from './Instance';
import type { MetadataEditor, MetadataCascadingPolicyData } from '../../common/types/metadata';
import type { JSONPatchOperations } from '../../common/types/api';

type Props = {
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
                    key={`${instance.id}-${templateKey}`}
                    canEdit={instance.canEdit}
                    cascadePolicy={instance.cascadePolicy}
                    data={instance.data}
                    hasError={hasError}
                    id={instance.id}
                    isCascadingPolicyApplicable={isCascadingPolicyApplicable}
                    isDirty={isDirty}
                    isOpen={isOpen}
                    onModification={onModification}
                    onRemove={onRemove}
                    onSave={onSave}
                    template={template}
                />
            );
        },
    );

export default Instances;
