// @flow

import {
    FIELD_TYPE_DATE,
    FIELD_TYPE_ENUM,
    FIELD_TYPE_FLOAT,
    FIELD_TYPE_MULTISELECT,
    FIELD_TYPE_STRING,
    JSON_PATCH_OP_ADD,
    JSON_PATCH_OP_REMOVE,
    JSON_PATCH_OP_REPLACE,
    JSON_PATCH_OP_TEST,
} from './constants';

export type FieldValue = string | number | Array<any>;

export type Fields = { [string]: FieldValue };

export type FieldType =
    | typeof FIELD_TYPE_DATE
    | typeof FIELD_TYPE_ENUM
    | typeof FIELD_TYPE_FLOAT
    | typeof FIELD_TYPE_MULTISELECT
    | typeof FIELD_TYPE_STRING;

export type TemplateFieldOption = {
    id?: string,
    key: string,
};

export type TemplateField = {
    id: string,
    type: FieldType,
    key: string,
    displayName: string,
    description?: string,
    isHidden?: boolean, // V2
    hidden?: boolean, // V3
    options?: Array<TemplateFieldOption>,
};

export type Template = {
    id: string,
    scope: string,
    templateKey: string,
    displayName?: string,
    fields?: Array<TemplateField>,
    isHidden?: boolean, // V2
    hidden?: boolean, // V3
};

export type CascadePolicyType = {
    canEdit?: boolean,
    id?: string,
};

export type InstanceType = {
    id: string,
    data: Fields,
    canEdit: boolean,
    cascadePolicy?: CascadePolicyType,
};

export type Editor = {
    hasError?: boolean,
    instance: InstanceType,
    isDirty?: boolean,
    template: Template,
};

export type JSONPatch = {
    op:
        | typeof JSON_PATCH_OP_ADD
        | typeof JSON_PATCH_OP_REMOVE
        | typeof JSON_PATCH_OP_REPLACE
        | typeof JSON_PATCH_OP_TEST,
    path: string,
    value?: FieldValue,
};

export type JSONPatchOperations = Array<JSONPatch>;

export type CascadingPolicyData = {
    id?: string,
    isEnabled: boolean,
    overwrite: boolean,
};

export type CellData = {
    cellData: any,
    columnData?: any,
    columnIndex: number,
    dataKey: string,
    isScrolling?: boolean,
    parent?: Object,
    rowData: Object,
    rowIndex: number,
};

export type HeaderData = {
    columnData?: any,
    dataKey: string,
    disableSort?: boolean,
    label: string,
    sortBy?: string,
    SortDirection?: any,
};
