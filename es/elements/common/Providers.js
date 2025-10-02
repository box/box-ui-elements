import React, { Children } from 'react';
import { Notification, TooltipProvider } from '@box/blueprint-web';
const Providers = ({
  children,
  hasProviders = true
}) => {
  if (hasProviders) {
    return /*#__PURE__*/React.createElement(Notification.Provider, null, /*#__PURE__*/React.createElement(Notification.Viewport, null), /*#__PURE__*/React.createElement(TooltipProvider, null, children));
  }
  return Children.only(children);
};
export default Providers;
//# sourceMappingURL=Providers.js.map