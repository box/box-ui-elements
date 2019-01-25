import React from 'react';
import sinon from 'sinon';

import { FileVersionListItemBase as FileVersionListItem } from '../FileVersionListItem';

const sandbox = sinon.sandbox.create();

describe('features/version-history-modal/FileVersionListItem', () => {
    const getTestVersion = (values = {}) => ({
        created: 5000,
        extension: 'jpg',
        fileVersionID: '123_456',
        id: '1',
        isCurrent: false,
        itemName: 'test',
        itemTypedID: 'file_123_456',
        updated: 10000,
        uploaderUserName: 'uploader',
        versionNumber: 10,
        ...values,
    });

    const getWrapper = (props = {}) =>
        shallow(
            <FileVersionListItem
                canUpload
                canDelete
                intl={{ formatMessage: sandbox.stub() }}
                isOverVersionLimit={false}
                isProcessing={false}
                onDelete={() => {}}
                onDownload={() => {}}
                onMakeCurrent={() => {}}
                onRestore={() => {}}
                style={{}}
                version={getTestVersion()}
                versionLimit={100}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render', () => {
        test('should render a FileIcon based on the version extension', () => {
            const wrapper = getWrapper({
                version: getTestVersion({
                    extension: 'jpg',
                }),
            });

            const fileIconWrapper = wrapper.find('FileIcon');
            expect(fileIconWrapper.length).toBe(1);
            expect(fileIconWrapper.prop('extension')).toEqual('jpg');
        });

        test('should render a badge with the correct version number', () => {
            const wrapper = getWrapper({
                version: getTestVersion({
                    extension: 'jpg',
                    versionNumber: 10,
                }),
            });

            const messageWrapper = wrapper.find({
                id: 'boxui.versionHistoryModal.versionNumberBadge',
            });
            expect(messageWrapper.length).toBe(1);
            expect(messageWrapper.prop('values')).toEqual({
                versionNumber: 10,
            });
        });

        test('should not render a CURRENT badge when version is not current', () => {
            const wrapper = getWrapper({
                version: getTestVersion({
                    isCurrent: false,
                }),
            });

            const messageWrapper = wrapper.find({
                id: 'boxui.versionHistoryModal.current',
            });
            expect(messageWrapper.length).toBe(0);
        });

        test('should render a CURRENT badge when version is current', () => {
            const wrapper = getWrapper({
                version: getTestVersion({
                    isCurrent: true,
                }),
            });

            const messageWrapper = wrapper.find({
                id: 'boxui.versionHistoryModal.current',
            });
            expect(messageWrapper.length).toBe(1);
        });

        test('should render a version limit exceeded message when current version number is past a threshold', () => {
            const wrapper = getWrapper({
                isOverVersionLimit: true,
                versionLimit: 100,
                version: getTestVersion(),
            });

            const messageWrapper = wrapper.find({
                id: 'boxui.versionHistoryModal.versionLimitExceeded',
            });
            expect(messageWrapper.length).toBe(1);
            expect(messageWrapper.prop('values')).toEqual({
                versionLimit: 100,
            });
            expect(wrapper.find('FileVersionsActions').length).toBe(0);
        });

        test('should render FileVersionActions correctly when version is within the version limit threshold', () => {
            const version = getTestVersion();
            const wrapper = getWrapper({
                isOverVersionLimit: false,
                isProcessing: true,
                versionLimit: 100,
                version,
            });

            expect(
                wrapper.find({
                    id: 'boxui.versionHistoryModal.versionLimitExceeded',
                }).length,
            ).toBe(0);

            const fileVersionActionsWrapper = wrapper.find('FileVersionActions');

            expect(fileVersionActionsWrapper).toMatchSnapshot();
        });
    });
});
