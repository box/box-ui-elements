import * as React from 'react';
import TemplateButton from './components/TemplateButton';
import FilterButton from './components/filter/FilterButton';
import ColumnButton from './components/ColumnButton';
import './styles/QueryBarButtons.scss';
const isItemName = column => {
  return column.source === 'item' && column.property === 'name';
};
const QueryBar = ({
  activeTemplate,
  columns,
  conditions,
  onColumnChange,
  onFilterChange,
  onTemplateChange,
  templates
}) => {
  const metadataColumns = columns && columns.filter(column => column.source !== 'item');
  const columnsWithoutItemName = columns && columns.filter(column => !isItemName(column));
  return /*#__PURE__*/React.createElement("section", {
    className: "metadata-view-query-bar"
  }, /*#__PURE__*/React.createElement(TemplateButton, {
    activeTemplate: activeTemplate,
    onTemplateChange: onTemplateChange,
    templates: templates
  }), /*#__PURE__*/React.createElement(FilterButton, {
    columns: metadataColumns,
    conditions: conditions,
    onFilterChange: onFilterChange
  }), /*#__PURE__*/React.createElement(ColumnButton, {
    columns: columnsWithoutItemName,
    onColumnChange: onColumnChange,
    template: activeTemplate
  }));
};
export default QueryBar;
//# sourceMappingURL=QueryBar.js.map