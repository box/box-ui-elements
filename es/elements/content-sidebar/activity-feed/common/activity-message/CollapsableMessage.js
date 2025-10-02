import * as React from 'react';
import classNames from 'classnames';
import CollapsableMessageToggle from './CollapsableMessageToggle';
import './ActivityMessage.scss';
export default function CollapsableMessage({
  children
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const [shouldCollapse, setShouldCollapse] = React.useState(false);
  const messageContainer = React.useRef(null);
  React.useLayoutEffect(() => {
    if (messageContainer.current) {
      const {
        clientHeight,
        scrollHeight
      } = messageContainer.current;
      setShouldCollapse(clientHeight !== scrollHeight);
    }
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classNames({
      'bcs-ActivityMessage-collapsed': isCollapsed
    }),
    ref: messageContainer
  }, children), shouldCollapse && /*#__PURE__*/React.createElement(CollapsableMessageToggle, {
    isMore: isCollapsed,
    onClick: () => setIsCollapsed(prevState => !prevState)
  }));
}
//# sourceMappingURL=CollapsableMessage.js.map