// @flow
import * as React from 'react';

import QueryBar from '../../src/features/query-bar/QueryBar';
import type { ColumnType, ConditionType } from '../../src/features/query-bar/flowTypes';
import {
    columnForItemName,
    columnForItemLastUpdated,
    columnWithEnumType,
    columnForDateType,
    columnWithMultiEnumType,
    columnWithNumberType,
    columnWithFloatType,
    columnForTemplateFieldName,
} from '../../src/features/query-bar/components/fixtures';
import type { MetadataTemplate } from '../../src/common/types/metadata';

type Props = {
    activeTemplate?: MetadataTemplate,
    conditions: Array<ConditionType>,
    onTemplateChange?: Function,
    templates?: Array<MetadataTemplate>,
    visibleColumns?: Array<ColumnType>,
};

const columns = [
    columnForItemName,
    columnForItemLastUpdated,
    columnWithEnumType,
    columnForDateType,
    columnWithMultiEnumType,
    columnWithNumberType,
    columnWithFloatType,
    columnForTemplateFieldName,
];

/* eslint-disable no-console */
const MetadataViewQueryBarExamples = ({ activeTemplate, onTemplateChange, templates, visibleColumns }: Props) => (
    <QueryBar
        activeTemplate={activeTemplate}
        columns={columns}
        conditions={[]}
        onColumnChange={() => {}}
        onFilterChange={newConditions => console.log({ newConditions })}
        onTemplateChange={onTemplateChange}
        templates={templates}
        visibleColumns={visibleColumns || []}
    />
);

export default MetadataViewQueryBarExamples;
