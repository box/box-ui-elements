import { createContext } from 'react';
const defaultMessageContextValue = {
  messageStateMap: {},
  messageApi: {
    eligibleMessageIDMap: {},
    markMessageAsSeen: () => {},
    markMessageAsClosed: () => {}
  },
  setMessageStateMap: () => {}
};
const MessageContext = /*#__PURE__*/createContext(defaultMessageContextValue);
export default MessageContext;
//# sourceMappingURL=MessageContext.js.map