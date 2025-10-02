import * as React from 'react';
import PlainButton from '../plain-button';
import Tooltip from '../tooltip';
import { KEYS } from '../../constants';
import './SuggestedPillsRow.scss';
const SuggestedPill = ({
  email,
  id,
  name,
  onAdd
}) => {
  const addSuggestedPill = event => {
    event.preventDefault();

    // TODO: refactor this so inline conversions aren't required at every usage
    onAdd({
      email,
      id,
      name,
      text: name,
      type: 'user',
      value: email
    });
  };
  const handleKeyPress = event => {
    if (event.key === KEYS.enter) {
      addSuggestedPill(event);
    }
  };
  return /*#__PURE__*/React.createElement(Tooltip, {
    position: "bottom-center",
    text: email
  }, /*#__PURE__*/React.createElement(PlainButton, {
    className: "suggested-pill-invisible-button",
    onClick: addSuggestedPill,
    onKeyDown: handleKeyPress,
    type: "button"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdl-Pill-text pill-text suggested-pill"
  }, name)));
};
export default SuggestedPill;
//# sourceMappingURL=SuggestedPill.js.map