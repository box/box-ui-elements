/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

type IntlDescriptor = {
    id: string,
    description: string,
    defaultMessage: string
};

const messages: { [string]: IntlDescriptor } = defineMessages({
    'buik.date.today': {
        id: 'buik.date.today',
        description: 'Shown instead of todays date.',
        defaultMessage: 'today'
    },
    'buik.date.yesterday': {
        id: 'buik.date.yesterday',
        description: 'Shown instead of yesterdays date.',
        defaultMessage: 'yesterday'
    },
    'buik.empty.state.search': {
        id: 'buik.empty.state.search',
        description: 'Message shown when there are no search results.',
        defaultMessage: 'Sorry, we couldn’t find what you’re looking for.'
    },
    'buik.empty.state.selected': {
        id: 'buik.empty.state.selected',
        description: 'Message shown when there are no selected items.',
        defaultMessage: 'You haven’t selected any items yet.'
    },
    'buik.empty.state.error': {
        id: 'buik.empty.state.error',
        description: 'Message shown when there is an error.',
        defaultMessage: 'A network error has occurred while trying to load.'
    },
    'buik.empty.state.folder': {
        id: 'buik.empty.state.folder',
        description: 'Message shown when there are no folder items.',
        defaultMessage: 'There are no items in this folder.'
    },
    'buik.empty.state.recents': {
        id: 'buik.empty.state.recents',
        description: 'Message shown when there are no recent items.',
        defaultMessage: 'There are no recent items yet.'
    },
    'buik.empty.state.folder.loading': {
        id: 'buik.empty.state.folder.loading',
        description: 'Message shown when folder items are still fetching.',
        defaultMessage: 'Please wait while the items load...'
    },
    'buik.footer.selected': {
        id: 'buik.footer.selected',
        description: 'Default label for selected items list in the footer.',
        defaultMessage: 'Selected'
    },
    'buik.footer.button.cancel': {
        id: 'buik.footer.button.cancel',
        description: 'Label for cancel button in the footer.',
        defaultMessage: 'Cancel'
    },
    'buik.footer.button.cancel.uploads': {
        id: 'buik.footer.button.cancel.uploads',
        description: 'Label for cancel uploads button in the footer.',
        defaultMessage: 'Cancel Uploads'
    },
    'buik.footer.button.close': {
        id: 'buik.footer.button.close',
        description: 'Label for close button in the footer.',
        defaultMessage: 'Close'
    },
    'buik.footer.button.choose': {
        id: 'buik.footer.button.choose',
        description: 'Label for the choose button in the footer.',
        defaultMessage: 'Choose'
    },
    'buik.footer.button.upload': {
        id: 'buik.footer.button.upload',
        description: 'Label for the upload button in the footer.',
        defaultMessage: 'Upload'
    },
    'buik.footer.selected.max': {
        id: 'buik.footer.selected.max',
        description: 'Indicator on the footer that max items have been selected.',
        defaultMessage: 'max'
    },
    'buik.header.search.placeholder': {
        id: 'buik.header.search.placeholder',
        description: 'Shown as a placeholder in the search box.',
        defaultMessage: 'Search files and folders'
    },
    'buik.header.button.upload': {
        id: 'buik.header.button.upload',
        description: 'Label for the upload menu item.',
        defaultMessage: 'Upload'
    },
    'buik.header.button.create': {
        id: 'buik.header.button.create',
        description: 'Label for the new folder menu item.',
        defaultMessage: 'New Folder'
    },
    'buik.folder.path.prefix': {
        id: 'buik.folder.path.prefix',
        description: 'Shown before a folder name.',
        defaultMessage: 'In'
    },
    'buik.item.modified': {
        id: 'buik.item.modified',
        description: 'Shown before folder modification date and label for modified column.',
        defaultMessage: 'Modified'
    },
    'buik.item.interacted': {
        id: 'buik.item.interacted',
        description: 'Shown before folder modification date and label for interacted column.',
        defaultMessage: 'Last Accessed'
    },
    'buik.item.name': {
        id: 'buik.item.name',
        description: 'Label for name header column.',
        defaultMessage: 'Name'
    },
    'buik.item.size': {
        id: 'buik.item.size',
        description: 'Label for size header column.',
        defaultMessage: 'Size'
    },
    'buik.item.share.access.open': {
        id: 'buik.item.share.access.open',
        description: 'Dropdown select option for open share access.',
        defaultMessage: 'Access: People with the link'
    },
    'buik.item.share.access.collaborators': {
        id: 'buik.item.share.access.collaborators',
        description: 'Dropdown select option for collaborator share access.',
        defaultMessage: 'Access: People in this folder'
    },
    'buik.item.share.access.company': {
        id: 'buik.item.share.access.company',
        description: 'Dropdown select option for enterprise share access.',
        defaultMessage: 'People in this company'
    },
    'buik.item.share.access.none': {
        id: 'buik.item.share.access.none',
        description: 'Dropdown select option for no access.',
        defaultMessage: 'No shared link'
    },
    'buik.item.share.access.remove': {
        id: 'buik.item.share.access.remove',
        description: 'Dropdown select option to remove access.',
        defaultMessage: 'Remove shared link'
    },
    'buik.btn.sort': {
        id: 'buik.btn.sort',
        description: 'Label for sort button',
        defaultMessage: 'Sort'
    },
    'buik.sort.option.name.asc': {
        id: 'buik.sort.option.name.asc',
        description: 'Name ascending option shown in the share access drop down select.',
        defaultMessage: 'Name: A → Z'
    },
    'buik.sort.option.name.desc': {
        id: 'buik.sort.option.name.desc',
        description: 'Name descending option shown in the share access drop down select.',
        defaultMessage: 'Name: Z → A'
    },
    'buik.sort.option.date.asc': {
        id: 'buik.sort.option.date.asc',
        description: 'Date ascending option shown in the share access drop down select.',
        defaultMessage: 'Date: Oldest → Newest'
    },
    'buik.sort.option.date.desc': {
        id: 'buik.sort.option.date.desc',
        description: 'Date descending option shown in the share access drop down select.',
        defaultMessage: 'Date: Newest → Oldest'
    },
    'buik.sort.option.size.asc': {
        id: 'buik.sort.option.size.asc',
        description: 'Size ascending option shown in the share access drop down select.',
        defaultMessage: 'Size: Smallest → Largest'
    },
    'buik.sort.option.size.desc': {
        id: 'buik.sort.option.size.desc',
        description: 'Size descending option shown in the share access drop down select.',
        defaultMessage: 'Size: Largest → Smallest'
    },
    'buik.folder.name.root': {
        id: 'buik.folder.name.root',
        description: 'Default label for root folder.',
        defaultMessage: 'All Files'
    },
    'buik.folder.name.search': {
        id: 'buik.folder.name.search',
        description: 'Shown as the title in the sub header while searching.',
        defaultMessage: 'Search Results'
    },
    'buik.folder.name.recents': {
        id: 'buik.folder.name.recents',
        description: 'Shown as the title in the sub header when showing recents.',
        defaultMessage: 'Recents'
    },
    'buik.folder.name.selected': {
        id: 'buik.folder.name.selected',
        description: 'Shown as the title in the sub header while showing selected items.',
        defaultMessage: 'Selected Items'
    },
    'buik.folder.name.error': {
        id: 'buik.folder.name.error',
        description: 'Shown as the title in the sub header while showing an error.',
        defaultMessage: 'Error'
    },
    'buik.more.options.preview': {
        id: 'buik.more.options.preview',
        description: 'Label for preview menu item in the ... drop down.',
        defaultMessage: 'Preview'
    },
    'buik.more.options.open': {
        id: 'buik.more.options.open',
        description: 'Label for open menu item in the ... drop down for web links.',
        defaultMessage: 'Open'
    },
    'buik.more.options.delete': {
        id: 'buik.more.options.delete',
        description: 'Label for delete menu item in the ... drop down.',
        defaultMessage: 'Delete'
    },
    'buik.more.options.rename': {
        id: 'buik.more.options.rename',
        description: 'Label for rename menu item in the ... drop down.',
        defaultMessage: 'Rename'
    },
    'buik.item.button.share': {
        id: 'buik.item.button.share',
        description: 'Label for share button on item row.',
        defaultMessage: 'Share'
    },
    'buik.more.options.download': {
        id: 'buik.more.options.download',
        description: 'Label for download menu item in the ... drop down.',
        defaultMessage: 'Download'
    },
    'buik.modal.delete.confirmation.label': {
        id: 'buik.modal.delete.confirmation.label',
        description: 'Label for delete confirmation dialog',
        defaultMessage: 'Confirm Delete'
    },
    'buik.modal.delete.confirmation.text': {
        id: 'buik.modal.delete.confirmation.text',
        description: 'Text for delete confirmation dialog',
        defaultMessage: 'Are you sure you want to delete {name}?'
    },
    'buik.modal.delete.confirmation.text.folder': {
        id: 'buik.modal.delete.confirmation.text.folder',
        description: 'Text for delete confirmation dialog for folders',
        defaultMessage: 'Are you sure you want to delete {name} and all its contents?'
    },
    'buik.modal.rename.dialog.label': {
        id: 'buik.modal.rename.dialog.label',
        description: 'Label for rename dialog',
        defaultMessage: 'Rename'
    },
    'buik.modal.rename.dialog.text': {
        id: 'buik.modal.rename.dialog.text',
        description: 'Text for rename dialog',
        defaultMessage: 'Please enter a new name for {name}:'
    },
    'buik.modal.create.dialog.label': {
        id: 'buik.modal.create.dialog.label',
        description: 'Label for create folder dialog',
        defaultMessage: 'New Folder'
    },
    'buik.modal.create.dialog.text': {
        id: 'buik.modal.create.dialog.text',
        description: 'Text for create folder dialog',
        defaultMessage: 'Please enter a name.'
    },
    'buik.modal.create.dialog.button': {
        id: 'buik.modal.create.dialog.button',
        description: 'Text for create folder dialog button',
        defaultMessage: 'Create'
    },
    'buik.upload.state.error': {
        id: 'buik.upload.state.error',
        description: 'Message shown when there is a network error when uploading',
        defaultMessage: 'A network error has occured while trying to upload.'
    },
    'buik.upload.state.empty': {
        id: 'buik.upload.state.empty',
        description: 'Message shown when there are no items to upload',
        defaultMessage: 'Drag and drop files or'
    },
    'buik.upload.state.empty.input': {
        id: 'buik.upload.state.empty.input',
        description: 'Message shown for upload link when there are no items to upload',
        defaultMessage: 'browse your device'
    },
    'buik.upload.state.empty.input.nodragdrop': {
        id: 'buik.upload.state.empty.input.nodragdrop',
        description: 'Message shown on a device with no drag and drop support when there are no items to upload',
        defaultMessage: 'Select files from your device'
    },
    'buik.upload.state.inprogress': {
        id: 'buik.upload.state.inprogress',
        description: 'Message shown when user drag and drops files onto uploads in progress',
        defaultMessage: 'Drag and drop to add additional files'
    },
    'buik.upload.state.success': {
        id: 'buik.upload.state.success',
        description: 'Message shown when all files have been successfully uploaded',
        defaultMessage: 'Success! Your files have been uploaded'
    },
    'buik.upload.state.success.input': {
        id: 'buik.upload.state.success.input',
        description: 'Message shown for upload link after a successful upload',
        defaultMessage: 'Upload additional files'
    },
    'buik.action.button.pending': {
        id: 'buik.action.button.pending',
        description: 'Message shown in tooltip for remove button for a pending upload',
        defaultMessage: 'Remove'
    },
    'buik.action.button.inprogress': {
        id: 'buik.action.button.inprogress',
        description: 'Message shown in tooltip for cancel button for an upload in progress',
        defaultMessage: 'Cancel'
    },
    'buik.action.button.complete': {
        id: 'buik.action.button.complete',
        description: 'Message shown in tooltip for remove button for a completed upload',
        defaultMessage: 'Remove'
    },
    'buik.action.button.error': {
        id: 'buik.action.button.error',
        description: 'Message shown in tooltip for retry button for an upload with an error',
        defaultMessage: 'Retry'
    },
    'buik.modal.rename.dialog.error.invalid': {
        id: 'buik.modal.rename.dialog.error.invalid',
        description: 'Error text for rename dialog when name is invalid',
        defaultMessage: 'This name is invalid.'
    },
    'buik.modal.rename.dialog.error.inuse': {
        id: 'buik.modal.rename.dialog.error.inuse',
        description: 'Error text for rename dialog when name is already in use',
        defaultMessage: 'An item with the same name already exists.'
    },
    'buik.modal.rename.dialog.error.toolong': {
        id: 'buik.modal.rename.dialog.error.toolong',
        description: 'Error text for rename dialog when name is too long',
        defaultMessage: 'This name is too long.'
    },
    'buik.modal.create.dialog.error.invalid': {
        id: 'buik.modal.create.dialog.error.invalid',
        description: 'Error text for create folder dialog when name is invalid',
        defaultMessage: 'This is an invalid folder name.'
    },
    'buik.modal.create.dialog.error.toolong': {
        id: 'buik.modal.create.dialog.error.toolong',
        description: 'Error text for create folder dialog when name is too long',
        defaultMessage: 'This folder name is too long.'
    },
    'buik.modal.create.dialog.error.inuse': {
        id: 'buik.modal.create.dialog.error.inuse',
        description: 'Error text for create folder dialog when name is already in use',
        defaultMessage: 'An folder with the same name already exists.'
    },
    'buik.modal.preview.dialog.label': {
        id: 'buik.modal.preview.dialog.label',
        description: 'Label for preview dialog',
        defaultMessage: 'Preview'
    },
    'buik.modal.upload.dialog.label': {
        id: 'buik.modal.upload.dialog.label',
        description: 'Label for upload dialog',
        defaultMessage: 'Upload'
    },
    'buik.modal.share.dialog.label': {
        id: 'buik.modal.share.dialog.label',
        description: 'Label for shared link dialog',
        defaultMessage: 'Share'
    },
    'buik.modal.share.dialog.text': {
        id: 'buik.modal.share.dialog.text',
        description: 'Text for share link dialog',
        defaultMessage: 'Shared Link:'
    },
    'buik.modal.share.dialog.text.none': {
        id: 'buik.modal.share.dialog.text.none',
        description: 'Text for no shared link',
        defaultMessage: 'None'
    },
    'buik.modal.dialog.share.button.copy': {
        id: 'buik.modal.dialog.share.button.copy',
        description: 'Copy button label',
        defaultMessage: 'Copy'
    },
    'buik.modal.dialog.share.button.close': {
        id: 'buik.modal.dialog.share.button.close',
        description: 'Close button label',
        defaultMessage: 'Close'
    }
});

export default messages;
