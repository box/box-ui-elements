// @flow

export type ColumnType = {
    displayName: string,
    id: string,
    isShown: boolean,
    options: Array<Object> | null,
    property: string,
    source: string,
    templateKey?: string,
    type: string,
};

export type ConditionType = {
    columnDisplayText: string,
    columnKey: string | null,
    id: number,
    operatorDisplayText: string,
    operatorKey: string | null,
    valueDisplayText: string,
    valueKey: string | null,
    valueType: string,
};
