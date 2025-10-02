const _excluded = ["className", "file", "onAsk", "onRequestClose"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { useCallback, useState } from 'react';
import getProp from 'lodash/get';
import ContentAnswersModal from './ContentAnswersModal';
import ContentAnswersOpenButton from './ContentAnswersOpenButton';
// @ts-ignore: no ts definition

const ContentAnswers = props => {
  const {
      className = '',
      file,
      onAsk,
      onRequestClose
    } = props,
    rest = _objectWithoutProperties(props, _excluded);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasQuestions, setHasQuestions] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const handleClick = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);
  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    if (hasQuestions) {
      setIsHighlighted(true);
    }
    if (onRequestClose) {
      onRequestClose();
    }
  }, [hasQuestions, onRequestClose]);
  const handleAsk = useCallback(() => {
    setHasQuestions(true);
    if (onAsk) {
      onAsk();
    }
  }, [onAsk]);
  const currentExtension = getProp(file, 'extension');
  return /*#__PURE__*/React.createElement("div", {
    className: `be-ContentAnswers ${className}`
  }, /*#__PURE__*/React.createElement(ContentAnswersOpenButton, {
    fileExtension: currentExtension,
    isHighlighted: isHighlighted,
    isModalOpen: isModalOpen,
    onClick: handleClick
  }), /*#__PURE__*/React.createElement(ContentAnswersModal, _extends({
    file: file,
    isOpen: isModalOpen,
    onAsk: handleAsk,
    onRequestClose: handleClose
  }, rest)));
};
export default ContentAnswers;
//# sourceMappingURL=ContentAnswers.js.map