import { type MetadataTemplate, type MetadataFormFieldValue } from '@box/metadata-editor';
import type { MetadataFieldType } from '@box/metadata-view';
import type { Selection } from 'react-aria-components';
import type { BoxItem, Collection } from '../../common/types/core';
type ItemMetadataFieldValue = string | number | Array<string> | null | undefined;
export declare function useSelectedItemText(currentCollection: Collection, selectedItemIds: Selection): string;
export declare function isEmptyValue(value: ItemMetadataFieldValue): boolean;
export declare function areFieldValuesEqual(value1: ItemMetadataFieldValue, value2: ItemMetadataFieldValue): boolean;
export declare function isMultiValuesField(fieldType: MetadataFieldType, fieldValue: MetadataFormFieldValue): boolean;
export declare function useTemplateInstance(metadataTemplate: MetadataTemplate, selectedItems: BoxItem[], isEditing: boolean): {
    canEdit: boolean;
    displayName: string;
    hidden: boolean;
    id: string;
    fields: {
        value: any;
        displayName: string;
        hidden: boolean;
        id: string;
        key: string;
        options: import("@box/metadata-editor").MetadataTemplateFieldOption[];
        type: import("@box/metadata-editor").MetadataTemplateFieldType;
    }[];
    scope: string;
    templateKey: string;
    type: string;
};
export declare const getFileExtensions: (selectedFileType: string) => string[];
export {};
