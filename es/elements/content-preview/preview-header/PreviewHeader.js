function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Preview header component
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import getProp from 'lodash/get';
import AsyncLoad from '../../common/async-load';
import FileInfo from './FileInfo';
import IconClose from '../../../icons/general/IconClose';
import IconDownload from '../../../icons/general/IconDownloadSolid';
import IconDrawAnnotationMode from '../../../icons/annotations/IconDrawAnnotation';
import IconPointAnnotation from '../../../icons/annotations/IconPointAnnotation';
import IconPrint from '../../../icons/general/IconPrint';
import Logo from '../../common/header/Logo';
import messages from '../../common/messages';
import PlainButton from '../../../components/plain-button/PlainButton';
import { bdlGray50 } from '../../../styles/variables';
import './PreviewHeader.scss';
const LoadableContentAnswers = AsyncLoad({
  // $FlowFixMe TypeScript component
  loader: () => import(/* webpackMode: "lazy", webpackChunkName: "content-answers" */'../../common/content-answers')
});
const LoadableContentOpenWith = AsyncLoad({
  loader: () => import(/* webpackMode: "lazy", webpackChunkName: "content-open-with" */'../../content-open-with')
});
const PreviewHeader = ({
  canAnnotate,
  canDownload,
  canPrint,
  contentAnswersProps = {},
  contentOpenWithProps = {},
  file,
  intl,
  logoUrl,
  onClose,
  onDownload,
  onPrint,
  selectedVersion,
  token
}) => {
  const fileId = file && file.id;
  const shouldRenderAnswers = fileId && contentAnswersProps.show;
  const shouldRenderOpenWith = fileId && contentOpenWithProps.show;
  const currentVersionId = getProp(file, 'file_version.id');
  const selectedVersionId = getProp(selectedVersion, 'id', currentVersionId);
  const isPreviewingCurrentVersion = currentVersionId === selectedVersionId;

  // When previewing an older version the close button returns the user to the current version
  const closeMsg = isPreviewingCurrentVersion ? intl.formatMessage(messages.close) : intl.formatMessage(messages.back);
  const printMsg = intl.formatMessage(messages.print);
  const downloadMsg = intl.formatMessage(messages.download);
  const drawMsg = intl.formatMessage(messages.drawAnnotation);
  const pointMsg = intl.formatMessage(messages.pointAnnotation);
  return /*#__PURE__*/React.createElement("header", {
    className: classNames('bcpr-PreviewHeader', {
      'bcpr-PreviewHeader--basic': !isPreviewingCurrentVersion
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcpr-PreviewHeader-content bp-header bp-base-header"
  }, logoUrl ? /*#__PURE__*/React.createElement(Logo, {
    url: logoUrl
  }) : /*#__PURE__*/React.createElement(FileInfo, {
    file: file,
    version: selectedVersion
  }), /*#__PURE__*/React.createElement("div", {
    className: "bcpr-PreviewHeader-controls"
  }, isPreviewingCurrentVersion && /*#__PURE__*/React.createElement(React.Fragment, null, shouldRenderOpenWith && /*#__PURE__*/React.createElement(LoadableContentOpenWith, _extends({
    className: "bcpr-bcow-btn",
    fileId: fileId,
    token: token
  }, contentOpenWithProps)), shouldRenderAnswers && /*#__PURE__*/React.createElement(LoadableContentAnswers, _extends({
    className: "bcpr-PreviewHeader-contentAnswers",
    file: file
  }, contentAnswersProps)), canAnnotate && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PlainButton, {
    "aria-label": drawMsg,
    className: "bcpr-PreviewHeader-button bp-btn-annotate-draw bp-is-hidden",
    title: drawMsg,
    type: "button"
  }, /*#__PURE__*/React.createElement(IconDrawAnnotationMode, {
    color: bdlGray50,
    height: 18,
    width: 18
  })), /*#__PURE__*/React.createElement(PlainButton, {
    "aria-label": pointMsg,
    className: "bcpr-PreviewHeader-button bp-btn-annotate-point bp-is-hidden",
    title: pointMsg,
    type: "button"
  }, /*#__PURE__*/React.createElement(IconPointAnnotation, {
    color: bdlGray50,
    height: 18,
    width: 18
  }))), canPrint && /*#__PURE__*/React.createElement(PlainButton, {
    "aria-label": printMsg,
    className: "bcpr-PreviewHeader-button",
    onClick: onPrint,
    title: printMsg,
    type: "button"
  }, /*#__PURE__*/React.createElement(IconPrint, {
    color: bdlGray50,
    height: 22,
    width: 22
  })), canDownload && /*#__PURE__*/React.createElement(PlainButton, {
    "aria-label": downloadMsg,
    className: "bcpr-PreviewHeader-button",
    "data-target-id": "PreviewHeader-downloadButton",
    onClick: onDownload,
    title: downloadMsg,
    type: "button"
  }, /*#__PURE__*/React.createElement(IconDownload, {
    color: bdlGray50,
    height: 18,
    width: 18
  }))), onClose && /*#__PURE__*/React.createElement(PlainButton, {
    "aria-label": isPreviewingCurrentVersion && closeMsg,
    className: "bcpr-PreviewHeader-button bcpr-PreviewHeader-button-close",
    onClick: onClose,
    type: "button"
  }, isPreviewingCurrentVersion ? /*#__PURE__*/React.createElement(IconClose, {
    color: bdlGray50,
    height: 24,
    width: 24
  }) : closeMsg))));
};
export default injectIntl(PreviewHeader);
//# sourceMappingURL=PreviewHeader.js.map