// @flow
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import { injectIntl } from 'react-intl';

import { Modal } from '../../components/modal';

import UnifiedShareModalTitle from './UnifiedShareModalTitle';
import UnifiedShareForm from './UnifiedShareForm';
import RemoveLinkConfirmModal from './RemoveLinkConfirmModal';
import type { USMProps } from './flowTypes';

import './UnifiedShareModal.scss';

type State = {
    getInitialDataCalled: boolean,
    isConfirmModalOpen: boolean,
    isEmailLinkSectionExpanded: boolean,
    isFetching: boolean,
    sharedLinkLoaded: boolean,
    shouldRenderFTUXTooltip: boolean,
    showCollaboratorList: boolean,
};

class UnifiedShareModal extends React.Component<USMProps, State> {
    static defaultProps = {
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
            collaboratorListTracking: {},
        },
    };

    constructor(props: USMProps) {
        super(props);

        const { initialDataReceived } = props;

        this.state = {
            getInitialDataCalled: !!initialDataReceived,
            isConfirmModalOpen: false,
            isEmailLinkSectionExpanded: false,
            isFetching: !initialDataReceived,
            sharedLinkLoaded: false,
            shouldRenderFTUXTooltip: false,
            showCollaboratorList: false,
        };
    }

    componentDidMount() {
        const { item, trackingProps } = this.props;
        const { type, typedID } = item;
        const { modalTracking } = trackingProps;
        const { onLoad } = modalTracking;
        const { getInitialDataCalled } = this.state;

        // This check is to ensure minimum item props are
        // hydrated before we fetch data
        if (!getInitialDataCalled && type && typedID) {
            this.getInitialData();
        }

        if (onLoad) {
            onLoad();
        }
    }

    componentDidUpdate(prevProps: USMProps) {
        const { item, sharedLink, trackingProps } = this.props;
        const { type, typedID } = item;
        const { modalTracking } = trackingProps;
        const { onLoadSharedLink } = modalTracking;
        const prevSharedLink = prevProps.sharedLink;
        const { getInitialDataCalled } = this.state;

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
            this.setState({ sharedLinkLoaded: true });
        }
    }

    getInitialData = () => {
        const { getInitialData } = this.props;

        getInitialData().finally(() => {
            this.setState({
                isFetching: false,
                shouldRenderFTUXTooltip: true,
            });
        });
        this.setState({ getInitialDataCalled: true });
    };

    handleFtuxCloseClick = () => {
        this.setState({
            shouldRenderFTUXTooltip: false,
        });
    };

    openConfirmModal = () => {
        this.setState({ isConfirmModalOpen: true });
    };

    closeConfirmModal = () => {
        this.setState({ isConfirmModalOpen: false });
    };

    removeLink = () => {
        const { onRemoveLink, displayInModal } = this.props;
        onRemoveLink();
        if (!displayInModal) {
            this.closeConfirmModal();
        }
    };

    renderUSF = () => {
        const { onCollaboratorAvatarsClick, sharedLinkEditTagTargetingApi, sharedLinkEditTooltipTargetingApi } =
            this.props;
        const { isFetching, sharedLinkLoaded, shouldRenderFTUXTooltip } = this.state;

        return (
            <UnifiedShareForm
                {...this.props}
                onCollaboratorAvatarsClick={onCollaboratorAvatarsClick}
                handleFtuxCloseClick={this.handleFtuxCloseClick}
                isFetching={isFetching}
                openConfirmModal={this.openConfirmModal}
                sharedLinkEditTagTargetingApi={sharedLinkEditTagTargetingApi}
                sharedLinkEditTooltipTargetingApi={sharedLinkEditTooltipTargetingApi}
                sharedLinkLoaded={sharedLinkLoaded}
                shouldRenderFTUXTooltip={shouldRenderFTUXTooltip}
            />
        );
    };

    render() {
        // Shared link section props
        const { canInvite, displayInModal, isOpen, item, onRequestClose, submitting, trackingProps } = this.props;
        const { modalTracking, removeLinkConfirmModalTracking } = trackingProps;
        const { modalProps } = modalTracking;
        const { isEmailLinkSectionExpanded, isConfirmModalOpen, showCollaboratorList } = this.state;

        // focus logic at modal level
        const extendedModalProps = {
            focusElementSelector: canInvite
                ? '.bdl-PillSelector-input' // focus on invite collabs field
                : '.toggle-simple', // focus on shared link toggle
            ...modalProps,
        };

        return (
            <>
                {displayInModal ? (
                    <Modal
                        className="be-modal unified-share-modal"
                        isOpen={isConfirmModalOpen ? false : isOpen}
                        onRequestClose={submitting ? undefined : onRequestClose}
                        title={
                            <UnifiedShareModalTitle
                                isEmailLinkSectionExpanded={isEmailLinkSectionExpanded}
                                showCollaboratorList={showCollaboratorList}
                                item={item}
                            />
                        }
                        {...extendedModalProps}
                    >
                        {this.renderUSF()}
                    </Modal>
                ) : (
                    <div className="bdl-UnifiedShareForm-container">{this.renderUSF()}</div>
                )}
                {isConfirmModalOpen && (
                    <RemoveLinkConfirmModal
                        isOpen={isConfirmModalOpen}
                        onRequestClose={this.closeConfirmModal}
                        removeLink={this.removeLink}
                        submitting={submitting}
                        {...removeLinkConfirmModalTracking}
                    />
                )}
            </>
        );
    }
}

export { UnifiedShareModal as UnifiedShareModalBase };
export default injectIntl(UnifiedShareModal);
