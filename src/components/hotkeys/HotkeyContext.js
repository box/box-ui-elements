import { createContext } from 'react';

// Default to null - should be overridden by a provider (HotkeyLayer)
const HotkeyContext = createContext({ hotkeyLayer: null});

export default HotkeyContext;