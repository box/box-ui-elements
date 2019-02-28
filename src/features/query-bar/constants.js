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
export const VALUE_DISPLAY_TEXT: 'valueDisplayText' = 'valueDisplayText';
export const VALUE_KEY: 'valueKey' = 'valueKey';
export const WHERE: 'WHERE' = 'WHERE';

export const STRING: 'string' = 'string';
export const NUMBER: 'number' = 'number';
export const FLOAT: 'float' = 'float';
export const ENUM: 'enum' = 'enum';
export const DATE: 'date' = 'date';

export const IS: '=' = '=';
export const IS_NOT: '!=' = '!=';
export const GREATER_THAN: '>' = '>';
export const LESS_THAN: '<' = '<';

export const IS_OPERATOR = {
    displayName: 'is',
    key: IS,
};

export const GREATER_THAN_OPERATOR = {
    displayName: 'is greater than',
    key: GREATER_THAN,
};

export const LESS_THAN_OPERATOR = {
    displayName: 'is less than',
    key: LESS_THAN,
};

export const IS_NOT_OPERATOR = {
    displayName: 'is not',
    key: IS_NOT,
};

export const COLUMN_OPERATORS = {
    string: [IS_OPERATOR, IS_NOT_OPERATOR, GREATER_THAN_OPERATOR, LESS_THAN_OPERATOR],
    number: [IS_OPERATOR, IS_NOT_OPERATOR, GREATER_THAN_OPERATOR, LESS_THAN_OPERATOR],
    float: [IS_OPERATOR, IS_NOT_OPERATOR, GREATER_THAN_OPERATOR, LESS_THAN_OPERATOR],
    enum: [IS_OPERATOR, IS_NOT_OPERATOR, GREATER_THAN_OPERATOR, LESS_THAN_OPERATOR],
    date: [IS_OPERATOR, IS_NOT_OPERATOR, GREATER_THAN_OPERATOR, LESS_THAN_OPERATOR],
};
