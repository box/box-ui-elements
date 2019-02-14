// @flow
import * as React from 'react';

import TemplateButton from './components/TemplateButton';
import FilterButton from './components/filter/FilterButton';
import ColumnButton from './components/ColumnButton';

import type { ColumnType } from './flowTypes';

import './styles/QueryBarButtons.scss';

type Props = {
    activeTemplate?: MetadataTemplate,
    columns?: Array<ColumnType>,
    onColumnChange?: Function,
    onFilterChange?: Function,
    onTemplateChange?: Function,
    templates?: Array<MetadataTemplate>,
};

const QueryBar = ({ activeTemplate, columns, onColumnChange, onFilterChange, onTemplateChange, templates }: Props) => (
    <section className="metadata-view-query-bar">
        <TemplateButton activeTemplate={activeTemplate} onTemplateChange={onTemplateChange} templates={templates} />
        <FilterButton onFilterChange={onFilterChange} template={activeTemplate} />
        <ColumnButton columns={columns} onColumnChange={onColumnChange} template={activeTemplate} />
    </section>
);

export default QueryBar;
