/**
 * @flow
 * @file HOC to make popup-able Box UI Elements
 * @author Box
 */

import React, { PureComponent } from 'react';
import Modal from 'react-modal';
import noop from 'lodash/noop';
import omit from 'lodash/omit';

import { CLIENT_NAME_CONTENT_PICKER, CLIENT_NAME_CONTENT_UPLOADER } from '../../constants';

import type { ModalOptions } from './flowTypes';

type Props = {
    modal: ModalOptions,
    onCancel?: Function,
    onChoose?: Function,
    onClick?: Function,
    onClose?: Function,
};

type State = {
    isOpen: boolean,
};

const makePopup = (kit: string) => (Wrapped: any) =>
    class Wrapper extends PureComponent<Props, State> {
        /**
         * [constructor]
         *
         * @param {*} props
         * @return {Wrapper}
         */
        constructor(props: Props) {
            super(props);
            this.state = {
                isOpen: false,
            };
        }

        /**
         * Hides the modal and call the callback
         *
         * @param {Function} callback - function to call
         * @return {void}
         */
        close(callback: Function, data: any) {
            this.setState({ isOpen: false }, () => callback(data));
        }

        /**
         * Callback for clicking
         *
         * @param {*} data - any callback data
         * @return {void}
         */
        onClick = (data: any) => {
            const { onClick = noop }: Props = this.props;
            this.close(onClick, data);
        };

        /**
         * Callback for pressing close
         *
         * @param {*} data - any callback data
         * @return {void}
         */
        onClose = (data: any) => {
            const { onClose = noop }: Props = this.props;
            this.close(onClose, data);
        };

        /**
         * Callback for pressing cancel
         *
         * @param {*} data - any callback data
         * @return {void}
         */
        onCancel = (data: any) => {
            const { onCancel = noop }: Props = this.props;
            this.close(onCancel, data);
        };

        /**
         * Callback for pressing choose
         *
         * @param {*} data - any callback data
         * @return {void}
         */
        onChoose = (data: any) => {
            const { onChoose = noop }: Props = this.props;
            this.close(onChoose, data);
        };

        /**
         * Button click handler
         *
         * @return {void}
         */
        onButtonClick = () => {
            this.setState({ isOpen: true });
        };

        /**
         * Renders the component
         *
         * @return {void}
         */
        render() {
            const { isOpen }: State = this.state;
            const { modal, ...rest }: Props = this.props;
            const wrappedProps = omit(rest, ['onCancel', 'onChoose', 'onClose', 'modal']);
            const {
                buttonLabel = 'Missing modal.buttonLabel in options',
                buttonClassName = 'btn btn-primary',
                modalClassName = 'be-modal-wrapper-content',
                overlayClassName = 'be-modal-wrapper-overlay',
            }: ModalOptions = modal;

            switch (kit) {
                case CLIENT_NAME_CONTENT_PICKER:
                    wrappedProps.onCancel = this.onCancel;
                    wrappedProps.onChoose = this.onChoose;
                    break;
                case CLIENT_NAME_CONTENT_UPLOADER:
                    wrappedProps.onClose = this.onClose;
                    break;
                default:
                    throw new Error('Unknown kit type');
            }

            return (
                <div>
                    <button className={buttonClassName} onClick={this.onButtonClick} type="button">
                        {buttonLabel}
                    </button>
                    <Modal
                        className={modalClassName}
                        contentLabel={kit}
                        isOpen={isOpen}
                        overlayClassName={overlayClassName}
                    >
                        <Wrapped {...wrappedProps} />
                    </Modal>
                </div>
            );
        }
    };

export default makePopup;
