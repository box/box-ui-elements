// @flow
import { FLOAT } from './constants';

const isFloat = (value: string) => {
    return !/^\s*$/.test(value) && !Number.isNaN(value);
};

const isInt = (value: string) => {
    return /^\d+$/.test(value);
};

const isValidValue = (type: string, value?: string | Date | any) => {
    if (type === FLOAT) {
        if (value != null && !isFloat(String(value))) {
            return true;
        }
        if (value == null) {
            return true;
        }
        return false;
    }
    return false;
};

// eslint-disable-next-line import/prefer-default-export
export { isFloat, isInt, isValidValue };
