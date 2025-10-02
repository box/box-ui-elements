import * as React from 'react';
import IconFileVideo from '../../icon/content/FileVideo32';
import PreviewLoadingRing from './PreviewLoadingRing';
import { getColor, getIcon } from './previewIcons';
import './PreviewLoading.scss';
export default function PreviewLoading({
  extension
}) {
  const color = getColor(extension);
  const Icon = getIcon(extension);
  const theme = Icon === IconFileVideo ? 'dark' : 'light'; // Video files are displayed on a dark background

  return /*#__PURE__*/React.createElement(PreviewLoadingRing, {
    className: "bdl-PreviewLoading",
    color: color,
    theme: theme
  }, /*#__PURE__*/React.createElement(Icon, {
    className: "bdl-PreviewLoading-icon"
  }));
}
//# sourceMappingURL=PreviewLoading.js.map