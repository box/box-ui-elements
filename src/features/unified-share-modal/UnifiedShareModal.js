// @flow

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
        initiallySelectedContacts: [],
        createSharedLinkOnLoad: false,
        focusSharedLinkOnLoad: false,
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

        this.state = {
            getInitialDataCalled: false,
            isConfirmModalOpen: false,
            isEmailLinkSectionExpanded: false,
            isFetching: false,
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
        const { item, sharedLink } = this.props;
        const { type, typedID } = item;
        const prevSharedLink = prevProps.sharedLink;
        const { getInitialDataCalled } = this.state;

        // This check is to ensure minimum item props are
        // hydrated before we fetch data
        if (!getInitialDataCalled && type && typedID) {
            this.getInitialData();
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
        const { onRemoveLink, showFormOnly } = this.props;
        onRemoveLink();
        if (showFormOnly) {
            this.closeConfirmModal();
        }
    };

    renderUSF = () => {
        const { isFetching, sharedLinkLoaded, shouldRenderFTUXTooltip } = this.state;
        return (
            <UnifiedShareForm
                {...this.props}
                closeConfirmModal={this.closeConfirmModal}
                handleFtuxCloseClick={this.handleFtuxCloseClick}
                isFetching={isFetching}
                openConfirmModal={this.openConfirmModal}
                sharedLinkLoaded={sharedLinkLoaded}
                shouldRenderFTUXTooltip={shouldRenderFTUXTooltip}
            />
        );
    };

    render() {
        // Shared link section props
        const { canInvite, isOpen, item, onRequestClose, showFormOnly, submitting, trackingProps } = this.props;
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
                {showFormOnly ? (
                    this.renderUSF()
                ) : (
                    <Modal
                        className="unified-share-modal"
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
