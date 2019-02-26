// @flow

export const AND: 'AND' = 'AND';
export const OR: 'OR' = 'OR';
export const EMPTY_CONNECTOR: 'EMPTY_CONNECTOR' = 'EMPTY_CONNECTOR';
export const COLUMN: 'column' = 'column';
export const COLUMN_DISPLAY_TEXT: 'columnDisplayText' = 'columnDisplayText';
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

export const COLUMN_OPERATORS = {
    string: [
        {
            displayName: 'is',
            type: STRING,
        },
    ],
    number: [
        {
            displayName: 'is',
            type: NUMBER,
        },
    ],
    float: [
        {
            displayName: 'is',
            type: FLOAT,
        },
    ],
    enum: [
        {
            displayName: 'is',
            type: ENUM,
        },
    ],
    date: [
        {
            displayName: 'is',
            type: DATE,
        },
        {
            displayName: 'is greater than',
            type: DATE,
        },
        {
            displayName: 'is less than',
            type: DATE,
        },
        {
            displayName: 'is not',
            type: DATE,
        },
    ],
};
