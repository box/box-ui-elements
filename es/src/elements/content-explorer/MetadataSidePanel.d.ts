import React from 'react';
import { JSONPatchOperations, type MetadataTemplateField } from '@box/metadata-editor';
import type { Selection } from 'react-aria-components';
import type { BoxItem, Collection } from '../../common/types/core';
import type { MetadataTemplate } from '../../common/types/metadata';
import './MetadataSidePanel.scss';
export interface MetadataSidePanelProps {
    currentCollection: Collection;
    metadataTemplate: MetadataTemplate;
    onClose: () => void;
    onUpdate: (items: BoxItem[], operations: JSONPatchOperations, templateOldFields: MetadataTemplateField[], templateNewFields: MetadataTemplateField[], successCallback: () => void, errorCallback: ErrorCallback) => Promise<void>;
    refreshCollection: () => void;
    selectedItemIds: Selection;
}
declare const MetadataSidePanel: ({ currentCollection, metadataTemplate, onClose, onUpdate, refreshCollection, selectedItemIds, }: MetadataSidePanelProps) => React.JSX.Element;
export default MetadataSidePanel;
