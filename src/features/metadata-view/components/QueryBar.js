// @flow
import * as React from 'react';

import TemplateButton from './TemplateButton';
import FilterButton from './FilterButton';
import ColumnButton from './ColumnButton';

import type { ColumnType } from '../flowTypes';

import '../styles/QueryBarButtons.scss';

type Props = {
    activeTemplate?: MetadataTemplate,
    onColumnChange?: Function,
    onFilterChange?: Function,
    onTemplateChange?: Function,
    templates?: Array<MetadataTemplate>,
    visibleColumns?: Array<ColumnType>,
};

const QueryBar = ({
    activeTemplate,
    onColumnChange,
    onFilterChange,
    onTemplateChange,
    templates,
    visibleColumns,
}: Props) => (
    <section className="metadata-view-query-bar">
        <TemplateButton activeTemplate={activeTemplate} onTemplateChange={onTemplateChange} templates={templates} />
        <FilterButton onFilterChange={onFilterChange} template={activeTemplate} />
        <ColumnButton onColumnChange={onColumnChange} template={activeTemplate} visibleColumns={visibleColumns} />
    </section>
);

export default QueryBar;
