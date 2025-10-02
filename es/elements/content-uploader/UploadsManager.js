import * as React from 'react';
import classNames from 'classnames';
import ItemList from './ItemList';
import OverallUploadsProgressBar from './OverallUploadsProgressBar';
import { isActivateKey } from '../../utils/dom';
import { STATUS_ERROR } from '../../constants';
import './UploadsManager.scss';
const UploadsManager = ({
  isDragging,
  isExpanded,
  isResumableUploadsEnabled,
  isVisible,
  items,
  onItemActionClick,
  onRemoveActionClick,
  onUpgradeCTAClick,
  onUploadsManagerActionClick,
  toggleUploadsManager,
  view
}) => {
  /**
   * Keydown handler for progress bar
   *
   * @param {React.KeyboardEvent} event
   * @return {void}
   */
  const handleProgressBarKeyDown = event => {
    if (isActivateKey(event)) {
      toggleUploadsManager();
    }
  };
  let numFailedUploads = 0;
  let totalSize = 0;
  let totalUploaded = 0;
  items.forEach(item => {
    if (item.status !== STATUS_ERROR && !item.isFolder) {
      totalSize += item.size;
      totalUploaded += item.size * item.progress / 100.0;
    } else if (item.status === STATUS_ERROR) {
      numFailedUploads += 1;
    }
  });
  const percent = totalUploaded / totalSize * 100;
  const isResumeVisible = isResumableUploadsEnabled && numFailedUploads > 0;
  const hasMultipleFailedUploads = numFailedUploads > 1;
  return /*#__PURE__*/React.createElement("div", {
    "data-resin-component": "uploadsmanager",
    "data-resin-feature": "uploads",
    className: classNames('be bcu-uploads-manager-container', {
      'bcu-is-expanded': isExpanded,
      'bcu-is-visible': isVisible
    })
  }, /*#__PURE__*/React.createElement(OverallUploadsProgressBar, {
    isDragging: isDragging,
    isExpanded: isExpanded,
    isResumeVisible: isResumeVisible,
    isVisible: isVisible,
    hasMultipleFailedUploads: hasMultipleFailedUploads,
    onClick: toggleUploadsManager,
    onKeyDown: handleProgressBarKeyDown,
    onUploadsManagerActionClick: onUploadsManagerActionClick,
    percent: percent,
    view: view
  }), /*#__PURE__*/React.createElement("div", {
    className: "bcu-uploads-manager-item-list"
  }, /*#__PURE__*/React.createElement(ItemList, {
    isResumableUploadsEnabled: isResumableUploadsEnabled,
    items: items,
    onClick: onItemActionClick,
    onRemoveClick: onRemoveActionClick,
    onUpgradeCTAClick: onUpgradeCTAClick
  })));
};
export default UploadsManager;
//# sourceMappingURL=UploadsManager.js.map