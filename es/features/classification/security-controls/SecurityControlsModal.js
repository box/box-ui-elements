function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, ModalActions } from '../../../components/modal';
import commonMessages from '../../../common/messages';
import Button from '../../../components/button';
import classificationMessages from '../messages';
import ClassifiedBadge from '../ClassifiedBadge';
import Label from '../../../components/label/Label';
import messages from './messages';
import SecurityControlsItem from './SecurityControlsItem';
import './SecurityControlsModal.scss';
const SecurityControlsModal = ({
  closeModal,
  definition,
  classificationColor,
  classificationName,
  isSecurityControlsModalOpen,
  itemName,
  modalItems
}) => {
  if (!itemName || !classificationName || !definition) {
    return null;
  }
  const title = /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.modalTitle, {
    values: {
      itemName
    }
  }));
  return /*#__PURE__*/React.createElement(Modal, {
    className: "bdl-SecurityControlsModal",
    title: title,
    onRequestClose: closeModal,
    isOpen: isSecurityControlsModalOpen
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(FormattedMessage, messages.modalDescription)), /*#__PURE__*/React.createElement(ClassifiedBadge, {
    color: classificationColor,
    name: classificationName
  }), /*#__PURE__*/React.createElement(Label, {
    text: /*#__PURE__*/React.createElement(FormattedMessage, classificationMessages.definition)
  }, /*#__PURE__*/React.createElement("p", {
    className: "bdl-SecurityControlsModal-definition"
  }, definition)), /*#__PURE__*/React.createElement("ul", {
    className: "bdl-SecurityControlsModal-controlsItemList"
  }, modalItems.map(({
    message,
    tooltipMessage
  }, index) => /*#__PURE__*/React.createElement(SecurityControlsItem, {
    key: index,
    message: message,
    tooltipMessage: tooltipMessage
  }))), /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, {
    onClick: closeModal,
    type: "button"
  }, /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.close))));
};
SecurityControlsModal.defaultProps = {
  isSecurityControlsModalOpen: false,
  modalItems: []
};
export default SecurityControlsModal;
//# sourceMappingURL=SecurityControlsModal.js.map