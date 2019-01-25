import React from 'react';

import { PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from '../constants';
import AccessDescription from '../AccessDescription';

describe('features/shared-link-modal/AccessDescription', () => {
    let getWrapper;

    beforeEach(() => {
        getWrapper = (props = {}) => shallow(<AccessDescription enterpriseName="enterprise" {...props} />);
    });

    describe('people with link', () => {
        [
            // People with link can download
            {
                itemType: 'folder',
                isDownloadAllowed: true,
                isEditAllowed: true,
                messageID: 'boxui.share.peopleWithLinkCanDownloadFolder',
            },
            // People with link can view the folder
            {
                itemType: 'folder',
                isDownloadAllowed: false,
                isEditAllowed: false,
                messageID: 'boxui.share.peopleWithLinkCanViewFolder',
            },
            // People with link can edit the file
            {
                itemType: 'file',
                isDownloadAllowed: true,
                isEditAllowed: true,
                messageID: 'boxui.share.peopleWithLinkCanEditFile',
            },
            // People with the link can download the file
            {
                itemType: 'file',
                isDownloadAllowed: true,
                isEditAllowed: false,
                messageID: 'boxui.share.peopleWithLinkCanDownloadFile',
            },
            // People with the link can view the file
            {
                itemType: 'file',
                isDownloadAllowed: false,
                isEditAllowed: false,
                messageID: 'boxui.share.peopleWithLinkCanViewFile',
            },
        ].forEach(({ itemType, isDownloadAllowed, isEditAllowed, messageID }) => {
            test('should render the correct message', () => {
                const wrapper = getWrapper({
                    accessLevel: PEOPLE_WITH_LINK,
                    itemType,
                    isDownloadAllowed,
                    isEditAllowed,
                });

                expect(wrapper.find('FormattedMessage').prop('id')).toEqual(messageID);
            });
        });
    });

    describe('people in company', () => {
        [
            // People in Enterprise can download folder
            {
                enterpriseName: undefined,
                itemType: 'folder',
                isDownloadAllowed: true,
                isEditAllowed: false,
                messageID: 'boxui.share.peopleInCompanyCanDownloadFolder',
            },
            // People in Enterprise can view folder
            {
                enterpriseName: undefined,
                itemType: 'folder',
                isDownloadAllowed: false,
                isEditAllowed: false,
                messageID: 'boxui.share.peopleInCompanyCanViewFolder',
            },
            // People in Enterprise can edit the file
            {
                enterpriseName: undefined,
                itemType: 'file',
                isDownloadAllowed: true,
                isEditAllowed: true,
                messageID: 'boxui.share.peopleInCompanyCanEditFile',
            },
            // People in Enterprise can download the file
            {
                enterpriseName: undefined,
                itemType: 'file',
                isDownloadAllowed: true,
                isEditAllowed: false,
                messageID: 'boxui.share.peopleInCompanyCanDownloadFile',
            },
            // People in Enterprise can view the file
            {
                enterpriseName: undefined,
                itemType: 'file',
                isDownloadAllowed: false,
                isEditAllowed: false,
                messageID: 'boxui.share.peopleInCompanyCanViewFile',
            },
            // Certain People in Enterprise can download folder
            {
                enterpriseName: 'enterprise',
                itemType: 'folder',
                isDownloadAllowed: true,
                isEditAllowed: false,
                messageID: 'boxui.share.peopleInSpecifiedCompanyCanDownloadFolder',
            },
            // Certain People in Enterprise can view folder
            {
                enterpriseName: 'enterprise',
                itemType: 'folder',
                isDownloadAllowed: false,
                isEditAllowed: false,
                messageID: 'boxui.share.peopleInSpecifiedCompanyCanViewFolder',
            },
            // Certain People in Enterprise can edit the file
            {
                enterpriseName: 'enterprise',
                itemType: 'file',
                isDownloadAllowed: true,
                isEditAllowed: true,
                messageID: 'boxui.share.peopleInSpecifiedCompanyCanEditFile',
            },
            // Certain People in Enterprise can download file
            {
                enterpriseName: 'enterprise',
                itemType: 'file',
                isDownloadAllowed: true,
                isEditAllowed: false,
                messageID: 'boxui.share.peopleInSpecifiedCompanyCanDownloadFile',
            },
            // Certain People in Enterprise can view the file
            {
                enterpriseName: 'enterprise',
                itemType: 'file',
                isDownloadAllowed: false,
                isEditAllowed: false,
                messageID: 'boxui.share.peopleInSpecifiedCompanyCanViewFile',
            },
        ].forEach(({ enterpriseName, itemType, isDownloadAllowed, isEditAllowed, messageID }) => {
            test('should render the correct message', () => {
                const wrapper = getWrapper({
                    accessLevel: PEOPLE_IN_COMPANY,
                    enterpriseName,
                    itemType,
                    isDownloadAllowed,
                    isEditAllowed,
                });

                expect(wrapper.find('FormattedMessage').prop('id')).toEqual(messageID);
            });
        });
    });

    describe('people in item', () => {
        [
            // Users in Item can preview and download folder
            {
                itemType: 'folder',
                isDownloadAllowed: true,
                isEditAllowed: true,
                isPreviewAllowed: true,
                messageID: 'boxui.share.peopleInItemCanPreviewAndDownloadFolder',
            },
            // Users in Item can preview and preview folder
            {
                itemType: 'folder',
                isDownloadAllowed: false,
                isEditAllowed: false,
                isPreviewAllowed: true,
                messageID: 'boxui.share.peopleInItemCanPreviewFolder',
            },
            // Users in Item can download folder
            {
                itemType: 'folder',
                isDownloadAllowed: true,
                isEditAllowed: false,
                isPreviewAllowed: false,
                messageID: 'boxui.share.peopleInItemCanDownloadFolder',
            },
            // Users in Item can access folder
            {
                itemType: 'folder',
                isDownloadAllowed: false,
                isEditAllowed: false,
                isPreviewAllowed: false,
                messageID: 'boxui.share.peopleInItemCanAccessFolder',
            },
            // Users in Item can edit the file
            {
                itemType: 'file',
                isDownloadAllowed: true,
                isEditAllowed: true,
                isPreviewAllowed: true,
                messageID: 'boxui.share.peopleInItemCanEditFile',
            },
            // Users in Item can preview and download file
            {
                itemType: 'file',
                isDownloadAllowed: true,
                isEditAllowed: false,
                isPreviewAllowed: true,
                messageID: 'boxui.share.peopleInItemCanPreviewAndDownloadFile',
            },
            // Users in Item can preview file
            {
                itemType: 'file',
                isDownloadAllowed: false,
                isEditAllowed: false,
                isPreviewAllowed: true,
                messageID: 'boxui.share.peopleInItemCanPreviewFile',
            },
            // Users in Item can download the file
            {
                itemType: 'file',
                isDownloadAllowed: true,
                isEditAllowed: false,
                isPreviewAllowed: false,
                messageID: 'boxui.share.peopleInItemCanDownloadFile',
            },
            // Users in Item can access file
            {
                itemType: 'file',
                isDownloadAllowed: false,
                isEditAllowed: false,
                isPreviewAllowed: false,
                messageID: 'boxui.share.peopleInItemCanAccessFile',
            },
        ].forEach(({ itemType, isDownloadAllowed, isEditAllowed, isPreviewAllowed, messageID }) => {
            test('should render the correct message', () => {
                const wrapper = getWrapper({
                    accessLevel: PEOPLE_IN_ITEM,
                    itemType,
                    isDownloadAllowed,
                    isEditAllowed,
                    isPreviewAllowed,
                });

                expect(wrapper.find('FormattedMessage').prop('id')).toEqual(messageID);
            });
        });
    });
});
