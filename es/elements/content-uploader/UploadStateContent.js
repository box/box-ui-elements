function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import UploadInput from './UploadInput';
import messages from '../common/messages';
const UploadStateContent = ({
  fileInputLabel,
  folderInputLabel,
  message,
  onChange,
  useButton = false
}) => {
  const inputLabelClass = useButton ? 'btn btn-primary be-input-btn' : 'be-input-link'; // TODO: Refactor to use Blueprint components
  const canUploadFolder = !useButton && !!folderInputLabel;
  let inputsContent;
  const handleChange = event => {
    if (!onChange) {
      return;
    }
    onChange(event);
    const {
      currentTarget
    } = event;
    currentTarget.value = ''; // Reset the file input selection
  };
  const fileInputContent = fileInputLabel ? /*#__PURE__*/React.createElement(UploadInput, {
    inputLabel: fileInputLabel,
    inputLabelClass: inputLabelClass,
    onChange: handleChange
  }) : null;
  const folderInputContent = canUploadFolder ? /*#__PURE__*/React.createElement(UploadInput, {
    inputLabel: folderInputLabel,
    inputLabelClass: inputLabelClass,
    isFolderUpload: true,
    onChange: handleChange
  }) : null;
  if (fileInputContent && folderInputContent) {
    inputsContent = /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.uploadOptions, {
      values: {
        option1: fileInputContent,
        option2: folderInputContent
      }
    }));
  } else if (fileInputContent) {
    inputsContent = fileInputContent;
  }
  return /*#__PURE__*/React.createElement("div", null, message && /*#__PURE__*/React.createElement("div", {
    className: "bcu-upload-state-message"
  }, message), inputsContent && /*#__PURE__*/React.createElement("div", {
    className: "bcu-upload-input-container"
  }, inputsContent));
};
export default UploadStateContent;
//# sourceMappingURL=UploadStateContent.js.map