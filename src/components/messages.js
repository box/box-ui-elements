/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

type IntlDESCriptor = {
    id: string,
    description: string,
    defaultMessage: string
};

const messages: { [string]: IntlDESCriptor } = defineMessages({
    today: {
        id: 'be.today',
        description: 'Shown instead of todays date.',
        defaultMessage: 'today'
    },
    yesterday: {
        id: 'be.yesterday',
        description: 'Shown instead of yesterdays date.',
        defaultMessage: 'yesterday'
    },
    logo: {
        id: 'be.logo',
        description: 'Placeholder for a logo.',
        defaultMessage: 'Logo'
    },
    preview: {
        id: 'be.preview',
        description: 'Label for preview action.',
        defaultMessage: 'Preview'
    },
    open: {
        id: 'be.open',
        description: 'Label for open action.',
        defaultMessage: 'Open'
    },
    close: {
        id: 'be.close',
        description: 'Label for close action.',
        defaultMessage: 'Close'
    },
    copy: {
        id: 'be.copy',
        description: 'Label for copy action.',
        defaultMessage: 'Copy'
    },
    delete: {
        id: 'be.delete',
        description: 'Label for delete action.',
        defaultMessage: 'Delete'
    },
    rename: {
        id: 'be.rename',
        description: 'Label for rename action.',
        defaultMessage: 'Rename'
    },
    remove: {
        id: 'be.remove',
        description: 'Label for remove action.',
        defaultMessage: 'Remove'
    },
    retry: {
        id: 'be.retry',
        description: 'Label for retry action.',
        defaultMessage: 'Retry'
    },
    share: {
        id: 'be.share',
        description: 'Label for share action.',
        defaultMessage: 'Share'
    },
    download: {
        id: 'be.download',
        description: 'Label for download action.',
        defaultMessage: 'Download'
    },
    cancel: {
        id: 'be.cancel',
        description: 'Label for cancel action.',
        defaultMessage: 'Cancel'
    },
    cancelUploads: {
        id: 'be.cancelUploads',
        description: 'Label for cancel uploads action.',
        defaultMessage: 'Cancel Uploads'
    },
    create: {
        id: 'be.create',
        description: 'Label for create action.',
        defaultMessage: 'Create'
    },
    choose: {
        id: 'be.choose',
        description: 'Label for choose action.',
        defaultMessage: 'Choose'
    },
    upload: {
        id: 'be.upload',
        description: 'Label for upload action.',
        defaultMessage: 'Upload'
    },
    newFolder: {
        id: 'be.newFolder',
        description: 'Label for create new folder action.',
        defaultMessage: 'New Folder'
    },
    in: {
        id: 'be.in',
        description: 'Label for in action.',
        defaultMessage: 'In'
    },
    selected: {
        id: 'be.selected',
        description: 'Default label for selected items list in the footer.',
        defaultMessage: 'Selected'
    },
    max: {
        id: 'be.max',
        description: 'Indicator on the footer that max items have been selected.',
        defaultMessage: 'max'
    },
    modified: {
        id: 'be.itemModified',
        description: 'Label for item modified date.',
        defaultMessage: 'Modified'
    },
    created: {
        id: 'be.itemCreated',
        description: 'Label for item created date.',
        defaultMessage: 'Created'
    },
    owner: {
        id: 'be.itemOwner',
        description: 'Label for item owner.',
        defaultMessage: 'Owner'
    },
    uploader: {
        id: 'be.itemUploader',
        description: 'label for item uploader.',
        defaultMessage: 'Uploader'
    },
    interacted: {
        id: 'be.itemInteracted',
        description: 'Label for item last accessed date.',
        defaultMessage: 'Last Accessed'
    },
    name: {
        id: 'be.itemName',
        description: 'Label for item name attribute.',
        defaultMessage: 'Name'
    },
    size: {
        id: 'be.itemSize',
        description: 'Label for item size attribute.',
        defaultMessage: 'Size'
    },
    deleteDialogLabel: {
        id: 'be.deleteDialogLabel',
        description: 'Label for delete confirmation dialog',
        defaultMessage: 'Confirm Delete'
    },
    deleteDialogFileText: {
        id: 'be.deleteDialogFileText',
        description: 'Text for delete confirmation dialog for files',
        defaultMessage: 'Are you sure you want to delete {name}?'
    },
    deleteDialogFolderText: {
        id: 'be.deleteDialogFolderText',
        description: 'Text for delete confirmation dialog for folders',
        defaultMessage: 'Are you sure you want to delete {name} and all its contents?'
    },
    renameDialogLabel: {
        id: 'be.renameDialogLabel',
        description: 'Label for rename dialog',
        defaultMessage: 'Rename'
    },
    renameDialogText: {
        id: 'be.renameDialogText',
        description: 'Text for rename dialog',
        defaultMessage: 'Please enter a new name for {name}:'
    },
    renameDialogErrorInvalid: {
        id: 'be.renameDialogErrorInvalid',
        description: 'Error text for rename dialog when name is invalid',
        defaultMessage: 'This name is invalid.'
    },
    renameDialogErrorInUse: {
        id: 'be.renameDialogErrorInUse',
        description: 'Error text for rename dialog when name is already in use',
        defaultMessage: 'An item with the same name already exists.'
    },
    renameDialogErrorTooLong: {
        id: 'be.renameDialogErrorTooLong',
        description: 'Error text for rename dialog when name is too long',
        defaultMessage: 'This name is too long.'
    },
    createDialogLabel: {
        id: 'be.createDialogLabel',
        description: 'Label for create folder dialog',
        defaultMessage: 'New Folder'
    },
    createDialogText: {
        id: 'be.createDialogText',
        description: 'Text for create folder dialog',
        defaultMessage: 'Please enter a name.'
    },
    createDialogErrorInvalid: {
        id: 'be.createDialogErrorInvalid',
        description: 'Error text for create folder dialog when name is invalid',
        defaultMessage: 'This is an invalid folder name.'
    },
    createDialogErrorTooLong: {
        id: 'be.createDialogErrorTooLong',
        description: 'Error text for create folder dialog when name is too long',
        defaultMessage: 'This folder name is too long.'
    },
    createDialogErrorInUse: {
        id: 'be.createDialogErrorInUse',
        description: 'Error text for create folder dialog when name is already in use',
        defaultMessage: 'An folder with the same name already exists.'
    },
    shareDialogLabel: {
        id: 'be.shareDialogLabel',
        description: 'Label for shared link dialog',
        defaultMessage: 'Share'
    },
    shareDialogText: {
        id: 'be.shareDialogText',
        description: 'Text for share link dialog',
        defaultMessage: 'Shared Link:'
    },
    shareDialogNone: {
        id: 'be.shareDialogNone',
        description: 'Text for no shared link',
        defaultMessage: 'None'
    },
    shareAccessOpen: {
        id: 'be.shareAccessOpen',
        description: 'Dropdown select option for open share access.',
        defaultMessage: 'Access: People with the link'
    },
    shareAccessCollab: {
        id: 'be.shareAccessCollab',
        description: 'Dropdown select option for collaborator share access.',
        defaultMessage: 'Access: People in this folder'
    },
    shareAccessCompany: {
        id: 'be.shareAccessCompany',
        description: 'Dropdown select option for enterprise share access.',
        defaultMessage: 'People in this company'
    },
    shareAccessNone: {
        id: 'be.shareAccessNone',
        description: 'Dropdown select option for no access.',
        defaultMessage: 'No shared link'
    },
    shareAccessRemove: {
        id: 'be.shareAccessRemove',
        description: 'Dropdown select option to remove access.',
        defaultMessage: 'Remove shared link'
    },
    searchPlaceholder: {
        id: 'be.searchPlaceholder',
        description: 'Shown as a placeholder in the search box.',
        defaultMessage: 'Search files and folders'
    },
    sidebarShow: {
        id: 'be.sidebarShow',
        description: 'Label for the show sidebar button.',
        defaultMessage: 'Show Sidebar'
    },
    sidebarHide: {
        id: 'be.sidebarHide',
        description: 'Label for the hide sidebar button.',
        defaultMessage: 'Hide Sidebar'
    },
    sidebarDescription: {
        id: 'be.sidebarDescription',
        description: 'Label for the description field in the preview sidebar.',
        defaultMessage: 'Description'
    },
    sidebarDescriptionPlaceholder: {
        id: 'be.sidebarDescriptionPlaceholder',
        description: 'Placeholder for file description in preview sidebar.',
        defaultMessage: 'Enter a description'
    },
    sidebarDetailsTitle: {
        id: 'be.sidebarDetailsTitle',
        description: 'Title for the preview details sidebar.',
        defaultMessage: 'Details'
    },
    sidebarProperties: {
        id: 'be.sidebarProperties',
        description: 'Label for file properties section in the preview sidebar',
        defaultMessage: 'File Properties'
    },
    keywordSkill: {
        id: 'be.keywordSkill',
        description: 'Label for keywords skill section in the preview sidebar',
        defaultMessage: 'Keywords'
    },
    timelineSkill: {
        id: 'be.timelineSkill',
        description: 'Label for timelines skill section in the preview sidebar',
        defaultMessage: 'Timelines'
    },
    transcriptSkill: {
        id: 'be.transcriptSkill',
        description: 'Label for transcripts skill section in the preview sidebar',
        defaultMessage: 'Transcripts'
    },
    uploadErrorTooManyFiles: {
        id: 'be.uploadErrorTooManyFiles',
        description: 'Message shown when too many files are uploaded at once',
        defaultMessage: 'You can only upload up to {fileLimit} file(s) at a time.'
    },
    uploadError: {
        id: 'be.uploadError',
        description: 'Message shown when there is a network error when uploading',
        defaultMessage: 'A network error has occured while trying to upload.'
    },
    uploadEmpty: {
        id: 'be.uploadEmpty',
        description: 'Message shown when there are no items to upload',
        defaultMessage: 'Drag and drop files or'
    },
    uploadEmptyInput: {
        id: 'be.uploadEmptyInput',
        description: 'Message shown for upload link when there are no items to upload',
        defaultMessage: 'browse your device'
    },
    uploadNoDragDrop: {
        id: 'be.uploadNoDragDrop',
        description: 'Message shown on a device with no drag and drop support when there are no items to upload',
        defaultMessage: 'Select files from your device'
    },
    uploadInProgress: {
        id: 'be.uploadInProgress',
        description: 'Message shown when user drag and drops files onto uploads in progress',
        defaultMessage: 'Drag and drop to add additional files'
    },
    uploadSuccess: {
        id: 'be.uploadSuccess',
        description: 'Message shown when all files have been successfully uploaded',
        defaultMessage: 'Success! Your files have been uploaded'
    },
    uploadSuccessInput: {
        id: 'be.uploadSuccessInput',
        description: 'Message shown for upload link after a successful upload',
        defaultMessage: 'Upload additional files'
    },
    nameASC: {
        id: 'be.nameASC',
        description: 'Name ascending option shown in the share access drop down select.',
        defaultMessage: 'Name: A → Z'
    },
    nameDESC: {
        id: 'be.nameDESC',
        description: 'Name descending option shown in the share access drop down select.',
        defaultMessage: 'Name: Z → A'
    },
    dateASC: {
        id: 'be.dateASC',
        description: 'Date ascending option shown in the share access drop down select.',
        defaultMessage: 'Date: Oldest → Newest'
    },
    dateDESC: {
        id: 'be.dateDESC',
        description: 'Date descending option shown in the share access drop down select.',
        defaultMessage: 'Date: Newest → Oldest'
    },
    sizeASC: {
        id: 'be.sizeASC',
        description: 'Size ascending option shown in the share access drop down select.',
        defaultMessage: 'Size: Smallest → Largest'
    },
    sizeDESC: {
        id: 'be.sizeDESC',
        description: 'Size descending option shown in the share access drop down select.',
        defaultMessage: 'Size: Largest → Smallest'
    },
    searchState: {
        id: 'be.searchState',
        description: 'Message shown when there are no search results.',
        defaultMessage: 'Sorry, we couldn’t find what you’re looking for.'
    },
    selectedState: {
        id: 'be.selectedState',
        description: 'Message shown when there are no selected items.',
        defaultMessage: 'You haven’t selected any items yet.'
    },
    errorState: {
        id: 'be.errorState',
        description: 'Message shown when there is an error.',
        defaultMessage: 'A network error has occurred while trying to load.'
    },
    folderState: {
        id: 'be.folderState',
        description: 'Message shown when there are no folder items.',
        defaultMessage: 'There are no items in this folder.'
    },
    recentsState: {
        id: 'be.recentsState',
        description: 'Message shown when there are no recent items.',
        defaultMessage: 'There are no recent items yet.'
    },
    loadingState: {
        id: 'be.loadingState',
        description: 'Message shown when folder items are still fetching.',
        defaultMessage: 'Please wait while the items load...'
    },
    rootBreadcrumb: {
        id: 'be.rootBreadcrumb',
        description: 'Default label for root folder.',
        defaultMessage: 'All Files'
    },
    searchBreadcrumb: {
        id: 'be.searchBreadcrumb',
        description: 'Shown as the title in the sub header while searching.',
        defaultMessage: 'Search Results'
    },
    recentsBreadcrumb: {
        id: 'be.recentsBreadcrumb',
        description: 'Shown as the title in the sub header when showing recents.',
        defaultMessage: 'Recents'
    },
    selectedBreadcrumb: {
        id: 'be.selectedBreadcrumb',
        description: 'Shown as the title in the sub header while showing selected items.',
        defaultMessage: 'Selected Items'
    },
    errorBreadcrumb: {
        id: 'be.errorBreadcrumb',
        description: 'Shown as the title in the sub header while showing an error.',
        defaultMessage: 'Error'
    },
    uploadsManagerUploadInProgress: {
        id: 'be.uploadsManagerUploadInProgress',
        description: 'Text shown when uploads are in progress',
        defaultMessage: 'Uploading'
    },
    uploadsManagerUploadComplete: {
        id: 'be.uploadsManagerUploadComplete',
        description: 'Text shown when uploads are completed',
        defaultMessage: 'Completed'
    },
    uploadsManagerUploadFailed: {
        id: 'be.uploadsManagerUploadFailed',
        description: 'Text shown when uploads failed',
        defaultMessage: 'Some Uploads Failed.'
    }
});

export default messages;
