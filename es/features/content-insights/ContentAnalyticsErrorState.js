import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import MetricsReview56 from '../../illustration/MetricsReview56';
import messages from './messages';
import './ContentAnalyticsErrorState.scss';
const ContentAnalyticsErrorState = ({
  error
}) => {
  const renderErrorMessage = responseError => {
    const isPermissionError = !!responseError && responseError.status === 403;
    if (isPermissionError) {
      return /*#__PURE__*/React.createElement("div", {
        className: "ContentAnalyticsErrorState-text--permission",
        "data-testid": "ContentAnalyticsErrorState-text--permission"
      }, /*#__PURE__*/React.createElement(FormattedMessage, messages.contentAnalyticsPermissionError));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "ContentAnalyticsErrorState-text",
      "data-testid": "ContentAnalyticsErrorState-text"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.contentAnalyticsErrorText));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ContentAnalyticsErrorState",
    "data-testid": "ContentAnalyticsErrorState"
  }, /*#__PURE__*/React.createElement(MetricsReview56, {
    "data-testid": "ContentAnalyticsErrorState-image"
  }), renderErrorMessage(error));
};
export default ContentAnalyticsErrorState;
//# sourceMappingURL=ContentAnalyticsErrorState.js.map