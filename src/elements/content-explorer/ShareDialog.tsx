import * as React from 'react';
import Modal from 'react-modal';
import noop from 'lodash/noop';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Modal as BlueprintModal, Text } from '@box/blueprint-web';

import ShareAccessSelect from '../common/share-access-select';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../constants';
import type { Access, BoxItem } from '../../common/types/core';

import messages from '../common/messages';

import './ShareDialog.scss';

export interface ShareDialogProps {
    appElement: HTMLElement;
    canSetShareAccess: boolean;
    isLoading: boolean;
    isOpen: boolean;
    item: BoxItem;
    onCancel: () => void;
    onShareAccessChange: (access: Access) => void;
    parentElement: HTMLElement;
}

const ShareDialog = ({
    appElement,
    canSetShareAccess,
    isLoading,
    isOpen,
    item,
    onCancel,
    onShareAccessChange,
    parentElement,
}: ShareDialogProps) => {
    const { formatMessage } = useIntl();
    let textInput = null;

    const copy = () => {
        if (textInput instanceof HTMLInputElement) {
            textInput.select();
            document.execCommand('copy');
        }
    };

    const { shared_link: sharedLink }: BoxItem = item;
    const { url } = sharedLink || {
        url: formatMessage(messages.shareDialogNone),
    };

    return (
        <Modal
            appElement={appElement}
            className={CLASS_MODAL_CONTENT}
            contentLabel={formatMessage(messages.shareDialogLabel)}
            isOpen={isOpen}
            onRequestClose={onCancel}
            overlayClassName={CLASS_MODAL_OVERLAY}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} be-modal-share`}
        >
            <BlueprintModal.Body>
                <Text as="label">
                    <FormattedMessage {...messages.shareDialogText} />
                </Text>
                <div className="be-modal-input-group">
                    <input
                        ref={input => {
                            textInput = input;
                        }}
                        onChange={noop}
                        type="text"
                        value={url}
                    />
                    <Button autoFocus className="be-modal-button-copy" onClick={copy} variant="primary">
                        {formatMessage(messages.copy)}
                    </Button>
                </div>

                <BlueprintModal.Footer className="be-modal-btns">
                    <ShareAccessSelect
                        canSetShareAccess={canSetShareAccess}
                        className="bce-shared-access-select"
                        item={item}
                        onChange={onShareAccessChange}
                    />
                    <Button
                        loading={isLoading}
                        loadingAriaLabel={formatMessage(messages.loading)}
                        onClick={onCancel}
                        size="large"
                        variant="secondary"
                    >
                        {formatMessage(messages.close)}
                    </Button>
                </BlueprintModal.Footer>
            </BlueprintModal.Body>
        </Modal>
    );
};

export default ShareDialog;
