import * as React from 'react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { DiscoDanceParty, HatWand, UploadCloud } from '@box/blueprint-web-assets/illustrations/Medium';
import UploadStateContent from './UploadStateContent';
import { VIEW_ERROR, VIEW_UPLOAD_EMPTY, VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS } from '../../constants';
import messages from '../common/messages';
import './UploadState.scss';
const UploadState = ({
  canDrop,
  hasItems,
  isOver,
  isTouch,
  view,
  onSelect,
  isFolderUploadEnabled
}) => {
  const {
    formatMessage
  } = useIntl();
  let icon;
  let content;
  switch (view) {
    case VIEW_ERROR:
      icon = /*#__PURE__*/React.createElement(HatWand, {
        "aria-label": formatMessage(messages.uploadErrorState)
      });
      content = /*#__PURE__*/React.createElement(UploadStateContent, {
        message: formatMessage(messages.uploadError)
      });
      break;
    case VIEW_UPLOAD_EMPTY:
      icon = /*#__PURE__*/React.createElement(UploadCloud, {
        "aria-label": formatMessage(messages.uploadEmptyState)
      });
      /* eslint-disable no-nested-ternary */
      content = canDrop && hasItems ? /*#__PURE__*/React.createElement(UploadStateContent, {
        message: formatMessage(messages.uploadInProgress)
      }) : isTouch ? /*#__PURE__*/React.createElement(UploadStateContent, {
        fileInputLabel: formatMessage(messages.uploadNoDragDrop),
        onChange: onSelect,
        useButton: true
      }) : /*#__PURE__*/React.createElement(UploadStateContent, {
        fileInputLabel: formatMessage(messages.uploadEmptyFileInput),
        folderInputLabel: isFolderUploadEnabled && formatMessage(messages.uploadEmptyFolderInput),
        message: isFolderUploadEnabled ? formatMessage(messages.uploadEmptyWithFolderUploadEnabled) : formatMessage(messages.uploadEmptyWithFolderUploadDisabled),
        onChange: onSelect
      });
      /* eslint-enable no-nested-ternary */
      break;
    case VIEW_UPLOAD_IN_PROGRESS:
      icon = /*#__PURE__*/React.createElement(UploadCloud, {
        "aria-label": formatMessage(messages.uploadEmptyState)
      });
      content = /*#__PURE__*/React.createElement(UploadStateContent, {
        message: formatMessage(messages.uploadInProgress)
      });
      break;
    case VIEW_UPLOAD_SUCCESS:
      icon = /*#__PURE__*/React.createElement(DiscoDanceParty, {
        "aria-label": formatMessage(messages.uploadSuccessState)
      });
      content = /*#__PURE__*/React.createElement(UploadStateContent, {
        fileInputLabel: formatMessage(messages.uploadSuccessFileInput),
        folderInputLabel: isFolderUploadEnabled && formatMessage(messages.uploadSuccessFolderInput),
        message: formatMessage(messages.uploadSuccess),
        onChange: onSelect,
        useButton: isTouch
      });
      break;
    default:
      break;
  }
  const className = classNames('bcu-upload-state', {
    'bcu-is-droppable': isOver && canDrop,
    'bcu-is-not-droppable': isOver && !canDrop,
    'bcu-has-items': hasItems
  });
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement("div", null, icon, content), /*#__PURE__*/React.createElement("div", {
    className: "bcu-drag-drop-overlay"
  }));
};
export default UploadState;
//# sourceMappingURL=UploadState.js.map