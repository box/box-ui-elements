import * as React from 'react';
import classNames from 'classnames';
import tabbable from 'tabbable';
import omit from 'lodash/omit';

import FocusTrap from '../focus-trap';
import LoadingIndicator, { LoadingIndicatorSize } from '../loading-indicator';
import Portal from '../portal';
import ModalDialog from './ModalDialog';

import './Modal.scss';

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'style' | 'title'> {
    /** Contents of the modal dialog */
    children: React.ReactNode;
    /** Additional CSS classname of the `.modal` element */
    className?: string;
    /** CSS selector for the element that receives focus when the modal opens */
    focusElementSelector?: string;
    /** Whether to display a loading indicator instead of the modal dialog */
    isLoading?: boolean;
    /** Whether the modal is open */
    isOpen?: boolean;
    /** Handler called when the backdrop is clicked */
    onBackdropClick?: React.MouseEventHandler<HTMLDivElement>;
    /** Handler called when the modal requests to close */
    onRequestClose?: (
        event:
            | React.KeyboardEvent<HTMLElement>
            | React.MouseEvent<HTMLDivElement>
            | React.MouseEvent<HTMLButtonElement>,
    ) => void;
    /** Whether to render inline instead of using a portal */
    shouldNotUsePortal?: boolean;
    /** Styles applied to the backdrop and dialog */
    style: {
        backdrop?: React.CSSProperties;
        dialog?: React.CSSProperties;
    };
    /** Title displayed in the modal header */
    title?: React.ReactNode;
}

class Modal extends React.Component<ModalProps> {
    static defaultProps = {
        style: {
            backdrop: {},
            dialog: {},
        },
    };

    componentDidMount() {
        const { isOpen } = this.props;

        if (isOpen) {
            this.onModalOpen();
        }
    }

    componentDidUpdate(prevProps: ModalProps) {
        const { isLoading, isOpen } = this.props;

        // Set focus if modal is transitioning from closed -> open and/or loading -> not loading
        if ((!prevProps.isOpen || prevProps.isLoading) && isOpen && !isLoading) {
            this.onModalOpen();
        }
    }

    /**
     * Call props.onRequestClose when escape is pressed
     * @param {SyntheticKeyboardEvent} event
     */
    onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        const { isOpen, onRequestClose } = this.props;
        if (isOpen && onRequestClose && event.key === 'Escape') {
            event.stopPropagation();
            onRequestClose(event);
        }
    };

    /**
     * Call props.onRequestClose when backdrop is clicked
     * @param {SyntheticMouseEvent} event
     */
    onBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const { onRequestClose, onBackdropClick } = this.props;

        if (onBackdropClick) {
            onBackdropClick(event);
        } else if (onRequestClose) {
            onRequestClose(event);
        }
    };

    /**
     * Focuses on the correct element in the popup when it opens
     */
    onModalOpen = () => {
        setTimeout(() => {
            const { focusElementSelector } = this.props;
            const focusElementSelectorTrimmed = focusElementSelector && focusElementSelector.trim();
            if (focusElementSelectorTrimmed) {
                this.focusElement(focusElementSelectorTrimmed);
            } else {
                this.focusFirstUsefulElement();
            }
        }, 0);
    };

    dialog: HTMLDivElement | null = null;

    /**
     * Focus the first useful element in the modal (i.e. not the close button, unless it's the only thing)
     */
    focusFirstUsefulElement = () => {
        if (!this.dialog) {
            return;
        }
        const tabbableEls = tabbable(this.dialog);
        if (tabbableEls.length > 1) {
            tabbableEls[1].focus();
        } else if (tabbableEls.length > 0) {
            tabbableEls[0].focus();
        }
    };

    /**
     * Focus the element that matches the selector in the modal
     * @throws {Error} When the elementSelector does not match any element
     */
    focusElement = (elementSelector: string) => {
        if (!this.dialog) {
            return;
        }
        const el = this.dialog.querySelector<HTMLElement>(elementSelector);
        if (el) {
            el.focus();
        } else {
            throw new Error(`Could not find element matching selector ${elementSelector} to focus on.`);
        }
    };

    render() {
        const { className, isLoading, isOpen, onRequestClose, shouldNotUsePortal, style, ...rest } = this.props;

        if (!isOpen) {
            return null;
        }

        const bodyOverrideStyle = `
            body {
                overflow:hidden;
            }
        `;

        // used `omit` here to prevent certain key/value pairs from going into the spread on `ModalDialog`
        const modalProps = omit(rest, ['onBackdropClick', 'focusElementSelector']);

        const WrapperComponent = (shouldNotUsePortal ? 'div' : Portal) as React.ElementType;
        // Render a style tag to prevent body from scrolling as long as the Modal is open
        return (
            <WrapperComponent className={classNames('modal', className)} onKeyDown={this.onKeyDown} tabIndex={-1}>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
                <div className="modal-backdrop" onClick={this.onBackdropClick} style={style.backdrop} />
                <FocusTrap className="modal-dialog-container">
                    {isLoading ? (
                        <LoadingIndicator size={LoadingIndicatorSize.LARGE} />
                    ) : (
                        <ModalDialog
                            modalRef={modalEl => {
                                // This callback gets passed through as a regular prop since
                                // ModalDialog is wrapped in a HOC
                                this.dialog = modalEl;
                            }}
                            onRequestClose={onRequestClose}
                            style={style.dialog}
                            {...modalProps}
                        />
                    )}
                </FocusTrap>
                <style type="text/css">{bodyOverrideStyle}</style>
            </WrapperComponent>
        );
    }
}

export default Modal;
