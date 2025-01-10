import React from 'react';
import PropTypes from 'prop-types';
import HotkeyService from './HotkeyService';

export const HotkeyContext = React.createContext(null);

export const HotkeyConsumer = HotkeyContext.Consumer;

export const HotkeyProvider = ({ children, hotkeyService }) => {
    if (!hotkeyService || !hotkeyService.getActiveHotkeys || !hotkeyService.getActiveTypes) {
        throw new Error('HotkeyProvider requires a valid hotkeyService prop');
    }
    return <HotkeyContext.Provider value={hotkeyService}>{children}</HotkeyContext.Provider>;
};

HotkeyProvider.propTypes = {
    children: PropTypes.node.isRequired,
    hotkeyService: PropTypes.instanceOf(HotkeyService).isRequired,
};
