import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Text } from '@box/blueprint-web';
import ProgressBar from './ProgressBar';
import UploadsManagerAction from './UploadsManagerAction';
import { VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS, VIEW_ERROR, VIEW_UPLOAD_EMPTY } from '../../constants';
import messages from '../common/messages';
import './OverallUploadsProgressBar.scss';

/**
 * Get upload status
 *
 * @param {View} view
 * @return {FormattedMessage|string}
 */
const getUploadStatus = view => {
  switch (view) {
    case VIEW_UPLOAD_IN_PROGRESS:
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.uploadsManagerUploadInProgress);
    case VIEW_UPLOAD_SUCCESS:
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.uploadsManagerUploadComplete);
    case VIEW_UPLOAD_EMPTY:
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.uploadsManagerUploadPrompt);
    case VIEW_ERROR:
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.uploadsManagerUploadFailed);
    default:
      return '';
  }
};

/**
 * Get overall upload progress percentage
 *
 * @param {string} view
 * @param {number} percent
 */
const getPercent = (view, percent) => {
  switch (view) {
    case VIEW_UPLOAD_SUCCESS:
      return 100;
    case VIEW_UPLOAD_EMPTY:
    case VIEW_ERROR:
      return 0;
    default:
      return percent;
  }
};
const OverallUploadsProgressBar = ({
  customPrompt,
  hasMultipleFailedUploads,
  isDragging,
  isExpanded,
  isResumeVisible,
  isVisible,
  onClick,
  onKeyDown,
  onUploadsManagerActionClick,
  percent,
  view
}) => {
  // Show the upload prompt and set progress to 0 when the uploads manager
  // is invisible or is having files dragged to it
  const shouldShowPrompt = isDragging || !isVisible;
  const message = customPrompt || messages.uploadsManagerUploadPrompt;
  const status = shouldShowPrompt ? /*#__PURE__*/React.createElement(FormattedMessage, message) : getUploadStatus(view);
  const updatedPercent = shouldShowPrompt ? 0 : getPercent(view, percent);
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": !isVisible,
    className: "bcu-overall-progress-bar",
    "data-resin-target": isExpanded ? 'uploadcollapse' : 'uploadexpand',
    onClick: onClick,
    onKeyDown: onKeyDown,
    role: "button"
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ,
    tabIndex: isVisible ? '0' : '-1'
  }, /*#__PURE__*/React.createElement(Text, {
    as: "span",
    className: "bcu-upload-status",
    color: "textOnDarkDefault",
    variant: "bodyDefaultBold"
  }, status), /*#__PURE__*/React.createElement(ProgressBar, {
    percent: updatedPercent
  }), isResumeVisible && /*#__PURE__*/React.createElement(UploadsManagerAction, {
    hasMultipleFailedUploads: hasMultipleFailedUploads,
    onClick: onUploadsManagerActionClick
  }), /*#__PURE__*/React.createElement("span", {
    className: "bcu-uploads-manager-toggle"
  }));
};
export default OverallUploadsProgressBar;
//# sourceMappingURL=OverallUploadsProgressBar.js.map