// @flow
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import { injectIntl } from 'react-intl';

import { Modal } from '../../components/modal';

import UnifiedShareModalTitle from './UnifiedShareModalTitle';
import UnifiedShareForm from './UnifiedShareForm';
import RemoveLinkConfirmModal from './RemoveLinkConfirmModal';
import RemoveCollaboratorConfirmModal from './RemoveCollaboratorConfirmModal';
import type { USMProps, collaboratorType } from './flowTypes';

import './UnifiedShareModal.scss';

type State = {
    getInitialDataCalled: boolean,
    isRemoveLinkConfirmModalOpen: boolean,
    isRemoveCollaboratorConfirmModalOpen: boolean,
    collaboratorToRemove: ?collaboratorType,
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
        canRemoveCollaborators: false,
        trackingProps: {
            inviteCollabsEmailTracking: {},
            sharedLinkEmailTracking: {},
            sharedLinkTracking: {},
            inviteCollabTracking: {},
            modalTracking: {},
            removeLinkConfirmModalTracking: {},
            removeCollaboratorConfirmModalTracking: {},
            collaboratorListTracking: {},
        },
    };

    constructor(props: USMProps) {
        super(props);

        const { initialDataReceived } = props;

        this.state = {
            getInitialDataCalled: !!initialDataReceived,
            isRemoveLinkConfirmModalOpen: false,
            isRemoveCollaboratorConfirmModalOpen: false,
            isEmailLinkSectionExpanded: false,
            isFetching: !initialDataReceived,
            sharedLinkLoaded: false,
            shouldRenderFTUXTooltip: false,
            showCollaboratorList: false,
            collaboratorToRemove: null,
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
        this.setState({ isRemoveLinkConfirmModalOpen: true });
    };

    openRemoveCollaboratorConfirmModal = (collaborator: collaboratorType) => {
        const { canRemoveCollaborators } = this.props;
        if (canRemoveCollaborators) {
            this.setState({ isRemoveCollaboratorConfirmModalOpen: true, collaboratorToRemove: collaborator });
        }
    };

    closeConfirmModal = () => {
        this.setState({ isRemoveLinkConfirmModalOpen: false });
    };

    closeRemoveCollaboratorConfirmModal = () => {
        this.setState({
            isRemoveCollaboratorConfirmModalOpen: false,
            collaboratorToRemove: null,
            shouldRenderFTUXTooltip: false,
        });
    };

    removeLink = () => {
        const { onRemoveLink, displayInModal } = this.props;
        onRemoveLink();
        if (!displayInModal) {
            this.closeConfirmModal();
        }
    };

    removeCollaborator = async () => {
        const { onRemoveCollaborator } = this.props;
        if (this.state.collaboratorToRemove) {
            await onRemoveCollaborator?.(this.state.collaboratorToRemove);
        }

        this.closeRemoveCollaboratorConfirmModal();
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
                onRemoveCollaboratorClick={this.openRemoveCollaboratorConfirmModal}
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
        const { modalTracking, removeLinkConfirmModalTracking, removeCollaboratorConfirmModalTracking } = trackingProps;
        const { modalProps } = modalTracking;
        const {
            isEmailLinkSectionExpanded,
            isRemoveLinkConfirmModalOpen,
            isRemoveCollaboratorConfirmModalOpen,
            showCollaboratorList,
        } = this.state;

        // focus logic at modal level
        const extendedModalProps = {
            focusElementSelector: canInvite
                ? '.bdl-PillSelector-input' // focus on invite collaborators field
                : '.toggle-simple', // focus on shared link toggle
            ...modalProps,
        };

        return (
            <>
                {displayInModal ? (
                    <Modal
                        className="be-modal unified-share-modal"
                        isOpen={isRemoveLinkConfirmModalOpen || isRemoveCollaboratorConfirmModalOpen ? false : isOpen}
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
                {isRemoveLinkConfirmModalOpen && (
                    <RemoveLinkConfirmModal
                        isOpen={isRemoveLinkConfirmModalOpen}
                        onRequestClose={this.closeConfirmModal}
                        removeLink={this.removeLink}
                        submitting={submitting}
                        {...removeLinkConfirmModalTracking}
                    />
                )}
                {isRemoveCollaboratorConfirmModalOpen && (
                    <RemoveCollaboratorConfirmModal
                        isOpen={isRemoveCollaboratorConfirmModalOpen}
                        onRequestClose={this.closeRemoveCollaboratorConfirmModal}
                        onSubmit={this.removeCollaborator}
                        submitting={submitting}
                        collaborator={this.state.collaboratorToRemove}
                        modalProps={{ className: 'remove-collaborator-confirm-modal' }}
                        {...removeCollaboratorConfirmModalTracking}
                    />
                )}
            </>
        );
    }
}

export { UnifiedShareModal as UnifiedShareModalBase };
export default injectIntl(UnifiedShareModal);
