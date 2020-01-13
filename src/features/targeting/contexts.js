// @flow
import { createContext } from 'react';

import { type FtuxContextValue, type TargetingContextValue } from './types';

const FtuxContext = createContext<FtuxContextValue>({});

const TargetingContext = createContext<TargetingContextValue>({});

export { FtuxContext, TargetingContext };
