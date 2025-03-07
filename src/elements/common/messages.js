/**
 * @flow
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
        defaultMessage: 'This preview didn’t load. Please try to open or download the file to view.',
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
    add: {
        id: 'be.add',
        description: 'Label for add action',
        defaultMessage: 'Add',
    },
    gridView: {
        id: 'be.gridView',
        description: 'Label for switching to grid view',
        defaultMessage: 'Switch to Grid View',
    },
    gridViewIncreaseColumnSize: {
        id: 'be.gridView.increaseColumnSize',
        description: 'Label for increasing the size of columns in grid view',
        defaultMessage: 'Increase column size',
    },
    gridViewDecreaseColumnSize: {
        id: 'be.gridView.decreaseColumnSize',
        description: 'Label for decreasing the size of columns in grid view',
        defaultMessage: 'Decrease column size',
    },
    gridViewSliderLabel: {
        id: 'be.gridView.sliderLabel',
        description: 'Label for the grid view size slider',
        defaultMessage: 'Grid view size',
    },
    listView: {
        id: 'be.listView',
        description: 'Label for switching to list view',
        defaultMessage: 'Switch to List View',
    },
    sort: {
        id: 'be.sort',
        description: 'Label for sort action',
        defaultMessage: 'Sort',
    },
    newFolder: {
        id: 'be.newFolder',
        description: 'Label for create new folder action.',
        defaultMessage: 'New Folder',
    },
    in: {
        id: 'be.in',
        description: 'Label for in action.',
        defaultMessage: 'In',
    },
    print: {
        id: 'be.print',
        description: 'Label for print action',
        defaultMessage: 'Print',
    },
    selected: {
        id: 'be.selected',
        description: 'Default label for selected items list in the footer.',
        defaultMessage: '{count} Selected',
    },
    max: {
        id: 'be.max',
        description: 'Indicator on the footer that max items have been selected.',
        defaultMessage: 'max',
    },
    nameDate: {
        id: 'be.nameDate',
        description: 'Text for modified or interacted date with user.',
        defaultMessage: '{date} by {name}',
    },
    modified: {
        id: 'be.itemModified',
        description: 'Label for item modified date.',
        defaultMessage: 'Modified',
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
    created: {
        id: 'be.itemCreated',
        description: 'Label for item created date.',
        defaultMessage: 'Created',
    },
    owner: {
        id: 'be.itemOwner',
        description: 'Label for item owner.',
        defaultMessage: 'Owner',
    },
    uploader: {
        id: 'be.itemUploader',
        description: 'label for item uploader.',
        defaultMessage: 'Uploader',
    },
    interacted: {
        id: 'be.itemInteracted',
        description: 'Label for item last accessed date.',
        defaultMessage: 'Last Accessed',
    },
    interactedDate: {
        id: 'be.interactedDate',
        description: 'Text for last accessed date with last access prefix.',
        defaultMessage: 'Last accessed on {date}',
    },
    name: {
        id: 'be.itemName',
        description: 'Label for item name attribute.',
        defaultMessage: 'Name',
    },
    size: {
        id: 'be.itemSize',
        description: 'Label for item size attribute.',
        defaultMessage: 'Size',
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
    renameDialogLabel: {
        id: 'be.renameDialogLabel',
        description: 'Label for rename dialog',
        defaultMessage: 'Rename',
    },
    renameDialogText: {
        id: 'be.renameDialogText',
        description: 'Text for rename dialog',
        defaultMessage: 'Please enter a new name for {name}:',
    },
    renameDialogErrorInvalid: {
        id: 'be.renameDialogErrorInvalid',
        description: 'Error text for rename dialog when name is invalid',
        defaultMessage: 'This name is invalid.',
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
    shareDialogLabel: {
        id: 'be.shareDialogLabel',
        description: 'Label for shared link dialog',
        defaultMessage: 'Share',
    },
    shareDialogText: {
        id: 'be.shareDialogText',
        description: 'Text for share link dialog',
        defaultMessage: 'Shared Link:',
    },
    shareDialogNone: {
        id: 'be.shareDialogNone',
        description: 'Text for no shared link',
        defaultMessage: 'None',
    },
    shareAccessOpen: {
        id: 'be.shareAccessOpen',
        description: 'Dropdown select option for open share access.',
        defaultMessage: 'Access: People with the link',
    },
    shareAccessCollab: {
        id: 'be.shareAccessCollab',
        description: 'Dropdown select option for collaborator share access.',
        defaultMessage: 'Access: People in this folder',
    },
    shareAccessCompany: {
        id: 'be.shareAccessCompany',
        description: 'Dropdown select option for enterprise share access.',
        defaultMessage: 'People in this company',
    },
    shareAccessNone: {
        id: 'be.shareAccessNone',
        description: 'Dropdown select option for no access.',
        defaultMessage: 'No shared link',
    },
    shareAccessRemove: {
        id: 'be.shareAccessRemove',
        description: 'Dropdown select option to remove access.',
        defaultMessage: 'Remove shared link',
    },
    searchClear: {
        id: 'be.searchClear',
        description: 'Aria label for the clear button in the search box.',
        defaultMessage: 'Clear search',
    },
    searchPlaceholder: {
        id: 'be.searchPlaceholder',
        description: 'Shown as a placeholder in the search box.',
        defaultMessage: 'Search files and folders',
    },
    sidebarAccessStats: {
        id: 'be.sidebarAccessStats',
        description: 'Title for the sidebar access stats.',
        defaultMessage: 'Access Stats',
    },
    sidebarContentInsights: {
        id: 'be.sidebarContentInsights',
        description: 'Title for the sidebar content insights.',
        defaultMessage: 'Content Insights',
    },
    sidebarShow: {
        id: 'be.sidebarShow',
        description: 'Label for the show sidebar button.',
        defaultMessage: 'Show Sidebar',
    },
    sidebarHide: {
        id: 'be.sidebarHide',
        description: 'Label for the hide sidebar button.',
        defaultMessage: 'Hide Sidebar',
    },
    description: {
        id: 'be.description',
        description: 'Label for the description field in the preview sidebar.',
        defaultMessage: 'Description',
    },
    descriptionPlaceholder: {
        id: 'be.descriptionPlaceholder',
        description: 'Placeholder for file description in preview sidebar.',
        defaultMessage: 'Enter a description',
    },
    sidebarDetailsTitle: {
        id: 'be.sidebarDetailsTitle',
        description: 'Title for the preview details sidebar.',
        defaultMessage: 'Details',
    },
    sidebarSkillsTitle: {
        id: 'be.sidebarSkillsTitle',
        description: 'Title for the preview details skills.',
        defaultMessage: 'Skills',
    },
    sidebarSkillsErrorTitle: {
        id: 'be.sidebarSkillsErrorTitle',
        description: 'Generic error title for skills editing.',
        defaultMessage: 'Skills Error',
    },
    sidebarSkillsErrorContent: {
        id: 'be.sidebarSkillsErrorContent',
        description: 'Generic error content for skills editing.',
        defaultMessage: 'An error has occurred while updating skills. Please refresh the page and try again.',
    },
    sidebarBoxAITitle: {
        id: 'be.sidebarBoxAITitle',
        description: 'Title for the preview Box AI feed.',
        defaultMessage: 'Box AI',
    },
    sidebarBoxAIContent: {
        id: 'be.sidebarBoxAIContent',
        description: 'Generic Box AI content type opened used in welcome message and placeholder',
        defaultMessage: 'content',
    },
    sidebarBoxAISwitchToModalView: {
        id: 'be.sidebarBoxAISwitchToModalView',
        description: 'Label for button that triggers switch to Box AI Modal',
        defaultMessage: 'Switch to modal view',
    },
    sidebarActivityTitle: {
        id: 'be.sidebarActivityTitle',
        description: 'Title for the preview activity feed.',
        defaultMessage: 'Activity',
    },
    sidebarDocGenTitle: {
        id: 'be.sidebarDocGenTitle',
        description: 'Title for the DocGen sidebar tab.',
        defaultMessage: 'Doc Gen Tags',
    },
    sidebarDocGenTooltip: {
        id: 'be.sidebarDocGenTooltip',
        defaultMessage: 'Box Doc Gen',
        description: 'Icon title for a Box file of type DocGen template',
    },
    sidebarMetadataTitle: {
        id: 'be.sidebarMetadataTitle',
        description: 'Title for the preview metadata.',
        defaultMessage: 'Metadata',
    },
    sidebarMetadataEditingErrorContent: {
        id: 'be.sidebarMetadataEditingErrorContent',
        description: 'Generic error content for metadata editing.',
        defaultMessage: 'An error has occurred while updating metadata. Please refresh the page and try again.',
    },
    sidebarMetadataFetchingErrorContent: {
        id: 'be.sidebarMetadataFetchingErrorContent',
        description: 'Generic error content for metadata fetching.',
        defaultMessage: 'An error has occurred while fetching metadata. Please refresh the page and try again.',
    },
    sidebarFileFetchingErrorContent: {
        id: 'be.sidebarFileFetchingErrorContent',
        description: 'Generic error content for file fetching.',
        defaultMessage: 'An error has occurred while fetching your Box file. Please refresh the page and try again.',
    },
    sidebarProperties: {
        id: 'be.sidebarProperties',
        description: 'Label for file properties section in the preview sidebar',
        defaultMessage: 'File Properties',
    },
    sidebarNavLabel: {
        id: 'be.sidebarNavLabel',
        description: 'Label for the sidebar tabs list',
        defaultMessage: 'Sidebar',
    },
    defaultSkill: {
        id: 'be.defaultSkill',
        description: 'Label for default skill section in the preview sidebar',
        defaultMessage: 'Skill Card',
    },
    statusSkill: {
        id: 'be.statusSkill',
        description: 'Label for status skill card in the preview sidebar',
        defaultMessage: 'Status',
    },
    topicsSkill: {
        id: 'be.topicsSkill',
        description: 'Label for keywords/topics skill section in the preview sidebar',
        defaultMessage: 'Topics',
    },
    keywordSkill: {
        id: 'be.keywordSkill',
        description: 'Label for keywords/topics skill section in the preview sidebar',
        defaultMessage: 'Topics',
    },
    faceSkill: {
        id: 'be.faceSkill',
        description: 'Label for face skill section in the preview sidebar',
        defaultMessage: 'Faces',
    },
    transcriptSkill: {
        id: 'be.transcriptSkill',
        description: 'Label for transcript skill section in the preview sidebar',
        defaultMessage: 'Transcript',
    },
    skillPendingStatus: {
        id: 'be.skillPendingStatus',
        description: 'Default message when skills are still running',
        defaultMessage: 'We’re working on processing your file - please hold!',
    },
    skillInvokedStatus: {
        id: 'be.skillInvokedStatus',
        description: 'Default message when skills are waiting to run',
        defaultMessage: 'We’re preparing to process your file - please hold!',
    },
    skillUnknownError: {
        id: 'be.skillUnknownError',
        description: 'Default error message when skills fail to run',
        defaultMessage: 'Something went wrong with running this skill or fetching its data.',
    },
    skillInvalidFileSizeError: {
        id: 'be.skillInvalidFileSizeError',
        description: 'Error message when skill fails due to file size',
        defaultMessage: 'We’re sorry, no skills information was found. This file size is currently not supported.',
    },
    skillInvalidFileExtensionError: {
        id: 'be.skillInvalidFileExtensionError',
        description: 'Error message when skill fails due to file extension',
        defaultMessage: 'We’re sorry, no skills information was found. This file extension is currently not supported.',
    },
    skillNoInfoFoundError: {
        id: 'be.skillNoInfoFoundError',
        description: 'Error message when a skill has no data',
        defaultMessage: 'We’re sorry, no skills information was found.',
    },
    skillFileProcessingError: {
        id: 'be.skillFileProcessingError',
        description: 'Error message when a skill processing failed',
        defaultMessage: 'We’re sorry, something went wrong with processing the file.',
    },
    uploadErrorTooManyFiles: {
        id: 'be.uploadErrorTooManyFiles',
        description: 'Message shown when too many files are uploaded at once',
        defaultMessage: 'You can only upload up to {fileLimit} file(s) at a time.',
    },
    uploadError: {
        id: 'be.uploadError',
        description: 'Message shown when there is a network error when uploading',
        defaultMessage: 'A network error has occurred while trying to upload.',
    },
    uploadEmptyWithFolderUploadEnabled: {
        id: 'be.uploadEmptyWithFolderUploadEnabled',
        description: 'Message shown when there are no items to upload and folder upload is enabled',
        defaultMessage: 'Drag and drop files and folders',
    },
    uploadEmptyWithFolderUploadDisabled: {
        id: 'be.uploadEmptyWithFolderUploadDisabled',
        description: 'Message shown when there are no items to upload and folder upload is disabled',
        defaultMessage: 'Drag and drop files',
    },
    uploadEmptyFileInput: {
        id: 'be.uploadEmptyFileInput',
        description: 'Message shown for upload link for uploading more files when there are no items to upload',
        defaultMessage: 'Browse your device',
    },
    uploadEmptyFolderInput: {
        id: 'be.uploadEmptyFolderInput',
        description: 'Message shown for upload link for uploading more folders when there are no items to upload',
        defaultMessage: 'Select Folders',
    },
    uploadNoDragDrop: {
        id: 'be.uploadNoDragDrop',
        description: 'Message shown on a device with no drag and drop support when there are no items to upload',
        defaultMessage: 'Select files from your device',
    },
    uploadInProgress: {
        id: 'be.uploadInProgress',
        description: 'Message shown when user drag and drops files onto uploads in progress',
        defaultMessage: 'Drag and drop to add additional files',
    },
    uploadSuccess: {
        id: 'be.uploadSuccess',
        description: 'Message shown when all files have been successfully uploaded',
        defaultMessage: 'Success! Your files have been uploaded.',
    },
    uploadSuccessFileInput: {
        id: 'be.uploadSuccessFileInput',
        description: 'Message shown for upload link for uploading more files after a successful upload',
        defaultMessage: 'Select More Files',
    },
    uploadSuccessFolderInput: {
        id: 'be.uploadSuccessFolderInput',
        description: 'Message shown for upload link for uploading more folders after a successful upload',
        defaultMessage: 'Select More Folders',
    },
    uploadOptions: {
        id: 'be.uploadOptions',
        description: 'Message shown for letting user choose between {option1} and {option2}',
        defaultMessage: '{option1} or {option2}',
    },
    nameASC: {
        id: 'be.nameASC',
        description: 'Name ascending option shown in the share access drop down select.',
        defaultMessage: 'Name: A → Z',
    },
    nameDESC: {
        id: 'be.nameDESC',
        description: 'Name descending option shown in the share access drop down select.',
        defaultMessage: 'Name: Z → A',
    },
    dateASC: {
        id: 'be.dateASC',
        description: 'Date ascending option shown in the share access drop down select.',
        defaultMessage: 'Date: Oldest → Newest',
    },
    dateDESC: {
        id: 'be.dateDESC',
        description: 'Date descending option shown in the share access drop down select.',
        defaultMessage: 'Date: Newest → Oldest',
    },
    sizeASC: {
        id: 'be.sizeASC',
        description: 'Size ascending option shown in the share access drop down select.',
        defaultMessage: 'Size: Smallest → Largest',
    },
    sizeDESC: {
        id: 'be.sizeDESC',
        description: 'Size descending option shown in the share access drop down select.',
        defaultMessage: 'Size: Largest → Smallest',
    },
    breadcrumbLabel: {
        id: 'be.breadcrumb.breadcrumbLabel',
        description: 'Aria label for describing "breadcrumb"',
        defaultMessage: 'Breadcrumb',
    },
    errorBreadcrumb: {
        id: 'be.errorBreadcrumb',
        description: 'Default label for signifying error in the sub header.',
        defaultMessage: 'Error',
    },
    rootBreadcrumb: {
        id: 'be.rootBreadcrumb',
        description: 'Default label for root folder.',
        defaultMessage: 'All Files',
    },
    searchBreadcrumb: {
        id: 'be.searchBreadcrumb',
        description: 'Shown as the title in the sub header while searching.',
        defaultMessage: 'Search Results',
    },
    recentsBreadcrumb: {
        id: 'be.recentsBreadcrumb',
        description: 'Shown as the title in the sub header when showing recents.',
        defaultMessage: 'Recents',
    },
    selectedBreadcrumb: {
        id: 'be.selectedBreadcrumb',
        description: 'Shown as the title in the sub header while showing selected items.',
        defaultMessage: 'Selected Items',
    },
    uploadsManagerUploadInProgress: {
        id: 'be.uploadsManagerUploadInProgress',
        description: 'Text shown when uploads are in progress',
        defaultMessage: 'Uploading',
    },
    uploadsManagerUploadPrompt: {
        id: 'be.uploadsManagerUploadPrompt',
        description: 'Text shown to guide the user to drag drop file to upload',
        defaultMessage: 'Drop files on this page to upload them into this folder.',
    },
    uploadsManagerUploadComplete: {
        id: 'be.uploadsManagerUploadComplete',
        description: 'Text shown when uploads are completed',
        defaultMessage: 'Completed',
    },
    uploadsManagerUploadFailed: {
        id: 'be.uploadsManagerUploadFailed',
        description: 'Text shown when uploads failed',
        defaultMessage: 'Some Uploads Failed',
    },
    uploadsCancelButtonTooltip: {
        id: 'be.uploadsCancelButtonTooltip',
        description: 'Cancel upload button tooltip',
        defaultMessage: 'Cancel this upload',
    },
    uploadsRetryButtonTooltip: {
        id: 'be.uploadsRetryButtonTooltip',
        description: 'Retry upload button tooltip',
        defaultMessage: 'Retry upload',
    },
    uploadsFileSizeLimitExceededErrorMessage: {
        id: 'be.uploadsFileSizeLimitExceededErrorMessage',
        description: 'Error message shown when file size exceeds the limit',
        defaultMessage: 'File size exceeds the folder owner’s file size limit',
    },
    uploadsFileSizeLimitExceededErrorMessageForUpgradeCta: {
        id: 'be.uploadsFileSizeLimitExceededErrorMessageForUpgradeCta',
        description: 'Error message shown when file size exceeds the limit',
        defaultMessage: 'This file exceeds your plan’s upload limit. Upgrade now to store larger files.',
    },
    uploadsFileSizeLimitExceededUpgradeMessageForUpgradeCta: {
        id: 'be.uploadsFileSizeLimitExceededUpgradeMessageForUpgradeCta',
        description: 'Upgrade message shown when file size exceeds the limit',
        defaultMessage: 'Upgrade',
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
    uploadsOneOrMoreChildFoldersFailedToUploadMessage: {
        id: 'be.uploadsOneOrMoreChildFoldersFailedToUploadMessage',
        description: 'Error message shown when one or more child folders failed to upload',
        defaultMessage: 'One or more child folders failed to upload.',
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
    errorOccured: {
        id: 'be.errorOccured',
        defaultMessage: 'An error occurred',
        description: 'Title when an error occurs',
    },
    editLabel: {
        id: 'be.editLabel',
        defaultMessage: 'Edit',
        description: 'Label for an edit action',
    },
    getVersionInfo: {
        id: 'be.getVersionInfo',
        defaultMessage: 'Get version information',
        description: 'Aria label for button to get information about a file’s versions',
    },
    keywordsApplied: {
        id: 'be.keywordsAppliedList',
        defaultMessage: 'Keywords were applied',
        description: 'Message displayed in the activity feed for when image keyword search applies keywords',
    },
    keywordsList: {
        id: 'be.keywordsList',
        defaultMessage: 'Keywords: {words}',
        description: 'Label for a list of keywords. {words} are the list of keywords.',
    },
    noActivity: {
        id: 'be.noActivity',
        defaultMessage: 'No activity to show',
        description: 'Message displayed in an empty activity feed',
    },
    noActivityAnnotationPrompt: {
        id: 'be.noActivityAnnotationPrompt',
        defaultMessage: 'Hover over the preview and use the controls at the bottom to annotate the file.',
        description: 'Message shown alongside empty activity feed when user can annotate',
    },
    noActivityCommentPrompt: {
        id: 'be.noActivityCommentPrompt',
        defaultMessage: 'Comment and @mention people to notify them.',
        description: 'Message shown in ',
    },
    versionDeleted: {
        id: 'be.versionDeleted',
        defaultMessage: '{name} deleted v{version_number}',
        description:
            'Message displayed in the activity feed for a deleted version. {name} is the user who performed the action. {version_number} is the file version string.',
    },
    versionPromoted: {
        id: 'be.versionPromoted',
        defaultMessage: '{name} promoted v{version_promoted} to v{version_number}',
        description:
            'Message displayed in the activity feed for a promoted version. {name} is the user who performed the action. {version_promoted} is the originating file version string. {version_number} is the file version string.',
    },
    versionRestored: {
        id: 'be.versionRestored',
        defaultMessage: '{name} restored v{version_number}',
        description:
            'Message displayed in the activity feed for a restored version. {name} is the user who performed the action. {version_number} is the file version string.',
    },
    versionMultipleUsersUploaded: {
        id: 'be.versionMultipleUsersUploaded',
        defaultMessage: '{numberOfCollaborators} collaborators uploaded v{versions}',
        description:
            'Message displayed in the activity feed to represent the range of versions uploaded by multiple users. {numberOfCollaborators} is a number and {versions} is a range of versions.',
    },
    versionMultipleUsersRestored: {
        id: 'be.versionMultipleUsersRestored',
        defaultMessage: '{numberOfCollaborators} collaborators restored v{versions}',
        description:
            'Message displayed in the activity feed to represent the range of versions restored by multiple users. {numberOfCollaborators} is a number. {versions} is a range of versions.',
    },
    versionMultipleUsersTrashed: {
        id: 'be.versionMultipleUsersTrashed',
        defaultMessage: '{numberOfCollaborators} collaborators deleted v{versions}',
        description:
            'Message displayed in the activity feed to represent the range of versions trashed by multiple users. {numberOfCollaborators} is a number. {versions} is a range of versions.',
    },
    versionUploadCollapsed: {
        id: 'be.versionUploadCollapsed',
        defaultMessage: '{name} uploaded v{versions}',
        description:
            'Message displayed in the activity feed to represent the range of versions uploaded by a single user. {name} is the user who uploaded. {versions} is a range of versions.',
    },
    versionRestoreCollapsed: {
        id: 'be.versionRestoreCollapsed',
        defaultMessage: '{name} restored v{versions}',
        description:
            'Message displayed in the activity feed to represent the range of versions restored by a single user. {name} is the user who restored. {versions} is a range of versions.',
    },
    versionTrashCollapsed: {
        id: 'be.versionTrashCollapsed',
        defaultMessage: '{name} deleted v{versions}',
        description:
            'Message displayed in the activity feed to represent the range of versions deleted by a single user. {name} is the user who deleted. {versions} is a range of versions.',
    },
    versionUploaded: {
        id: 'be.versionUploaded',
        defaultMessage: '{name} uploaded v{version_number}',
        description:
            'Message displayed in the activity feed for a newly uploaded version. {name} is the user who performed the action. {version_number} is the file version string.',
    },
    fileRequestDisplayName: {
        defaultMessage: 'File Request',
        description:
            'name of the File Request feature used to translate when a File Request is uploaded by the service',
        id: 'be.fileRequestDisplayName',
    },
    defaultInlineErrorContentMessage: {
        id: 'be.defaultInlineErrorContentMessage',
        description: 'Default bottom inline error message',
        defaultMessage: 'Please try again later.',
    },
    fileDescriptionInlineErrorTitleMessage: {
        id: 'be.fileDescriptionInlineErrorTitleMessage',
        description: 'Inline error title message for file description',
        defaultMessage: 'Something went wrong when saving the description.',
    },
    defaultErrorMaskHeaderMessage: {
        id: 'be.defaultErrorMaskHeaderMessage',
        description: 'Default error mask top message',
        defaultMessage: 'We’re sorry, something went wrong.',
    },
    defaultErrorMaskSubHeaderMessage: {
        id: 'be.defaultErrorMaskSubHeaderMessage',
        description: 'Default error mask bottom message',
        defaultMessage: 'Please refresh the page or try again later.',
    },
    fileAccessStatsErrorHeaderMessage: {
        id: 'be.fileAccessStatsErrorHeaderMessage',
        description: 'File access stats error message',
        defaultMessage: 'Something went wrong when fetching the access stats.',
    },
    fileAccessStatsPermissionsError: {
        id: 'be.accessStatsPermissionsError',
        description: 'The text for when the user does not have permissions to see access stats.',
        defaultMessage: 'Sorry, you do not have permission to see the access stats for this file.',
    },
    fileClassificationErrorHeaderMessage: {
        id: 'be.fileClassificationErrorHeaderMessage',
        description: 'File classification error message',
        defaultMessage: 'Something went wrong when fetching classification.',
    },
    currentUserErrorHeaderMessage: {
        id: 'be.currentUserErrorHeaderMessage',
        description: 'Current user error message',
        defaultMessage: 'Something went wrong when fetching the current user.',
    },
    activityFeedItemApiError: {
        id: 'be.activityFeedItemApiError',
        description: 'Error message for feed item API errors',
        defaultMessage: 'There was a problem loading the activity feed. Please refresh the page or try again later.',
    },
    nextFile: {
        defaultMessage: 'Next File',
        description: 'Next file button title',
        id: 'be.nextFile',
    },
    nextPage: {
        defaultMessage: 'Next Page',
        description: 'Next page button tooltip',
        id: 'be.pagination.nextPage',
    },
    pageStatus: {
        defaultMessage: '{pageNumber} of {pageCount}',
        description: 'Pagination menu button with current page number out of total number of pages',
        id: 'be.pagination.pageStatus',
    },
    previousFile: {
        defaultMessage: 'Previous File',
        description: 'Previous file button title',
        id: 'be.previousFile',
    },
    previousPage: {
        defaultMessage: 'Previous Page',
        description: 'Previous page button tooltip',
        id: 'be.pagination.previousPage',
    },
    previousSegment: {
        id: 'be.previousSegment',
        description: 'Title for previous segment on skill timeline',
        defaultMessage: 'Previous Segment',
    },
    nextSegment: {
        id: 'be.nextSegment',
        description: 'Title for next segment on skill timeline',
        defaultMessage: 'Next Segment',
    },
    transcriptEdit: {
        id: 'be.transcriptEdit',
        description: 'Message to the user for editing the transcript in the sidebar',
        defaultMessage: 'Click any section to edit.',
    },
    emptyOpenWithDescription: {
        id: 'be.emptyOpenWithDescription',
        description: 'Message to the user when there are no Open With integrations',
        defaultMessage: 'No integrations are available for this file',
    },
    errorOpenWithDescription: {
        id: 'be.errorOpenWithDescription',
        description: 'Message to the user when the open with element errors',
        defaultMessage: 'Opening this file with other services is currently unavailable',
    },
    defaultOpenWithDescription: {
        id: 'be.defaultOpenWithDescription',
        description: 'Message to the user when there is at least one Open With integration available',
        defaultMessage: 'Open this file with a partner service',
    },
    executeIntegrationOpenWithErrorHeader: {
        id: 'be.executeIntegrationOpenWithErrorHeader',
        description: 'Header message to the user when an Open With integration fails to execute',
        defaultMessage: 'We’re sorry, this integration is currently unavailable.',
    },
    executeIntegrationOpenWithErrorSubHeader: {
        id: 'be.executeIntegrationOpenWithErrorSubHeader',
        description: 'Sub header message to the user when an Open With integration fails to execute',
        defaultMessage: 'Please try again later.',
    },
    boxToolsInstallMessage: {
        id: 'be.boxToolsInstallMessage',
        description: 'Message shown telling user how to install Box Tools',
        defaultMessage: 'Install {boxTools} to open this file on your desktop',
    },
    boxToolsBlacklistedError: {
        id: 'be.boxEditBlacklistedError',
        description: 'Message when Box Tools cannot open a particular file type',
        defaultMessage: 'This file cannot be opened locally',
    },
    drawAnnotation: {
        id: 'be.drawAnnotation',
        description: 'Message to the user to enter into drawing annotation mode',
        defaultMessage: 'Drawing annotation mode',
    },
    pointAnnotation: {
        id: 'be.pointAnnotation',
        description: 'Message to the user to enter into point annotation mode',
        defaultMessage: 'Point annotation mode',
    },
    expand: {
        id: 'be.expand',
        description: 'Message to the user to expand the Transcript entries',
        defaultMessage: 'Expand',
    },
    collapse: {
        id: 'be.collapse',
        description: 'Message to the user to collapse the Transcript entries',
        defaultMessage: 'Collapse',
    },
    back: {
        id: 'be.back',
        description: 'Label for back button',
        defaultMessage: 'Back',
    },
    priorCollaborator: {
        id: 'be.priorCollaborator',
        description:
            'If a user has been deleted, we call the user "a prior collaborator" - meaning someone who used to be able to collaborate on the content.',
        defaultMessage: 'A Prior Collaborator',
    },
    moreOptions: {
        id: 'be.moreOptions',
        description: 'Label for a button that displays more options',
        defaultMessage: 'More options',
    },
    bookmark: {
        id: 'be.bookmark',
        description: 'Icon title for a Box item of type bookmark or web-link',
        defaultMessage: 'Bookmark',
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
    collaboratedFolder: {
        id: 'be.collaboratedFolder',
        description: 'Icon title for a Box item of type folder that has collaborators',
        defaultMessage: 'Collaborated Folder',
    },
    externalFolder: {
        id: 'be.externalFolder',
        description: "Icon title for a Box item of type folder that has collaborators outside of the user's enterprise",
        defaultMessage: 'External Folder',
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
});

export default messages;
