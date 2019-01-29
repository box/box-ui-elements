// @flow
import * as React from 'react';

import Instance from './Instance';
import type { Editor, JSONPatchOperations, CascadingPolicyData } from './flowTypes';

type Props = {
    editors?: Array<Editor>,
    isCascadingPolicyApplicable?: boolean,
    onModification?: (id: string, isDirty: boolean) => void,
    onRemove?: (id: string) => void,
    onSave?: (id: string, data: JSONPatchOperations, cascadingPolicy?: CascadingPolicyData, rawData: Object) => void,
};

const Instances = ({ isCascadingPolicyApplicable = false, editors = [], onModification, onRemove, onSave }: Props) =>
    editors.map<React.Element<typeof Instance>>(({ isDirty = false, instance, hasError = false, template }: Editor) => (
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
    ));

export default Instances;
