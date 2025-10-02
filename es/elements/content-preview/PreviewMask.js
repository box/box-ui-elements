import * as React from 'react';
// @ts-ignore flow import
import PreviewError from './PreviewError';
import { PreviewLoading } from '../../components/preview';
import './PreviewMask.scss';
export default function PreviewMask({
  errorCode,
  extension,
  isLoading
}) {
  if (!errorCode && !isLoading) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "bcpr-PreviewMask"
  }, errorCode ? /*#__PURE__*/React.createElement(PreviewError, {
    errorCode: errorCode
  }) : isLoading && /*#__PURE__*/React.createElement(PreviewLoading, {
    extension: extension
  }));
}
//# sourceMappingURL=PreviewMask.js.map