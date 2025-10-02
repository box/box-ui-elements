import * as React from 'react';
import noop from 'lodash/noop';
import Megaphone20 from '../../../icon/fill/Megaphone20';
import CountBadge from '../../../components/count-badge/CountBadge';
import Badgeable from '../../../components/badgeable/Badgeable';
import MessageCenterModal from './message-center-modal/MessageCenterModal';
import Internationalize from '../../../elements/common/Internationalize';
function MessageCenter({
  contentPreviewProps,
  getUnreadMessageCount,
  buttonComponent: ButtonComponent,
  getEligibleMessages,
  getToken,
  apiHost,
  postMarkAllMessagesAsSeen,
  overscanRowCount,
  language,
  messages,
  onMessageShown = noop
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = React.useState(null);
  // TODO: create hook for fetching, loading
  const [eligibleMessages, setEligibleMessages] = React.useState(null);
  const isFetchingMessagesRef = React.useRef(false);
  React.useEffect(() => {
    async function fetchUnreadMessageCount() {
      try {
        const {
          count
        } = await getUnreadMessageCount();
        setUnreadMessageCount(count);
      } catch (err) {
        // TODO: add error handling
      }
    }
    fetchUnreadMessageCount();
  }, [getUnreadMessageCount]);
  React.useEffect(() => {
    async function fetchEligibleMessages() {
      if (!isFetchingMessagesRef.current) {
        isFetchingMessagesRef.current = true;
        try {
          const eligibleMessagesResponse = await getEligibleMessages();
          setEligibleMessages(eligibleMessagesResponse);
        } catch (err) {
          setEligibleMessages(err);
        }
        isFetchingMessagesRef.current = false;
      }
    }
    const isOpenAndNoMessages = isOpen && !eligibleMessages;
    // if there are unread messages, prefetch the data as the user is more likely to click on the message center
    const shouldPrefetch = !isOpen && !eligibleMessages && !!unreadMessageCount;
    if (isOpenAndNoMessages || shouldPrefetch) {
      fetchEligibleMessages();
    }
  }, [eligibleMessages, getEligibleMessages, isOpen, unreadMessageCount]);
  function handleOnClick() {
    setIsOpen(prevIsOpen => !prevIsOpen);
    if (unreadMessageCount && unreadMessageCount > 0 && eligibleMessages) {
      try {
        postMarkAllMessagesAsSeen(eligibleMessages);
      } catch (err) {
        // swallow
      }
      setUnreadMessageCount(0);
    }
  }
  function onRequestClose() {
    setIsOpen(false);
  }
  const icon = /*#__PURE__*/React.createElement(ButtonComponent, {
    badgeCount: unreadMessageCount,
    "data-resin-target": "messageCenterOpenModal",
    "data-testid": "message-center-unread-count",
    onClick: handleOnClick,
    render: () => /*#__PURE__*/React.createElement(Badgeable, {
      className: "icon-bell-badge",
      topRight: /*#__PURE__*/React.createElement(CountBadge, {
        isVisible: !!unreadMessageCount,
        shouldAnimate: true,
        value: unreadMessageCount || 0
      })
    }, /*#__PURE__*/React.createElement(Megaphone20, {
      className: "bdl-MessageCenter-icon"
    }))
  });
  return /*#__PURE__*/React.createElement(Internationalize, {
    messages: messages,
    language: language
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdl-MessageCenter",
    "data-resin-component": "messageCenter"
  }, isOpen ? /*#__PURE__*/React.createElement(React.Fragment, null, icon, /*#__PURE__*/React.createElement(MessageCenterModal, {
    apiHost: apiHost,
    contentPreviewProps: contentPreviewProps,
    getToken: getToken,
    messages: eligibleMessages,
    onRequestClose: onRequestClose,
    overscanRowCount: overscanRowCount,
    onMessageShown: onMessageShown
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, icon)));
}
export default MessageCenter;
//# sourceMappingURL=MessageCenter.js.map