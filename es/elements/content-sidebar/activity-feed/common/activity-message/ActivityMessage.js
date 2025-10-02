function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage, injectIntl } from 'react-intl';
import CollapsableMessage from './CollapsableMessage';
import LoadingIndicator, { LoadingIndicatorSize } from '../../../../../components/loading-indicator';
import ShowOriginalButton from './ShowOriginalButton';
import TranslateButton from './TranslateButton';
import formatTaggedMessage, { renderTimestampWithText } from '../../utils/formatTaggedMessage';
import { withFeatureConsumer, isFeatureEnabled } from '../../../../common/feature-checking';
import messages from './messages';
import './ActivityMessage.scss';
class ActivityMessage extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isLoading: false,
      isTranslation: false
    });
    _defineProperty(this, "handleTranslate", event => {
      const {
        id,
        tagged_message,
        onTranslate = noop,
        translatedTaggedMessage
      } = this.props;
      if (!translatedTaggedMessage) {
        this.setState({
          isLoading: true
        });
        onTranslate({
          id,
          tagged_message
        });
      }
      this.setState({
        isTranslation: true
      });
      event.preventDefault();
    });
    _defineProperty(this, "handleShowOriginal", event => {
      this.setState({
        isTranslation: false
      });
      event.preventDefault();
    });
  }
  componentDidUpdate(prevProps) {
    const {
      translatedTaggedMessage,
      translationFailed
    } = this.props;
    const {
      translatedTaggedMessage: prevTaggedMessage,
      translationFailed: prevTranslationFailed
    } = prevProps;
    if (prevTaggedMessage === translatedTaggedMessage || prevTranslationFailed === translationFailed) {
      return;
    }
    if (translatedTaggedMessage || translationFailed) {
      this.setState({
        isLoading: false
      });
    }
  }
  getButton(isTranslation) {
    let button = null;
    if (isTranslation) {
      button = /*#__PURE__*/React.createElement(ShowOriginalButton, {
        handleShowOriginal: this.handleShowOriginal
      });
    } else {
      button = /*#__PURE__*/React.createElement(TranslateButton, {
        handleTranslate: this.handleTranslate
      });
    }
    return button;
  }
  render() {
    const {
      features,
      getUserProfileUrl,
      id,
      intl,
      isEdited,
      onClick = noop,
      annotationsMillisecondTimestamp,
      tagged_message,
      translatedTaggedMessage,
      translationEnabled
    } = this.props;
    const {
      isLoading,
      isTranslation
    } = this.state;
    const commentToDisplay = translationEnabled && isTranslation && translatedTaggedMessage ? translatedTaggedMessage : tagged_message;
    const MessageWrapper = isFeatureEnabled(features, 'activityFeed.collapsableMessages.enabled') ? CollapsableMessage : React.Fragment;
    return isLoading ? /*#__PURE__*/React.createElement("div", {
      className: "bcs-ActivityMessageLoading"
    }, /*#__PURE__*/React.createElement(LoadingIndicator, {
      size: LoadingIndicatorSize.SMALL
    })) : /*#__PURE__*/React.createElement("div", {
      className: "bcs-ActivityMessage"
    }, /*#__PURE__*/React.createElement(MessageWrapper, null, annotationsMillisecondTimestamp ? renderTimestampWithText(annotationsMillisecondTimestamp, onClick, intl, ` ${commentToDisplay}`) : formatTaggedMessage(commentToDisplay, id, false, getUserProfileUrl, intl), isEdited && /*#__PURE__*/React.createElement("span", {
      className: "bcs-ActivityMessage-edited"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.activityMessageEdited))), translationEnabled ? this.getButton(isTranslation) : null);
  }
}
_defineProperty(ActivityMessage, "defaultProps", {
  isEdited: false,
  translationEnabled: false
});
export { ActivityMessage };
export default withFeatureConsumer(injectIntl(ActivityMessage));
//# sourceMappingURL=ActivityMessage.js.map