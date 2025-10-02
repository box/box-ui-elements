const _excluded = ["createSession", "encodedSession", "onClearAction", "onSelectedAgentCallback", "getAIStudioAgents", "hasRequestInProgress", "hostAppName", "isAIStudioAgentSelectorEnabled", "isLoading", "onSelectAgent", "questions", "shouldShowLandingPage", "sendQuestion", "stopQuestion"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * @file Box AI sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { BoxAiAgentSelectorWithApi, useAgents } from '@box/box-ai-agent-selector';
import { IconButton, Tooltip } from '@box/blueprint-web';
import { ArrowsExpand } from '@box/blueprint-web-assets/icons/Fill';
import { BoxAiContentAnswers, ClearConversationButton, IntelligenceModal, withApiWrapper } from '@box/box-ai-content-answers';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_BOXAI_SIDEBAR, SIDEBAR_VIEW_BOXAI } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import { BoxAISidebarContext } from './context/BoxAISidebarContext';
import BoxAISidebarTitle from './BoxAISidebarTitle';
import messages from '../common/messages';
import './BoxAISidebar.scss';
const MARK_NAME_JS_READY = `${ORIGIN_BOXAI_SIDEBAR}_${EVENT_JS_READY}`;
mark(MARK_NAME_JS_READY);
function BoxAISidebarContent(props) {
  const {
      createSession,
      encodedSession,
      onClearAction,
      onSelectedAgentCallback,
      getAIStudioAgents,
      hasRequestInProgress,
      hostAppName,
      isAIStudioAgentSelectorEnabled,
      isLoading,
      onSelectAgent,
      questions,
      shouldShowLandingPage,
      sendQuestion,
      stopQuestion
    } = props,
    rest = _objectWithoutProperties(props, _excluded);
  const {
    formatMessage
  } = useIntl();
  const isSessionInitiated = React.useRef(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const {
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
  } = React.useContext(BoxAISidebarContext);
  const {
    agents,
    requestState,
    selectedAgent
  } = useAgents();
  const {
    questions: cacheQuestions
  } = cache;
  if (cache.shouldShowLandingPage !== shouldShowLandingPage) {
    setCacheValue('shouldShowLandingPage', shouldShowLandingPage);
  }
  if (cache.encodedSession !== encodedSession) {
    setCacheValue('encodedSession', encodedSession);
  }
  if (cache.questions !== questions) {
    setCacheValue('questions', questions);
  }
  if (cache.agents.selectedAgent !== selectedAgent) {
    setCacheValue('agents', {
      agents,
      requestState,
      selectedAgent
    });
  }
  const handleUserIntentToUseAI = (userHasInteracted = false) => {
    // Create session if not already created or loading
    if (!shouldPreinitSession && !encodedSession && !isLoading && createSession) {
      createSession(true, false);
    }
    if (userHasInteracted && onUserInteraction) {
      onUserInteraction();
    }
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleSwitchToModalClick = () => {
    handleUserIntentToUseAI();
    setIsModalOpen(true);
  };
  React.useEffect(() => {
    if (shouldPreinitSession && !encodedSession && createSession) {
      createSession(true, true);
    }
    if (encodedSession && cacheQuestions.length > 0 && cacheQuestions[cacheQuestions.length - 1].isCompleted === false) {
      // if we have cache with question that is not completed resend it to trigger an API
      sendQuestion({
        prompt: cacheQuestions[cacheQuestions.length - 1].prompt
      });
    }
    if (recordAction) {
      recordAction({
        action: 'programmatic',
        component: 'sidebar',
        feature: 'answers',
        target: 'loaded',
        data: {
          items: items.map(item => {
            return {
              status: item.status,
              fileType: item.fileType
            };
          })
        }
      });
    }
    return () => {
      // stop API request on unmount (e.g. during switching to another tab)
      stopQuestion();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resend the last question (if it was sent before session loaded) after (re-)initializing session
  React.useEffect(() => {
    const lastQuestion = cacheQuestions[cacheQuestions.length - 1];
    if (!shouldPreinitSession && !isSessionInitiated.current && encodedSession && lastQuestion?.isLoading) {
      sendQuestion(lastQuestion, selectedAgent, false);
      isSessionInitiated.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encodedSession]);
  React.useEffect(() => {
    onSelectedAgentCallback?.(selectedAgent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAgent?.id]);
  const renderBoxAISidebarTitle = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: "bcs-BoxAISidebar-title-part"
    }, /*#__PURE__*/React.createElement(BoxAISidebarTitle, {
      isAIStudioAgentSelectorEnabled: isAIStudioAgentSelectorEnabled
    }), isAIStudioAgentSelectorEnabled && /*#__PURE__*/React.createElement("div", {
      className: "bcs-BoxAISidebar-agentSelector"
    }, /*#__PURE__*/React.createElement(BoxAiAgentSelectorWithApi, {
      disabled: hasRequestInProgress,
      fetcher: getAIStudioAgents,
      hostAppName: hostAppName,
      onAgentsListOpen: handleUserIntentToUseAI,
      onSelectAgent: onSelectAgent,
      recordAction: recordAction,
      shouldHideAgentSelectorOnLoad: true,
      variant: "sidebar"
    })));
  };
  const renderActions = () => /*#__PURE__*/React.createElement(React.Fragment, null, renderBoxAISidebarTitle(), /*#__PURE__*/React.createElement(ClearConversationButton, {
    onClick: onClearAction
  }), /*#__PURE__*/React.createElement(Tooltip, {
    content: formatMessage(messages.sidebarBoxAISwitchToModalView),
    variant: "standard"
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": formatMessage(messages.sidebarBoxAISwitchToModalView),
    className: "bcs-BoxAISidebar-expand",
    "data-target-id": "IconButton-expandBoxAISidebar",
    icon: ArrowsExpand,
    onClick: handleSwitchToModalClick,
    size: "small"
  })));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SidebarContent, {
    actions: renderActions(),
    className: classNames('bcs-BoxAISidebar', {
      'with-modal-open': isModalOpen
    }),
    elementId: elementId,
    sidebarView: SIDEBAR_VIEW_BOXAI
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcs-BoxAISidebar-content"
  }, /*#__PURE__*/React.createElement(BoxAiContentAnswers, _extends({
    className: "bcs-BoxAISidebar-contentAnswers",
    contentName: contentName,
    contentType: formatMessage(messages.sidebarBoxAIContent),
    hostAppName: hostAppName,
    isAIStudioAgentSelectorEnabled: isAIStudioAgentSelectorEnabled,
    isFeedbackEnabled: isFeedbackEnabled,
    isFeedbackFormEnabled: isFeedbackFormEnabled,
    isStopResponseEnabled: isStopResponseEnabled,
    items: items,
    questions: questions,
    onFeedbackFormSubmit: onFeedbackFormSubmit,
    onUserIntentToUseAI: handleUserIntentToUseAI,
    shouldFeedbackFormIncludeFeedbackText: shouldFeedbackFormIncludeFeedbackText,
    shouldShowLandingPage: cache.shouldShowLandingPage,
    showLoadingIndicator: isLoading && shouldPreinitSession,
    stopQuestion: stopQuestion,
    submitQuestion: sendQuestion,
    variant: "sidebar",
    recordAction: recordAction
  }, rest)))), /*#__PURE__*/React.createElement(IntelligenceModal, _extends({
    contentName: contentName,
    contentType: formatMessage(messages.sidebarBoxAIContent),
    extension: fileExtension,
    getAIStudioAgents: getAIStudioAgents,
    hasRequestInProgress: hasRequestInProgress,
    hostAppName: hostAppName,
    isAIStudioAgentSelectorEnabled: isAIStudioAgentSelectorEnabled,
    isFeedbackEnabled: isFeedbackEnabled,
    isFeedbackFormEnabled: isFeedbackFormEnabled,
    isStopResponseEnabled: isStopResponseEnabled,
    items: items,
    itemSize: itemSize,
    onClearAction: onClearAction,
    onFeedbackFormSubmit: onFeedbackFormSubmit,
    onOpenChange: handleModalClose,
    onSelectAgent: onSelectAgent,
    onUserIntentToUseAI: handleUserIntentToUseAI,
    open: isModalOpen,
    questions: questions,
    recordAction: isModalOpen ? recordAction : undefined,
    shouldFeedbackFormIncludeFeedbackText: shouldFeedbackFormIncludeFeedbackText,
    shouldShowLandingPage: cache.shouldShowLandingPage,
    showLoadingIndicator: false,
    stopPropagationOnEsc: true,
    stopQuestion: stopQuestion,
    submitQuestion: sendQuestion,
    variant: "collapsible"
  }, rest, {
    shouldRenderProviders: false
  })));
}
export { BoxAISidebarContent as BoxAISidebarComponent };
const BoxAISidebarContentDefaultExport = flow([withLogger(ORIGIN_BOXAI_SIDEBAR), withErrorBoundary(ORIGIN_BOXAI_SIDEBAR), withAPIContext, withApiWrapper // returns only props for Box AI, keep it at the end
])(BoxAISidebarContent);
export default BoxAISidebarContentDefaultExport;
//# sourceMappingURL=BoxAISidebarContent.js.map