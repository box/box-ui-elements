import * as React from 'react';
import { MetadataView, type MetadataViewProps } from '@box/metadata-view';
<<<<<<< HEAD
import type { MetadataTemplate } from '../../common/types/metadata';
=======

import type { SortDescriptor } from 'react-aria-components';
>>>>>>> b49985c8b (feat(metadata-view): Add MetadataView V2)
import type { Collection } from '../../common/types/core';

export interface MetadataViewContainerProps extends Omit<MetadataViewProps, 'items'> {
    currentCollection: Collection;
<<<<<<< HEAD
    metadataTemplate: MetadataTemplate;
=======
    onSortChange?: (sortBy: string, sortDirection: string) => void;
>>>>>>> b49985c8b (feat(metadata-view): Add MetadataView V2)
}

const MetadataViewContainer = ({
    actionBarProps,
    columns,
    currentCollection,
<<<<<<< HEAD
    metadataTemplate,
    ...rest
}: MetadataViewContainerProps) => {
    const { items = [] } = currentCollection;
=======
    onSortChange,
    tableProps,
    ...rest
}: MetadataViewContainerProps) => {
    const { items = [], metadataTemplate } = currentCollection;
>>>>>>> b49985c8b (feat(metadata-view): Add MetadataView V2)

    const filterGroups = React.useMemo(
        () => [
            {
<<<<<<< HEAD
                toggleable: true,
=======
                togglable: true,
>>>>>>> b49985c8b (feat(metadata-view): Add MetadataView V2)
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

<<<<<<< HEAD
    return (
        <MetadataView
=======
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
>>>>>>> b49985c8b (feat(metadata-view): Add MetadataView V2)
            actionBarProps={{
                ...actionBarProps,
                filterGroups,
            }}
<<<<<<< HEAD
            columns={columns}
            items={items}
=======
            tableProps={{
                ...tableProps,
                onSortChange: handleSortChange,
            }}
>>>>>>> b49985c8b (feat(metadata-view): Add MetadataView V2)
            {...rest}
        />
    );
};

export default MetadataViewContainer;
