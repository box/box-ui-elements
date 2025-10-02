import * as React from 'react';
import classNames from 'classnames';
import { SortDirection } from '@box/react-virtualized/dist/es/Table/index';
import IconSortChevron from '../../icons/general/IconSortChevron';
const {
  ASC,
  DESC
} = SortDirection;
const sortableColumnHeaderRenderer = ({
  dataKey,
  label,
  sortBy,
  sortDirection
}) => /*#__PURE__*/React.createElement("span", {
  className: "VirtualizedTable-sortableColumnHeader ReactVirtualized__Table__headerTruncatedText",
  title: label
}, /*#__PURE__*/React.createElement("span", null, label), dataKey === sortBy && /*#__PURE__*/React.createElement(IconSortChevron, {
  className: classNames('VirtualizedTable-sortIcon', {
    'is-ascending': sortDirection === ASC,
    'is-descending': sortDirection === DESC
  })
}));
export default sortableColumnHeaderRenderer;
//# sourceMappingURL=sortableColumnHeaderRenderer.js.map