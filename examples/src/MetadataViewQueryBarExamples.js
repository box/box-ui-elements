// @flow
import * as React from 'react';

import QueryBar from '../../src/features/query-bar/QueryBar';
import type { ColumnType } from '../../src/features/query-bar/flowTypes';
import { columns } from '../../src/features/query-bar/components/fixtures';

type Props = {
    activeTemplate?: MetadataTemplate,
    onTemplateChange?: Function,
    templates?: Array<MetadataTemplate>,
    visibleColumns?: Array<ColumnType>,
};

const MetadataViewQueryBarExamples = ({ activeTemplate, onTemplateChange, templates, visibleColumns }: Props) => (
    <QueryBar
        activeTemplate={activeTemplate}
        columns={columns}
        onColumnChange={() => {}}
        onTemplateChange={onTemplateChange}
        templates={templates}
        visibleColumns={visibleColumns || []}
    />
);

export default MetadataViewQueryBarExamples;
