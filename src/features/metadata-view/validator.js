// @flow
import { FLOAT } from './constants';

const floatRegex = /[^$,.\d]/;

const floatValidator = (value: string) => {
    return value.match(floatRegex);
};

const isValidValue = (type: string, value?: string | Date | any) => {
    if (type === FLOAT) {
        if (value != null && !floatValidator(String(value))) {
            return true;
        }
        if (value == null) {
            return true;
        }
        return false;
    }
    return false;
};

const isValidCondition = (type: string, condition: Object | null) => {
    if (!condition) {
        return false;
    }
    if (type === FLOAT) {
        if (condition.valueKey && !floatValidator(String(condition.valueKey))) {
            return true;
        }
    } else if (type !== FLOAT) {
        if (
            condition.attributeKey !== null &&
            condition.valueKey !== null &&
            condition.valueKey !== '' &&
            condition.operatorKey !== null
        ) {
            return true;
        }
    }
    return false;
};

export { isValidCondition, isValidValue };
