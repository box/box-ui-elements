// @flow
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    archived: {
        defaultMessage: 'Archived',
        description: 'Label for archivization date under item properties in the sidebar',
        id: 'boxui.itemDetails.archived',
    },
    bookmarkExpiration: {
        defaultMessage: 'This bookmark will be deleted on {expiration}.',
        description:
            'Warning message in the sidebar that this bookmark will be automatically deleted on a certain date, {expiration} is the date',
        id: 'boxui.itemDetails.bookmarkExpiration',
    },
    created: {
        defaultMessage: 'Created',
        description: 'Label for created date under item properties in the sidebar',
        id: 'boxui.itemDetails.created',
    },
    deleted: {
        defaultMessage: 'Deleted',
        description: 'Label for deletion date under item properties in the sidebar',
        id: 'boxui.itemDetails.deleted',
    },
    description: {
        defaultMessage: 'Description',
        description: 'Label for description under item properties in the sidebar',
        id: 'boxui.itemDetails.description',
    },
    descriptionPlaceholder: {
        defaultMessage: 'Enter a description',
        description: 'Placeholder for textarea to enter a description under item properties in the sidebar',
        id: 'boxui.itemDetails.descriptionPlaceholder',
    },
    enterpriseOwner: {
        defaultMessage: 'Enterprise Owner',
        description: 'Label for name of enterprise owner under item properties in the sidebar',
        id: 'boxui.itemDetails.enterpriseOwner',
    },
    fileExpiration: {
        defaultMessage: 'This file will be deleted on {expiration}.',
        description:
            'Warning message in the sidebar that this file will be automatically deleted on a certain date, {expiration} is the date',
        id: 'boxui.itemDetails.fileExpiration',
    },
    filesCountLabel: {
        defaultMessage: '{filesCount, plural, one {# File} other {# Files}}',
        description: 'Label for files count under item properties in the sidebar',
        id: 'boxui.itemDetails.filesCountLabel',
    },
    folderExpiration: {
        defaultMessage: 'This folder will be deleted on {expiration}.',
        description:
            'Warning message in the sidebar that this folder will be automatically deleted on a certain date, {expiration} is the date',
        id: 'boxui.itemDetails.folderExpiration',
    },
    modified: {
        defaultMessage: 'Modified',
        description: 'Label for modified date under item properties in the sidebar',
        id: 'boxui.itemDetails.modified',
    },
    owner: {
        defaultMessage: 'Owner',
        description: 'Label for name of owner under item properties in the sidebar',
        id: 'boxui.itemDetails.owner',
    },
    retentionPolicyDescription: {
        defaultMessage: 'Policy',
        description: 'Label for description of the retention policy under item properties in the sidebar',
        id: 'boxui.itemDetails.retentionPolicyDescription',
    },
    retentionPolicyExpiration: {
        defaultMessage: 'Policy Expiration',
        description: 'Label for the expiration date of the retention policy under item properties in the sidebar',
        id: 'boxui.itemDetails.retentionPolicyExpiration',
    },
    retentionPolicyExtend: {
        defaultMessage: 'Extend',
        description:
            'Button to extend the expiration date of the retention policy under item properties in the sidebar',
        id: 'boxui.itemDetails.retentionPolicyExtend',
    },
    savedVersions: {
        defaultMessage: '{versionCount, number} Saved Versions',
        description:
            'Text for button in the sidebar to open the version history popup, {versionCount} is the number of saved file versions',
        id: 'boxui.itemDetails.savedVersions',
    },
    sharedLinkExpiration: {
        defaultMessage: 'This shared link will be disabled on {expiration}.',
        description:
            'Warning message in the sidebar that this shared link will expire on a certain date, {expiration} is the date',
        id: 'boxui.itemDetails.sharedLinkExpiration',
    },
    size: {
        defaultMessage: 'Size',
        description: 'Label for human-readable filesize under item properties in the sidebar',
        id: 'boxui.itemDetails.size',
    },
    uploader: {
        defaultMessage: 'Uploader',
        description: 'Label for name of uploader under item properties in the sidebar',
        id: 'boxui.itemDetails.uploader',
    },
    url: {
        defaultMessage: 'URL',
        description: 'Label for a weblink url under item properties in the sidebar',
        id: 'boxui.itemDetails.url',
    },
    urlPlaceholder: {
        defaultMessage: 'Enter a valid url',
        description: 'Placeholder for a weblink url text area in the right sidebar',
        id: 'boxui.itemDetails.urlPlaceholder',
    },
});

export default messages;
