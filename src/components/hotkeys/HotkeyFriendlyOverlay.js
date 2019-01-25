// @flow
import * as React from 'react';

import { Overlay } from '../flyout';
import type { Props } from '../flyout/Overlay';

import HotkeyLayer from './HotkeyLayer';

/*
 * Note that this is expected to be used within a Flyout component that only renders this
 * when it is actually to be put on screen.
 */
const HotkeyFriendlyOverlay = ({ ...props }: Props) => (
    <HotkeyLayer>
        <Overlay {...props} />
    </HotkeyLayer>
);

export default HotkeyFriendlyOverlay;
