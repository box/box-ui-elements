/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import noop from 'lodash/noop';
import { injectIntl, FormattedMessage } from 'react-intl';
import PrimaryButton from 'box-react-ui/lib/components/primary-button/PrimaryButton';
import Button from 'box-react-ui/lib/components/button/Button';
import messages from 'elements/common/messages';
import ShareAccessSelect from 'elements/common/share-access-select';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../constants';

import './ShareDialog.scss';

type Props = {
    canSetShareAccess: boolean,
    isOpen: boolean,
    onShareAccessChange: Function,
    onCancel: Function,
    item: BoxItem,
    isLoading: boolean,
    parentElement: HTMLElement,
    appElement: HTMLElement,
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
            isOpen={isOpen}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} be-modal-share`}
            className={CLASS_MODAL_CONTENT}
            overlayClassName={CLASS_MODAL_OVERLAY}
            onRequestClose={onCancel}
            contentLabel={intl.formatMessage(messages.shareDialogLabel)}
            appElement={appElement}
        >
            <div className="be-modal-content">
                <label>
                    <FormattedMessage tagName="div" {...messages.shareDialogText} />
                    <span>
                        <input
                            type="text"
                            onChange={noop}
                            ref={input => {
                                textInput = input;
                            }}
                            value={url}
                        />
                        <PrimaryButton type="button" className="be-modal-button-copy" onClick={copy} autoFocus>
                            <FormattedMessage {...messages.copy} />
                        </PrimaryButton>
                    </span>
                </label>
            </div>
            <div className="be-modal-btns">
                <ShareAccessSelect
                    className="bce-shared-access-select"
                    canSetShareAccess={canSetShareAccess}
                    onChange={onShareAccessChange}
                    item={item}
                />
                <Button type="button" onClick={onCancel} isLoading={isLoading}>
                    <FormattedMessage {...messages.close} />
                </Button>
            </div>
        </Modal>
    );
};

export default injectIntl(ShareDialog);
