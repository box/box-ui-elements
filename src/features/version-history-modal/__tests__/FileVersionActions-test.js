import React from 'react';
import sinon from 'sinon';

import FileVersionActions from '../FileVersionActions';

const sandbox = sinon.sandbox.create();

describe('features/version-history-modal/FileVersionActions', () => {
    const getTestVersion = (values = {}) => ({
        canDownload: false,
        created: 5000,
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

    const getWrapper = (props = {}) =>
        shallow(
            <FileVersionActions
                canDelete
                canUpload
                isProcessing={false}
                onDelete={() => {}}
                onDownload={() => {}}
                onMakeCurrent={() => {}}
                onRestore={() => {}}
                version={getTestVersion()}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render', () => {
        describe('Restore button', () => {
            test('should not render a restore button when version is not deleted', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        deleted: 0,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.restore',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should not render a restore button when no onRestore callback is passed', () => {
                const wrapper = getWrapper({
                    onRestore: null,
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.restore',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should render a restore button when version has been deleted', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        deleted: 1000,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.restore',
                });
                expect(messageWrapper.length).toBe(1);
            });

            test('should not fire onRestore callback when isProcessing=true', () => {
                const wrapper = getWrapper({
                    isProcessing: true,
                    onRestore: sandbox.mock().never(),
                    version: getTestVersion({
                        deleted: 1000,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.restore',
                });
                const buttonWrapper = messageWrapper.parent();

                buttonWrapper.simulate('click');
            });

            test('should fire onRestore callback when isProcessing=false', () => {
                const version = getTestVersion({
                    deleted: 1000,
                });
                const wrapper = getWrapper({
                    isProcessing: false,
                    onRestore: sandbox.mock().withArgs(version),
                    version,
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.restore',
                });
                const buttonWrapper = messageWrapper.parent();

                buttonWrapper.simulate('click');
            });
        });

        describe('Download button', () => {
            test('should not render a download button when version is deleted', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        canDownload: true,
                        deleted: 1000,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.download',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should not render a download button when version is not downloadable', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        canDownload: false,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.download',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should not render a download button when no onDownload callback is passed', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        canDownload: true,
                    }),
                    onDownload: null,
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.download',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should render a download button when version is downloadable', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        canDownload: true,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.download',
                });
                expect(messageWrapper.length).toBe(1);
            });

            test('should not fire onDownload callback when isProcessing=true', () => {
                const wrapper = getWrapper({
                    isProcessing: true,
                    onDownload: sandbox.mock().never(),
                    version: getTestVersion({
                        canDownload: true,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.download',
                });
                const buttonWrapper = messageWrapper.parent();

                buttonWrapper.simulate('click');
            });

            test('should fire onDownload callback when isProcessing=false', () => {
                const version = getTestVersion({
                    canDownload: true,
                });
                const wrapper = getWrapper({
                    isProcessing: false,
                    onDownload: sandbox.mock().withArgs(version),
                    version,
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.download',
                });
                const buttonWrapper = messageWrapper.parent();

                buttonWrapper.simulate('click');
            });
        });

        describe('Make Current button', () => {
            test('should not render a Make Current button when version is deleted', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        deleted: 1000,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.makeCurrent',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should not render a Make Current button when version is the current version', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        isCurrent: true,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.makeCurrent',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should not render a Make Current button when no onMakeCurrent callback is passed', () => {
                const wrapper = getWrapper({
                    onMakeCurrent: null,
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.makeCurrent',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should render a Make Current button when version is not current', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        isCurrent: false,
                        deleted: 0,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.makeCurrent',
                });
                expect(messageWrapper.length).toBe(1);
            });

            test('should not render a Make Current button when version is not current but user does not have upload permission', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        isCurrent: false,
                        deleted: 0,
                    }),
                    canUpload: false,
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.makeCurrent',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should not fire onMakeCurrent callback when isProcessing=true', () => {
                const wrapper = getWrapper({
                    isProcessing: true,
                    onMakeCurrent: sandbox.mock().never(),
                    version: getTestVersion(),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.makeCurrent',
                });
                const buttonWrapper = messageWrapper.parent();

                buttonWrapper.simulate('click');
            });

            test('should fire onMakeCurrent callback when isProcessing=false', () => {
                const version = getTestVersion();
                const wrapper = getWrapper({
                    isProcessing: false,
                    onMakeCurrent: sandbox.mock().withArgs(version),
                    version,
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.makeCurrent',
                });
                const buttonWrapper = messageWrapper.parent();

                buttonWrapper.simulate('click');
            });
        });

        describe('Remove button', () => {
            test('should not render a remove button when version is deleted', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        deleted: 1000,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.remove',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should not render a remove button when version is the current version', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        isCurrent: true,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.remove',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should not render a remove button when no onDelete callback is passed', () => {
                const wrapper = getWrapper({
                    version: getTestVersion(),
                    onDelete: null,
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.remove',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should not render a remove button when version is being retained', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        isRetained: true,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.remove',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should render a remove button when version is removeable', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        deleted: 0,
                    }),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.remove',
                });
                expect(messageWrapper.length).toBe(1);
            });

            test('should not render a remove button when version is removeable but user does not have delete permission', () => {
                const wrapper = getWrapper({
                    version: getTestVersion({
                        deleted: 0,
                    }),
                    canDelete: false,
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.remove',
                });
                expect(messageWrapper.length).toBe(0);
            });

            test('should not fire onDelete callback when isProcessing=true', () => {
                const wrapper = getWrapper({
                    isProcessing: true,
                    onDelete: sandbox.mock().never(),
                    version: getTestVersion(),
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.remove',
                });
                const buttonWrapper = messageWrapper.parent();

                buttonWrapper.simulate('click');
            });

            test('should fire onDelete callback when isProcessing=false', () => {
                const version = getTestVersion();
                const wrapper = getWrapper({
                    isProcessing: false,
                    onDelete: sandbox.mock().withArgs(version),
                    version,
                });

                const messageWrapper = wrapper.find({
                    id: 'boxui.versionHistoryModal.remove',
                });
                const buttonWrapper = messageWrapper.parent();

                buttonWrapper.simulate('click');
            });
        });
    });
});
