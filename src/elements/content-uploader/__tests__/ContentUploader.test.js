import * as React from 'react';
import { shallow } from 'enzyme';
import * as UploaderUtils from '../../../utils/uploads';
import Browser from '../../../utils/Browser';
import { ContentUploaderComponent, CHUNKED_UPLOAD_MIN_SIZE_BYTES } from '../ContentUploader';
import Footer from '../Footer';
import {
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
    STATUS_COMPLETE,
    STATUS_ERROR,
    VIEW_ERROR,
    VIEW_UPLOAD_EMPTY,
    VIEW_UPLOAD_IN_PROGRESS,
    VIEW_UPLOAD_SUCCESS,
} from '../../../constants';

const EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD = 5;

jest.mock('../../../utils/Browser');

describe('elements/content-uploader/ContentUploader', () => {
    const getWrapper = (props = {}) => shallow(<ContentUploaderComponent {...props} />);
    const createMockFiles = length => {
        const filesList = [];
        for (let i = 0; i < length; i += 1) {
            const file = new File(['contents'], `upload_file_${i}.txt`, {
                type: 'text/plain',
            });
            filesList.push(file);
        }

        return filesList;
    };

    const mapToUploadItems = files => {
        return files.map(file => {
            return {
                api: {},
                extension: '',
                file,
                name: file.name,
                progress: 0,
                size: 1000,
                status: STATUS_PENDING,
            };
        });
    };

    describe('onBeforeUpload()', () => {
        test('should call onBeforeUpload', () => {
            const onBeforeUpload = jest.fn();
            const wrapper = getWrapper({
                onBeforeUpload,
            });

            wrapper.instance().addFilesToUploadQueue([{ name: 'yoyo', size: 1000 }], jest.fn(), false);

            expect(onBeforeUpload).toBeCalled();
        });
    });

    describe('updateViewAndCollection()', () => {
        test('should set itemIds to be an empty when method is called with an empty array', () => {
            const onComplete = jest.fn();
            const useUploadsManager = false;
            const isResumableUploadsEnabled = false;
            const wrapper = getWrapper({
                onComplete,
                useUploadsManager,
                isResumableUploadsEnabled,
            });

            const instance = wrapper.instance();

            instance.updateViewAndCollection([], null);

            expect(wrapper.state().itemIds).toEqual({});
            expect(instance.itemIdsRef.current).toEqual({});
        });

        test.each([
            ['not', true, 'not', STATUS_PENDING, 0],
            ['', true, '', STATUS_COMPLETE, 1],
            ['', false, 'not', STATUS_STAGED, 1],
        ])(
            'should %s call onComplete when isResumableUploadsEnabled is %s and %s all items are finished',
            (a, isResumableUploadsEnabled, b, status, expected) => {
                const onComplete = jest.fn();
                const useUploadsManager = true;
                const wrapper = getWrapper({
                    onComplete,
                    useUploadsManager,
                    isResumableUploadsEnabled,
                });
                const instance = wrapper.instance();
                const items = [{ status }, { status: STATUS_COMPLETE }, { status: STATUS_ERROR }];

                instance.updateViewAndCollection(items, null);

                expect(onComplete).toHaveBeenCalledTimes(expected);
            },
        );
        test.each([
            ['not', true, 'not', STATUS_PENDING, 0],
            ['', true, '', STATUS_COMPLETE, 1],
            ['not', false, 'not', STATUS_STAGED, 0],
        ])(
            'should %s call onComplete when isPartialUploadEnabled is %s and %s all items are finished',
            (a, isPartialUploadEnabled, b, status, expected) => {
                const onComplete = jest.fn();
                const wrapper = getWrapper({
                    onComplete,
                    isPartialUploadEnabled,
                });
                const instance = wrapper.instance();
                const items = [{ status }, { status: STATUS_COMPLETE }, { status: STATUS_ERROR }];

                instance.updateViewAndCollection(items, null);

                expect(onComplete).toHaveBeenCalledTimes(expected);
            },
        );
    });

    describe('addFilesToUploadQueue()', () => {
        test('should overwrite itemIds if they already exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            const itemIds = { yoyo: false };
            wrapper.setState({ itemIds });
            instance.itemIdsRef.current = itemIds;

            wrapper.instance().addFilesToUploadQueue([{ name: 'yoyo', size: 1000 }], jest.fn(), false);

            const expected = { yoyo: true };
            expect(wrapper.state().itemIds).toMatchObject(expected);
            expect(instance.itemIdsRef.current).toMatchObject(expected);
        });

        test('should add generated itemId', () => {
            const wrapper = getWrapper({ rootFolderId: 0 });
            const instance = wrapper.instance();
            instance.itemIdsRef.current = { abcd: true };

            global.Date.now = jest.fn(() => 10000);

            instance.addFilesToUploadQueue([{ name: 'yoyo', size: 1000 }], jest.fn(), false);

            const expected = { abcd: true, yoyo: true, yoyo_0_10000: true };
            expect(wrapper.state().itemIds).toEqual(expected);
            expect(instance.itemIdsRef.current).toEqual(expected);
        });

        test('should handle accepting package "files" separate from folders', () => {
            const mockFile = { name: 'hi' };
            Browser.isSafari = jest.fn(() => true);
            const entry = {
                isDirectory: true,
                kind: 'file',
                file: fn => {
                    fn(mockFile);
                },
            };
            const wrapper = getWrapper({
                rootFolderId: 0,
                isFolderUploadEnabled: true,
                hasUploads: true,
                useUploadsManager: true,
            });

            global.Date.now = jest.fn(() => 10000);

            wrapper.setProps({
                files: [mockFile],
                dataTransferItems: [
                    {
                        kind: 'file',
                        type: 'application/zip',
                        getAsFile: jest.fn(() => mockFile),
                        webkitGetAsEntry: () => entry,
                        name: 'hi',
                    },
                ],
            });
            const expected = { hi: true, hi_0_10000: true };
            expect(wrapper.state().itemIds).toEqual(expected);
            expect(wrapper.instance().itemIdsRef.current).toEqual(expected);
        });
    });

    describe('removeFileFromUploadQueue()', () => {
        const item = {
            api: {
                cancel: jest.fn(),
            },
            status: STATUS_IN_PROGRESS,
        };
        let wrapper;
        let instance;
        beforeEach(() => {
            wrapper = getWrapper();
            wrapper.setState({
                items: [item],
            });
            instance = wrapper.instance();
            instance.itemsRef.current = [item];
        });

        test('should cancel and remove item from uploading queue', () => {
            instance.removeFileFromUploadQueue(item);

            expect(item.api.cancel).toBeCalled();
            expect(wrapper.state().items.length).toBe(0);
            expect(instance.itemsRef.current.length).toBe(0);
        });

        test('should allow re-uploading after cancellation', () => {
            const file = new File(['contents'], 'test.txt', { type: 'text/plain' });
            const uploadItem = {
                api: { cancel: jest.fn() },
                file,
                name: 'test.txt',
                status: STATUS_PENDING,
                options: { folderId: 0, uploadInitTimestamp: 12345 },
            };

            // Set up initial state with both file IDs tracked
            wrapper.setState({
                items: [uploadItem],
                itemIds: { 'test.txt': true, 'test.txt_0_12345': true },
            });
            instance.itemsRef.current = [uploadItem];
            instance.itemIdsRef.current = { 'test.txt': true, 'test.txt_0_12345': true };

            // Remove the file
            instance.removeFileFromUploadQueue(uploadItem);

            // Verify both file IDs were removed from tracking
            expect(instance.itemIdsRef.current['test.txt']).toBeUndefined();
            expect(instance.itemIdsRef.current['test.txt_0_12345']).toBeUndefined();
            expect(wrapper.state().itemIds['test.txt']).toBeUndefined();
            expect(wrapper.state().itemIds['test.txt_0_12345']).toBeUndefined();

            // Try to add the same file again
            const newFiles = instance.getNewFiles([file]);

            // Should not be filtered out since IDs were removed
            expect(newFiles.length).toBe(1);
            expect(newFiles[0]).toBe(file);
        });

        test.each`
            view                       | action
            ${VIEW_ERROR}              | ${'should not'}
            ${VIEW_UPLOAD_EMPTY}       | ${'should not'}
            ${VIEW_UPLOAD_IN_PROGRESS} | ${'should'}
            ${VIEW_UPLOAD_SUCCESS}     | ${'should not'}
        `('$action call upload if the view is $view', option => {
            wrapper.setState({
                view: option,
            });

            instance.upload = jest.fn();

            instance.removeFileFromUploadQueue(item);

            if (option === VIEW_UPLOAD_IN_PROGRESS) {
                expect(instance.upload).toBeCalled();
            } else {
                expect(instance.upload).not.toBeCalled();
            }
        });
    });

    describe('resetFile()', () => {
        test('should call getUploadAPI and updateViewAndCollection', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const item = { api: { cancel: jest.fn() }, file: { size: 10 } };
            instance.getUploadAPI = jest.fn();
            instance.updateViewAndCollection = jest.fn();

            instance.resetFile(item);
            expect(instance.getUploadAPI).toBeCalled();
            expect(instance.updateViewAndCollection).toBeCalled();
        });

        test('should reset progress, status, and existing item error', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const item = {
                api: { cancel: jest.fn() },
                file: { size: 10 },
                progress: 85,
                status: STATUS_ERROR,
                error: { name: 'testerror' },
            };

            instance.resetFile(item);
            expect(item.progress).toBe(0);
            expect(item.status).toBe(STATUS_PENDING);
            expect(item.error).toBeUndefined();
        });
    });

    describe('resumeFile()', () => {
        test('should call resume from api and call updateViewAndCollection', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const item = { api: {} };
            item.api.resume = jest.fn();
            instance.updateViewAndCollection = jest.fn();
            instance.resumeFile(item);
            expect(item.api.resume).toBeCalled();
            expect(instance.updateViewAndCollection).toBeCalled();
        });
    });

    describe('onClick()', () => {
        test('should cancel folder upload in progress', () => {
            const item = { api: {}, isFolder: true, status: STATUS_IN_PROGRESS };
            const onClickCancel = jest.fn();
            const wrapper = getWrapper({ onClickCancel });
            const instance = wrapper.instance();

            instance.removeFileFromUploadQueue = jest.fn();

            instance.onClick(item);

            expect(instance.removeFileFromUploadQueue).toBeCalledWith(item);
            expect(onClickCancel.mock.calls.length).toBe(1);
        });

        test.each([
            [
                'should set bytesUploadedOnLastResume when status is error and item is resumable',
                {
                    api: { sessionId: 123, totalUploadedBytes: 123456 },
                    status: STATUS_ERROR,
                    file: { size: CHUNKED_UPLOAD_MIN_SIZE_BYTES + 1 },
                },
                true,
                true,
            ],
            [
                'should not set bytesUploadedOnLastResume when file size <= CHUNKED_UPLOAD_MIN_SIZE_BYTES',
                {
                    api: { sessionId: 123, totalUploadedBytes: 123456 },
                    status: STATUS_ERROR,
                    file: { size: CHUNKED_UPLOAD_MIN_SIZE_BYTES },
                },
                true,
                true,
            ],
            [
                'should not set bytesUploadedOnLastResume when resumable uploads is not enabled',
                {
                    api: { sessionId: 123, totalUploadedBytes: 123456 },
                    status: STATUS_ERROR,
                    file: { size: CHUNKED_UPLOAD_MIN_SIZE_BYTES + 1 },
                },
                false,
                true,
            ],
            [
                'should not set bytesUploadedOnLastResume when not chunked upload',
                {
                    api: { sessionId: 123, totalUploadedBytes: 123456 },
                    status: STATUS_ERROR,
                    file: { size: CHUNKED_UPLOAD_MIN_SIZE_BYTES + 1 },
                },
                true,
                false,
            ],
            [
                'should not set bytesUploadedOnLastResume when item api has no session id',
                {
                    api: { sessionId: undefined, totalUploadedBytes: 123456 },
                    status: STATUS_ERROR,
                    file: { size: CHUNKED_UPLOAD_MIN_SIZE_BYTES + 1 },
                },
                true,
                true,
            ],
            [
                'should not set bytesUploadedOnLastResume when status is not error',
                {
                    api: { sessionId: 123, totalUploadedBytes: 123456 },
                    status: STATUS_COMPLETE,
                    file: { size: CHUNKED_UPLOAD_MIN_SIZE_BYTES + 1 },
                },
                true,
                true,
            ],
        ])('%o', (test, item, isResumableUploadsEnabled, chunked) => {
            jest.spyOn(UploaderUtils, 'isMultiputSupported').mockImplementation(() => true);
            const isChunkedUpload = chunked && item.file.size > CHUNKED_UPLOAD_MIN_SIZE_BYTES;
            const isResumable = isResumableUploadsEnabled && isChunkedUpload && item.api.sessionId;
            const onClickCancel = jest.fn();
            const onClickResume = jest.fn();
            const onClickRetry = jest.fn();
            const wrapper = getWrapper({
                chunked,
                isResumableUploadsEnabled,
                onClickCancel,
                onClickResume,
                onClickRetry,
            });
            const instance = wrapper.instance();
            instance.removeFileFromUploadQueue = jest.fn();
            instance.resumeFile = jest.fn();
            instance.resetFile = jest.fn();
            instance.uploadFile = jest.fn();

            instance.onClick(item);

            if (item.status === STATUS_ERROR && isResumable) {
                expect(item.bytesUploadedOnLastResume).toBe(item.api.totalUploadedBytes);
                expect(onClickResume.mock.calls.length).toBe(1);
            } else if (item.status === STATUS_ERROR) {
                expect(onClickRetry.mock.calls.length).toBe(1);
            } else {
                expect(item.bytesUploadedOnLastResume).toBe(undefined);
                expect(onClickCancel.mock.calls.length).toBe(1);
            }
        });
    });

    describe('clickAllWithStatus()', () => {
        test('should call onClick for all items', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const items = [{ status: STATUS_COMPLETE }, { status: STATUS_IN_PROGRESS }, { status: STATUS_ERROR }];
            instance.state.items = items;
            instance.itemsRef.current = items;

            instance.onClick = jest.fn();
            instance.clickAllWithStatus();
            expect(instance.onClick).toBeCalledWith(items[0]);
            expect(instance.onClick).toBeCalledWith(items[1]);
            expect(instance.onClick).toBeCalledWith(items[2]);
        });

        test('should call onClick for only items with given status', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const items = [
                { status: STATUS_COMPLETE },
                { status: STATUS_ERROR },
                { status: STATUS_IN_PROGRESS },
                { status: STATUS_ERROR },
            ];
            instance.state.items = items;
            instance.itemsRef.current = items;

            instance.onClick = jest.fn();
            instance.clickAllWithStatus(STATUS_ERROR);
            expect(instance.onClick).toBeCalledWith(items[1]);
            expect(instance.onClick).toBeCalledWith(items[3]);
        });
    });

    describe('isDone', () => {
        test('should be true if all items are complete or staged', () => {
            const wrapper = getWrapper();
            const files = createMockFiles(3);
            const items = mapToUploadItems(files).map(item => {
                return {
                    ...item,
                    status: STATUS_COMPLETE,
                };
            });
            items[2].status = STATUS_STAGED;
            wrapper.setState({
                items,
            });

            expect(wrapper.find(Footer).prop('isDone')).toEqual(true);
        });

        test('should be false if not all items are complete or staged', () => {
            const wrapper = getWrapper();
            const files = createMockFiles(3);
            const items = mapToUploadItems(files).map(item => {
                return {
                    ...item,
                    status: STATUS_COMPLETE,
                };
            });
            items[2].status = STATUS_PENDING;
            wrapper.setState({
                items,
            });

            expect(wrapper.find(Footer).prop('isDone')).toEqual(false);
        });
    });

    describe('getUploadAPI()', () => {
        let wrapper;
        let instance;
        let getPlainUploadAPI;
        let getChunkedUploadAPI;

        const file = {
            size: CHUNKED_UPLOAD_MIN_SIZE_BYTES + 1,
        };

        beforeEach(() => {
            jest.spyOn(global.console, 'warn').mockImplementation();
            wrapper = getWrapper({ isResumableUploadsEnabled: false });
            instance = wrapper.instance();
            getPlainUploadAPI = jest.fn();
            getChunkedUploadAPI = jest.fn();
            instance.createAPIFactory = jest.fn().mockReturnValue({
                getPlainUploadAPI,
                getChunkedUploadAPI,
            });
        });

        afterEach(() => {
            global.console.warn.mockRestore();
            UploaderUtils.isMultiputSupported.mockRestore();
        });

        test('should use the chunked upload api', () => {
            jest.spyOn(UploaderUtils, 'isMultiputSupported').mockImplementation(() => true);
            instance.getUploadAPI(file);
            expect(instance.createAPIFactory).toBeCalled();
            expect(getChunkedUploadAPI).toBeCalled();
        });

        test('should use the regular upload api if the file <= CHUNKED_UPLOAD_MIN_SIZE_BYTES', () => {
            jest.spyOn(UploaderUtils, 'isMultiputSupported').mockImplementation(() => true);
            instance.getUploadAPI({
                ...file,
                size: CHUNKED_UPLOAD_MIN_SIZE_BYTES,
            });
            expect(getPlainUploadAPI).toBeCalled();
        });

        test('should use the regular upload api if multiput not supported', () => {
            jest.spyOn(UploaderUtils, 'isMultiputSupported').mockImplementation(() => false);
            instance.getUploadAPI({
                ...file,
                size: CHUNKED_UPLOAD_MIN_SIZE_BYTES,
            });
            expect(getPlainUploadAPI).toBeCalled();
        });

        test('should use the regular upload api if chunked is false', () => {
            wrapper.setProps({
                chunked: false,
            });
            jest.spyOn(UploaderUtils, 'isMultiputSupported').mockImplementation(() => true);
            instance.getUploadAPI(file);
            expect(getPlainUploadAPI).toBeCalled();
        });
    });

    describe('Expand and collapse when more than EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD files uploaded', () => {
        let wrapper;
        let instance;
        let getPlainUploadAPI;
        let getChunkedUploadAPI;

        const expectAutoExpandStateToBe = expectation => {
            expect(instance.isAutoExpanded).toBe(expectation);
            expect(wrapper.state().isUploadsManagerExpanded).toBe(expectation);
        };

        beforeEach(() => {
            wrapper = getWrapper({
                useUploadsManager: true,
            });
            instance = wrapper.instance();

            // Stub out upload so actual upload doesn't happen
            const mockAPI = {
                upload: () => {},
            };
            getPlainUploadAPI = () => mockAPI;
            getChunkedUploadAPI = () => mockAPI;
            instance.createAPIFactory = jest.fn().mockReturnValue({
                getPlainUploadAPI,
                getChunkedUploadAPI,
            });
        });

        test('expand manager on upload when more than EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD files', () => {
            const files = createMockFiles(EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD + 1);
            wrapper.setProps({
                files,
            });

            expectAutoExpandStateToBe(true);
        });

        test('do not expand manager on upload when less than than EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD files', () => {
            const files = createMockFiles(EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD - 1);
            wrapper.setProps({
                files,
            });

            expectAutoExpandStateToBe(false);
        });

        test('expand manager on upload when two uploads totaling more than EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD files', () => {
            const files = createMockFiles(EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD + 1);
            wrapper.setProps({
                files: files.slice(0, 3),
            });

            expectAutoExpandStateToBe(false);

            wrapper.setProps({
                files: files.slice(3),
            });

            expectAutoExpandStateToBe(true);
        });

        test('close upload manager when uploads are done', () => {
            const files = createMockFiles(EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD + 1);

            const items = mapToUploadItems(files).map(item => {
                return {
                    ...item,
                    api: { upload: () => {} },
                };
            });
            wrapper.setState({
                items,
                isUploadsManagerExpanded: true,
            });

            instance.itemsRef.current = items;

            instance.isAutoExpanded = true;

            instance.handleUploadSuccess(items[0]);

            // Verify expanded is true after one file upload succeeds
            expectAutoExpandStateToBe(true);

            items.slice(1).forEach(item => instance.handleUploadSuccess(item));

            expect(wrapper.state().view).toBe(VIEW_UPLOAD_SUCCESS);
            expectAutoExpandStateToBe(false);
        });
    });

    describe('componentDidMount()', () => {
        test('adds files to upload queue if isPrepopulateFilesEnabled is true and files are provided', () => {
            const files = createMockFiles(3);

            // Simulate props change where isPrepopulateFilesEnabled is false
            const wrapper = getWrapper({
                isPrepopulateFilesEnabled: true,
                files,
            });
            const instance = wrapper.instance();
            instance.addFilesToUploadQueue = jest.fn();

            instance.componentDidMount();
            // Assert that addFilesToUploadQueue is called
            expect(instance.addFilesToUploadQueue).toBeCalled();
        });

        test('does not add files to upload queue if isPrepopulateFilesEnabled is false', () => {
            const files = createMockFiles(3);

            // Simulate props change where isPrepopulateFilesEnabled is false
            const wrapper = getWrapper({
                isPrepopulateFilesEnabled: false,
                files,
            });
            const instance = wrapper.instance();
            instance.addFilesToUploadQueue = jest.fn();

            instance.componentDidMount();
            // Assert that addFilesToUploadQueue is not called when isPrepopulateFilesEnabled is false
            expect(instance.addFilesToUploadQueue).not.toHaveBeenCalled();
        });

        test('does not add files to upload queue if isPrepopulateFilesEnabled is true but files are not present', () => {
            const files = [];

            // Simulate props change where isPrepopulateFilesEnabled is false
            const wrapper = getWrapper({
                isPrepopulateFilesEnabled: true,
                files,
            });
            const instance = wrapper.instance();
            instance.addFilesToUploadQueue = jest.fn();

            instance.componentDidMount();
            // Assert that addFilesToUploadQueue is not called when isPrepopulateFilesEnabled is false
            expect(instance.addFilesToUploadQueue).not.toHaveBeenCalled();
        });
    });

    describe('addFileDataTransferItemsToUploadQueue()', () => {
        test('should pass multiple files to the upload queue', async () => {
            jest.spyOn(UploaderUtils, 'getFileFromDataTransferItem').mockResolvedValue(() => 'file');

            const itemsLength = 3;
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.addFilesToUploadQueue = jest.fn();

            const files = createMockFiles(itemsLength);
            await instance.addFileDataTransferItemsToUploadQueue(files, jest.fn());
            expect(instance.addFilesToUploadQueue).toBeCalledTimes(1);
            expect(instance.addFilesToUploadQueue.mock.calls[0][0].length).toBe(itemsLength);
        });
    });

    describe('addPackageDataTransferItemsToUploadQueue()', () => {
        test('should pass multiple packages to the upload queue', async () => {
            jest.spyOn(UploaderUtils, 'getPackageFileFromDataTransferItem').mockResolvedValue(() => 'package');

            const itemsLength = 3;
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.addFilesToUploadQueue = jest.fn();

            const files = createMockFiles(itemsLength);
            await instance.addPackageDataTransferItemsToUploadQueue(files, jest.fn());
            expect(instance.addFilesToUploadQueue).toBeCalledTimes(1);
            expect(instance.addFilesToUploadQueue.mock.calls[0][0].length).toBe(itemsLength);
        });
    });

    describe('addFolderDataTransferItemsToUploadQueue()', () => {
        test('should pass multiple folders to the upload queue', async () => {
            jest.spyOn(UploaderUtils, 'getDataTransferItemId').mockResolvedValue(() => 'folder123');
            jest.spyOn(UploaderUtils, 'getDataTransferItemAPIOptions').mockResolvedValue(() => {});

            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const mockFoldersList = ['folder1', 'folder2'];
            const mockFolderUpload = { folder: { name: 'mockFolder' } };
            mockFolderUpload.buildFolderTreeFromDataTransferItem = jest.fn();

            instance.addToQueue = jest.fn();
            instance.getFolderUploadAPI = jest.fn().mockReturnValue(mockFolderUpload);
            instance.getNewDataTransferItems = jest.fn().mockReturnValue(mockFoldersList);

            await instance.addFolderDataTransferItemsToUploadQueue(mockFoldersList, jest.fn());
            expect(instance.addToQueue).toBeCalledTimes(1);
            expect(instance.addToQueue.mock.calls[0][0].length).toBe(mockFoldersList.length);
        });
    });
});
