// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import classNames from 'classnames';
import { Overlay } from '../flyout';
import { KEYS } from '../../constants';
import OverlayHeader from './OverlayHeader';
import ScrollWrapper from '../scroll-wrapper';
import './styles/FullScreenPopover.scss';

export type FullScreenPopoverProps = {
    /** Components to render in the overlay */
    children?: React.Node,
    /** Set className to the overlay wrapper */
    className?: string,
    /** Content nested inside of the popover header */
    header?: React.Element<any>,
    /** Fires this callback when overlay is closed */
    onClose?: Function,
    /** CSS selector that identifies clickable elements that closes the overlay */
    onCloseCssSelector?: string,
    /** Fires this callback when overlay is opened */
    onOpen?: Function,
    /** Custom button that toggles the overlay */
    popoverButton: React.Element<any>,
};

type Props = FullScreenPopoverProps;

const FullScreenPopover = (props: Props) => {
    const [isVisible, setVisibility] = React.useState(false);

    let overlayRef = null;

    const overlayID = React.useMemo(() => uniqueId('overlay'), []);
    const popoverButtonID = React.useMemo(() => uniqueId('popoverbutton'), []);

    const { className, header, children, onClose, onCloseCssSelector, onOpen, popoverButton } = props;

    const openOverlay = () => {
        setVisibility(true);
        if (onOpen) {
            onOpen();
        }
    };

    const closeOverlay = () => {
        setVisibility(false);
        if (onClose) {
            onClose();
        }
    };

    const focusButton = () => {
        const buttonEl = popoverButton.ref;
        if (buttonEl) {
            buttonEl.focus();
        }
    };

    const handleOverlayClick = (event: SyntheticEvent<>) => {
        // Searches overlay for classes that match event.target and closes overlay if match
        const overlayNode = overlayRef;
        const targetNode = event.target;
        if (overlayNode && overlayNode instanceof Node && targetNode instanceof Node && onCloseCssSelector) {
            const queryNodes = [...overlayNode.querySelectorAll(onCloseCssSelector)];
            for (let i = 0; i < queryNodes.length; i += 1) {
                if (queryNodes[i].contains(targetNode)) {
                    closeOverlay();
                    break;
                }
            }
        }
    };

    const handleKeyPress = () => {
        if (KEYS.enter) {
            openOverlay();
            focusButton();
        }
    };

    const handleButtonClick = (event: SyntheticEvent<>) => {
        if (isVisible) {
            closeOverlay();
        } else {
            openOverlay();
        }
        event.preventDefault();
    };

    const saveScrollRef = (ref: ?HTMLElement) => {
        overlayRef = ref;
    };

    const popoverButtonProps: Object = {
        onClick: handleButtonClick,
        onKeyPress: handleKeyPress,
        key: popoverButtonID,
        id: popoverButtonID,
        role: 'button',
        tabIndex: '0',
        'aria-haspopup': 'true',
        'aria-expanded': isVisible ? 'true' : 'false',
    };

    if (isVisible) {
        popoverButtonProps['aria-controls'] = overlayID;
    }

    const overlayProps = {
        role: 'dialog',
        className: 'bdl-full-screen-overlay',
        key: overlayID,
        id: overlayID,
    };

    return (
        <div className={classNames('bdl-full-screen-popover', className)}>
            {React.cloneElement(popoverButton, popoverButtonProps)}
            {isVisible ? (
                <Overlay {...overlayProps}>
                    <OverlayHeader className="bdl-fs-header" onCloseClick={closeOverlay}>
                        {header}
                    </OverlayHeader>
                    {children != null && (
                        <ScrollWrapper
                            className="bdl-fs-content"
                            scrollRefFn={saveScrollRef}
                            shadowSize="contain"
                            onClick={handleOverlayClick}
                        >
                            {children}
                        </ScrollWrapper>
                    )}
                </Overlay>
            ) : null}
        </div>
    );
};

export default FullScreenPopover;
