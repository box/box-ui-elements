import React from 'react';
import PropTypes from 'prop-types';

export const HotkeyContext = React.createContext(null);

HotkeyContext.displayName = 'HotkeyContext';

export const HotkeyContextPropTypes = {
    hotkeyLayer: PropTypes.object,
};
