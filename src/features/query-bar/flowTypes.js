// @flow

export type ColumnType = {
    displayName: string,
    fields?: Array<Object>,
    id: string,
    isShown: boolean,
    property: string,
    source: string,
    templateKey?: string,
    type: string,
};
