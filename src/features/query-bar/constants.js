// @flow

export const AND: 'AND' = 'AND';
export const OR: 'OR' = 'OR';
export const EMPTY_CONNECTOR: 'EMPTY_CONNECTOR' = 'EMPTY_CONNECTOR';
export const COLUMN: 'column' = 'column';
export const COLUMN_ID: 'columnId' = 'columnId';
export const OPERATOR: 'operator' = 'operator';
export const OPERATOR_DISPLAY_TEXT: 'operatorDisplayText' = 'operatorDisplayText';
export const OPERATOR_KEY: 'operatorKey' = 'operatorKey';
export const VALUE: 'value' = 'value';
export const VALUES: 'values' = 'values';
export const VALUE_DISPLAY_TEXT: 'valueDisplayText' = 'valueDisplayText';
export const VALUE_KEY: 'valueKey' = 'valueKey';
export const WHERE: 'WHERE' = 'WHERE';

export const STRING: 'string' = 'string';
export const NUMBER: 'number' = 'number';
export const FLOAT: 'float' = 'float';
export const ENUM: 'enum' = 'enum';
export const MULTI_SELECT: 'multiSelect' = 'multiSelect';
export const DATE: 'date' = 'date';

export const EQUALS: '=' = '=';
export const NOT_EQUALS: '<>' = '<>';
export const GREATER_THAN: '>' = '>';
export const LESS_THAN: '<' = '<';

export const SORT_ORDER_ASCENDING: 'ASC' = 'ASC';
export const SORT_ORDER_DESCENDING: 'DESC' = 'DESC';

export const OPERATORS = {
    EQUALS: { displayText: 'is', key: EQUALS },
    NOT_EQUALS: { displayText: 'is not', key: NOT_EQUALS },
    GREATER_THAN: { displayText: 'is greater than', key: GREATER_THAN },
    LESS_THAN: { displayText: 'is less than', key: LESS_THAN },
};

export const ALL_OPERATORS = [OPERATORS.EQUALS, OPERATORS.NOT_EQUALS, OPERATORS.GREATER_THAN, OPERATORS.LESS_THAN];

export const COLUMN_OPERATORS = {
    string: ALL_OPERATORS,
    number: ALL_OPERATORS,
    float: ALL_OPERATORS,
    enum: ALL_OPERATORS,
    date: ALL_OPERATORS,
    multiSelect: ALL_OPERATORS,
};
