import * as React from 'react';
import ContentAnalyticsErrorState from './ContentAnalyticsErrorState';
import ContentInsightsSummaryGhostState from './ContentInsightsSummaryGhostState';
import GraphCardPreviewsSummary from './GraphCardPreviewsSummary';
import OpenContentInsightsButton from './OpenContentInsightsButton';
import './ContentInsightsSummary.scss';
const ContentInsightsSummary = ({
  error,
  graphData,
  isLoading,
  previousPeriodCount,
  onClick,
  totalCount
}) => {
  const renderContentAnalyticsSummary = () => {
    if (error) {
      return /*#__PURE__*/React.createElement(ContentAnalyticsErrorState, {
        error: error
      });
    }
    if (isLoading) {
      return /*#__PURE__*/React.createElement(ContentInsightsSummaryGhostState, null);
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(GraphCardPreviewsSummary, {
      graphData: graphData,
      previousPeriodCount: previousPeriodCount,
      totalCount: totalCount
    }), /*#__PURE__*/React.createElement(OpenContentInsightsButton, {
      onClick: onClick
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ContentInsightsSummary"
  }, renderContentAnalyticsSummary());
};
export default ContentInsightsSummary;
//# sourceMappingURL=ContentInsightsSummary.js.map