// @flow
import { createContext } from 'react';

import { type FtuxContextValue, type TargetingContextValue } from './types';

const FtuxContext = createContext<FtuxContextValue>({});

const defaultTargetingContextValue = {
    getTargetingApi: () => ({
        shouldShow: () => false,
        onSeen: () => {},
        onClosed: () => {},
    }),
    setEligibleMessageHeaders: () => {},
};

const TargetingContext = createContext<TargetingContextValue>(defaultTargetingContextValue);

export { FtuxContext, TargetingContext };
