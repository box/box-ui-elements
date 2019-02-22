// @flow
import { AND, OR, EMPTY_CONNECTOR } from './constants';

export type ConnectorType = typeof AND | typeof OR | typeof EMPTY_CONNECTOR;

export type OptionType = {
    displayText: string,
    fieldId: string,
    type?: string,
    value: string | ConnectorType,
};

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
