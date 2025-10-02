function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DEFAULT_MAX_APP_COUNT, SECURITY_CONTROLS_FORMAT } from '../constants';
import { getShortSecurityControlsMessage, getFullSecurityControlsMessages } from './utils';
import messages from './messages';
import PlainButton from '../../../components/plain-button';
import Label from '../../../components/label/Label';
import SecurityControlsItem from './SecurityControlsItem';
import SecurityControlsModal from './SecurityControlsModal';
import './SecurityControls.scss';
const {
  FULL,
  SHORT,
  SHORT_WITH_BTN
} = SECURITY_CONTROLS_FORMAT;
class SecurityControls extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isSecurityControlsModalOpen: false
    });
    _defineProperty(this, "openModal", () => this.setState({
      isSecurityControlsModalOpen: true
    }));
    _defineProperty(this, "closeModal", () => this.setState({
      isSecurityControlsModalOpen: false
    }));
  }
  render() {
    const {
      classificationColor,
      classificationName,
      controls,
      controlsFormat,
      definition,
      itemName,
      maxAppCount,
      shouldRenderLabel,
      shouldDisplayAppsAsIntegrations
    } = this.props;
    let items = [];
    let modalItems;
    if (controlsFormat === FULL) {
      items = getFullSecurityControlsMessages(controls, maxAppCount, shouldDisplayAppsAsIntegrations);
    } else {
      items = getShortSecurityControlsMessage(controls, shouldDisplayAppsAsIntegrations);
      if (items.length && controlsFormat === SHORT_WITH_BTN) {
        modalItems = getFullSecurityControlsMessages(controls, maxAppCount, shouldDisplayAppsAsIntegrations);
      }
    }
    if (!items.length) {
      return null;
    }
    const {
      isSecurityControlsModalOpen
    } = this.state;
    const shouldShowSecurityControlsModal = controlsFormat === SHORT_WITH_BTN && !!itemName && !!classificationName && !!definition;
    let itemsList = /*#__PURE__*/React.createElement("ul", {
      className: "bdl-SecurityControls"
    }, items.map(({
      message,
      tooltipMessage
    }, index) => /*#__PURE__*/React.createElement(SecurityControlsItem, {
      key: index,
      message: message,
      tooltipMessage: tooltipMessage
    })));
    if (shouldRenderLabel) {
      itemsList = /*#__PURE__*/React.createElement(Label, {
        text: /*#__PURE__*/React.createElement(FormattedMessage, messages.securityControlsLabel)
      }, itemsList);
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, itemsList, shouldShowSecurityControlsModal && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PlainButton, {
      className: "lnk",
      onClick: this.openModal,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.viewAll)), /*#__PURE__*/React.createElement(SecurityControlsModal, {
      classificationColor: classificationColor,
      classificationName: classificationName,
      closeModal: this.closeModal,
      definition: definition,
      itemName: itemName,
      isSecurityControlsModalOpen: isSecurityControlsModalOpen,
      modalItems: modalItems
    })));
  }
}
_defineProperty(SecurityControls, "defaultProps", {
  classificationName: '',
  definition: '',
  itemName: '',
  controls: {},
  controlsFormat: SHORT,
  maxAppCount: DEFAULT_MAX_APP_COUNT,
  shouldRenderLabel: false,
  shouldDisplayAppsAsIntegrations: false
});
export default SecurityControls;
//# sourceMappingURL=SecurityControls.js.map