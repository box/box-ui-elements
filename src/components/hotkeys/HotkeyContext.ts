import * as React from 'react';

import type HotkeyService from './HotkeyService';

export const HotkeyContext = React.createContext<HotkeyService | null>(null);

HotkeyContext.displayName = 'HotkeyContext';
