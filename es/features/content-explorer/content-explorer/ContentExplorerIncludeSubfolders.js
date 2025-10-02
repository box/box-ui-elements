import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import InfoBadge16 from '../../../icon/fill/InfoBadge16';
import Toggle from '../../../components/toggle';
import Tooltip from '../../../components/tooltip';
import messages from '../messages';
const ContentExplorerIncludeSubfolders = ({
  isDisabled,
  onChange,
  tooltipMessage
}) => {
  const label = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, messages.includeSubfolders), tooltipMessage && /*#__PURE__*/React.createElement(Tooltip, {
    text: /*#__PURE__*/React.createElement(FormattedMessage, tooltipMessage)
  }, /*#__PURE__*/React.createElement(InfoBadge16, {
    className: "bdl-ContentExplorerIncludeSubfolders-icon",
    fill: "blue"
  })));
  return /*#__PURE__*/React.createElement(Toggle, {
    label: label,
    isDisabled: isDisabled,
    onChange: onChange
  });
};
ContentExplorerIncludeSubfolders.propTypes = {
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
  tooltipMessage: PropTypes.object
};
export { ContentExplorerIncludeSubfolders as ContentExplorerIncludeSubfoldersBase };
export default injectIntl(ContentExplorerIncludeSubfolders);
//# sourceMappingURL=ContentExplorerIncludeSubfolders.js.map