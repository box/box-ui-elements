// @flow
import * as React from 'react';

import LoadingIndicator from './LoadingIndicator';
import type { Props as LoadingIndicatorProps } from './LoadingIndicator';

type Props = {
    isLoading?: boolean,
    loadingIndicatorProps?: LoadingIndicatorProps,
};

function makeLoadable(BaseComponent: React.ComponentType<any>): React.ComponentType<Props> {
    const LoadableComponent = ({ isLoading = false, loadingIndicatorProps = {}, ...rest }: Props) =>
        isLoading ? <LoadingIndicator {...loadingIndicatorProps} /> : <BaseComponent {...rest} />;

    LoadableComponent.displayName = `Loadable${BaseComponent.displayName || BaseComponent.name || 'Component'}`;

    return LoadableComponent;
}

export default makeLoadable;
