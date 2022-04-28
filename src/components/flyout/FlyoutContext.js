// @flow
import * as React from 'react';
import noop from 'lodash/noop';

type FlyoutContextValues = {
    closeOverlay: Function,
};

export default React.createContext<FlyoutContextValues>({ closeOverlay: noop });
