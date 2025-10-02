import * as React from 'react';
import { LoadingIndicatorProps } from './LoadingIndicator';
export interface MakeLoadableProps {
    isLoading?: boolean;
    loadingIndicatorProps?: LoadingIndicatorProps;
}
declare const makeLoadable: <P extends object>(BaseComponent: React.ComponentType<P>) => React.FC<P & MakeLoadableProps>;
export default makeLoadable;
