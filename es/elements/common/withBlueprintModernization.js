import React, { useContext } from 'react';
import { BlueprintModernizationContext, BlueprintModernizationProvider } from '@box/blueprint-web';
export function withBlueprintModernization(Component) {
  return function WithBlueprintModernization(props) {
    const context = useContext(BlueprintModernizationContext);
    // no context found from the parent component, so we need to provide our own
    if (!context.enableModernizedComponents) {
      return /*#__PURE__*/React.createElement(BlueprintModernizationProvider, {
        enableModernizedComponents: !!props.enableModernizedComponents
      }, /*#__PURE__*/React.createElement(Component, props));
    }
    // context found, so load the component with the existing context
    return /*#__PURE__*/React.createElement(Component, props);
  };
}
//# sourceMappingURL=withBlueprintModernization.js.map