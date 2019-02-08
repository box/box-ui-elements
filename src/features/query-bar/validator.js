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

// eslint-disable-next-line import/prefer-default-export
export { isValidValue };
