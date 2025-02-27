/**
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    today: {
        id: 'be.today',
        description: 'Shown instead of todays date.',
        defaultMessage: 'today',
    },
    yesterday: {
        id: 'be.yesterday',
        description: 'Shown instead of yesterdays date.',
        defaultMessage: 'yesterday',
    },
    logo: {
        id: 'be.logo',
        description: 'Placeholder for a logo.',
        defaultMessage: 'Logo',
    },
    error: {
        id: 'be.error',
        description: 'Generic error label.',
        defaultMessage: 'Error',
    },
    preview: {
        id: 'be.preview',
        description: 'Label for preview action.',
        defaultMessage: 'Preview',
    },
    previewError: {
        id: 'be.previewError',
        description: 'Error message when Preview fails due to the files call.',
        defaultMessage: "This preview didn't load. Please try to open or download the file to view.",
    },
    previewErrorBlockedByPolicy: {
        id: 'be.previewErrorBlockedByPolicy',
        description: 'Error message when Preview fails due to the files call which is blocked by an access policy.',
        defaultMessage: 'Your access to this content is restricted due to a security policy.',
    },
    boxEditErrorBlockedByPolicy: {
        id: 'be.boxEditErrorBlockedByPolicy',
        defaultMessage: 'Local editing of this content has been disabled based on an access policy',
        description: 'Shown in the open with dropdown when an application is blocked by shield access policy.',
    },
    previewUpdate: {
        id: 'be.previewUpdate',
        description: 'Message when new preview is available.',
        defaultMessage: 'A new version of this file is available.',
    },
    complete: {
        id: 'be.complete',
        description: 'Label for complete state.',
        defaultMessage: 'Complete',
    },
    loading: {
        id: 'be.loading',
        description: 'Label for loading state.',
        defaultMessage: 'Loading',
    },
    reload: {
        id: 'be.reload',
        description: 'Label for reload button.',
        defaultMessage: 'Reload',
    },
    open: {
        id: 'be.open',
        description: 'Label for open action.',
        defaultMessage: 'Open',
    },
    close: {
        id: 'be.close',
        description: 'Label for close action.',
        defaultMessage: 'Close',
    },
    copy: {
        id: 'be.copy',
        description: 'Label for copy action.',
        defaultMessage: 'Copy',
    },
    delete: {
        id: 'be.delete',
        description: 'Label for delete action.',
        defaultMessage: 'Delete',
    },
    rename: {
        id: 'be.rename',
        description: 'Label for rename action.',
        defaultMessage: 'Rename',
    },
    remove: {
        id: 'be.remove',
        description: 'Label for remove action.',
        defaultMessage: 'Remove',
    },
    resume: {
        id: 'be.resume',
        description: 'Label for resume action for a single file.',
        defaultMessage: 'Resume',
    },
    resumeAll: {
        id: 'be.resumeAll',
        description: 'Label for resume action for multiple files.',
        defaultMessage: 'Resume All',
    },
    retry: {
        id: 'be.retry',
        description: 'Label for retry action.',
        defaultMessage: 'Retry',
    },
    share: {
        id: 'be.share',
        description: 'Label for share action.',
        defaultMessage: 'Share',
    },
    download: {
        id: 'be.download',
        description: 'Label for download action.',
        defaultMessage: 'Download',
    },
    save: {
        id: 'be.save',
        description: 'Label for save action.',
        defaultMessage: 'Save',
    },
    cancel: {
        id: 'be.cancel',
        description: 'Label for cancel action.',
        defaultMessage: 'Cancel',
    },
    create: {
        id: 'be.create',
        description: 'Label for create action.',
        defaultMessage: 'Create',
    },
    choose: {
        id: 'be.choose',
        description: 'Label for choose action.',
        defaultMessage: 'Choose',
    },
    upload: {
        id: 'be.upload',
        description: 'Label for upload action.',
        defaultMessage: 'Upload',
    },
    uploadEmptyState: {
        id: 'be.uploadEmptyState',
        description: 'Label for upload empty state.',
        defaultMessage: 'Empty state',
    },
    uploadErrorState: {
        id: 'be.uploadErrorState',
        description: 'Label for upload error state.',
        defaultMessage: 'Error state',
    },
    uploadSuccessState: {
        id: 'be.uploadSuccessState',
        description: 'Label for upload success state.',
        defaultMessage: 'Success state',
    },
    createDialogLabel: {
        id: 'be.createDialogLabel',
        description: 'Label for create folder dialog',
        defaultMessage: 'New Folder',
    },
    createDialogText: {
        id: 'be.createDialogText',
        description: 'Text for create folder dialog',
        defaultMessage: 'Please enter a name.',
    },
    createDialogErrorInvalid: {
        id: 'be.createDialogErrorInvalid',
        description: 'Error text for create folder dialog when name is invalid',
        defaultMessage: 'This is an invalid folder name.',
    },
    createDialogErrorTooLong: {
        id: 'be.createDialogErrorTooLong',
        description: 'Error text for create folder dialog when name is too long',
        defaultMessage: 'This folder name is too long.',
    },
    createDialogErrorInUse: {
        id: 'be.createDialogErrorInUse',
        description: 'Error text for create folder dialog when name is already in use',
        defaultMessage: 'A folder with the same name already exists.',
    },
    defaultErrorMaskHeaderMessage: {
        id: 'be.defaultErrorMaskHeaderMessage',
        description: 'Default error mask top message',
        defaultMessage: "We're sorry, something went wrong.",
    },
    defaultErrorMaskSubHeaderMessage: {
        id: 'be.defaultErrorMaskSubHeaderMessage',
        description: 'Default error mask bottom message',
        defaultMessage: 'Please refresh the page or try again later.',
    },
    currentUserErrorHeaderMessage: {
        id: 'be.currentUserErrorHeaderMessage',
        description: 'Current user error message',
        defaultMessage: 'Something went wrong when fetching the current user.',
    },
    file: {
        id: 'be.file',
        description: 'Icon title for a Box item of type file',
        defaultMessage: 'File',
    },
    iconFile: {
        id: 'be.iconFile',
        description: 'Aria label for file icon',
        defaultMessage: '{extension} File',
    },
    folder: {
        id: 'be.folder',
        description: 'Icon title for a Box item of type folder',
        defaultMessage: 'Folder',
    },
    personalFolder: {
        id: 'be.personalFolder',
        description: 'Icon title for a Box item of type folder that is private and has no collaborators',
        defaultMessage: 'Personal Folder',
    },
    externalFolder: {
        id: 'be.externalFolder',
        description: "Icon title for a Box item of type folder that has collaborators outside of the user's enterprise",
        defaultMessage: 'External Folder',
    },
    collaboratedFolder: {
        id: 'be.collaboratedFolder',
        description: 'Icon title for a Box item of type folder that has collaborators',
        defaultMessage: 'Collaborated Folder',
    },
    archive: {
        id: 'be.archive',
        description: 'Icon title for a Box item of type folder is an archive',
        defaultMessage: 'Archive',
    },
    archivedFolder: {
        id: 'be.archivedFolder',
        description: 'Icon title for a Box item of type folder is in archive',
        defaultMessage: 'Archived Folder',
    },
    bookmark: {
        id: 'be.bookmark',
        description: 'Icon title for a Box item of type bookmark or web-link',
        defaultMessage: 'Bookmark',
    },
    moreOptions: {
        id: 'be.moreOptions',
        description: 'Label for a button that displays more options',
        defaultMessage: 'More options',
    },
    uploadsStorageLimitErrorMessage: {
        id: 'be.uploadsStorageLimitErrorMessage',
        description: 'Error message shown when account storage limit has been reached',
        defaultMessage: 'Account storage limit reached',
    },
    uploadsPendingFolderSizeLimitErrorMessage: {
        id: 'be.uploadsPendingFolderSizeLimitErrorMessage',
        description: 'Error message shown when pending app folder size exceeds the limit',
        defaultMessage: 'Pending app folder size limit exceeded',
    },
    uploadsPackageUploadErrorMessage: {
        id: 'be.uploadsPackageUploadErrorMessage',
        description: 'Error message to display when a macOS package failed to upload',
        defaultMessage: 'Failed to upload package file. Please retry by saving as a single file.',
    },
    uploadsDefaultErrorMessage: {
        id: 'be.uploadsDefaultErrorMessage',
        description: 'Default error message shown when upload fails',
        defaultMessage: 'Something went wrong with the upload. Please try again.',
    },
    uploadsFileSizeLimitExceededErrorMessage: {
        id: 'be.uploadsFileSizeLimitExceededErrorMessage',
        description: 'Error message shown when file size exceeds the limit',
        defaultMessage: "File size exceeds the folder owner's file size limit",
    },
    uploadsItemNameInUseErrorMessage: {
        id: 'be.uploadsItemNameInUseErrorMessage',
        description: 'Error message shown when attempting to upload a file which name already exists',
        defaultMessage: 'A file with this name already exists.',
    },
    uploadsProvidedFolderNameInvalidMessage: {
        id: 'be.uploadsProvidedFolderNameInvalidMessage',
        description: 'Error message shown when pending folder upload contains invalid characters',
        defaultMessage: 'Provided folder name, {name}, could not be used to create a folder.',
    },
    modifiedDateBy: {
        id: 'be.modifiedDateBy',
        description: 'Text for modified date with user with modified prefix.',
        defaultMessage: 'Modified {date} by {name}',
    },
    modifiedDate: {
        id: 'be.modifiedDate',
        description: 'Text for modified date with modified prefix.',
        defaultMessage: 'Modified {date}',
    },
    interactedDate: {
        id: 'be.interactedDate',
        description: 'Text for last accessed date with last access prefix.',
        defaultMessage: 'Last accessed on {date}',
    },
    nameDate: {
        id: 'be.nameDate',
        description: 'Text for modified or interacted date with user.',
        defaultMessage: '{date} by {name}',
    },
    uploadsOneOrMoreChildFoldersFailedToUploadMessage: {
        id: 'be.uploadsOneOrMoreChildFoldersFailedToUploadMessage',
        description: 'Error message shown when one or more child folders failed to upload',
        defaultMessage: 'One or more child folders failed to upload.',
    },
    uploadsFileSizeLimitExceededErrorMessageForUpgradeCta: {
        id: 'be.uploadsFileSizeLimitExceededErrorMessageForUpgradeCta',
        description: 'Error message shown when file size exceeds the limit',
        defaultMessage: "This file exceeds your plan's upload limit. Upgrade now to store larger files.",
    },
    deleteDialogLabel: {
        id: 'be.deleteDialogLabel',
        description: 'Label for delete confirmation dialog',
        defaultMessage: 'Confirm Delete',
    },
    deleteDialogFileText: {
        id: 'be.deleteDialogFileText',
        description: 'Text for delete confirmation dialog for files',
        defaultMessage: 'Are you sure you want to delete {name}?',
    },
    deleteDialogFolderText: {
        id: 'be.deleteDialogFolderText',
        description: 'Text for delete confirmation dialog for folders',
        defaultMessage: 'Are you sure you want to delete {name} and all its contents?',
    },
    uploadOptions: {
        id: 'be.uploadOptions',
        description: 'Label for upload options',
        defaultMessage: 'Upload Options',
    },
    uploadSuccess: {
        id: 'be.uploadSuccess',
        description: 'Text shown when upload is successful',
        defaultMessage: 'Upload success',
    },
    uploadSuccessFolderInput: {
        id: 'be.uploadSuccessFolderInput',
        description: 'Label for folder input when upload is successful',
        defaultMessage: 'Folder input',
    },
    name: {
        id: 'be.name',
        description: 'Label for item name',
        defaultMessage: 'Name',
    },
    interacted: {
        id: 'be.interacted',
        description: 'Label for last interacted date',
        defaultMessage: 'Last Accessed',
    },
    modified: {
        id: 'be.modified',
        description: 'Label for modified date',
        defaultMessage: 'Modified',
    },
    size: {
        id: 'be.size',
        description: 'Label for file size',
        defaultMessage: 'Size',
    },
    renameDialogErrorInUse: {
        id: 'be.renameDialogErrorInUse',
        description: 'Error text for rename dialog when name is already in use',
        defaultMessage: 'An item with the same name already exists.',
    },
    renameDialogErrorTooLong: {
        id: 'be.renameDialogErrorTooLong',
        description: 'Error text for rename dialog when name is too long',
        defaultMessage: 'This name is too long.',
    },
    renameDialogErrorInvalid: {
        id: 'be.renameDialogErrorInvalid',
        description: 'Error text for rename dialog when name is invalid',
        defaultMessage: 'This name is invalid.',
    },
    renameDialogErrorMaliciousName: {
        id: 'be.renameDialogErrorMaliciousName',
        description: 'Error text for rename dialog when name is malicious',
        defaultMessage: 'The name you are trying to use is not allowed.',
    },
    renameDialogLabel: {
        id: 'be.renameDialogLabel',
        description: 'Label for rename dialog',
        defaultMessage: 'Rename',
    },
    uploadEmptyWithFolderUploadDisabled: {
        id: 'be.uploadEmptyWithFolderUploadDisabled',
        description: 'Message shown for upload when folder upload is disabled',
        defaultMessage: 'Drag and drop files or click to upload content.',
    },
    uploadInProgress: {
        id: 'be.uploadInProgress',
        description: 'Message shown when upload is in progress',
        defaultMessage: 'Uploading...',
    },
    uploadSuccessFileInput: {
        id: 'be.uploadSuccessFileInput',
        description: 'Label for file input when upload is successful',
        defaultMessage: 'File input',
    },
    renameDialogText: {
        id: 'be.renameDialogText',
        description: 'Text for rename dialog',
        defaultMessage: 'Please enter a new name for {name}.',
    },
    shareDialogNone: {
        id: 'be.shareDialogNone',
        description: 'Default text for share dialog when no link exists',
        defaultMessage: 'None',
    },
    uploadEmptyFolderInput: {
        id: 'be.uploadEmptyFolderInput',
        description: 'Label for folder input when upload is empty',
        defaultMessage: 'Folder input',
    },
    uploadEmptyWithFolderUploadEnabled: {
        id: 'be.uploadEmptyWithFolderUploadEnabled',
        description: 'Message shown for upload when folder upload is enabled',
        defaultMessage: 'Drag and drop files and folders or click to upload content.',
    },
    uploadNoDragDrop: {
        id: 'be.uploadNoDragDrop',
        description: 'Message shown for upload when drag and drop is not supported',
        defaultMessage: 'File input',
    },
    uploadEmptyFileInput: {
        id: 'be.uploadEmptyFileInput',
        description: 'Label for file input when upload is empty',
        defaultMessage: 'File input',
    },
    shareDialogLabel: {
        id: 'be.shareDialogLabel',
        description: 'Label for share dialog',
        defaultMessage: 'Share',
    },
    shareDialogText: {
        id: 'be.shareDialogText',
        description: 'Text for share dialog',
        defaultMessage: 'Shared Link:',
    },
    uploadError: {
        id: 'be.uploadError',
        description: 'Message shown when upload fails',
        defaultMessage: 'An error occurred while uploading.',
    },
    uploadsManagerUploadPrompt: {
        id: 'be.uploadsManagerUploadPrompt',
        description: 'Text shown to prompt user to upload files',
        defaultMessage: 'Upload files and folders',
    },
    selected: {
        id: 'be.selected',
        description: 'Label for selected items',
        defaultMessage: '{count} selected',
    },
    max: {
        id: 'be.max',
        description: 'Label for maximum items that can be selected',
        defaultMessage: 'Max: {max}',
    },
    uploadsManagerUploadComplete: {
        id: 'be.uploadsManagerUploadComplete',
        description: 'Text shown when uploads are complete',
        defaultMessage: 'Uploads complete',
    },
    uploadsManagerUploadFailed: {
        id: 'be.uploadsManagerUploadFailed',
        description: 'Text shown when uploads have failed',
        defaultMessage: 'Some uploads failed',
    },
    sidebarBoxAISwitchToModalView: {
        id: 'be.sidebarBoxAISwitchToModalView',
        description: 'Text for BoxAI sidebar switch to modal view button',
        defaultMessage: 'Expand',
    },
    uploadsManagerUploadInProgress: {
        id: 'be.uploadsManagerUploadInProgress',
        description: 'Text shown when uploads are in progress',
        defaultMessage: 'Uploading...',
    },
    sidebarBoxAIContent: {
        id: 'be.sidebarBoxAIContent',
        description: 'Text for BoxAI sidebar content',
        defaultMessage: 'Box AI',
    },
    sidebarBoxAITitle: {
        id: 'be.sidebarBoxAITitle',
        description: 'Title for BoxAI sidebar',
        defaultMessage: 'Box AI',
    },
    sidebarMetadataTitle: {
        id: 'be.sidebarMetadataTitle',
        description: 'Title for metadata sidebar',
        defaultMessage: 'Metadata',
    },
    uploadsCancelButtonTooltip: {
        id: 'be.uploadsCancelButtonTooltip',
        description: 'Tooltip for cancel button',
        defaultMessage: 'Cancel',
    },
    uploadsFileSizeLimitExceededUpgradeMessageForUpgradeCta: {
        id: 'be.uploadsFileSizeLimitExceededUpgradeMessageForUpgradeCta',
        description: 'Message shown when file size exceeds limit with upgrade CTA',
        defaultMessage: "This file exceeds your plan's upload limit. Upgrade now to store larger files.",
    },
    sidebarContentInsights: {
        id: 'be.sidebarContentInsights',
        description: 'Title for content insights sidebar',
        defaultMessage: 'Content Insights',
    },
    sidebarMetadataEditingErrorContent: {
        id: 'be.sidebarMetadataEditingErrorContent',
        description: 'Error message for metadata editing',
        defaultMessage: 'There was an error editing this metadata.',
    },
    uploadErrorTooManyFiles: {
        id: 'be.uploadErrorTooManyFiles',
        description: 'Error message shown when too many files are uploaded',
        defaultMessage: 'You can only upload up to {fileLimit} files at a time.',
    },
    sidebarMetadataFetchingErrorContent: {
        id: 'be.sidebarMetadataFetchingErrorContent',
        description: 'Error message for metadata fetching',
        defaultMessage: 'There was an error fetching this metadata.',
    },
});

export default messages;
