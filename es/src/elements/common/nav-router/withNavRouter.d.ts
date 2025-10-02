import * as React from 'react';
import { WithNavRouterProps } from './types';
declare const withNavRouter: <P extends object>(Component: React.ComponentType<P>) => React.FC<P & WithNavRouterProps>;
export default withNavRouter;
