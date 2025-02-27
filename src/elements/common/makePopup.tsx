/**
 * @file HOC to make popup-able Box UI Elements
 * @author Box
 */

import React, { PureComponent, ReactElement } from 'react';
import Modal from 'react-modal';
import noop from 'lodash/noop';
import omit from 'lodash/omit';

import { CLIENT_NAME_CONTENT_PICKER, CLIENT_NAME_CONTENT_UPLOADER } from '../../constants';

import { ModalOptions } from './types';

interface Props {
    modal: ModalOptions;
    onCancel?: (data: unknown) => void;
    onChoose?: (data: unknown) => void;
    onClick?: (data: unknown) => void;
    onClose?: (data: unknown) => void;
}

interface State {
    isOpen: boolean;
}

const makePopup =
    (kit: string) =>
    <T extends object>(Wrapped: React.ComponentType<T>) =>
        class Wrapper extends PureComponent<Props & T, State> {
            /**
             * [constructor]
             *
             * @param {Props} props
             * @return {Wrapper}
             */
            constructor(props: Props & T) {
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
            close(callback: (data: unknown) => void, data: unknown): void {
                this.setState({ isOpen: false }, () => callback(data));
            }

            /**
             * Callback for clicking
             *
             * @param {unknown} data - callback data
             * @return {void}
             */
            onClick = (data: unknown): void => {
                const { onClick = noop } = this.props;
                this.close(onClick, data);
            };

            /**
             * Callback for pressing close
             *
             * @param {unknown} data - callback data
             * @return {void}
             */
            onClose = (data: unknown): void => {
                const { onClose = noop } = this.props;
                this.close(onClose, data);
            };

            /**
             * Callback for pressing cancel
             *
             * @param {unknown} data - callback data
             * @return {void}
             */
            onCancel = (data: unknown): void => {
                const { onCancel = noop } = this.props;
                this.close(onCancel, data);
            };

            /**
             * Callback for pressing choose
             *
             * @param {unknown} data - callback data
             * @return {void}
             */
            onChoose = (data: unknown): void => {
                const { onChoose = noop } = this.props;
                this.close(onChoose, data);
            };

            /**
             * Button click handler
             *
             * @return {void}
             */
            onButtonClick = (): void => {
                this.setState({ isOpen: true });
            };

            /**
             * Renders the component
             *
             * @return {ReactElement}
             */
            render(): ReactElement {
                const { isOpen } = this.state;
                const { modal, ...rest } = this.props;
                const wrappedProps = omit(rest, ['onCancel', 'onChoose', 'onClose', 'modal']) as T;
                const {
                    buttonLabel = 'Missing modal.buttonLabel in options',
                    buttonClassName = 'btn btn-primary',
                    modalClassName = 'be-modal-wrapper-content',
                    overlayClassName = 'be-modal-wrapper-overlay',
                } = modal;

                switch (kit) {
                    case CLIENT_NAME_CONTENT_PICKER:
                        (wrappedProps as Record<string, unknown>).onCancel = this.onCancel;
                        (wrappedProps as Record<string, unknown>).onChoose = this.onChoose;
                        break;
                    case CLIENT_NAME_CONTENT_UPLOADER:
                        (wrappedProps as Record<string, unknown>).onClose = this.onClose;
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
