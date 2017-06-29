/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import ShareAccessSelect from '../ShareAccessSelect';
import { Button } from '../Button';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../constants';
import type { BoxItem } from '../../flowTypes';
import './ShareDialog.scss';

type Props = {
    canSetShareAccess: boolean,
    isOpen: boolean,
    onShareAccessChange: Function,
    onCancel: Function,
    item: BoxItem,
    getLocalizedMessage: Function,
    isLoading: boolean,
    parentElement: HTMLElement
};

const ShareDialog = ({
    isOpen,
    canSetShareAccess,
    onShareAccessChange,
    onCancel,
    item,
    getLocalizedMessage,
    isLoading,
    parentElement
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
        url: getLocalizedMessage('buik.modal.share.dialog.text.none')
    };

    /* eslint-disable jsx-a11y/label-has-for */
    return (
        <Modal
            isOpen={isOpen}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} buik-modal-share`}
            className={CLASS_MODAL_CONTENT}
            overlayClassName={CLASS_MODAL_OVERLAY}
            contentLabel={getLocalizedMessage('buik.modal.share.dialog.label')}
        >
            <div className='buik-modal-content'>
                <label>
                    <div>
                        {getLocalizedMessage('buik.modal.share.dialog.text')}
                    </div>
                    <span>
                        <input
                            type='text'
                            readOnly
                            ref={(input) => {
                                textInput = input;
                            }}
                            value={url}
                        />
                        <Button className='buik-modal-button-copy' onClick={copy}>
                            {getLocalizedMessage('buik.modal.dialog.share.button.copy')}
                        </Button>
                    </span>
                </label>
            </div>
            <div className='buik-modal-btns'>
                <ShareAccessSelect
                    className='bce-shared-access-select'
                    canSetShareAccess={canSetShareAccess}
                    onChange={onShareAccessChange}
                    item={item}
                    getLocalizedMessage={getLocalizedMessage}
                />
                <Button onClick={onCancel} isLoading={isLoading}>
                    {getLocalizedMessage('buik.modal.dialog.share.button.close')}
                </Button>
            </div>
        </Modal>
    );
};

export default ShareDialog;
