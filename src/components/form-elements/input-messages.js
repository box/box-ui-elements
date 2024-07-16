// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import commonMessages from '../../common/messages';

const badInput = () => ({
    code: 'badInput',
    message: <FormattedMessage {...commonMessages.invalidInputError} />,
});

const patternMismatch = () => ({
    code: 'patternMismatch',
    message: <FormattedMessage {...commonMessages.invalidInputError} />,
});

const tooShort = (minLength: number) => ({
    code: 'tooShort',
    message: <FormattedMessage {...commonMessages.minLengthError} values={{ min: minLength }} />,
});

const tooLong = (maxLength: number) => ({
    code: 'tooLong',
    message: <FormattedMessage {...commonMessages.maxLengthError} values={{ max: maxLength }} />,
});

const typeMismatchEmail = () => ({
    code: 'typeMismatch',
    message: <FormattedMessage {...commonMessages.invalidEmailError} />,
});

const typeMismatchUrl = () => ({
    code: 'typeMismatch',
    message: <FormattedMessage {...commonMessages.invalidURLError} />,
});

const valueMissing = () => ({
    code: 'valueMissing',
    message: <FormattedMessage {...commonMessages.requiredFieldError} />,
});

export { badInput, patternMismatch, tooShort, tooLong, typeMismatchEmail, typeMismatchUrl, valueMissing };
