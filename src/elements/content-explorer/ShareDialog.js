/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import noop from 'lodash/noop';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import PrimaryButton from '../../components/primary-button/PrimaryButton';
import Button from '../../components/button/Button';
import messages from '../common/messages';
import ShareAccessSelect from '../common/share-access-select';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../constants';
import type { BoxItem } from '../../common/types/core';

import './ShareDialog.scss';

type Props = {
    appElement: HTMLElement,
    canSetShareAccess: boolean,
    isLoading: boolean,
    isOpen: boolean,
    item: BoxItem,
    onCancel: Function,
    onShareAccessChange: Function,
    parentElement: HTMLElement,
} & InjectIntlProvidedProps;

const ShareDialog = ({
    isOpen,
    canSetShareAccess,
    onShareAccessChange,
    onCancel,
    item,
    isLoading,
    parentElement,
    appElement,
    intl,
}: Props) => {
    let textInput = null;

    const copy = () => {
        if (textInput instanceof HTMLInputElement) {
            textInput.select();
            document.execCommand('copy');
        }
    };

    const { shared_link: sharedLink }: BoxItem = item;
    const { url } = sharedLink || {
        url: intl.formatMessage(messages.shareDialogNone),
    };

    /* eslint-disable jsx-a11y/label-has-for */
    return (
        <Modal
            appElement={appElement}
            className={CLASS_MODAL_CONTENT}
            contentLabel={intl.formatMessage(messages.shareDialogLabel)}
            isOpen={isOpen}
            onRequestClose={onCancel}
            overlayClassName={CLASS_MODAL_OVERLAY}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} be-modal-share`}
        >
            <div className="be-modal-content">
                <label>
                    <FormattedMessage tagName="div" {...messages.shareDialogText} />
                </label>
                <div className="be-modal-input-group">
                    <input
                        ref={input => {
                            textInput = input;
                        }}
                        onChange={noop}
                        type="text"
                        value={url}
                    />
                    <PrimaryButton autoFocus className="be-modal-button-copy" onClick={copy} type="button">
                        <FormattedMessage {...messages.copy} />
                    </PrimaryButton>
                </div>
            </div>
            <div className="be-modal-btns">
                <ShareAccessSelect
                    canSetShareAccess={canSetShareAccess}
                    className="bce-shared-access-select"
                    item={item}
                    onChange={onShareAccessChange}
                />
                <Button isLoading={isLoading} onClick={onCancel} type="button">
                    <FormattedMessage {...messages.close} />
                </Button>
            </div>
        </Modal>
    );
};

export default injectIntl(ShareDialog);
