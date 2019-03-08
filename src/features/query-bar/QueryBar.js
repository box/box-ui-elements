// @flow
import * as React from 'react';

import TemplateButton from './components/TemplateButton';
import FilterButton from './components/filter/FilterButton';
import ColumnButton from './components/ColumnButton';

import type { ColumnType, ConditionType } from './flowTypes';

import './styles/QueryBarButtons.scss';

type Props = {
    activeTemplate?: MetadataTemplate,
    columns?: Array<ColumnType>,
    conditions: Array<ConditionType>,
    onColumnChange?: Function,
    onFilterChange?: Function,
    onTemplateChange?: Function,
    templates?: Array<MetadataTemplate>,
};

const QueryBar = ({
    activeTemplate,
    columns,
    conditions,
    onColumnChange,
    onFilterChange,
    onTemplateChange,
    templates,
}: Props) => (
    <section className="metadata-view-query-bar">
        <TemplateButton activeTemplate={activeTemplate} onTemplateChange={onTemplateChange} templates={templates} />
        <FilterButton columns={columns} conditions={conditions} onFilterChange={onFilterChange} />
        <ColumnButton columns={columns} onColumnChange={onColumnChange} template={activeTemplate} />
    </section>
);

export default QueryBar;
