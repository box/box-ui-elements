// @flow

export const ATTRIBUTE: 'attribute' = 'attribute';
export const ATTRIBUTE_DISPLAY_TEXT: 'attributeDisplayText' = 'attributeDisplayText';
export const ATTRIBUTE_KEY: 'attributeKey' = 'attributeKey';
export const OPERATOR: 'operator' = 'operator';
export const OPERATOR_DISPLAY_TEXT: 'operatorDisplayText' = 'operatorDisplayText';
export const OPERATOR_KEY: 'operatorKey' = 'operatorKey';
export const VALUE: 'value' = 'value';
export const VALUE_DISPLAY_TEXT: 'valueDisplayText' = 'valueDisplayText';
export const VALUE_KEY: 'valueKey' = 'valueKey';
export const WHERE: null = null;
export const AND: 'AND' = 'AND';
export const OR: 'OR' = 'OR';

export const STRING: 'string' = 'string';
export const NUMBER: 'number' = 'number';
export const FLOAT: 'float' = 'float';
export const ENUM: 'enum' = 'enum';
export const DATE: 'date' = 'date';

export const OPERATORS_FOR_ATTRIBUTE = {
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
