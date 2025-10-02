import * as React from 'react';
import baseCellRenderer from './baseCellRenderer';
import ReadableTime from '../../components/time/ReadableTime';
const readableTimeCellRenderer = cellRendererParams => baseCellRenderer(cellRendererParams, cellValue => /*#__PURE__*/React.createElement(ReadableTime, {
  timestamp: Date.parse(cellValue),
  alwaysShowTime: true
}));
export default readableTimeCellRenderer;
//# sourceMappingURL=readableTimeCellRenderer.js.map