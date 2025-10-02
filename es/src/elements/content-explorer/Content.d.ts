import * as React from 'react';
import { ExternalFilterValues, MetadataViewContainerProps } from './MetadataViewContainer';
import { type FeatureConfig } from '../common/feature-checking';
import type { ViewMode } from '../common/flowTypes';
import type { ItemAction, ItemEventHandlers, ItemEventPermissions } from '../common/item';
import type { FieldsToShow } from '../../common/types/metadataQueries';
import type { BoxItem, Collection, View } from '../../common/types/core';
import type { MetadataFieldValue, MetadataTemplate } from '../../common/types/metadata';
import './Content.scss';
export interface ContentProps extends Required<ItemEventHandlers>, Required<ItemEventPermissions> {
    currentCollection: Collection;
    features?: FeatureConfig;
    fieldsToShow?: FieldsToShow;
    gridColumnCount?: number;
    isMedium: boolean;
    isSmall: boolean;
    isTouch: boolean;
    itemActions?: ItemAction[];
    metadataTemplate?: MetadataTemplate;
    metadataViewProps?: Omit<MetadataViewContainerProps, 'hasError' | 'currentCollection' | 'metadataTemplate' | 'onMetadataFilter'>;
    onMetadataFilter?: (fields: ExternalFilterValues) => void;
    onMetadataUpdate: (item: BoxItem, field: string, currentValue: MetadataFieldValue, editedValue: MetadataFieldValue) => void;
    onSortChange: (sortBy: string, sortDirection: string) => void;
    portalElement: HTMLElement;
    view: View;
    viewMode?: ViewMode;
}
declare const Content: ({ currentCollection, features, fieldsToShow, gridColumnCount, metadataTemplate, metadataViewProps, onMetadataFilter, onMetadataUpdate, onSortChange, view, viewMode, ...rest }: ContentProps) => React.JSX.Element;
export default Content;
