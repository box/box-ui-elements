import * as React from 'react';
import { injectIntl } from 'react-intl';
import BarChart from './charts/bar/BarChart';
import messages from './messages';
import MetricSummary from './MetricSummary';
import { METRIC, PERIOD } from './constants';
import './GraphCardPreviewsSummary.scss';
function GraphCardPreviewsSummary({
  graphData,
  intl,
  previousPeriodCount,
  totalCount
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MetricSummary, {
    data: graphData,
    metric: METRIC.PREVIEWS,
    period: PERIOD.WEEK,
    previousPeriodCount: previousPeriodCount,
    totalCount: totalCount
  }), /*#__PURE__*/React.createElement(BarChart, {
    className: "GraphCardPreviewsSummary-chart",
    data: graphData,
    label: intl.formatMessage(messages.previewGraphLabel),
    labelAccessor: "start",
    valueAccessor: "previewsCount"
  }));
}
export default injectIntl(GraphCardPreviewsSummary);
//# sourceMappingURL=GraphCardPreviewsSummary.js.map