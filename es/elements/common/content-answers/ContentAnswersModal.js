function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import { ANSWER_ERROR, IntelligenceModal } from '@box/box-ai-content-answers';
import { withAPIContext } from '../api-context';
import { DOCUMENT_SUGGESTED_QUESTIONS, SPREADSHEET_FILE_EXTENSIONS } from './constants';

// @ts-ignore: no ts definition

// @ts-ignore: no ts definition

// @ts-ignore: no ts definition

import messages from './messages';
const ContentAnswersModal = ({
  api,
  file,
  isOpen,
  onAsk,
  onClearConversation,
  onRequestClose,
  suggestedQuestions,
  isCitationsEnabled = true,
  isMarkdownEnabled = true
}) => {
  const {
    formatMessage
  } = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  let localizedQuestions = [];
  if (!suggestedQuestions || suggestedQuestions.length === 0) {
    localizedQuestions = DOCUMENT_SUGGESTED_QUESTIONS.map(question => ({
      id: question.id,
      label: formatMessage(messages[question.labelId]),
      prompt: formatMessage(messages[question.promptId])
    }));
  }
  const handleSuccessCallback = useCallback(response => {
    const question = {
      answer: response.data.answer,
      created_at: response.data.created_at,
      citations: response.data.citations,
      error: null,
      isCompleted: true,
      isLoading: false
    };
    setQuestions(prevState => {
      const lastQuestion = prevState[prevState.length - 1];
      const updatedLastQuestion = _objectSpread(_objectSpread({}, lastQuestion), question);
      return [...prevState.slice(0, -1), updatedLastQuestion];
    });
  }, []);
  const handleErrorCallback = useCallback((error, question) => {
    const rateLimitingRegex = /Too Many Requests/i;
    const errorMessage = error?.message || '';
    const isRateLimitingError = error?.response?.status === 429 || rateLimitingRegex.test(errorMessage);
    const errorQuestion = _objectSpread(_objectSpread({}, question), {}, {
      error: isRateLimitingError ? ANSWER_ERROR.RATE_LIMITING : ANSWER_ERROR.GENERAL,
      isCompleted: true,
      isLoading: false
    });
    setQuestions(prevState => {
      return [...prevState.slice(0, -1), errorQuestion];
    });
  }, []);
  const handleAsk = useCallback(async (question, aiAgent, isRetry = false) => {
    if (onAsk) {
      onAsk();
    }
    const {
      id
    } = file;
    const items = [{
      id,
      type: 'file'
    }];
    question.isCompleted = false;
    question.isLoading = true;
    const dialogueHistory = questions.map(q => ({
      prompt: q.prompt,
      answer: q.answer,
      created_at: q.created_at
    }));
    setQuestions(prevQuestions => {
      return [...(isRetry ? prevQuestions.slice(0, -1) : prevQuestions), question];
    });
    setIsLoading(true);
    try {
      const response = await api.getIntelligenceAPI(true).ask(question, items, dialogueHistory, {
        include_citations: isCitationsEnabled
      });
      handleSuccessCallback(response);
    } catch (e) {
      handleErrorCallback(e, question);
    }
    setIsLoading(false);
  }, [api, file, handleErrorCallback, handleSuccessCallback, isCitationsEnabled, onAsk, questions]);
  const handleRetry = useCallback(question => {
    setQuestions(prevState => {
      delete question.error;
      return [...prevState.slice(0, -1), question];
    });
    handleAsk(question, null, true);
  }, [handleAsk]);
  const handleClearConversation = useCallback(() => {
    if (onClearConversation) {
      onClearConversation();
    }
    setQuestions([]);
  }, [onClearConversation]);
  const handleOnRequestClose = useCallback(() => {
    if (onRequestClose) {
      onRequestClose();
    }
  }, [onRequestClose]);
  const fileName = getProp(file, 'name');
  const fileExtension = getProp(file, 'extension');
  const isSpreadsheet = SPREADSHEET_FILE_EXTENSIONS.includes(fileExtension);
  const spreadsheetNotice = isSpreadsheet ? formatMessage(messages.welcomeMessageSpreadsheetNotice) : '';
  return /*#__PURE__*/React.createElement(IntelligenceModal, {
    contentName: fileName,
    contentType: fileExtension,
    hasRequestInProgress: isLoading,
    isCitationsEnabled: isCitationsEnabled,
    isMarkdownEnabled: isMarkdownEnabled,
    onClearAction: handleClearConversation,
    onOpenChange: handleOnRequestClose,
    open: isOpen,
    questions: questions,
    retryQuestion: handleRetry,
    setAnswerFeedback: noop,
    shouldShowLandingPage: questions.length === 0,
    submitQuestion: handleAsk,
    suggestedQuestions: suggestedQuestions || localizedQuestions,
    warningNotice: spreadsheetNotice,
    warningNoticeAriaLabel: formatMessage(messages.welcomeMessageSpreadsheetNoticeAriaLabel)
  });
};
export default withAPIContext(ContentAnswersModal);
//# sourceMappingURL=ContentAnswersModal.js.map