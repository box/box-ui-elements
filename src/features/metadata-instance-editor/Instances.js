// @flow
import * as React from 'react';

import Instance from './Instance';

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
    templateFilters?: Set<string>,
};

const Instances = ({
    isCascadingPolicyApplicable = false,
    editors = [],
    onModification,
    onRemove,
    onSave,
    selectedTemplateKey,
    templateFilters,
}: Props) =>
    editors.map<React.Element<typeof Instance>>(
        ({ isDirty = false, instance, hasError = false, template }: MetadataEditor) => {
            const { templateKey } = template;
            // Open the included template by default, and only display the included fields in the template
            const isOpen = templateKey === selectedTemplateKey || (!selectedTemplateKey && editors.length === 1);
            return (
                <Instance
                    canEdit={instance.canEdit}
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
                    templateFilters={templateFilters}
                />
            );
        },
    );

export default Instances;
