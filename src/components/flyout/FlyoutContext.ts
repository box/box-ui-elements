import * as React from 'react';
import noop from 'lodash/noop';

export interface FlyoutContextValues {
    /** Closes the flyout overlay */
    closeOverlay: () => void;
}

export default React.createContext<FlyoutContextValues>({ closeOverlay: noop });
