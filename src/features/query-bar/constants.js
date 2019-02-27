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

export const COLUMN_OPERATORS = {
    string: [
        {
            displayName: 'is',
            key: IS,
            type: STRING,
        },
        {
            displayName: 'is greater than',
            key: GREATER_THAN,
            type: STRING,
        },
        {
            displayName: 'is less than',
            key: LESS_THAN,
            type: STRING,
        },
        {
            displayName: 'is not',
            key: IS_NOT,
            type: STRING,
        },
    ],
    number: [
        {
            displayName: 'is',
            key: IS,
            type: NUMBER,
        },
        {
            displayName: 'is greater than',
            key: GREATER_THAN,
            type: NUMBER,
        },
        {
            displayName: 'is less than',
            key: LESS_THAN,
            type: NUMBER,
        },
        {
            displayName: 'is not',
            key: IS_NOT,
            type: NUMBER,
        },
    ],
    float: [
        {
            displayName: 'is',
            key: IS,
            type: FLOAT,
        },
        {
            displayName: 'is greater than',
            key: GREATER_THAN,
            type: FLOAT,
        },
        {
            displayName: 'is less than',
            key: LESS_THAN,
            type: FLOAT,
        },
        {
            displayName: 'is not',
            key: IS_NOT,
            type: FLOAT,
        },
    ],
    enum: [
        {
            displayName: 'is',
            key: IS,
            type: ENUM,
        },
        {
            displayName: 'is greater than',
            key: GREATER_THAN,
            type: ENUM,
        },
        {
            displayName: 'is less than',
            key: LESS_THAN,
            type: ENUM,
        },
        {
            displayName: 'is not',
            key: IS_NOT,
            type: ENUM,
        },
    ],
    date: [
        {
            displayName: 'is',
            key: IS,
            type: DATE,
        },
        {
            displayName: 'is greater than',
            key: GREATER_THAN,
            type: DATE,
        },
        {
            displayName: 'is less than',
            key: LESS_THAN,
            type: DATE,
        },
        {
            displayName: 'is not',
            key: IS_NOT,
            type: DATE,
        },
    ],
};
