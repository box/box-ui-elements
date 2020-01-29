// @flow
import { FIELD_TYPE_FLOAT, FIELD_TYPE_INTEGER } from './constants';
import type { MetadataFieldValue } from '../../common/types/metadata';

const floatRegex = /^[-+]?[0-9]*\.?[0-9]*$/;
const integerRegex = /^[-+]?[0-9]+$/;

const floatValidator = (value: string) => !!value.match(floatRegex);
const integerValidator = (value: string) => !!value.match(integerRegex);

const isValidValue = (type: string, value: MetadataFieldValue) => {
    if (type === FIELD_TYPE_FLOAT && typeof value === 'string') {
        return floatValidator(value);
    }

    if (type === FIELD_TYPE_INTEGER && typeof value === 'string') {
        return integerValidator(value);
    }

    return true;
};

// eslint-disable-next-line import/prefer-default-export
export { isValidValue };
