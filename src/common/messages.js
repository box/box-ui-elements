// @flow
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    cancel: {
        defaultMessage: 'Cancel',
        description: 'Cancel button text',
        id: 'boxui.core.cancel',
    },
    close: {
        defaultMessage: 'Close',
        description: 'Close button text',
        id: 'boxui.core.close',
    },
    copy: {
        defaultMessage: 'Copy',
        description: 'Copy button text',
        id: 'boxui.core.copy',
    },
    copied: {
        defaultMessage: 'Copied',
        description: 'Copy button text after user clicks on it',
        id: 'boxui.core.copied',
    },
    done: {
        defaultMessage: 'Done',
        description: 'Done button text',
        id: 'boxui.core.done',
    },
    okay: {
        defaultMessage: 'Okay',
        description: 'Okay button text',
        id: 'boxui.core.okay',
    },
    save: {
        defaultMessage: 'Save',
        description: 'Save button text',
        id: 'boxui.core.save',
    },
    send: {
        defaultMessage: 'Send',
        description: 'Send button text',
        id: 'boxui.core.send',
    },
    optional: {
        defaultMessage: 'optional',
        description: 'Optional text for labels',
        id: 'boxui.core.optional',
    },
    pillSelectorPlaceholder: {
        defaultMessage: 'Add names or email addresses',
        description: 'Placeholder text for the pill selector',
        id: 'boxui.share.pillSelectorPlaceholder',
    },
    messageSelectorPlaceholder: {
        defaultMessage: 'Add a message',
        description: 'Placeholder text for message section',
        id: 'boxui.share.messageSelectorPlaceholder',
    },
    invalidInputError: {
        defaultMessage: 'Invalid Input',
        description: 'Generic error message for a field is invalid',
        id: 'boxui.validation.genericError',
    },
    minLengthError: {
        defaultMessage: 'Input must be at least {min} characters',
        description: 'Error message for when an input value is too short. {min} is the minimum length',
        id: 'boxui.validation.tooShortError',
    },
    maxLengthError: {
        defaultMessage: 'Input cannot exceed {max} characters',
        description: 'Error message for when an input value is too long. {max} is the maximum length',
        id: 'boxui.validation.tooLongError',
    },
    invalidEmailError: {
        defaultMessage: 'Invalid Email Address',
        description: 'Error message for when an invalid email is entered',
        id: 'boxui.validation.emailError',
    },
    invalidURLError: {
        defaultMessage: 'Invalid URL',
        description: 'Error message for when an invalid URL is entered',
        id: 'boxui.validation.URLError',
    },
    invalidUserError: {
        defaultMessage: 'Invalid User',
        description: 'Error message for when an invalid user is entered',
        id: 'boxui.validation.invalidUserError',
    },
    requiredFieldError: {
        defaultMessage: 'Required Field',
        description: 'Error message for when a required field is missing',
        id: 'boxui.validation.requiredError',
    },
    invalidDateError: {
        defaultMessage: 'Invalid Date',
        description: 'Error message for when an invalid Date is entered',
        id: 'boxui.validation.invalidDateError',
    },
});

export default messages;
