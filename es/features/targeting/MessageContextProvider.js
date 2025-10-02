import * as React from 'react';
import MessageContext from './MessageContext';
const MessageContextProvider = ({
  children,
  messageApi
}) => {
  const [messageStateMap, setMessageStateMap] = React.useState({});
  const value = {
    messageStateMap,
    messageApi,
    setMessageStateMap
  };
  return /*#__PURE__*/React.createElement(MessageContext.Provider, {
    value: value
  }, children);
};
export default MessageContextProvider;
//# sourceMappingURL=MessageContextProvider.js.map