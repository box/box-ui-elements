import { defineMessages } from 'react-intl';

const messages = defineMessages({
    heading: {
        id: 'be.contentUploader.cancelAllUploads.heading',
        defaultMessage: 'Cancel all uploads?',
        description: 'Heading for the cancel all uploads confirmation modal',
    },
    body: {
        id: 'be.contentUploader.cancelAllUploads.body',
        defaultMessage: 'Files that are still uploading will be canceled. Completed uploads will not be affected.',
        description: 'Body content for the cancel all uploads confirmation modal',
    },
    confirmButton: {
        id: 'be.contentUploader.cancelAllUploads.confirmButton',
        defaultMessage: 'Cancel All',
        description: 'Confirm button for the cancel all uploads modal',
    },
    keepUploadingButton: {
        id: 'be.contentUploader.cancelAllUploads.keepUploadingButton',
        defaultMessage: 'Keep Uploading',
        description: 'Dismiss button for the cancel all uploads modal',
    },
    closeLabel: {
        id: 'be.contentUploader.cancelAllUploads.closeLabel',
        defaultMessage: 'Close cancel uploads dialog',
        description: 'Aria label for the close button on the cancel all uploads modal',
    },
});

export default messages;
