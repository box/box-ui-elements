// @flow
import * as React from 'react';

import QueryBar from '../../src/features/metadata-view/components/QueryBar';
import type { Template } from '../../src/features/metadata-instance-editor/flowTypes';
import type { ColumnType } from '../../src/features/metadata-view/flowTypes';

type Props = {
    activeTemplate?: Template,
    onTemplateChange?: Function,
    templates?: Array<Template>,
    visibleColumns?: Array<ColumnType>,
};

const MetadataViewQueryBarExamples = ({ activeTemplate, onTemplateChange, templates, visibleColumns }: Props) => (
    <QueryBar
        activeTemplate={activeTemplate}
        onTemplateChange={onTemplateChange}
        onColumnChange={() => {}}
        templates={templates}
        visibleColumns={visibleColumns || []}
    />
);

export default MetadataViewQueryBarExamples;
