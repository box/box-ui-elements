// @flow
import * as React from 'react';

import TemplateButton from './TemplateButton';
import FilterButton from './FilterButton';
import ColumnButton from './ColumnButton';

import type { ColumnType } from '../flowTypes';

import '../styles/QueryBarButtons.scss';

type Props = {
    activeTemplate?: MetadataTemplate,
    onTemplateChange?: Function,
    onColumnChange?: Function,
    templates?: Array<MetadataTemplate>,
    visibleColumns?: Array<ColumnType>,
};

const QueryBar = ({ activeTemplate, onColumnChange, onTemplateChange, templates, visibleColumns }: Props) => (
    <section className="metadata-view-query-bar">
        <TemplateButton onTemplateChange={onTemplateChange} templates={templates} />
        <FilterButton template={activeTemplate} />
        <ColumnButton onColumnChange={onColumnChange} template={activeTemplate} visibleColumns={visibleColumns} />
    </section>
);

export default QueryBar;
