import * as React from 'react';
import { MetadataView, type MetadataViewProps } from '@box/metadata-view';

import type { SortDescriptor } from 'react-aria-components';
import type { Collection } from '../../common/types/core';

export interface MetadataViewContainerProps extends Omit<MetadataViewProps, 'items'> {
    currentCollection: Collection;
    onSortChange?: (sortBy: string, sortDirection: string) => void;
}

const MetadataViewContainer = ({
    actionBarProps,
    columns,
    currentCollection,
    onSortChange,
    tableProps,
    ...rest
}: MetadataViewContainerProps) => {
    const { items = [], metadataTemplate } = currentCollection;

    const filterGroups = React.useMemo(
        () => [
            {
                togglable: true,
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

    const handleSortChange = React.useCallback(
        (sortDescriptor: SortDescriptor) => {
            onSortChange?.(sortDescriptor.column as string, sortDescriptor.direction);
        },
        [onSortChange],
    );

    return (
        <MetadataView
            columns={columns}
            items={items}
            actionBarProps={{
                ...actionBarProps,
                filterGroups,
            }}
            tableProps={{
                ...tableProps,
                onSortChange: handleSortChange,
            }}
            {...rest}
        />
    );
};

export default MetadataViewContainer;
