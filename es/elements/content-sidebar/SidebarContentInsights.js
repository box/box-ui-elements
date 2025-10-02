import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import ContentInsightsSummary from '../../features/content-insights/ContentInsightsSummary';
// @ts-ignore Module is written in Flow
import messages from '../common/messages';
// @ts-ignore Module is written in Flow
import SidebarSection from './SidebarSection';
// @ts-ignore Module is written in Flow
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import withErrorHandling from './withErrorHandling'; // Above eslint rules disabled because typescript chokes on flow type import in withErrorHandling

import './SidebarContentInsights.scss';
const defaultContentInsights = {
  graphData: [],
  isLoading: true,
  previousPeriodCount: 0,
  totalCount: 0
};
const SidebarContentInsights = ({
  contentInsights = defaultContentInsights,
  onContentInsightsClick = noop
}) => {
  const {
    error,
    graphData,
    isLoading,
    previousPeriodCount,
    totalCount
  } = contentInsights;
  return /*#__PURE__*/React.createElement(SidebarSection, {
    className: "bcs-SidebarContentInsights",
    title: /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarContentInsights)
  }, /*#__PURE__*/React.createElement(ContentInsightsSummary, {
    error: error,
    graphData: graphData,
    isLoading: isLoading,
    onClick: onContentInsightsClick,
    previousPeriodCount: previousPeriodCount,
    totalCount: totalCount
  }));
};
export default withErrorHandling(SidebarContentInsights);
//# sourceMappingURL=SidebarContentInsights.js.map