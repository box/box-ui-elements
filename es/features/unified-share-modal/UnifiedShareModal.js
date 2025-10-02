function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Modal } from '../../components/modal';
import UnifiedShareModalTitle from './UnifiedShareModalTitle';
import UnifiedShareForm from './UnifiedShareForm';
import RemoveLinkConfirmModal from './RemoveLinkConfirmModal';
import RemoveCollaboratorConfirmModal from './RemoveCollaboratorConfirmModal';
import './UnifiedShareModal.scss';
class UnifiedShareModal extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "getInitialData", () => {
      const {
        getInitialData
      } = this.props;
      getInitialData().finally(() => {
        this.setState({
          isFetching: false,
          shouldRenderFTUXTooltip: true
        });
      });
      this.setState({
        getInitialDataCalled: true
      });
    });
    _defineProperty(this, "handleFtuxCloseClick", () => {
      this.setState({
        shouldRenderFTUXTooltip: false
      });
    });
    _defineProperty(this, "openConfirmModal", () => {
      this.setState({
        isRemoveLinkConfirmModalOpen: true
      });
    });
    _defineProperty(this, "openRemoveCollaboratorConfirmModal", collaborator => {
      const {
        canRemoveCollaborators
      } = this.props;
      if (canRemoveCollaborators) {
        this.setState({
          isRemoveCollaboratorConfirmModalOpen: true,
          collaboratorToRemove: collaborator
        });
      }
    });
    _defineProperty(this, "closeConfirmModal", () => {
      this.setState({
        isRemoveLinkConfirmModalOpen: false
      });
    });
    _defineProperty(this, "closeRemoveCollaboratorConfirmModal", () => {
      this.setState({
        isRemoveCollaboratorConfirmModalOpen: false,
        collaboratorToRemove: null,
        shouldRenderFTUXTooltip: false
      });
    });
    _defineProperty(this, "removeLink", () => {
      const {
        onRemoveLink,
        displayInModal
      } = this.props;
      onRemoveLink();
      if (!displayInModal) {
        this.closeConfirmModal();
      }
    });
    _defineProperty(this, "removeCollaborator", async () => {
      const {
        onRemoveCollaborator
      } = this.props;
      if (this.state.collaboratorToRemove) {
        await onRemoveCollaborator?.(this.state.collaboratorToRemove);
      }
      this.closeRemoveCollaboratorConfirmModal();
    });
    _defineProperty(this, "renderUSF", () => {
      const {
        onCollaboratorAvatarsClick,
        sharedLinkEditTagTargetingApi,
        sharedLinkEditTooltipTargetingApi
      } = this.props;
      const {
        isFetching,
        sharedLinkLoaded,
        shouldRenderFTUXTooltip
      } = this.state;
      return /*#__PURE__*/React.createElement(UnifiedShareForm, _extends({}, this.props, {
        onCollaboratorAvatarsClick: onCollaboratorAvatarsClick,
        handleFtuxCloseClick: this.handleFtuxCloseClick,
        onRemoveCollaboratorClick: this.openRemoveCollaboratorConfirmModal,
        isFetching: isFetching,
        openConfirmModal: this.openConfirmModal,
        sharedLinkEditTagTargetingApi: sharedLinkEditTagTargetingApi,
        sharedLinkEditTooltipTargetingApi: sharedLinkEditTooltipTargetingApi,
        sharedLinkLoaded: sharedLinkLoaded,
        shouldRenderFTUXTooltip: shouldRenderFTUXTooltip
      }));
    });
    const {
      initialDataReceived
    } = props;
    this.state = {
      collaboratorToRemove: null,
      getInitialDataCalled: !!initialDataReceived,
      isRemoveLinkConfirmModalOpen: false,
      isRemoveCollaboratorConfirmModalOpen: false,
      isEmailLinkSectionExpanded: false,
      isFetching: !initialDataReceived,
      sharedLinkLoaded: false,
      shouldRenderFTUXTooltip: false,
      showCollaboratorList: false
    };
  }
  componentDidMount() {
    const {
      item,
      trackingProps
    } = this.props;
    const {
      type,
      typedID
    } = item;
    const {
      modalTracking
    } = trackingProps;
    const {
      onLoad
    } = modalTracking;
    const {
      getInitialDataCalled
    } = this.state;

    // This check is to ensure minimum item props are
    // hydrated before we fetch data
    if (!getInitialDataCalled && type && typedID) {
      this.getInitialData();
    }
    if (onLoad) {
      onLoad();
    }
  }
  componentDidUpdate(prevProps) {
    const {
      item,
      sharedLink,
      trackingProps
    } = this.props;
    const {
      type,
      typedID
    } = item;
    const {
      modalTracking
    } = trackingProps;
    const {
      onLoadSharedLink
    } = modalTracking;
    const prevSharedLink = prevProps.sharedLink;
    const {
      getInitialDataCalled
    } = this.state;

    // This check is to ensure minimum item props are
    // hydrated before we fetch data
    if (!getInitialDataCalled && type && typedID) {
      this.getInitialData();
    }

    // this ensures that we obtain shared link information the first time data is returned
    // so we can pass the corresponding permissions in the callback
    if (!prevSharedLink.permissionLevel && sharedLink.permissionLevel && onLoadSharedLink) {
      onLoadSharedLink(sharedLink.permissionLevel);
    }

    // we use state to override the default auto copy prop when a URL comes into view
    if (prevSharedLink.url !== sharedLink.url && sharedLink.url) {
      this.setState({
        sharedLinkLoaded: true
      });
    }
  }
  render() {
    // Shared link section props
    const {
      canInvite,
      displayInModal,
      isOpen,
      item,
      onRequestClose,
      submitting,
      trackingProps
    } = this.props;
    const {
      modalTracking,
      removeLinkConfirmModalTracking,
      removeCollaboratorConfirmModalTracking
    } = trackingProps;
    const {
      modalProps
    } = modalTracking;
    const {
      isEmailLinkSectionExpanded,
      isRemoveLinkConfirmModalOpen,
      isRemoveCollaboratorConfirmModalOpen,
      showCollaboratorList
    } = this.state;

    // focus logic at modal level
    const extendedModalProps = _objectSpread({
      focusElementSelector: canInvite ? '.bdl-PillSelector-input' // focus on invite collaborators field
      : '.toggle-simple'
    }, modalProps);
    return /*#__PURE__*/React.createElement(React.Fragment, null, displayInModal ? /*#__PURE__*/React.createElement(Modal, _extends({
      className: "be-modal unified-share-modal",
      isOpen: isRemoveLinkConfirmModalOpen || isRemoveCollaboratorConfirmModalOpen ? false : isOpen,
      onRequestClose: submitting ? undefined : onRequestClose,
      title: /*#__PURE__*/React.createElement(UnifiedShareModalTitle, {
        isEmailLinkSectionExpanded: isEmailLinkSectionExpanded,
        showCollaboratorList: showCollaboratorList,
        item: item
      })
    }, extendedModalProps), this.renderUSF()) : /*#__PURE__*/React.createElement("div", {
      className: "bdl-UnifiedShareForm-container"
    }, this.renderUSF()), isRemoveLinkConfirmModalOpen && /*#__PURE__*/React.createElement(RemoveLinkConfirmModal, _extends({
      isOpen: isRemoveLinkConfirmModalOpen,
      onRequestClose: this.closeConfirmModal,
      removeLink: this.removeLink,
      submitting: submitting
    }, removeLinkConfirmModalTracking)), isRemoveCollaboratorConfirmModalOpen && /*#__PURE__*/React.createElement(RemoveCollaboratorConfirmModal, _extends({
      isOpen: isRemoveCollaboratorConfirmModalOpen,
      onRequestClose: this.closeRemoveCollaboratorConfirmModal,
      onSubmit: this.removeCollaborator,
      submitting: submitting,
      collaborator: this.state.collaboratorToRemove,
      modalProps: {
        className: 'remove-collaborator-confirm-modal'
      }
    }, removeCollaboratorConfirmModalTracking)));
  }
}
_defineProperty(UnifiedShareModal, "defaultProps", {
  canRemoveCollaborators: false,
  displayInModal: true,
  initiallySelectedContacts: [],
  isAllowEditSharedLinkForFileEnabled: false,
  createSharedLinkOnLoad: false,
  focusSharedLinkOnLoad: false,
  restrictedCollabEmails: [],
  restrictedGroups: [],
  trackingProps: {
    inviteCollabsEmailTracking: {},
    sharedLinkEmailTracking: {},
    sharedLinkTracking: {},
    inviteCollabTracking: {},
    modalTracking: {},
    removeLinkConfirmModalTracking: {},
    removeCollaboratorConfirmModalTracking: {},
    collaboratorListTracking: {}
  }
});
export { UnifiedShareModal as UnifiedShareModalBase };
export default injectIntl(UnifiedShareModal);
//# sourceMappingURL=UnifiedShareModal.js.map