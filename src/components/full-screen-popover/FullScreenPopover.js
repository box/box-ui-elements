// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import classNames from 'classnames';
import { Overlay } from '../flyout';
import { KEYS } from '../../constants';
import OverlayHeader from './OverlayHeader';
import './styles/FullScreenPopover.scss';

export type FullScreenPopoverProps = {
    /** Components to render in the overlay */
    children: React.Node,
    /** Set className to the overlay wrapper */
    className?: string,
    /** Content nested inside of the popover header */
    header?: React.Element<any>,
    /** Fires this callback when overlay is closed */
    onClose?: Function,
    /** CSS selector that identifies clickable elements that closes the overlay */
    onCloseClassSelector?: string,
    /** Fires this callback when overlay is opened */
    onOpen?: Function,
};

type Props = FullScreenPopoverProps;

const FullScreenPopover = (props: Props) => {
    const [isVisible, setVisibility] = React.useState(false);

    const overlayID = uniqueId('overlay');
    const popoverButtonID = uniqueId('popoverbutton');

    const { className, header, children, onClose, onCloseClassSelector, onOpen } = props;

    const elements = React.Children.toArray(children);

    if (elements.length !== 2) {
        throw new Error('FullScreenPopover must have exactly two children: A button component and a content element');
    }

    const [popoverButton, overlayContent] = elements;

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
        const buttonEl = document.getElementById(popoverButtonID);
        if (buttonEl) {
            buttonEl.focus();
        }
    };

    const handleOverlayClick = (event: SyntheticEvent<>) => {
        // Searches overlay for classes that match event.target and closes overlay if match
        const overlayNode: HTMLElement | null = document.getElementById(overlayID);
        const targetNode = event.target;
        if (overlayNode && overlayNode instanceof Node && targetNode instanceof Node && onCloseClassSelector) {
            const queryNodes = [...overlayNode.querySelectorAll(onCloseClassSelector)];
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
        className: 'full-screen-overlay',
        key: overlayID,
        id: overlayID,
    };

    return (
        <div className={classNames('full-screen-popover', className)}>
            {React.cloneElement(popoverButton, popoverButtonProps)}
            {isVisible ? (
                <Overlay {...overlayProps}>
                    <OverlayHeader className="fs-header" onCloseClick={closeOverlay}>
                        {header}
                    </OverlayHeader>
                    <div role="presentation" className="fs-content" onClick={handleOverlayClick}>
                        {overlayContent}
                    </div>
                </Overlay>
            ) : null}
        </div>
    );
};

export default FullScreenPopover;
