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
};

const Instances = ({ isCascadingPolicyApplicable = false, editors = [], onModification, onRemove, onSave }: Props) =>
    editors.map<React.Element<typeof Instance>>(
        ({ isDirty = false, instance, hasError = false, template }: MetadataEditor) => (
            <Instance
                canEdit={instance.canEdit}
                cascadePolicy={instance.cascadePolicy}
                data={instance.data}
                hasError={hasError}
                id={instance.id}
                isCascadingPolicyApplicable={isCascadingPolicyApplicable}
                isDirty={isDirty}
                isOpen={editors.length === 1}
                key={`${instance.id}-${template.templateKey}`}
                onModification={onModification}
                onSave={onSave}
                onRemove={onRemove}
                template={template}
            />
        ),
    );

export default Instances;
