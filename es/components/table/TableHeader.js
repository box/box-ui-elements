import * as React from 'react';
import classNames from 'classnames';
import TableRow from './TableRow';
const TableHeader = ({
  children,
  className = '',
  rowClassName = ''
}) => /*#__PURE__*/React.createElement("thead", {
  className: classNames('table-header', className)
}, /*#__PURE__*/React.createElement(TableRow, {
  className: rowClassName
}, children));
export default TableHeader;
//# sourceMappingURL=TableHeader.js.map