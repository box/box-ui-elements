import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import LabelPill from '../../components/label-pill';
import messages from './messages';
import './TrendPill.scss';
const getTrendStatus = trend => {
  if (trend === 0) {
    return 'neutral';
  }
  return trend > 0 ? 'up' : 'down';
};
const getTrendByPeriod = period => {
  switch (period) {
    case 'month':
      return messages.trendMonth;
    case 'threemonths':
      return messages.trendThreeMonths;
    case 'year':
      return messages.trendYear;
    case 'week':
    default:
      return messages.trendWeek;
  }
};
function TrendPill({
  intl,
  period,
  trend
}) {
  const getTrendLabel = value => {
    return intl.formatMessage(value > 0 ? messages.trendUp : messages.trendDown);
  };
  const trendStatus = getTrendStatus(trend);
  const trendLabel = getTrendLabel(trend);
  return /*#__PURE__*/React.createElement(LabelPill.Pill, {
    className: classNames('TrendPill', {
      'TrendPill--up': trendStatus === 'up',
      'TrendPill--down': trendStatus === 'down'
    })
  }, /*#__PURE__*/React.createElement(React.Fragment, null, trendStatus !== 'neutral' && /*#__PURE__*/React.createElement("span", {
    "aria-label": trendLabel,
    className: "TrendPill-trend",
    role: "img"
  }), /*#__PURE__*/React.createElement(LabelPill.Text, null, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "TrendPill-percentage"
  }, intl.formatNumber(trend, {
    style: 'percent'
  })), /*#__PURE__*/React.createElement(FormattedMessage, getTrendByPeriod(period))))));
}
export default injectIntl(TrendPill);
//# sourceMappingURL=TrendPill.js.map