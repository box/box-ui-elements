const _excluded = ["cache", "contentName", "elementId", "fileExtension", "fileID", "getSuggestedQuestions", "isIntelligentQueryMode", "isFeedbackEnabled", "isFeedbackFormEnabled", "isStopResponseEnabled", "items", "itemSize", "localizedQuestions", "onFeedbackFormSubmit", "onUserInteraction", "recordAction", "renderRemoteModule", "setCacheValue", "shouldFeedbackFormIncludeFeedbackText", "shouldPreinitSession", "setHasQuestions"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * @file Box AI Sidebar Container
 * @author Box
 */
import * as React from 'react';
import { useIntl } from 'react-intl';
import { AgentsProvider } from '@box/box-ai-agent-selector';
import BoxAISidebarContent from './BoxAISidebarContent';
import { BoxAISidebarContext } from './context/BoxAISidebarContext';
import { SPREADSHEET_FILE_EXTENSIONS } from '../common/content-answers/constants';
import messages from '../common/content-answers/messages';
const BoxAISidebar = props => {
  const {
      cache,
      contentName,
      elementId,
      fileExtension,
      fileID,
      getSuggestedQuestions,
      isIntelligentQueryMode,
      isFeedbackEnabled,
      isFeedbackFormEnabled,
      isStopResponseEnabled,
      items,
      itemSize,
      localizedQuestions,
      onFeedbackFormSubmit,
      onUserInteraction,
      recordAction,
      renderRemoteModule,
      setCacheValue,
      shouldFeedbackFormIncludeFeedbackText,
      shouldPreinitSession = true,
      setHasQuestions
    } = props,
    rest = _objectWithoutProperties(props, _excluded);
  const {
    questions
  } = cache;
  const {
    formatMessage
  } = useIntl();
  const contextValue = React.useMemo(() => ({
    cache,
    contentName,
    elementId,
    fileExtension,
    isFeedbackEnabled,
    isFeedbackFormEnabled,
    isStopResponseEnabled,
    items,
    itemSize,
    onFeedbackFormSubmit,
    onUserInteraction,
    recordAction,
    setCacheValue,
    shouldFeedbackFormIncludeFeedbackText,
    shouldPreinitSession
  }), [cache, contentName, elementId, fileExtension, isFeedbackEnabled, isFeedbackFormEnabled, isStopResponseEnabled, items, itemSize, onFeedbackFormSubmit, onUserInteraction, recordAction, setCacheValue, shouldFeedbackFormIncludeFeedbackText, shouldPreinitSession]);
  React.useEffect(() => {
    if (setHasQuestions) {
      setHasQuestions(questions.length > 0);
    }
  }, [questions.length, setHasQuestions]);
  if (renderRemoteModule) {
    return renderRemoteModule(elementId);
  }
  let questionsWithoutInProgress = questions;
  if (questions.length > 0 && !questions[questions.length - 1].isCompleted) {
    // pass only fully completed questions to not show loading indicator of question where we canceled API request
    questionsWithoutInProgress = questionsWithoutInProgress.slice(0, -1);
  }
  const isSpreadsheet = SPREADSHEET_FILE_EXTENSIONS.includes(fileExtension);
  let spreadsheetNotice = isSpreadsheet ? formatMessage(messages.welcomeMessageSpreadsheetNotice) : '';
  if (isIntelligentQueryMode) {
    spreadsheetNotice = formatMessage(messages.welcomeMessageIntelligentQueryNotice);
  } else if (isSpreadsheet) {
    spreadsheetNotice = formatMessage(messages.welcomeMessageSpreadsheetNotice);
  }
  const handleSuggestedQuestionsFetched = fetchedSuggestedQuestions => {
    setCacheValue('suggestedQuestions', fetchedSuggestedQuestions);
  };
  const suggestedQuestions = getSuggestedQuestions === null ? localizedQuestions : [];
  return (
    /*#__PURE__*/
    // BoxAISidebarContent is using withApiWrapper that is not passing all provided props,
    // that's why we need to use provider to pass other props
    React.createElement(AgentsProvider, {
      value: cache.agents
    }, /*#__PURE__*/React.createElement(BoxAISidebarContext.Provider, {
      value: contextValue
    }, /*#__PURE__*/React.createElement(BoxAISidebarContent, _extends({
      cachedSuggestedQuestions: cache.suggestedQuestions,
      getSuggestedQuestions: getSuggestedQuestions,
      isOpen: true,
      isStopResponseEnabled: isStopResponseEnabled,
      itemID: fileID,
      itemIDs: [fileID],
      onSuggestedQuestionsFetched: handleSuggestedQuestionsFetched,
      restoredQuestions: questionsWithoutInProgress,
      restoredSession: cache.encodedSession,
      restoredShouldShowLandingPage: cache.shouldShowLandingPage,
      shouldPreinitSession: shouldPreinitSession,
      suggestedQuestions: cache.suggestedQuestions.length > 0 ? cache.suggestedQuestions : suggestedQuestions,
      warningNotice: spreadsheetNotice,
      warningNoticeAriaLabel: formatMessage(messages.welcomeMessageSpreadsheetNoticeAriaLabel)
    }, rest))))
  );
};
export default BoxAISidebar;
//# sourceMappingURL=BoxAISidebar.js.map