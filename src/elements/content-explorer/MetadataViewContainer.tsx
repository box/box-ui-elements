import * as React from 'react';
import { MetadataView, type MetadataViewProps } from '@box/metadata-view';
import type { MetadataTemplate } from '../../common/types/metadata';
import type { Collection } from '../../common/types/core';

export interface MetadataViewContainerProps extends Omit<MetadataViewProps, 'items'> {
    currentCollection: Collection;
    metadataTemplate: MetadataTemplate;
}

const MetadataViewContainer = ({
    actionBarProps,
    columns,
    currentCollection,
    metadataTemplate,
    ...rest
}: MetadataViewContainerProps) => {
    const { items = [] } = currentCollection;

    const filterGroups = React.useMemo(
        () => [
            {
                toggleable: true,
                filters:
                    metadataTemplate?.fields?.map(field => {
                        return {
                            id: `${field.key}-filter`,
                            name: field.displayName,
                            fieldType: field.type,
                            options: field.options?.map(({ key }) => key) || [],
                            shouldRenderChip: true,
                        };
                    }) || [],
            },
        ],
        [metadataTemplate],
    );

    return (
        <MetadataView
            actionBarProps={{
                ...actionBarProps,
                filterGroups,
            }}
            columns={columns}
            items={items}
            {...rest}
        />
    );
};

export default MetadataViewContainer;
