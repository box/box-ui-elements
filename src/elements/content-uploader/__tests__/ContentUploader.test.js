import * as React from 'react';
import { shallow } from 'enzyme';
import { UploadsManager as UploadsManagerBP } from '@box/uploads-manager';
import * as UploaderUtils from '../../../utils/uploads';
import Browser from '../../../utils/Browser';
import { ContentUploaderComponent, CHUNKED_UPLOAD_MIN_SIZE_BYTES } from '../ContentUploader';
import Footer from '../Footer';
import UploadsManager from '../UploadsManager';
import DroppableContent from '../DroppableContent';
import {
    ERROR_CODE_ITEM_NAME_IN_USE,
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
    STATUS_COMPLETE,
    STATUS_ERROR,
    STATUS_CANCELED,
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

        test('should clear dedupeKey from itemIds when canceling a folder item', () => {
            const folderItem = {
                api: { cancel: jest.fn() },
                dedupeKey: 'shared',
                isFolder: true,
                name: 'shared',
                status: STATUS_PENDING,
            };

            wrapper.setState({
                items: [folderItem],
                itemIds: { shared: true },
            });
            instance.itemsRef.current = [folderItem];
            instance.itemIdsRef.current = { shared: true };

            instance.removeFileFromUploadQueue(folderItem);

            expect(instance.itemIdsRef.current.shared).toBeUndefined();
            expect(wrapper.state().itemIds.shared).toBeUndefined();
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

    describe('controlled isExpanded / onToggle', () => {
        test('uses isExpanded prop value when in controlled mode', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true, isExpanded: true, onToggle: jest.fn() });
            expect(wrapper.find(UploadsManagerBP).prop('isExpanded')).toBe(true);

            wrapper.setProps({ isExpanded: false });
            expect(wrapper.find(UploadsManagerBP).prop('isExpanded')).toBe(false);
        });

        test('falls back to internal state when isExpanded prop is not provided', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });
            expect(wrapper.find(UploadsManagerBP).prop('isExpanded')).toBe(false);

            wrapper.setState({ isUploadsManagerExpanded: true });
            expect(wrapper.find(UploadsManagerBP).prop('isExpanded')).toBe(true);
        });

        test('toggleUploadsManager calls onToggle with next value in controlled mode and does not mutate internal state', () => {
            const onToggle = jest.fn();
            const wrapper = getWrapper({
                enableModernizedUploads: true,
                useUploadsManager: true,
                isExpanded: false,
                onToggle,
            });

            wrapper.instance().toggleUploadsManager();

            expect(onToggle).toHaveBeenCalledTimes(1);
            expect(onToggle).toHaveBeenCalledWith(true);
            expect(wrapper.state().isUploadsManagerExpanded).toBe(false);
        });

        test('toggleUploadsManager flips internal state in uncontrolled mode and fires onToggle', () => {
            const onToggle = jest.fn();
            const wrapper = getWrapper({ useUploadsManager: true, onToggle });

            wrapper.instance().toggleUploadsManager();

            expect(wrapper.state().isUploadsManagerExpanded).toBe(true);
            expect(onToggle).toHaveBeenCalledTimes(1);
            expect(onToggle).toHaveBeenCalledWith(true);
        });

        test('toggleUploadsManager does not require onToggle in uncontrolled mode', () => {
            const wrapper = getWrapper({ useUploadsManager: true });

            expect(() => wrapper.instance().toggleUploadsManager()).not.toThrow();
            expect(wrapper.state().isUploadsManagerExpanded).toBe(true);
        });

        test('auto-expand on file-count threshold does not mutate state in controlled mode', () => {
            const onToggle = jest.fn();
            const wrapper = getWrapper({
                useUploadsManager: true,
                isExpanded: false,
                onToggle,
            });
            const instance = wrapper.instance();
            const mockAPI = { upload: () => {} };
            instance.createAPIFactory = jest.fn().mockReturnValue({
                getPlainUploadAPI: () => mockAPI,
                getChunkedUploadAPI: () => mockAPI,
            });

            const files = createMockFiles(EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD + 1);
            wrapper.setProps({ files });

            expect(wrapper.state().isUploadsManagerExpanded).toBe(false);
            // Auto-expand must not leak into the persisted preference via onToggle.
            expect(onToggle).not.toHaveBeenCalled();
        });

        test('controlled-mode collapse runs minimizeUploadsManager side effects (onMinimize, cleanup timer, isAutoExpanded reset)', () => {
            jest.useFakeTimers();
            const onToggle = jest.fn();
            const onMinimize = jest.fn();
            const wrapper = getWrapper({
                enableModernizedUploads: true,
                useUploadsManager: true,
                isExpanded: true,
                onToggle,
                onMinimize,
            });
            const instance = wrapper.instance();
            instance.isAutoExpanded = true;
            instance.checkClearUploadItems = jest.fn();

            instance.toggleUploadsManager();

            expect(onToggle).toHaveBeenCalledWith(false);
            expect(onMinimize).toHaveBeenCalledTimes(1);
            expect(instance.isAutoExpanded).toBe(false);
            expect(instance.checkClearUploadItems).toHaveBeenCalledTimes(1);
            // Internal state still owned by consumer — untouched.
            expect(wrapper.state().isUploadsManagerExpanded).toBe(false);
            jest.useRealTimers();
        });

        test('auto-collapse via resetUploadManagerExpandState is a no-op in controlled mode', () => {
            const onToggle = jest.fn();
            const wrapper = getWrapper({
                useUploadsManager: true,
                isExpanded: true,
                onToggle,
            });
            const instance = wrapper.instance();
            instance.isAutoExpanded = true;

            instance.resetUploadManagerExpandState();

            expect(instance.isAutoExpanded).toBe(false);
            expect(wrapper.state().isUploadsManagerExpanded).toBe(false); // initial default
            expect(onToggle).not.toHaveBeenCalled();
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

        test('should stash dedupeKey on each folder item so it can be cleared on cancel', async () => {
            jest.spyOn(UploaderUtils, 'getDataTransferItemId').mockImplementation(item => `key-${item}`);
            jest.spyOn(UploaderUtils, 'getDataTransferItemAPIOptions').mockReturnValue({});

            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const mockFoldersList = ['folder1', 'folder2'];
            const mockFolderUpload = { folder: { name: 'mockFolder' } };
            mockFolderUpload.buildFolderTreeFromDataTransferItem = jest.fn();

            instance.addToQueue = jest.fn();
            instance.getFolderUploadAPI = jest.fn().mockReturnValue(mockFolderUpload);
            instance.getNewDataTransferItems = jest.fn().mockReturnValue(mockFoldersList);

            await instance.addFolderDataTransferItemsToUploadQueue(mockFoldersList, jest.fn());

            const queuedItems = instance.addToQueue.mock.calls[0][0];
            expect(queuedItems[0].dedupeKey).toBe('key-folder1');
            expect(queuedItems[1].dedupeKey).toBe('key-folder2');
            expect(instance.itemIdsRef.current['key-folder1']).toBe(true);
            expect(instance.itemIdsRef.current['key-folder2']).toBe(true);
        });
    });

    describe('render()', () => {
        describe('enableModernizedUploads', () => {
            test('should render legacy UploadsManager when enableModernizedUploads is false and useUploadsManager is true', () => {
                const wrapper = getWrapper({ enableModernizedUploads: false, useUploadsManager: true });
                expect(wrapper.find(UploadsManager)).toHaveLength(1);
                expect(wrapper.find(UploadsManagerBP)).toHaveLength(0);
                expect(wrapper.find(DroppableContent)).toHaveLength(0);
            });

            test('should render DroppableContent when enableModernizedUploads is false and useUploadsManager is false', () => {
                const wrapper = getWrapper({ enableModernizedUploads: false, useUploadsManager: false });
                expect(wrapper.find(DroppableContent)).toHaveLength(1);
                expect(wrapper.find(UploadsManager)).toHaveLength(0);
                expect(wrapper.find(UploadsManagerBP)).toHaveLength(0);
            });

            test('should render modernized UploadsManagerBP when enableModernizedUploads is true', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true });
                expect(wrapper.find(UploadsManagerBP)).toHaveLength(1);
                expect(wrapper.find(UploadsManager)).toHaveLength(0);
                expect(wrapper.find(DroppableContent)).toHaveLength(0);
            });

            test('should render modernized UploadsManagerBP even when useUploadsManager is true', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true, useUploadsManager: true });
                expect(wrapper.find(UploadsManagerBP)).toHaveLength(1);
                expect(wrapper.find(UploadsManager)).toHaveLength(0);
            });

            test('should map state.items to modernized item shape', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true });
                wrapper.setState({
                    items: [
                        {
                            name: 'foo.pdf',
                            extension: 'pdf',
                            progress: 42,
                            status: STATUS_IN_PROGRESS,
                            file: { name: 'foo.pdf' },
                        },
                    ],
                });
                const items = wrapper.find(UploadsManagerBP).prop('items');
                expect(items).toHaveLength(1);
                expect(items[0]).toMatchObject({
                    name: 'foo.pdf',
                    extension: 'pdf',
                    progress: 42,
                    status: 'uploading',
                });
            });

            test('should pass isExpanded from state', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true });
                wrapper.setState({ isUploadsManagerExpanded: true });
                expect(wrapper.find(UploadsManagerBP).prop('isExpanded')).toBe(true);
            });

            test('should mark in-progress item as canceled when onItemCancel is invoked', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true });
                const cancelMock = jest.fn();
                const item = {
                    name: 'foo.pdf',
                    extension: 'pdf',
                    progress: 50,
                    status: STATUS_IN_PROGRESS,
                    file: { name: 'foo.pdf' },
                    api: { cancel: cancelMock },
                };
                wrapper.setState({ items: [item] });
                const instance = wrapper.instance();
                instance.itemsRef.current = [item];

                wrapper.find(UploadsManagerBP).prop('onItemCancel')('foo.pdf');

                expect(cancelMock).toHaveBeenCalled();
                expect(item.status).toBe(STATUS_CANCELED);
            });

            test('should ignore onItemCancel for already-completed items', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true });
                const cancelMock = jest.fn();
                const item = {
                    name: 'foo.pdf',
                    extension: 'pdf',
                    progress: 100,
                    status: STATUS_COMPLETE,
                    file: { name: 'foo.pdf' },
                    api: { cancel: cancelMock },
                };
                wrapper.setState({ items: [item] });
                const instance = wrapper.instance();
                instance.itemsRef.current = [item];

                wrapper.find(UploadsManagerBP).prop('onItemCancel')('foo.pdf');

                expect(cancelMock).not.toHaveBeenCalled();
                expect(item.status).toBe(STATUS_COMPLETE);
            });

            test('should call removeFileFromUploadQueue when onItemRemove is invoked', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true });
                const item = {
                    name: 'foo.pdf',
                    extension: 'pdf',
                    progress: 0,
                    status: STATUS_COMPLETE,
                    file: { name: 'foo.pdf' },
                };
                wrapper.setState({ items: [item] });
                const instance = wrapper.instance();
                const removeSpy = jest.spyOn(instance, 'removeFileFromUploadQueue').mockImplementation(() => {});

                wrapper.find(UploadsManagerBP).prop('onItemRemove')('foo.pdf');

                expect(removeSpy).toHaveBeenCalledWith(item);
            });

            test('should no-op when modernized id does not match any item', () => {
                const onClickCancel = jest.fn();
                const wrapper = getWrapper({ enableModernizedUploads: true, onClickCancel });
                const item = {
                    name: 'foo.pdf',
                    extension: 'pdf',
                    progress: 50,
                    status: STATUS_IN_PROGRESS,
                    file: { name: 'foo.pdf' },
                    api: { cancel: jest.fn() },
                };
                wrapper.setState({ items: [item] });
                const instance = wrapper.instance();
                instance.itemsRef.current = [item];
                const markSpy = jest.spyOn(instance, 'markItemCanceled');

                wrapper.find(UploadsManagerBP).prop('onItemCancel')('missing-id');

                expect(markSpy).not.toHaveBeenCalled();
                expect(item.api.cancel).not.toHaveBeenCalled();
                expect(onClickCancel).not.toHaveBeenCalled();
                expect(item.status).toBe(STATUS_IN_PROGRESS);
            });

            test('should not crash when state contains a folder item without a file', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true, rootFolderId: '0' });
                const folderItem = {
                    name: 'my-folder',
                    extension: '',
                    progress: 0,
                    status: STATUS_PENDING,
                    isFolder: true,
                    api: {},
                };
                wrapper.setState({ items: [folderItem] });

                expect(() => wrapper.find(UploadsManagerBP).prop('items')).not.toThrow();
                const items = wrapper.find(UploadsManagerBP).prop('items');
                expect(items).toHaveLength(1);
                expect(items[0]).toMatchObject({ name: 'my-folder', isFolder: true });
            });

            test('should resolve folder item handler via modernized id', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true, rootFolderId: '0' });
                const folderItem = {
                    name: 'my-folder',
                    extension: '',
                    progress: 0,
                    status: STATUS_PENDING,
                    isFolder: true,
                    api: { cancel: jest.fn() },
                };
                wrapper.setState({ items: [folderItem] });
                const instance = wrapper.instance();
                instance.itemsRef.current = [folderItem];

                const folderId = wrapper.find(UploadsManagerBP).prop('items')[0].id;
                wrapper.find(UploadsManagerBP).prop('onItemCancel')(folderId);

                expect(folderItem.status).toBe(STATUS_CANCELED);
            });

            test('onCancelAll should open the confirmation modal instead of canceling directly', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true });
                const inProgress = {
                    name: 'a.pdf',
                    extension: 'pdf',
                    progress: 25,
                    status: STATUS_IN_PROGRESS,
                    file: { name: 'a.pdf' },
                    api: { cancel: jest.fn() },
                };
                wrapper.setState({ items: [inProgress] });
                const instance = wrapper.instance();
                instance.itemsRef.current = [inProgress];

                wrapper.find(UploadsManagerBP).prop('onCancelAll')();

                expect(wrapper.state('isCancelAllModalOpen')).toBe(true);
                expect(inProgress.status).toBe(STATUS_IN_PROGRESS);
                expect(inProgress.api.cancel).not.toHaveBeenCalled();
            });

            test('handleCancelAllConfirm should cancel all in-progress and pending items and close modal', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true });
                const inProgress = {
                    name: 'a.pdf',
                    extension: 'pdf',
                    progress: 25,
                    status: STATUS_IN_PROGRESS,
                    file: { name: 'a.pdf' },
                    api: { cancel: jest.fn() },
                };
                const pending = {
                    name: 'b.pdf',
                    extension: 'pdf',
                    progress: 0,
                    status: STATUS_PENDING,
                    file: { name: 'b.pdf' },
                    api: { cancel: jest.fn() },
                };
                const complete = {
                    name: 'c.pdf',
                    extension: 'pdf',
                    progress: 100,
                    status: STATUS_COMPLETE,
                    file: { name: 'c.pdf' },
                    api: { cancel: jest.fn() },
                };
                wrapper.setState({ items: [inProgress, pending, complete], isCancelAllModalOpen: true });
                const instance = wrapper.instance();
                instance.itemsRef.current = [inProgress, pending, complete];

                instance.handleCancelAllConfirm();

                expect(wrapper.state('isCancelAllModalOpen')).toBe(false);
                expect(inProgress.status).toBe(STATUS_CANCELED);
                expect(pending.status).toBe(STATUS_CANCELED);
                expect(complete.status).toBe(STATUS_COMPLETE);
                expect(inProgress.api.cancel).toHaveBeenCalled();
                expect(pending.api.cancel).toHaveBeenCalled();
                expect(complete.api.cancel).not.toHaveBeenCalled();
            });

            test('handleCancelAllDismiss should close the modal without canceling uploads', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true });
                const inProgress = {
                    name: 'a.pdf',
                    status: STATUS_IN_PROGRESS,
                    file: { name: 'a.pdf' },
                    api: { cancel: jest.fn() },
                };
                wrapper.setState({ items: [inProgress], isCancelAllModalOpen: true });
                const instance = wrapper.instance();
                instance.itemsRef.current = [inProgress];

                instance.handleCancelAllDismiss();

                expect(wrapper.state('isCancelAllModalOpen')).toBe(false);
                expect(inProgress.status).toBe(STATUS_IN_PROGRESS);
                expect(inProgress.api.cancel).not.toHaveBeenCalled();
            });

            describe('updateViewAndCollection with canceled items', () => {
                let onComplete;
                let wrapper;
                let instance;

                beforeEach(() => {
                    onComplete = jest.fn();
                    wrapper = getWrapper({
                        enableModernizedUploads: true,
                        useUploadsManager: true,
                        onComplete,
                    });
                    instance = wrapper.instance();
                });

                test('should not fire onComplete when all items are canceled (modernized)', () => {
                    instance.updateViewAndCollection([
                        { status: STATUS_CANCELED, file: { name: 'a' } },
                        { status: STATUS_CANCELED, file: { name: 'b' } },
                    ]);
                    expect(onComplete).not.toHaveBeenCalled();
                });

                test('should fire onComplete when at least one item completes (modernized)', () => {
                    instance.updateViewAndCollection([
                        { status: STATUS_COMPLETE, file: { name: 'a' } },
                        { status: STATUS_CANCELED, file: { name: 'b' } },
                    ]);
                    expect(onComplete).toHaveBeenCalled();
                });

                test('should treat canceled items as terminal and resolve to VIEW_UPLOAD_SUCCESS (modernized)', () => {
                    instance.updateViewAndCollection([
                        { status: STATUS_COMPLETE, file: { name: 'a' } },
                        { status: STATUS_CANCELED, file: { name: 'b' } },
                    ]);
                    expect(wrapper.state('view')).toBe(VIEW_UPLOAD_SUCCESS);
                });

                test('should not fire onComplete on the partial-upload path when all items are canceled (modernized, no manager)', () => {
                    onComplete = jest.fn();
                    wrapper = getWrapper({
                        enableModernizedUploads: true,
                        isPartialUploadEnabled: true,
                        useUploadsManager: false,
                        onComplete,
                    });
                    wrapper.instance().updateViewAndCollection([
                        { status: STATUS_CANCELED, file: { name: 'a' } },
                        { status: STATUS_CANCELED, file: { name: 'b' } },
                    ]);
                    expect(onComplete).not.toHaveBeenCalled();
                });

                test('should preserve legacy behavior when modernized flag is off', () => {
                    onComplete = jest.fn();
                    wrapper = getWrapper({
                        enableModernizedUploads: false,
                        useUploadsManager: true,
                        onComplete,
                    });
                    wrapper.instance().updateViewAndCollection([{ status: STATUS_COMPLETE, file: { name: 'a' } }]);
                    expect(onComplete).toHaveBeenCalled();
                });
            });

            test('handleUploadsManagerRetryAll should restart errored and canceled items', () => {
                const onClickRetry = jest.fn();
                const wrapper = getWrapper({ enableModernizedUploads: true, onClickRetry });
                const errored = {
                    name: 'a.pdf',
                    extension: 'pdf',
                    progress: 0,
                    status: STATUS_ERROR,
                    file: { name: 'a.pdf', size: 100 },
                    api: {},
                    isFolder: false,
                };
                const canceled = {
                    name: 'b.pdf',
                    extension: 'pdf',
                    progress: 0,
                    status: STATUS_CANCELED,
                    file: { name: 'b.pdf', size: 100 },
                    api: {},
                    isFolder: false,
                };
                const complete = {
                    name: 'c.pdf',
                    extension: 'pdf',
                    progress: 100,
                    status: STATUS_COMPLETE,
                    file: { name: 'c.pdf', size: 100 },
                    api: {},
                };
                wrapper.setState({ items: [errored, canceled, complete] });
                const instance = wrapper.instance();
                instance.itemsRef.current = [errored, canceled, complete];
                const resetSpy = jest.spyOn(instance, 'resetFile').mockImplementation(() => {});
                const uploadFileSpy = jest.spyOn(instance, 'uploadFile').mockImplementation(() => {});

                wrapper.find(UploadsManagerBP).prop('onRetryAll')();

                expect(resetSpy).toHaveBeenCalledTimes(2);
                expect(uploadFileSpy).toHaveBeenCalledTimes(2);
                expect(onClickRetry).toHaveBeenCalledTimes(2);
                expect(onClickRetry).toHaveBeenCalledWith(errored);
                expect(onClickRetry).toHaveBeenCalledWith(canceled);
            });

            test('handleUploadsManagerRetryAll should call onClickResume for resumable chunked items', () => {
                const onClickResume = jest.fn();
                const wrapper = getWrapper({
                    enableModernizedUploads: true,
                    chunked: true,
                    isResumableUploadsEnabled: true,
                    onClickResume,
                });
                const resumable = {
                    name: 'big.bin',
                    extension: 'bin',
                    progress: 25,
                    status: STATUS_ERROR,
                    file: { name: 'big.bin', size: CHUNKED_UPLOAD_MIN_SIZE_BYTES + 1 },
                    api: { sessionId: 'sess-1', totalUploadedBytes: 1024 },
                    isFolder: false,
                };
                wrapper.setState({ items: [resumable] });
                const instance = wrapper.instance();
                instance.itemsRef.current = [resumable];
                jest.spyOn(UploaderUtils, 'isMultiputSupported').mockReturnValue(true);
                const resumeSpy = jest.spyOn(instance, 'resumeFile').mockImplementation(() => {});

                wrapper.find(UploadsManagerBP).prop('onRetryAll')();

                expect(resumeSpy).toHaveBeenCalledWith(resumable);
                expect(onClickResume).toHaveBeenCalledWith(resumable);
                expect(resumable.bytesUploadedOnLastResume).toBe(1024);
            });

            test('handleUploadsManagerRetryAll should drop name-in-use items instead of retrying', () => {
                const onClickCancel = jest.fn();
                const onCancel = jest.fn();
                const wrapper = getWrapper({ enableModernizedUploads: true, onClickCancel, onCancel });
                const conflict = {
                    name: 'dup.pdf',
                    extension: 'pdf',
                    progress: 0,
                    status: STATUS_ERROR,
                    error: { code: ERROR_CODE_ITEM_NAME_IN_USE },
                    file: { name: 'dup.pdf', size: 100 },
                    api: { cancel: jest.fn() },
                    isFolder: false,
                };
                const ok = {
                    name: 'ok.pdf',
                    extension: 'pdf',
                    progress: 0,
                    status: STATUS_ERROR,
                    file: { name: 'ok.pdf', size: 100 },
                    api: {},
                    isFolder: false,
                };
                wrapper.setState({ items: [conflict, ok] });
                const instance = wrapper.instance();
                instance.itemsRef.current = [conflict, ok];
                const resetSpy = jest.spyOn(instance, 'resetFile').mockImplementation(() => {});
                const uploadFileSpy = jest.spyOn(instance, 'uploadFile').mockImplementation(() => {});

                wrapper.find(UploadsManagerBP).prop('onRetryAll')();

                expect(onClickCancel).toHaveBeenCalledWith(conflict);
                expect(conflict.api.cancel).toHaveBeenCalled();
                expect(instance.itemsRef.current).not.toContain(conflict);
                expect(resetSpy).toHaveBeenCalledTimes(1);
                expect(resetSpy).toHaveBeenCalledWith(ok);
                expect(uploadFileSpy).toHaveBeenCalledWith(ok);
            });

            test('handleUploadsManagerItemRetry should fire onClickRetry for non-resumable items', () => {
                const onClickRetry = jest.fn();
                const wrapper = getWrapper({ enableModernizedUploads: true, onClickRetry });
                const item = {
                    name: 'a.pdf',
                    extension: 'pdf',
                    progress: 0,
                    status: STATUS_ERROR,
                    file: { name: 'a.pdf', size: 100 },
                    api: {},
                    isFolder: false,
                };
                wrapper.setState({ items: [item] });
                const instance = wrapper.instance();
                instance.itemsRef.current = [item];
                const resetSpy = jest.spyOn(instance, 'resetFile').mockImplementation(() => {});
                const uploadFileSpy = jest.spyOn(instance, 'uploadFile').mockImplementation(() => {});

                const { id } = wrapper.find(UploadsManagerBP).prop('items')[0];
                wrapper.find(UploadsManagerBP).prop('onItemRetry')(id);

                expect(resetSpy).toHaveBeenCalledWith(item);
                expect(uploadFileSpy).toHaveBeenCalledWith(item);
                expect(onClickRetry).toHaveBeenCalledWith(item);
            });

            test('handleUploadsManagerItemRetry should drop name-in-use items instead of retrying', () => {
                const onClickCancel = jest.fn();
                const wrapper = getWrapper({ enableModernizedUploads: true, onClickCancel });
                const item = {
                    name: 'dup.pdf',
                    extension: 'pdf',
                    progress: 0,
                    status: STATUS_ERROR,
                    error: { code: ERROR_CODE_ITEM_NAME_IN_USE },
                    file: { name: 'dup.pdf', size: 100 },
                    api: { cancel: jest.fn() },
                    isFolder: false,
                };
                wrapper.setState({ items: [item] });
                const instance = wrapper.instance();
                instance.itemsRef.current = [item];
                const resetSpy = jest.spyOn(instance, 'resetFile').mockImplementation(() => {});
                const uploadFileSpy = jest.spyOn(instance, 'uploadFile').mockImplementation(() => {});

                const { id } = wrapper.find(UploadsManagerBP).prop('items')[0];
                wrapper.find(UploadsManagerBP).prop('onItemRetry')(id);

                expect(onClickCancel).toHaveBeenCalledWith(item);
                expect(item.api.cancel).toHaveBeenCalled();
                expect(instance.itemsRef.current).not.toContain(item);
                expect(resetSpy).not.toHaveBeenCalled();
                expect(uploadFileSpy).not.toHaveBeenCalled();
            });
        });
    });
});
