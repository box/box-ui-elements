function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import PropTypes from 'prop-types';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Checkbox from '../../../components/checkbox/Checkbox';
import { RadioButton } from '../../../components/radio';
import { ContentExplorerModePropType } from '../prop-types';
import ContentExplorerModes from '../modes';
import messages from '../messages';
const ItemListButton = ({
  contentExplorerMode,
  id = '',
  isChecked = false,
  isDisabled = false,
  isSelected = false,
  name
}) => {
  if (contentExplorerMode === ContentExplorerModes.MULTI_SELECT) {
    return /*#__PURE__*/React.createElement(Checkbox, {
      hideLabel: true,
      isChecked: isChecked || !isDisabled && isSelected,
      isDisabled: isDisabled,
      label: /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.selectItem, {
        values: {
          name
        }
      })),
      name: "item",
      readOnly: true,
      value: id
    });
  }
  return /*#__PURE__*/React.createElement(RadioButton, {
    hideLabel: true,
    isDisabled: isDisabled,
    isSelected: !isDisabled && isSelected,
    label: /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.selectItem, {
      values: {
        name
      }
    })),
    name: "item",
    value: id
  });
};
ItemListButton.propTypes = {
  contentExplorerMode: ContentExplorerModePropType.isRequired,
  id: PropTypes.string,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  name: PropTypes.string.isRequired
};
export default ItemListButton;
//# sourceMappingURL=ItemListButton.js.map