import * as React from 'react';

// @ts-ignore flow import
import { Overlay } from '../flyout';

import HotkeyLayer from './HotkeyLayer';

export interface HotkeyFriendlyOverlayProps {
    /** Overlay contents */
    children: React.ReactNode;
    /** Component class names */
    className?: string;
    /** Click handler for the overlay */
    onClick?: Function;
    /** Called when the overlay requests to close */
    onClose?: Function;
    /** Whether the overlay should focus the first focusable element by default */
    shouldDefaultFocus?: boolean;
}

/*
 * Note that this is expected to be used within a Flyout component that only renders this
 * when it is actually to be put on screen.
 */
const HotkeyFriendlyOverlay = ({ ...props }: HotkeyFriendlyOverlayProps) => (
    <HotkeyLayer>
        <Overlay {...props} />
    </HotkeyLayer>
);

export default HotkeyFriendlyOverlay;
