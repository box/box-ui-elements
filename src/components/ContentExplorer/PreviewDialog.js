/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React, { PureComponent } from 'react';
import Modal from 'react-modal';
import cloneDeep from 'lodash.clonedeep';
import ContentPreview from '../ContentPreview';
import { Button } from '../Button';
import { TYPE_FILE, CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../constants';
import IconCross from '../icons/IconCross';
import type { BoxItem, Collection } from '../../flowTypes';
import './PreviewDialog.scss';

type Props = {
    isOpen: boolean,
    currentCollection: Collection,
    onCancel: Function,
    item: BoxItem,
    token: string,
    getLocalizedMessage: Function,
    parentElement: HTMLElement,
    isTouch: boolean,
    onPreview: Function
};

type State = {
    name: string
};

class PreviewDialog extends PureComponent<void, Props, State> {
    props: Props;
    state: State;
    container: HTMLDivElement;
    preview: any;

    /**
     * [constructor]
     *
     * @private
     * @return {PreviewDialog}
     */
    constructor() {
        super();
        this.state = {
            name: ''
        };
    }

    /**
     * Handles closing of preview
     *
     * @private
     * @return {void}
     */
    onClose = (): void => {
        const { onCancel }: Props = this.props;
        if (this.preview) {
            this.preview.hide();
        }
        onCancel();
    };

    /**
     * Handles loading of preview
     *
     * @private
     * @return {void}
     */
    onLoad = ({ file }: { file: BoxItem }): void => {
        const { onPreview }: Props = this.props;
        const { name } = file;
        this.setState({ name });
        onPreview(cloneDeep(file));
    };

    /**
     * Handles rendering of preview dialog
     *
     * @private
     * @return {void}
     */
    render() {
        const { isOpen, getLocalizedMessage, parentElement, token, item, currentCollection }: Props = this.props;
        const { name }: State = this.state;
        const { id }: BoxItem = item;
        const { items }: Collection = currentCollection;

        const title = getLocalizedMessage('buik.modal.dialog.share.button.close');
        const label = getLocalizedMessage('buik.modal.preview.dialog.label');

        if (!id || !items || !isOpen) {
            return null;
        }

        // $FlowFixMe: id is string
        const files: string[] = items.filter(({ type }) => type === TYPE_FILE).map(({ id: fileId }) => fileId);

        return (
            <Modal
                isOpen={isOpen}
                parentSelector={() => parentElement}
                portalClassName={`${CLASS_MODAL} buik-modal-preview`}
                className={CLASS_MODAL_CONTENT_FULL_BLEED}
                overlayClassName={CLASS_MODAL_OVERLAY}
                contentLabel={label}
            >
                <div className='buik-modal-content'>
                    <div className='buik-preview-header'>
                        {name}
                        <Button
                            className='buik-modal-preview-btn-close'
                            onClick={this.onClose}
                            title={title}
                            aria-label={title}
                        >
                            <IconCross color='#777' width={16} height={16} />
                        </Button>
                    </div>
                    <div className='buik-preview-container'>
                        <ContentPreview
                            fileId={id}
                            token={token}
                            header='none'
                            collection={files}
                            onLoad={this.onLoad}
                        />
                    </div>
                </div>
            </Modal>
        );
    }
}

export default PreviewDialog;
