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
    templateFilters?: MetadataTemplateFilters,
};

const Instances = ({
    isCascadingPolicyApplicable = false,
    editors = [],
    onModification,
    onRemove,
    onSave,
    templateFilters,
}: Props) =>
    editors.map<React.Element<typeof Instance>>(
        ({ isDirty = false, instance, hasError = false, template }: MetadataEditor) => {
            const { templateKey } = template;
            let isOpen = false;
            let includedFieldIds;
            // Open the included template by default, and only display the included fields in the template
            if (templateFilters) {
                isOpen = templateKey === templateFilters.includedTemplateKey;
                if (isOpen && templateFilters.includedFieldIds) {
                    includedFieldIds = new Set(templateFilters.includedFieldIds);
                }
            } else if (editors.length === 1) {
                isOpen = true;
            }
            return (
                <Instance
                    canEdit={instance.canEdit}
                    cascadePolicy={instance.cascadePolicy}
                    data={instance.data}
                    hasError={hasError}
                    id={instance.id}
                    includedFieldIds={includedFieldIds}
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
