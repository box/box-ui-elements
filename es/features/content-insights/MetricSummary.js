import * as React from 'react';
import isFinite from 'lodash/isFinite';
import isNaN from 'lodash/isNaN';
import { injectIntl } from 'react-intl';
import HeaderWithCount from './HeaderWithCount';
import messages from './messages';
import TrendPill from './TrendPill';
import { formatCount } from './numberUtils';
import { METRIC } from './constants';
import './MetricSummary.scss';
const METRIC_MAP = {
  [METRIC.PREVIEWS]: {
    headerMessage: messages.previewGraphType,
    getPeriodCount: data => data.reduce((count, {
      previewsCount
    }) => count + previewsCount, 0)
  },
  [METRIC.DOWNLOADS]: {
    getPeriodCount: data => data.reduce((count, {
      downloadsCount
    }) => count + downloadsCount, 0),
    headerMessage: messages.downloadGraphType
  },
  [METRIC.USERS]: {
    getPeriodCount: data => {
      const periodUsers = data.reduce((totalUsers, {
        users
      }) => new Set([...Array.from(totalUsers), ...Array.from(users)]), new Set());
      return periodUsers.size;
    },
    headerMessage: messages.peopleTitle
  }
};

// Limit the trend to a finite number (in case the previous period count was 0 and the calculated trend is Infinity)
const formatTrend = calculatedTrend => !isFinite(calculatedTrend) ? 1 : calculatedTrend;
function MetricSummary({
  data = [],
  intl,
  metric,
  period,
  previousPeriodCount = 0,
  totalCount
}) {
  const {
    getPeriodCount,
    headerMessage
  } = METRIC_MAP[metric];
  const periodCount = getPeriodCount(data);
  const calculatedTrend = (periodCount - previousPeriodCount) / previousPeriodCount;
  const trend = isNaN(calculatedTrend) ? 0 : formatTrend(calculatedTrend);
  return /*#__PURE__*/React.createElement("div", {
    className: "MetricSummary"
  }, /*#__PURE__*/React.createElement(HeaderWithCount, {
    title: intl.formatMessage(headerMessage),
    totalCount: totalCount
  }), /*#__PURE__*/React.createElement("div", {
    className: "MetricSummary-period"
  }, /*#__PURE__*/React.createElement("span", {
    className: "MetricSummary-periodCount"
  }, formatCount(periodCount, intl)), /*#__PURE__*/React.createElement(TrendPill, {
    period: period,
    trend: trend
  })));
}
export default injectIntl(MetricSummary);
//# sourceMappingURL=MetricSummary.js.map