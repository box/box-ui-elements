// @flow
import * as React from 'react';
import classNames from 'classnames';
import tabbable from 'tabbable';
import omit from 'lodash/omit';

import FocusTrap from '../focus-trap';
import LoadingIndicator from '../loading-indicator';
import Portal from '../portal';
import ModalDialog from './ModalDialog';

import './Modal.scss';
import withViewportSize from '../media-query/withViewportSize';

const MODAL_FULLSCREEN_BUFFER = 50;

type Props = {
    children: React.Node,
    /** Additional CSS classname of the `.modal` element */
    className?: string,
    focusElementSelector?: string,
    isLoading?: boolean,
    isOpen?: boolean,
    onBackdropClick?: Function,
    /** `(event) => {}`. `event` can be of type `SyntheticKeyboardEvent|SyntheticMouseEvent`. */
    onRequestClose?: Function,
    /** modal usually use Portal as Portal stays if parent is removed, but it cannot retain DOM tree's resin props */
    shouldNotUsePortal?: boolean,
    style: {
        backdrop?: Object,
        dialog?: Object,
    },
    title?: React.Node,
    viewHeight: ?number,
    viewWidth: ?number,
};

type State = {
    fullscreen: ?boolean,
    initialWidth: number,
};

class Modal extends React.Component<Props, State> {
    state = {
        initialWidth: 0,
        fullscreen: false,
    };

    static defaultProps = {
        style: {
            backdrop: {},
            dialog: {},
        },
        viewWidth: null,
        viewHeight: null,
    };

    componentDidMount() {
        const { isOpen } = this.props;

        if (isOpen) {
            this.onModalOpen();
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { isLoading, isOpen } = this.props;
        const { fullscreen, initialWidth } = this.state;

        // Set focus if modal is transitioning from closed -> open and/or loading -> not loading
        if ((!prevProps.isOpen || prevProps.isLoading) && isOpen && !isLoading) {
            this.onModalOpen();
        }

        if (this.dialog) {
            const { offsetWidth } = this.dialog;
            let shouldFullscreen = this.shouldRenderFullscreen(initialWidth);

            if (initialWidth === 0 && initialWidth !== offsetWidth) {
                shouldFullscreen = this.shouldRenderFullscreen(offsetWidth);
                this.setState({ initialWidth: offsetWidth, fullscreen: shouldFullscreen });
            } else if (shouldFullscreen !== fullscreen) this.setState({ fullscreen: shouldFullscreen });
        }
    }

    shouldRenderFullscreen(modalWidth: number): boolean {
        const { viewWidth } = this.props;
        if (!viewWidth) return false;

        return viewWidth < modalWidth + MODAL_FULLSCREEN_BUFFER;
    }

    /**
     * Call props.onRequestClose when escape is pressed
     * @param {SyntheticKeyboardEvent} event
     */
    onKeyDown = (event: SyntheticKeyboardEvent<>) => {
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
    onBackdropClick = (event: SyntheticMouseEvent<HTMLDivElement>) => {
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

    dialog: ?HTMLElement;

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
        const el = this.dialog.querySelector(elementSelector);
        if (el) {
            el.focus();
        } else {
            throw new Error(`Could not find element matching selector ${elementSelector} to focus on.`);
        }
    };

    render() {
        const {
            className,
            isLoading,
            isOpen,
            onRequestClose,
            shouldNotUsePortal,
            style,
            viewWidth,
            ...rest
        } = this.props;

        const { fullscreen } = this.state;

        if (!isOpen) {
            return null;
        }

        const bodyOverrideStyle = `
            body {
                overflow:hidden;
            }
        `;
        const responsiveWidthStyle = viewWidth ? { maxWidth: `${viewWidth}px` } : null;

        // used `omit` here to prevent certain key/value pairs from going into the spread on `ModalDialog`
        const modalProps = omit(rest, ['onBackdropClick', 'focusElementSelector']);

        const WrapperComponent = shouldNotUsePortal ? 'div' : Portal;
        // Render a style tag to prevent body from scrolling as long as the Modal is open
        return (
            <WrapperComponent
                className={classNames('modal', fullscreen && 'modal-fullscreen', className)}
                onKeyDown={this.onKeyDown}
                tabIndex="-1"
                style={responsiveWidthStyle}
            >
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
                <div className="modal-backdrop" onClick={this.onBackdropClick} style={style.backdrop} />
                <FocusTrap
                    className={classNames('modal-dialog-container', fullscreen && 'modal-dialog-container-fullscreen')}
                >
                    {isLoading ? (
                        <LoadingIndicator size="large" />
                    ) : (
                        <ModalDialog
                            fullscreen
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
const ResponsiveModal = withViewportSize(Modal);

export { ResponsiveModal };
export default Modal;
