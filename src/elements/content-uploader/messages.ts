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
    largeFileWarningHeading: {
        id: 'be.contentUploader.largeFileWarning.heading',
        defaultMessage: "{count, plural, one {File} other {Files}} Can't Be Uploaded",
        description: 'Heading for the warning modal shown when one or more files exceed the upload size limit',
    },
    largeFileWarningBody: {
        id: 'be.contentUploader.largeFileWarning.body',
        defaultMessage:
            '{count, plural, one {This file exceeds} other {These files exceed}} the {maxFileSize} limit on your current plan. <link>Upgrade your plan</link> for larger uploads:',
        description:
            'Body text in the warning modal informing the user that one or more files exceed their plan upload size limit. Contains a link to upgrade the plan.',
    },
    largeFileWarningCancelButton: {
        id: 'be.contentUploader.largeFileWarning.cancelButton',
        defaultMessage: 'Cancel',
        description: 'Label for the button that cancels the upload attempt entirely',
    },
    largeFileWarningUploadTheRestButton: {
        id: 'be.contentUploader.largeFileWarning.uploadTheRestButton',
        defaultMessage: 'Upload the Rest',
        description:
            'Label for the button that proceeds with uploading only the files that are within the plan size limit',
    },
    largeFileWarningCloseAriaLabel: {
        id: 'be.contentUploader.largeFileWarning.closeAriaLabel',
        defaultMessage: 'Close',
        description: 'Accessible label for the close button in the large file warning modal',
    },
    largeFileWarningFileListAriaLabel: {
        id: 'be.contentUploader.largeFileWarning.fileListAriaLabel',
        defaultMessage: 'Files exceeding the upload size limit',
        description: 'Accessible label for the list of oversize files inside the warning modal',
    },
});

export default messages;
