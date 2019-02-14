import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import Button from '../../components/button';
import { Modal, ModalActions } from '../../components/modal';
import commonMessages from '../../common/messages';

import FileVersionList from './FileVersionList';

import messages from './messages';
import { VersionsPropType } from './prop-types';

class VersionHistoryModal extends Component {
    static propTypes = {
        canDelete: PropTypes.bool,
        canUpload: PropTypes.bool,
        isOpen: PropTypes.bool,
        isProcessing: PropTypes.bool,
        onDelete: PropTypes.func.isRequired,
        onDownload: PropTypes.func.isRequired,
        onMakeCurrent: PropTypes.func.isRequired,
        onRestore: PropTypes.func.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        scrollToVersionNumber: PropTypes.number,
        versionLimit: PropTypes.number,
        versions: VersionsPropType.isRequired,
    };

    renderFileVersionList() {
        const {
            canDelete,
            canUpload,
            isProcessing,
            onDelete,
            onDownload,
            onMakeCurrent,
            onRestore,
            scrollToVersionNumber,
            versionLimit,
            versions,
        } = this.props;

        if (!versions || versions.length <= 0) {
            return null;
        }

        return (
            <FileVersionList
                canDelete={canDelete}
                canUpload={canUpload}
                isProcessing={isProcessing}
                onDelete={onDelete}
                onDownload={onDownload}
                onMakeCurrent={onMakeCurrent}
                onRestore={onRestore}
                scrollToVersionNumber={scrollToVersionNumber}
                versionLimit={versionLimit}
                versions={versions}
            />
        );
    }

    render() {
        const { isOpen, onRequestClose } = this.props;

        return (
            <Modal
                className="version-history-modal"
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                title={<FormattedMessage {...messages.title} />}
            >
                {this.renderFileVersionList()}
                <ModalActions>
                    <Button onClick={onRequestClose} type="button">
                        <FormattedMessage {...commonMessages.close} />
                    </Button>
                </ModalActions>
            </Modal>
        );
    }
}

export default VersionHistoryModal;
