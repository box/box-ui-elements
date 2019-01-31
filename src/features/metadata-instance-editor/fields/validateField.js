// @flow
import { FIELD_TYPE_FLOAT, FIELD_TYPE_INTEGER } from '../constants';

const floatRegexAllowTrailingPeriod = /^[-+]?[0-9]*\.?[0-9]*$/;
const floatRegex = /^[-+]?[0-9]*\.?[0-9]+$/;
const integerRegex = /^[-+]?[0-9]+$/;

const floatValidatorAllowTrailingPeriod = (value: string) => !!value.match(floatRegexAllowTrailingPeriod);
const floatValidator = (value: string) => !!value.match(floatRegex);
const integerValidator = (value: string) => !!value.match(integerRegex);

type Options = {
    allowTrailingPeriod?: boolean,
};

const isValidValue = (type: string, value: MetadataFieldValue, options?: Options = {}) => {
    if (type === FIELD_TYPE_FLOAT && typeof value === 'string') {
        return options.allowTrailingPeriod ? floatValidatorAllowTrailingPeriod(value) : floatValidator(value);
    }

    if (type === FIELD_TYPE_INTEGER && typeof value === 'string') {
        return integerValidator(value);
    }

    return true;
};

export { isValidValue };
