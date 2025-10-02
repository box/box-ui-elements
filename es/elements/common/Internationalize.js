/**
 * 
 * @file Wraps a component in an IntlProvider
 * @author Box
 */

import React, { Children } from 'react';
import { IntlProvider } from 'react-intl';
const Internationalize = ({
  language,
  messages,
  children
}) => {
  const shouldInternationalize = !!language && !!messages;
  if (shouldInternationalize) {
    return /*#__PURE__*/React.createElement(IntlProvider, {
      locale: language,
      messages: messages
    }, children);
  }
  return Children.only(children);
};
export default Internationalize;
//# sourceMappingURL=Internationalize.js.map