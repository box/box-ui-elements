import { defineMessages } from 'react-intl';

const messages = defineMessages({
    cancelAllUploadsModalHeading: {
        id: 'be.contentUploader.cancelAllUploadsModalHeading',
        defaultMessage: 'Cancel all uploads?',
        description: 'Heading for the cancel all uploads confirmation modal',
    },
    cancelAllUploadsModalContent: {
        id: 'be.contentUploader.cancelAllUploadsModalContent',
        defaultMessage: 'Files that are still uploading will be canceled. Completed uploads will not be affected.',
        description: 'Body content for the cancel all uploads confirmation modal',
    },
    cancelAllUploadsConfirmButton: {
        id: 'be.contentUploader.cancelAllUploadsConfirmButton',
        defaultMessage: 'Cancel All',
        description: 'Confirm button for the cancel all uploads modal',
    },
    cancelAllUploadsKeepButton: {
        id: 'be.contentUploader.cancelAllUploadsKeepButton',
        defaultMessage: 'Keep Uploading',
        description: 'Dismiss button for the cancel all uploads modal',
    },
    cancelAllUploadsCloseLabel: {
        id: 'be.contentUploader.cancelAllUploadsCloseLabel',
        defaultMessage: 'Close cancel uploads dialog',
        description: 'Aria label for the close button on the cancel all uploads modal',
    },
});

export default messages;
