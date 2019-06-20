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
        defaultMessage: 'We’re sorry, the preview didn’t load. Please refresh the page.',
    },
    previewUpdate: {
        id: 'be.previewUpdate',
        description: 'Message when new preview is available.',
        defaultMessage: 'A new version of this file is available.',
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
    add: {
        id: 'be.add',
        description: 'Label for add action',
        defaultMessage: 'Add',
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
    sidebarActivityTitle: {
        id: 'be.sidebarActivityTitle',
        description: 'Title for the preview activity feed.',
        defaultMessage: 'Activity',
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
    searchState: {
        id: 'be.searchState',
        description: 'Message shown when there are no search results.',
        defaultMessage: 'Sorry, we couldn’t find what you’re looking for.',
    },
    selectedState: {
        id: 'be.selectedState',
        description: 'Message shown when there are no selected items.',
        defaultMessage: 'You haven’t selected any items yet.',
    },
    errorState: {
        id: 'be.errorState',
        description: 'Message shown when there is an error.',
        defaultMessage: 'A network error has occurred while trying to load.',
    },
    folderState: {
        id: 'be.folderState',
        description: 'Message shown when there are no folder items.',
        defaultMessage: 'There are no items in this folder.',
    },
    recentsState: {
        id: 'be.recentsState',
        description: 'Message shown when there are no recent items.',
        defaultMessage: 'There are no recent items yet.',
    },
    loadingState: {
        id: 'be.loadingState',
        description: 'Message shown when folder items are still fetching.',
        defaultMessage: 'Please wait while the items load...',
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
    uploadsDefaultErrorMessage: {
        id: 'be.uploadsDefaultErrorMessage',
        description: 'Default error message shown when upload fails',
        defaultMessage: 'Something went wrong with the upload. Please try again.',
    },
    approvalAddAssignee: {
        id: 'be.approvalAddAssignee',
        defaultMessage: 'Add an assignee',
        description: 'Placeholder for approvers input',
    },
    approvalAddTask: {
        id: 'be.approvalAddTask',
        defaultMessage: 'Add Task',
        description: 'Label for checkbox to add approvers to a comment',
    },
    approvalAddTaskTooltip: {
        id: 'be.approvalAddTaskTooltip',
        defaultMessage:
            'Assigning a task to someone will send them a notification with the message in the comment box and allow them to approve or deny.',
        description: 'Tooltip text for checkbox to add approvers to a comment',
    },
    approvalAssignees: {
        id: 'be.approvalAssignees',
        defaultMessage: 'Assignees',
        description: 'Title for assignees input',
    },
    approvalDueDate: {
        id: 'be.approvalDueDate',
        defaultMessage: 'Due Date',
        description: 'Title for approvers due date input',
    },
    approvalSelectDate: {
        id: 'be.approvalSelectDate',
        defaultMessage: 'Select a date',
        description: 'Placeholder for due date input',
    },
    atMentionTip: {
        id: 'be.atMentionTip',
        defaultMessage: '@mention users to notify them.',
        description: 'Mentioning call to action displayed below the comment input',
    },
    errorOccured: {
        id: 'be.errorOccured',
        defaultMessage: 'An error occurred',
        description: 'Title when an error occurs',
    },
    commentCancel: {
        id: 'be.commentCancel',
        defaultMessage: 'Cancel',
        description: 'Text for cancel button',
    },
    commentDeletePrompt: {
        id: 'be.commentDeletePrompt',
        defaultMessage: 'Delete comment?',
        description: 'Confirmation prompt text to delete comment',
    },
    commentPost: {
        id: 'be.commentPost',
        defaultMessage: 'Post',
        description: 'Text for post button',
    },
    commentShowOriginal: {
        id: 'be.commentShowOriginal',
        defaultMessage: 'Show Original',
        description: 'Show original button for showing original comment',
    },
    commentTranslate: {
        id: 'be.commentTranslate',
        defaultMessage: 'Translate',
        description: 'Translate button for translating comment',
    },
    commentWrite: {
        id: 'be.commentWrite',
        defaultMessage: 'Write a comment',
        description: 'Placeholder for comment input',
    },
    commentPostedFullDateTime: {
        id: 'be.commentPostedFullDateTime',
        defaultMessage: '{time, date, full} at {time, time, short}',
        description: 'Comment posted full date time for title',
    },
    commentCreateErrorMessage: {
        id: 'be.commentCreateErrorMessage',
        description: 'Error message when a comment creation fails',
        defaultMessage: 'There was an error creating this comment.',
    },
    commentCreateConflictMessage: {
        id: 'be.commentCreateConflictMessage',
        description: 'Error message when a comment creation fails due to a conflict',
        defaultMessage: 'This comment already exists.',
    },
    commentDeleteErrorMessage: {
        id: 'be.commentDeleteErrorMessage',
        description: 'Error message when a comment deletion fails',
        defaultMessage: 'There was an error deleting this comment.',
    },
    taskDeleteMenuItem: {
        id: 'be.taskDeleteMenuItem',
        defaultMessage: 'Delete task',
        description: 'Text to show on menu item to delete task',
    },
    taskEditMenuItem: {
        id: 'be.taskEditMenuItem',
        defaultMessage: 'Modify task',
        description: 'Text to show on menu item to edit task',
    },
    taskDeletePrompt: {
        id: 'be.taskDeletePrompt',
        defaultMessage: 'Are you sure you want to permanently delete this task?',
        description: 'Confirmation prompt text to delete task',
    },
    taskCreateErrorTitle: {
        id: 'be.taskCreateErrorTitle',
        description: 'Title shown above error message when a task creation fails',
        defaultMessage: 'Error',
    },
    taskCreateErrorMessage: {
        id: 'be.taskCreateErrorMessage',
        description: 'Error message when a task creation fails',
        defaultMessage: 'An error occurred while creating this task. Please try again.',
    },
    taskUpdateErrorMessage: {
        id: 'be.taskEditErrorMessage',
        description: 'Error message when a task edit fails',
        defaultMessage: 'An error occurred while modifying this task. Please try again.',
    },
    taskActionErrorTitle: {
        id: 'be.taskActionErrorTitle',
        description: 'Title shown when an error occurs performing an action on a task',
        defaultMessage: 'Error',
    },
    taskApproveErrorMessage: {
        id: 'be.taskApproveErrorMessage',
        description: 'Error message when approving a task fails',
        defaultMessage: 'An error has occurred while approving this task. Please refresh the page and try again.',
    },
    taskCompleteErrorMessage: {
        id: 'be.taskCompleteErrorMessage',
        description: 'Error message when completing a task fails',
        defaultMessage: 'An error has occurred while completing this task. Please refresh the page and try again.',
    },
    taskRejectErrorMessage: {
        id: 'be.taskRejectErrorMessage',
        description: 'Error message when rejecting a task fails',
        defaultMessage: 'An error has occurred while rejecting this task. Please refresh the page and try again.',
    },
    taskDeleteErrorMessage: {
        id: 'be.taskDeleteErrorMessage',
        description: 'Error message when a task deletion fails',
        defaultMessage: 'There was an error while deleting this task. Please refresh the page and try again.',
    },
    taskCollaboratorLoadErrorMessage: {
        id: 'be.taskCollaboratorLoadErrorMessage',
        description: 'Error message when we failed to load the collaborators when user tries to edit a task',
        defaultMessage: 'An error has occurred while loading collaborators for this task. Please try again.',
    },
    taskShowMoreAssignees: {
        id: 'be.taskShowMoreAssignees',
        description:
            'Button name to expand task assignee list, additionalAssigneeCount is the number of additional task assignees that can be shown.',
        defaultMessage: 'Show {additionalAssigneeCount} More',
    },
    taskShowLessAssignees: {
        id: 'be.taskShowLessAssignees',
        description: 'Button name to hide task assignee list',
        defaultMessage: 'Show Less',
    },
    completedAssignment: {
        id: 'be.completedAssignment',
        defaultMessage: 'Completed',
        description: 'Title for checkmark icon indicating someone completed a task',
    },
    appActivityDeleteErrorMessage: {
        id: 'be.appActivityDeleteErrorMessage',
        description: 'Error message when an app activity deletion fails',
        defaultMessage: 'There was an error deleting this item.',
    },
    appActivityCreatedAtFullDateTime: {
        id: 'be.appActivityCreatedAtFullDateTime',
        defaultMessage: '{time, date, full} at {time, time, short}',
        description: 'App Activity created at full date time for title',
    },
    appActivityDeletePrompt: {
        id: 'be.appActivityDeletePrompt',
        defaultMessage: 'Delete App Activity?',
        description: 'Confirmation prompt text to delete app activity',
    },
    appActivityAltIcon: {
        id: 'be.appActivityAltIcon',
        defaultMessage: '{appActivityName} Icon',
        description: 'Alt message if app activity icon is missing or cannot load',
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
        defaultMessage: 'Keywords: { words }',
        description: 'Label for a list of keywords. {words} are the list of keywords.',
    },
    noActivity: {
        id: 'be.noActivity',
        defaultMessage: 'No Activity Yet',
        description: 'Message displayed in an empty activity feed',
    },
    noActivityCommentPrompt: {
        id: 'be.noActivityCommentPrompt',
        defaultMessage: 'Comment and @mention people to notify them.',
        description: 'Message shown in ',
    },
    rejectedAssignment: {
        id: 'be.rejectedAssignment',
        defaultMessage: 'Rejected',
        description: 'Title for x icon indicating someone rejected a task',
    },
    taskApprove: {
        id: 'be.taskApprove',
        defaultMessage: 'Complete',
        description: 'Approve option for a task',
    },
    taskDueDate: {
        id: 'be.taskDueDate',
        defaultMessage: 'Due',
        description: 'Due date for a task',
    },
    tasksForApproval: {
        id: 'be.tasksForApproval',
        defaultMessage: 'Tasks',
        description: 'Tasks for approval',
    },
    taskReject: {
        id: 'be.taskReject',
        defaultMessage: 'Decline',
        description: 'Reject option for a task',
    },
    taskDueDateLabel: {
        id: 'be.tasks.taskDueDate',
        defaultMessage: 'Due: {date}',
        description: 'Label and date for task due date',
    },
    tasksAddTask: {
        id: 'be.tasks.addTask',
        defaultMessage: 'Add Task',
        description: 'label for button that opens task popup',
    },
    taskAddTaskGeneral: {
        id: 'be.tasks.addTask.general',
        defaultMessage: 'General Task',
        description: 'label for menu item that opens general task popup',
    },
    taskAddTaskGeneralDescription: {
        id: 'be.tasks.addTask.general.description',
        defaultMessage: 'Keep track of work that needs to get done',
        description: 'description for menu item that opens general task popup',
    },
    taskAddTaskApproval: {
        id: 'be.tasks.addTask.approval',
        defaultMessage: 'Approval Task',
        description: 'label for menu item that opens approval task popup',
    },
    taskAddTaskApprovalDescription: {
        id: 'be.tasks.addTask.approval.description',
        defaultMessage: 'Request an approval to move work forward',
        description: 'description for menu item that opens approval task popup',
    },
    tasksCreateGeneralTaskFormTitle: {
        id: 'be.tasks.createTask.general.title',
        defaultMessage: 'Create General Task',
        description: 'title for general task popup',
    },
    tasksCreateApprovalTaskFormTitle: {
        id: 'be.tasks.createTask.approval.title',
        defaultMessage: 'Create Approval Task',
        description: 'title for approval task popup',
    },
    tasksEditApprovalTaskFormTitle: {
        id: 'be.tasks.editTask.approval.title',
        defaultMessage: 'Modify Approval Task',
        description: 'title for when editing an existing approval task',
    },
    tasksEditGeneralTaskFormTitle: {
        id: 'be.tasks.editTask.general.title',
        defaultMessage: 'Modify General Task',
        description: 'modal title for when editing an existing general task',
    },
    tasksAddTaskFormSelectAssigneesLabel: {
        id: 'be.tasks.addTaskForm.selectAssigneesLabel',
        defaultMessage: 'Select Assignees',
        description: 'label for task create form assignee input',
    },
    tasksAddTaskFormMessageLabel: {
        id: 'be.tasks.addTaskForm.messageLabel',
        defaultMessage: 'Message',
        description: 'label for task create form message input',
    },
    tasksAddTaskFormDueDateLabel: {
        id: 'be.tasks.addTaskForm.dueDateLabel',
        defaultMessage: 'Due Date',
        description: 'label for task create form due date input',
    },
    tasksAddTaskFormSubmitLabel: {
        id: 'be.tasks.addTaskForm.submit',
        defaultMessage: 'Create',
        description: 'label for create button in create task modal in create mode',
    },
    tasksEditTaskFormSubmitLabel: {
        id: 'be.tasks.editTaskForm.submit',
        defaultMessage: 'Update',
        description: 'label for edit button in create task modal in edit mode',
    },
    tasksAddTaskFormCancelLabel: {
        id: 'be.tasks.addTaskForm.cancel',
        defaultMessage: 'Cancel',
        description: 'label for cancel button in create task popup',
    },
    tasksFeedApproveAction: {
        id: 'be.tasks.feed.approveAction',
        defaultMessage: 'Approve',
        description: 'Approve option for an approval task',
    },
    tasksFeedCompleteAction: {
        id: 'be.tasks.feed.completeAction',
        defaultMessage: 'Mark as Complete',
        description: 'Completion option for a general task',
    },
    tasksFeedRejectAction: {
        id: 'be.tasks.feed.rejectAction',
        defaultMessage: 'Reject',
        description: 'Reject option for an approval task',
    },
    tasksFeedStatusLabel: {
        id: 'be.tasks.feed.statusLabel',
        defaultMessage: 'Status: {taskStatus}',
        description: 'Label for the task status',
    },
    tasksFeedCompletedLabel: {
        id: 'be.tasks.feed.completedLabel',
        defaultMessage: 'Completed',
        description: 'Label for a completed task',
    },
    tasksFeedApprovedLabel: {
        id: 'be.tasks.feed.approvedLabel',
        defaultMessage: 'Approved',
        description: 'Label for an approved task',
    },
    tasksFeedRejectedLabel: {
        id: 'be.tasks.feed.rejectedLabel',
        defaultMessage: 'Rejected',
        description: 'Label for a rejected task',
    },
    tasksFeedInProgressLabel: {
        id: 'be.tasks.feed.inProgressLabel',
        defaultMessage: 'In Progress',
        description: 'Label for a task in progress',
    },
    tasksFeedHeadlineApprovalCurrentUser: {
        id: 'be.tasks.feed.headline.approval.currentUser',
        defaultMessage: '{ user } assigned you an Approval Task',
        description: 'Comment headline for an approval task assigned to the current user',
    },
    tasksFeedHeadlineApproval: {
        id: 'be.tasks.feed.headline.approval',
        defaultMessage: '{ user } assigned an Approval Task',
        description: 'Comment headline for an approval task',
    },
    tasksFeedHeadlineGeneralCurrentUser: {
        id: 'be.tasks.feed.headline.general.currentUser',
        defaultMessage: '{ user } assigned you a Task',
        description: 'Comment headline for a general task assigned to the current user',
    },
    tasksFeedHeadlineGeneral: {
        id: 'be.tasks.feed.headline.general',
        defaultMessage: '{ user } assigned a Task',
        description: 'Comment headline for a general task',
    },
    tasksFeedMoreAssigneesLabel: {
        id: 'be.tasks.feed.moreAssigneesLabel',
        defaultMessage: 'See all assignees',
        description: 'Label for button to expand flyout to see all task assignees',
    },
    tasksFeedAssigneeListTitle: {
        id: 'be.tasks.feed.assigneeList.title',
        defaultMessage: 'Assignees',
        description: 'Title for list of all task assignees',
    },
    tasksFeedStatusRejected: {
        id: 'be.tasks.status.rejected',
        defaultMessage: 'Rejected {dateTime}',
        description: 'Rejected task status, where dateTime is a readable time like "Today at 2pm"',
    },
    tasksFeedStatusApproved: {
        id: 'be.tasks.status.approved',
        defaultMessage: 'Approved {dateTime}',
        description: 'Approved task status, where dateTime is a readable time like "Today at 2pm"',
    },
    tasksFeedStatusCompleted: {
        id: 'be.tasks.status.completed',
        defaultMessage: 'Completed {dateTime}',
        description: 'Completed task status, where dateTime is a readable time like "Today at 2pm"',
    },
    tasksFeedStatusNotStarted: {
        id: 'be.tasks.status.notStarted',
        defaultMessage: 'Awaiting',
        description: 'Task status when not started',
    },
    tasksFeedStatusInProgress: {
        id: 'be.tasks.status.inProgress',
        defaultMessage: 'Awaiting',
        description: 'Task status when in progress',
    },
    versionDeleted: {
        id: 'be.versionDeleted',
        defaultMessage: '{ name } deleted version { version_number }',
        description:
            'Message displayed in the activity feed for a deleted version. {name} is the user who performed the action. { version_number } is the file version string.',
    },
    versionRestored: {
        id: 'be.versionRestored',
        defaultMessage: '{ name } restored version { version_number }',
        description:
            'Message displayed in the activity feed for a restored version. {name} is the user who performed the action. { version_number } is the file version string.',
    },
    versionMultipleUsersUploaded: {
        id: 'be.versionMultipleUsersUploaded',
        defaultMessage: '{ numberOfCollaborators } collaborators uploaded versions { versions }',
        description:
            'Message displayed in the activity feed to represent the range of versions uploaded by multiple users. { numberOfCollaborators } is a number and { versions } is a range of versions.',
    },
    versionUploadCollapsed: {
        id: 'be.versionUploadCollapsed',
        defaultMessage: '{ name } uploaded versions { versions }',
        description:
            'Message displayed in the activity feed to represent the range of versions uploaded by a single user. { name } is the user who uploaded. { versions } is a range of versions.',
    },
    versionUploaded: {
        id: 'be.versionUploaded',
        defaultMessage: '{ name } uploaded version { version_number }',
        description:
            'Message displayed in the activity feed for a newly uploaded version. {name} is the user who performed the action. { version_number } is the file version string.',
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
});

export default messages;
