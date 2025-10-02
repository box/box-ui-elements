export const AND = 'AND';
export const OR = 'OR';
export const EMPTY_CONNECTOR = 'EMPTY_CONNECTOR';
export const COLUMN = 'column';
export const COLUMN_ID = 'columnId';
export const OPERATOR = 'operator';
export const OPERATOR_DISPLAY_TEXT = 'operatorDisplayText';
export const OPERATOR_KEY = 'operatorKey';
export const VALUE = 'value';
export const VALUES = 'values';
export const VALUE_DISPLAY_TEXT = 'valueDisplayText';
export const VALUE_KEY = 'valueKey';
export const WHERE = 'WHERE';
export const STRING = 'string';
export const NUMBER = 'number';
export const FLOAT = 'float';
export const ENUM = 'enum';
export const MULTI_SELECT = 'multiSelect';
export const DATE = 'date';
export const EQUALS = '=';
export const NOT_EQUALS = '<>';
export const GREATER_THAN = '>';
export const LESS_THAN = '<';
export const SORT_ORDER_ASCENDING = 'ASC';
export const SORT_ORDER_DESCENDING = 'DESC';
export const OPERATORS = {
  EQUALS: {
    displayText: 'is',
    key: EQUALS
  },
  NOT_EQUALS: {
    displayText: 'is not',
    key: NOT_EQUALS
  },
  GREATER_THAN: {
    displayText: 'is greater than',
    key: GREATER_THAN
  },
  LESS_THAN: {
    displayText: 'is less than',
    key: LESS_THAN
  }
};
export const ALL_OPERATORS = [OPERATORS.EQUALS, OPERATORS.NOT_EQUALS, OPERATORS.GREATER_THAN, OPERATORS.LESS_THAN];
export const COLUMN_OPERATORS = {
  string: ALL_OPERATORS,
  number: ALL_OPERATORS,
  float: ALL_OPERATORS,
  enum: ALL_OPERATORS,
  date: ALL_OPERATORS,
  multiSelect: ALL_OPERATORS
};
//# sourceMappingURL=constants.js.map