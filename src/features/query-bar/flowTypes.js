// @flow
import { AND, OR, EMPTY_CONNECTOR } from './constants';

export type ConnectorType = typeof AND | typeof OR | typeof EMPTY_CONNECTOR;

export type OptionType = {
    displayText: string,
    id: string,
    type?: string,
    value: string,
};

export type ColumnType = {
    displayName: string,
    id: string,
    isShown: boolean,
    options: Array<Object> | null, // TODO: ColumnOptionsType - Array<ColumnOptionType>
    property: string,
    source: string,
    templateKey?: string,
    type: string,
};

export type ConditionType = {
    columnId: string,
    id: number,
    operator: string,
    values: Array<string>,
};
