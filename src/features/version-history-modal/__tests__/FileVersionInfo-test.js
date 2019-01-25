import React from 'react';

import FileVersionInfo from '../FileVersionInfo';
import { DISPOSITION_ACTION_REMOVE_RETENTION_ONLY, DISPOSITION_ACTION_DELETE_ITEMS } from '../constants';

describe('features/version-history-modal/FileVersionInfo', () => {
    const getTestVersion = (values = {}) => ({
        canDownload: false,
        created: 10000,
        deleted: 0,
        extension: 'jpg',
        fileVersionID: '123_456',
        id: '1',
        isCurrent: false,
        isRetained: false,
        itemName: 'test',
        itemTypedID: 'file_123_456',
        updated: 10000,
        uploaderUserName: 'uploader',
        versionNumber: 10,
        ...values,
    });

    const getWrapper = (props = {}) => shallow(<FileVersionInfo version={getTestVersion()} {...props} />);

    describe('render', () => {
        test('should render a deleted by permanently message when version is going to be deleted permanently', () => {
            const wrapper = getWrapper({
                version: getTestVersion({
                    deleted: 1000,
                    deletedPermanentlyBy: 2000,
                    deleterUserName: 'deleter',
                }),
            });

            const messageWrapper = wrapper.find({
                id: 'boxui.versionHistoryModal.deletedPermanentlyByInfo',
            });
            expect(messageWrapper.length).toBe(1);
            expect(messageWrapper.prop('values')).toEqual({
                deleted: 1000000,
                deletedPermanentlyBy: 2000000,
                deleterUserName: 'deleter',
            });
        });

        test('should render a deleted message when version is deleted', () => {
            const wrapper = getWrapper({
                version: getTestVersion({
                    deleted: 1000,
                    deleterUserName: 'deleter',
                }),
            });

            const messageWrapper = wrapper.find({
                id: 'boxui.versionHistoryModal.deletedByInfo',
            });
            expect(messageWrapper.length).toBe(1);
            expect(messageWrapper.prop('values')).toEqual({
                deleted: 1000000,
                deleterUserName: 'deleter',
            });
        });

        test('should render a restored message when version is restored', () => {
            const wrapper = getWrapper({
                version: getTestVersion({
                    restored: 1000,
                    restorerUserName: 'restorer',
                }),
            });

            const messageWrapper = wrapper.find({
                id: 'boxui.versionHistoryModal.restoredByInfo',
            });
            expect(messageWrapper.length).toBe(1);
            expect(messageWrapper.prop('values')).toEqual({
                restored: 1000000,
                restorerUserName: 'restorer',
            });
        });

        test('should render a restored from version message when version is restored as current', () => {
            const wrapper = getWrapper({
                version: getTestVersion({
                    currentFromUserName: 'restorer',
                    currentFromFileVersionID: '123',
                    currentFromVersionNumber: 10,
                    isCurrent: true,
                    updated: 1000,
                }),
            });

            const messageWrapper = wrapper.find({
                id: 'boxui.versionHistoryModal.restoredFromVersionInfo',
            });
            expect(messageWrapper.length).toBe(1);
            expect(messageWrapper.prop('values')).toEqual({
                restored: 1000000,
                restorerUserName: 'restorer',
                versionNumber: 10,
            });
        });

        test('should render a restored from previous version message when an unknown version is restored as current', () => {
            const wrapper = getWrapper({
                version: getTestVersion({
                    currentFromUserName: 'restorer',
                    currentFromFileVersionID: '123',
                    currentFromVersionNumber: null,
                    isCurrent: true,
                    updated: 1000,
                }),
            });

            const messageWrapper = wrapper.find({
                id: 'boxui.versionHistoryModal.restoredFromPreviousVersionInfo',
            });
            expect(messageWrapper.length).toBe(1);
            expect(messageWrapper.prop('values')).toEqual({
                restored: 1000000,
                restorerUserName: 'restorer',
            });
        });

        test('should render an uploaded message with updated date when is the current version', () => {
            const wrapper = getWrapper({
                version: getTestVersion({
                    created: 1000,
                    updated: 5000,
                    isCurrent: true,
                    uploaderUserName: 'uploader',
                }),
            });

            const messageWrapper = wrapper.find({
                id: 'boxui.versionHistoryModal.uploadedInfo',
            });
            expect(messageWrapper.length).toBe(1);
            expect(messageWrapper.prop('values')).toEqual({
                uploaded: 5000000,
                uploaderUserName: 'uploader',
            });
        });

        test('should render an uploaded message with created date when it is just a normal version', () => {
            const wrapper = getWrapper({
                version: getTestVersion({
                    created: 1000,
                    uploaderUserName: 'uploader',
                }),
            });

            const messageWrapper = wrapper.find({
                id: 'boxui.versionHistoryModal.uploadedInfo',
            });
            expect(messageWrapper.length).toBe(1);
            expect(messageWrapper.prop('values')).toEqual({
                uploaded: 1000000,
                uploaderUserName: 'uploader',
            });
        });

        describe('retention messages', () => {
            test('should not render retention messages when version is not retained', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        isRetained: false,
                    }),
                });

                const messageWrapper = wrapper.find('.file-version-retention-info');
                expect(messageWrapper.length).toBe(0);
            });

            test('should not render retention messages when version is not retained', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        isRetained: true,
                        isIndefinitelyRetained: true,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.retainedIndefinitely',
                });
                expect(messageWrapper.length).toBe(1);
            });

            test('should show retained until message when disposition is Remove Retention Only', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        isRetained: true,
                        dispositionAction: DISPOSITION_ACTION_REMOVE_RETENTION_ONLY,
                        dispositionDate: 1000,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.retainedUntil',
                });
                expect(messageWrapper.length).toBe(1);
                expect(messageWrapper.prop('values')).toEqual({
                    dispositionDate: 1000000,
                });
            });

            test('should not render retention messages when version is not retained', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        isRetained: true,
                        dispositionAction: DISPOSITION_ACTION_DELETE_ITEMS,
                        dispositionDate: 1000,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.retainedAndDeletedOn',
                });
                expect(messageWrapper.length).toBe(1);
                expect(messageWrapper.prop('values')).toEqual({
                    dispositionDate: 1000000,
                });
            });
        });
    });
});
