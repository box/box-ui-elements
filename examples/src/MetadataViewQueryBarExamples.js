// @flow
import * as React from 'react';

import QueryBar from '../../src/features/query-bar/QueryBar';
import type { ColumnType, ConditionType } from '../../src/features/query-bar/flowTypes';
import { columns, conditions } from '../../src/features/query-bar/components/fixtures';

type Props = {
    activeTemplate?: MetadataTemplate,
    conditions: Array<ConditionType>,
    onTemplateChange?: Function,
    templates?: Array<MetadataTemplate>,
    visibleColumns?: Array<ColumnType>,
};

/* eslint-disable no-console */
const MetadataViewQueryBarExamples = ({ activeTemplate, onTemplateChange, templates, visibleColumns }: Props) => (
    <QueryBar
        activeTemplate={activeTemplate}
        columns={columns}
        conditions={conditions}
        onColumnChange={() => {}}
        onFilterChange={newConditions => console.log({ newConditions })}
        onTemplateChange={onTemplateChange}
        templates={templates}
        visibleColumns={visibleColumns || []}
    />
);

export default MetadataViewQueryBarExamples;
