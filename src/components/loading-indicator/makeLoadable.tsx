import * as React from 'react';
import LoadingIndicator, { LoadingIndicatorProps } from './LoadingIndicator';

export interface MakeLoadableProps {
    isLoading?: boolean;
    loadingIndicatorProps?: LoadingIndicatorProps;
}

const makeLoadable = <P extends object>(BaseComponent: React.ComponentType<P>): React.FC<P & MakeLoadableProps> => {
    const LoadableComponent = ({ isLoading = false, loadingIndicatorProps = {}, ...rest }: P & MakeLoadableProps) =>
        isLoading ? <LoadingIndicator {...loadingIndicatorProps} /> : <BaseComponent {...(rest as P)} />;

    LoadableComponent.displayName = `Loadable${BaseComponent.displayName || BaseComponent.name || 'Component'}`;

    return LoadableComponent;
};

export default makeLoadable;
