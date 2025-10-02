import * as React from 'react';

// https://stackoverflow.com/questions/72787050/typescript-upload-directory-property-directory-does-not-exist-on-type
// Extend the InputHTMLAttributes interface to include the directory attribute

const UploadInput = ({
  inputLabel,
  inputLabelClass = '',
  isFolderUpload = false,
  isMultiple = true,
  onChange
}) => {
  const inputRef = React.useRef(null);
  const onKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (inputRef.current) {
        inputRef.current.click();
      }
    }
  };
  return inputLabel ?
  /*#__PURE__*/
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
  React.createElement("label", {
    className: inputLabelClass,
    onKeyDown: onKeyDown,
    role: "button",
    tabIndex: 0
  }, inputLabel, /*#__PURE__*/React.createElement("input", {
    "data-testid": "upload-input",
    directory: isFolderUpload ? '' : undefined,
    multiple: isMultiple,
    onChange: onChange,
    ref: inputRef,
    type: "file",
    webkitdirectory: isFolderUpload ? '' : undefined
  })) : null;
};
export default UploadInput;
//# sourceMappingURL=UploadInput.js.map