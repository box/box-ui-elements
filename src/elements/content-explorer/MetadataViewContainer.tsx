import * as React from 'react';
import { MetadataView, type MetadataViewProps } from '@box/metadata-view';

import type { Collection } from '../../common/types/core';

export interface MetadataViewContainerProps extends Omit<MetadataViewProps, 'items'> {
    currentCollection: Collection;
}

const MetadataViewContainer = ({ currentCollection, ...rest }: MetadataViewContainerProps) => {
    const { items = [] } = currentCollection;

    return <MetadataView items={items} {...rest} />;
};

export default MetadataViewContainer;
