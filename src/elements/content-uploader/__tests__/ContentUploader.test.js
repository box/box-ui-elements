import * as React from 'react';
import { shallow } from 'enzyme';
import { UploadsManager as UploadsManagerBP } from '@box/uploads-manager';
import * as UploaderUtils from '../../../utils/uploads';
import Browser from '../../../utils/Browser';
import { fireEvent, render, screen } from '../../../test-utils/testing-library';
import { ContentUploaderComponent, CHUNKED_UPLOAD_MIN_SIZE_BYTES } from '../ContentUploader';
import Footer from '../Footer';
import UploadsManager from '../UploadsManager';
import DroppableContent from '../DroppableContent';
import ModernizedUploadsManagerDropZone from '../ModernizedUploadsManagerDropZone';
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

        test('should add rootFolderId to raw file upload options for the modernized uploads manager', () => {
            const wrapper = getWrapper({
                enableModernizedUploads: true,
                rootFolderId: '12345',
                useUploadsManager: true,
            });

            wrapper.instance().addFilesToUploadQueue([{ name: 'yoyo', size: 1000 }], jest.fn(), false);

            expect(wrapper.state().items[0].options.folderId).toBe('12345');
        });

        test('should not add rootFolderId to raw file upload options outside the modernized uploads manager', () => {
            const wrapper = getWrapper({ rootFolderId: '12345' });

            wrapper.instance().addFilesToUploadQueue([{ name: 'yoyo', size: 1000 }], jest.fn(), false);

            expect(wrapper.state().items[0].options.folderId).toBeUndefined();
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

    describe('uploads manager display order (newest on top)', () => {
        const orderedItems = [
            { name: 'first.txt', status: STATUS_COMPLETE },
            { name: 'second.txt', status: STATUS_IN_PROGRESS },
            { name: 'third.txt', status: STATUS_PENDING },
        ];

        test('modernized manager renders the most recently added item on top', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true, useUploadsManager: true });
            wrapper.setState({ items: orderedItems });

            const renderedNames = wrapper
                .find(UploadsManagerBP)
                .prop('items')
                .map(item => item.name);

            expect(renderedNames).toEqual(['third.txt', 'second.txt', 'first.txt']);
        });

        test('legacy manager preserves the original upload order', () => {
            const wrapper = getWrapper({ useUploadsManager: true });
            wrapper.setState({ items: orderedItems });

            const renderedNames = wrapper
                .find(UploadsManager)
                .prop('items')
                .map(item => item.name);

            expect(renderedNames).toEqual(['first.txt', 'second.txt', 'third.txt']);
        });

        test('display reversal does not mutate the internal items collection (upload order preserved)', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true, useUploadsManager: true });
            wrapper.setState({ items: orderedItems });

            wrapper.find(UploadsManagerBP);

            expect(wrapper.state().items.map(item => item.name)).toEqual(['first.txt', 'second.txt', 'third.txt']);
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

    describe('ModernizedUploadsManagerDropZone', () => {
        const renderModernizedUploadsManagerDropZone = props =>
            render(
                <ModernizedUploadsManagerDropZone
                    addDataTransferItemsToUploadQueue={jest.fn()}
                    allowedTypes={['Files']}
                    className="bcu-modernized-panel"
                    data-testid="bcu-modernized-panel"
                    {...props}
                >
                    <div />
                </ModernizedUploadsManagerDropZone>,
            );

        test('prevents browser navigation and queues files dropped on the modernized panel', () => {
            const addDataTransferItemsToUploadQueue = jest.fn();
            const dataTransfer = {
                items: ['file-item'],
                types: ['Files'],
            };
            const dragEnterEvent = {
                dataTransfer,
                preventDefault: jest.fn(),
            };
            const dropEvent = {
                dataTransfer,
                preventDefault: jest.fn(),
            };
            const wrapper = shallow(
                <ModernizedUploadsManagerDropZone
                    addDataTransferItemsToUploadQueue={addDataTransferItemsToUploadQueue}
                    allowedTypes={['Files']}
                    className="bcu-modernized-panel"
                >
                    <div />
                </ModernizedUploadsManagerDropZone>,
            );

            wrapper.instance().handleDragEnter(dragEnterEvent);
            wrapper.instance().handleDrop(dropEvent);

            expect(dragEnterEvent.preventDefault).toHaveBeenCalled();
            expect(dropEvent.preventDefault).toHaveBeenCalled();
            expect(addDataTransferItemsToUploadQueue).toHaveBeenCalledWith(dataTransfer);
        });

        test('prevents browser navigation without queueing when isDropEnabled is false', () => {
            const addDataTransferItemsToUploadQueue = jest.fn();
            const dataTransfer = {
                items: ['file-item'],
                types: ['Files'],
            };
            const dragEnterEvent = {
                dataTransfer,
                preventDefault: jest.fn(),
            };
            const dropEvent = {
                dataTransfer,
                preventDefault: jest.fn(),
            };
            const wrapper = shallow(
                <ModernizedUploadsManagerDropZone
                    addDataTransferItemsToUploadQueue={addDataTransferItemsToUploadQueue}
                    allowedTypes={['Files']}
                    isDropEnabled={false}
                    className="bcu-modernized-panel"
                >
                    <div />
                </ModernizedUploadsManagerDropZone>,
            );

            wrapper.instance().handleDragEnter(dragEnterEvent);
            wrapper.instance().handleDrop(dropEvent);

            expect(dragEnterEvent.preventDefault).toHaveBeenCalled();
            expect(dropEvent.preventDefault).toHaveBeenCalled();
            expect(addDataTransferItemsToUploadQueue).not.toHaveBeenCalled();
        });

        test('does not forward droppable state props to the modernized panel DOM element', () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
            const dataTransfer = {
                items: ['file-item'],
                types: ['Files'],
            };
            let consoleErrors = '';

            try {
                renderModernizedUploadsManagerDropZone();

                fireEvent.dragEnter(screen.getByTestId('bcu-modernized-panel'), { dataTransfer });

                consoleErrors = consoleError.mock.calls.flat().join('\n');
            } finally {
                consoleError.mockRestore();
            }

            expect(consoleErrors).not.toContain('isDragging');
            expect(consoleErrors).not.toContain('isOver');
        });

        test('does not queue files dropped on the modernized panel when isDropEnabled is false', () => {
            const addDataTransferItemsToUploadQueue = jest.fn();
            const dataTransfer = {
                items: ['file-item'],
                types: ['Files'],
            };

            renderModernizedUploadsManagerDropZone({
                addDataTransferItemsToUploadQueue,
                isDropEnabled: false,
            });

            fireEvent.dragEnter(screen.getByTestId('bcu-modernized-panel'), { dataTransfer });
            fireEvent.drop(screen.getByTestId('bcu-modernized-panel'), { dataTransfer });

            expect(addDataTransferItemsToUploadQueue).not.toHaveBeenCalled();
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
                expect(wrapper.find(ModernizedUploadsManagerDropZone)).toHaveLength(1);
            });

            test('should disable dropping on the modernized panel when modernized drop props are omitted', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true });

                expect(wrapper.find(ModernizedUploadsManagerDropZone).prop('isDropEnabled')).toBe(false);
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

            test('should pass onItemShare prop to UploadsManagerBP', () => {
                const onItemShare = jest.fn();
                const wrapper = getWrapper({ enableModernizedUploads: true, onItemShare });
                expect(wrapper.find(UploadsManagerBP).prop('onItemShare')).toBe(onItemShare);
            });

            test('should pass onItemOpen prop to UploadsManagerBP', () => {
                const onItemOpen = jest.fn();
                const wrapper = getWrapper({ enableModernizedUploads: true, onItemOpen });
                expect(wrapper.find(UploadsManagerBP).prop('onItemOpen')).toBe(onItemOpen);
            });

            test('should default onItemShare to undefined when not provided', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true });
                expect(wrapper.find(UploadsManagerBP).prop('onItemShare')).toBeUndefined();
            });

            test('should default onItemOpen to undefined when not provided', () => {
                const wrapper = getWrapper({ enableModernizedUploads: true });
                expect(wrapper.find(UploadsManagerBP).prop('onItemOpen')).toBeUndefined();
            });
        });
    });

    describe('modernized panel open/close lifecycle', () => {
        const HIDE_DELAY_MS = 8000;

        const makeItem = (name, status) => {
            let progress = 0;
            if (status === STATUS_COMPLETE) {
                progress = 100;
            } else if (status === STATUS_IN_PROGRESS) {
                progress = 50;
            }
            return { name, extension: 'pdf', progress, status, file: { name } };
        };

        const armDismissTimer = wrapper => {
            const instance = wrapper.instance();
            wrapper.setState({
                modernizedPanelState: 'shown',
                items: [makeItem('a.pdf', STATUS_IN_PROGRESS)],
            });
            wrapper.setState({
                items: [makeItem('a.pdf', STATUS_COMPLETE)],
            });
            return instance;
        };

        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('starts dismiss timer when batch transitions to all-complete and panel is shown', () => {
            const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
            const wrapper = getWrapper({ enableModernizedUploads: true });
            const instance = armDismissTimer(wrapper);

            expect(instance.modernizedDismissTimer).not.toBeNull();
            expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), HIDE_DELAY_MS);
            setTimeoutSpy.mockRestore();
        });

        test('transitions to dismissing only after the full delay', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });
            armDismissTimer(wrapper);

            jest.advanceTimersByTime(HIDE_DELAY_MS - 1);
            expect(wrapper.state('modernizedPanelState')).toBe('shown');

            jest.advanceTimersByTime(1);
            expect(wrapper.state('modernizedPanelState')).toBe('dismissing');
        });

        test('clears timer when a new in-progress item is added mid-wait', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });
            const instance = armDismissTimer(wrapper);

            jest.advanceTimersByTime(4000);

            wrapper.setState({
                items: [makeItem('a.pdf', STATUS_COMPLETE), makeItem('b.pdf', STATUS_IN_PROGRESS)],
            });

            expect(instance.modernizedDismissTimer).toBeNull();

            jest.advanceTimersByTime(HIDE_DELAY_MS);
            expect(wrapper.state('modernizedPanelState')).toBe('shown');
        });

        test('clears timer when an item flips to STATUS_ERROR mid-wait', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });
            const instance = armDismissTimer(wrapper);

            jest.advanceTimersByTime(4000);

            wrapper.setState({
                items: [makeItem('a.pdf', STATUS_COMPLETE), makeItem('b.pdf', STATUS_ERROR)],
            });

            expect(instance.modernizedDismissTimer).toBeNull();
            expect(wrapper.state('modernizedPanelState')).toBe('shown');
        });

        test('hover cancels the timer and mouse-leave re-arms it', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });
            const instance = armDismissTimer(wrapper);

            instance.handleModernizedMouseEnter();

            expect(instance.isPanelHovered).toBe(true);
            expect(instance.modernizedDismissTimer).toBeNull();

            instance.handleModernizedMouseLeave();

            expect(instance.isPanelHovered).toBe(false);
            expect(instance.modernizedDismissTimer).not.toBeNull();

            jest.advanceTimersByTime(HIDE_DELAY_MS);
            expect(wrapper.state('modernizedPanelState')).toBe('dismissing');
        });

        test('keyboard focus cancels the timer and blur re-arms it', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });
            const instance = armDismissTimer(wrapper);

            instance.handleModernizedFocus({
                target: { matches: () => true },
            });

            expect(instance.isPanelFocused).toBe(true);
            expect(instance.modernizedDismissTimer).toBeNull();

            instance.handleModernizedBlur({
                relatedTarget: null,
                currentTarget: { contains: () => false },
            });

            expect(instance.isPanelFocused).toBe(false);
            expect(instance.modernizedDismissTimer).not.toBeNull();

            jest.advanceTimersByTime(HIDE_DELAY_MS);
            expect(wrapper.state('modernizedPanelState')).toBe('dismissing');
        });

        test('mouse-induced focus does not cancel the timer', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });
            const instance = armDismissTimer(wrapper);

            instance.handleModernizedFocus({
                target: { matches: () => false },
            });

            expect(instance.isPanelFocused).toBe(false);
            expect(instance.modernizedDismissTimer).not.toBeNull();
        });

        test('blur to a child element does not re-arm the timer', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });
            const instance = armDismissTimer(wrapper);

            instance.handleModernizedFocus({
                target: { matches: () => true },
            });
            expect(instance.modernizedDismissTimer).toBeNull();

            const childNode = {};
            instance.handleModernizedBlur({
                relatedTarget: childNode,
                currentTarget: { contains: target => target === childNode },
            });

            expect(instance.isPanelFocused).toBe(true);
            expect(instance.modernizedDismissTimer).toBeNull();
        });

        test('handleModernizedAnimationEnd finalizes dismiss only for the slide-out animation', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });
            const instance = wrapper.instance();
            const resetSpy = jest
                .spyOn(instance, 'resetUploadsManagerItemsWhenUploadsComplete')
                .mockImplementation(() => {});

            wrapper.setState({ modernizedPanelState: 'dismissing' });

            instance.handleModernizedAnimationEnd({ animationName: 'something-else' });
            expect(wrapper.state('modernizedPanelState')).toBe('dismissing');
            expect(resetSpy).not.toHaveBeenCalled();

            instance.handleModernizedAnimationEnd({ animationName: 'bcu-modernized-slideOut' });
            expect(wrapper.state('modernizedPanelState')).toBe('hidden');
            expect(resetSpy).toHaveBeenCalled();
        });

        test('dismisses only after the latest batch completes when multiple rapid batches occur', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });
            const instance = armDismissTimer(wrapper);

            jest.advanceTimersByTime(3000);

            wrapper.setState({
                items: [
                    makeItem('a.pdf', STATUS_COMPLETE),
                    makeItem('b.pdf', STATUS_COMPLETE),
                    makeItem('c.pdf', STATUS_IN_PROGRESS),
                ],
            });
            expect(instance.modernizedDismissTimer).toBeNull();

            wrapper.setState({
                items: [
                    makeItem('a.pdf', STATUS_COMPLETE),
                    makeItem('b.pdf', STATUS_COMPLETE),
                    makeItem('c.pdf', STATUS_COMPLETE),
                ],
            });
            expect(instance.modernizedDismissTimer).not.toBeNull();

            jest.advanceTimersByTime(3000);
            expect(wrapper.state('modernizedPanelState')).toBe('shown');

            jest.advanceTimersByTime(5000);
            expect(wrapper.state('modernizedPanelState')).toBe('dismissing');
        });

        test('returns panel to shown when a new in-progress item arrives while dismissing', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });
            wrapper.setState({
                modernizedPanelState: 'dismissing',
                items: [makeItem('a.pdf', STATUS_COMPLETE)],
            });

            wrapper.setState({
                items: [makeItem('a.pdf', STATUS_COMPLETE), makeItem('b.pdf', STATUS_IN_PROGRESS)],
            });

            expect(wrapper.state('modernizedPanelState')).toBe('shown');
        });

        test('componentWillUnmount clears the dismiss timer', () => {
            const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
            const wrapper = getWrapper({ enableModernizedUploads: true });
            const instance = armDismissTimer(wrapper);
            const timerId = instance.modernizedDismissTimer;

            wrapper.unmount();

            expect(clearTimeoutSpy).toHaveBeenCalledWith(timerId);
            clearTimeoutSpy.mockRestore();
        });

        test('shows panel when items appear from hidden state', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });

            expect(wrapper.state('modernizedPanelState')).toBe('hidden');

            wrapper.setState({
                items: [makeItem('a.pdf', STATUS_IN_PROGRESS)],
            });

            expect(wrapper.state('modernizedPanelState')).toBe('shown');
        });

        test('does not change modernized panel state when enableModernizedUploads is false', () => {
            const wrapper = getWrapper({ enableModernizedUploads: false });
            const instance = wrapper.instance();

            wrapper.setState({
                items: [makeItem('a.pdf', STATUS_COMPLETE)],
            });

            expect(wrapper.state('modernizedPanelState')).toBe('hidden');
            expect(instance.modernizedDismissTimer).toBeNull();
        });

        test('clears dismiss timer and hides panel when queue empties while shown', () => {
            const wrapper = getWrapper({ enableModernizedUploads: true });
            const instance = armDismissTimer(wrapper);

            expect(instance.modernizedDismissTimer).not.toBeNull();

            wrapper.setState({
                items: [],
            });

            expect(instance.modernizedDismissTimer).toBeNull();
            expect(wrapper.state('modernizedPanelState')).toBe('hidden');
        });

        test('clears dismiss timer and hides panel when cancel empties the queue', () => {
            const wrapper = getWrapper({
                enableModernizedUploads: true,
                maxFileSize: 100,
            });
            const instance = wrapper.instance();
            const pendingItem = {
                api: { cancel: jest.fn() },
                extension: 'txt',
                file: new File([new Uint8Array(50)], 'small.txt', { type: 'text/plain' }),
                name: 'small.txt',
                progress: 0,
                size: 50,
                status: STATUS_PENDING,
            };

            wrapper.setState({
                items: [pendingItem],
                modernizedPanelState: 'shown',
                isLargeFileWarningModalOpen: true,
            });
            instance.itemsRef.current = [pendingItem];

            instance.handleLargeFileWarningCancel();

            expect(instance.modernizedDismissTimer).toBeNull();
            expect(wrapper.state('modernizedPanelState')).toBe('hidden');
        });
    });

    describe('upload() large-file gate', () => {
        const makeFileWithSize = (name, size) => new File([new Uint8Array(size)], name, { type: 'text/plain' });

        const makePendingFileItem = (name, size) => ({
            api: {},
            extension: 'txt',
            file: makeFileWithSize(name, size),
            name,
            progress: 0,
            size,
            status: STATUS_PENDING,
        });

        test('should upload immediately when maxFileSize is not configured', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.uploadFile = jest.fn();
            instance.itemsRef.current = [makePendingFileItem('large.txt', 200)];

            instance.upload();

            expect(instance.uploadFile).toHaveBeenCalledTimes(1);
            expect(wrapper.state('isLargeFileWarningModalOpen')).toBe(false);
        });

        test('should upload immediately when all pending files are within maxFileSize', () => {
            const wrapper = getWrapper({ maxFileSize: 100 });
            const instance = wrapper.instance();
            instance.uploadFile = jest.fn();
            instance.itemsRef.current = [makePendingFileItem('small.txt', 50)];

            instance.upload();

            expect(instance.uploadFile).toHaveBeenCalledTimes(1);
            expect(wrapper.state('isLargeFileWarningModalOpen')).toBe(false);
        });

        test('should open the large file warning modal when any pending file exceeds maxFileSize', () => {
            const wrapper = getWrapper({
                enableModernizedUploads: true,
                isUpgradeModalEnabled: true,
                maxFileSize: 100,
            });
            const instance = wrapper.instance();
            instance.uploadFile = jest.fn();
            instance.itemsRef.current = [makePendingFileItem('small.txt', 50), makePendingFileItem('large.txt', 200)];

            instance.upload();

            expect(instance.uploadFile).not.toHaveBeenCalled();
            expect(wrapper.state('isLargeFileWarningModalOpen')).toBe(true);
        });

        test('should NOT open the modal when isUpgradeModalEnabled is false even with oversize files', () => {
            const wrapper = getWrapper({
                enableModernizedUploads: true,
                isUpgradeModalEnabled: false,
                maxFileSize: 100,
            });
            const instance = wrapper.instance();
            instance.uploadFile = jest.fn();
            instance.itemsRef.current = [makePendingFileItem('large.txt', 200)];

            instance.upload();

            expect(instance.uploadFile).toHaveBeenCalledTimes(1);
            expect(wrapper.state('isLargeFileWarningModalOpen')).toBe(false);
        });
    });

    describe('addToQueue()', () => {
        const makeFileWithSize = (name, size) => new File([new Uint8Array(size)], name, { type: 'text/plain' });

        test('should not auto-upload pending items when adding a batch with oversize files during an in-progress upload', () => {
            const wrapper = getWrapper({
                enableModernizedUploads: true,
                isUpgradeModalEnabled: true,
                maxFileSize: 100,
            });
            const instance = wrapper.instance();
            const inProgressItem = {
                api: {},
                extension: 'txt',
                file: makeFileWithSize('uploading.txt', 50),
                name: 'uploading.txt',
                progress: 50,
                size: 50,
                status: STATUS_IN_PROGRESS,
            };
            const oversizeItem = {
                api: {},
                extension: 'txt',
                file: makeFileWithSize('large.txt', 200),
                name: 'large.txt',
                progress: 0,
                size: 200,
                status: STATUS_PENDING,
            };
            const eligibleItem = {
                api: {},
                extension: 'txt',
                file: makeFileWithSize('small.txt', 50),
                name: 'small.txt',
                progress: 0,
                size: 50,
                status: STATUS_PENDING,
            };

            instance.itemsRef.current = [inProgressItem];
            wrapper.setState({ view: VIEW_UPLOAD_IN_PROGRESS });
            instance.uploadFile = jest.fn();

            instance.addToQueue([oversizeItem, eligibleItem], null);

            expect(wrapper.state('isLargeFileWarningModalOpen')).toBe(true);
            expect(instance.uploadFile).not.toHaveBeenCalled();
            expect(eligibleItem.status).toBe(STATUS_PENDING);
        });
    });

    describe('handleLargeFileWarningUploadRest()', () => {
        test('should remove oversize pending items and start upload', () => {
            const wrapper = getWrapper({ maxFileSize: 100 });
            const instance = wrapper.instance();
            const oversizeItem = {
                api: { cancel: jest.fn() },
                extension: 'txt',
                file: new File([new Uint8Array(200)], 'large.txt', { type: 'text/plain' }),
                name: 'large.txt',
                progress: 0,
                size: 200,
                status: STATUS_PENDING,
            };
            const eligibleItem = {
                api: { cancel: jest.fn() },
                extension: 'txt',
                file: new File([new Uint8Array(50)], 'small.txt', { type: 'text/plain' }),
                name: 'small.txt',
                progress: 0,
                size: 50,
                status: STATUS_PENDING,
            };

            instance.itemsRef.current = [oversizeItem, eligibleItem];
            instance.upload = jest.fn();
            wrapper.setState({
                isLargeFileWarningModalOpen: true,
                items: [oversizeItem, eligibleItem],
            });

            instance.handleLargeFileWarningUploadRest();

            expect(oversizeItem.api.cancel).toHaveBeenCalledTimes(1);
            expect(eligibleItem.api.cancel).not.toHaveBeenCalled();
            expect(wrapper.state('items')).toEqual([eligibleItem]);
            expect(wrapper.state('isLargeFileWarningModalOpen')).toBe(false);
            expect(instance.upload).toHaveBeenCalledTimes(1);
        });
    });

    describe('handleLargeFileWarningCancel()', () => {
        test('should remove all pending items and close the modal', () => {
            const onCancel = jest.fn();
            const wrapper = getWrapper({ maxFileSize: 100, onCancel, rootFolderId: '0' });
            const instance = wrapper.instance();
            const oversizeItem = {
                api: { cancel: jest.fn() },
                extension: 'txt',
                file: new File([new Uint8Array(200)], 'large.txt', { type: 'text/plain' }),
                name: 'large.txt',
                progress: 0,
                size: 200,
                status: STATUS_PENDING,
            };
            const eligibleItem = {
                api: { cancel: jest.fn() },
                extension: 'txt',
                file: new File([new Uint8Array(50)], 'small.txt', { type: 'text/plain' }),
                name: 'small.txt',
                progress: 0,
                size: 50,
                status: STATUS_PENDING,
            };

            instance.itemsRef.current = [oversizeItem, eligibleItem];
            instance.itemIdsRef.current = { 'large.txt': true, 'small.txt': true };
            wrapper.setState({
                isLargeFileWarningModalOpen: true,
                items: [oversizeItem, eligibleItem],
            });

            instance.handleLargeFileWarningCancel();

            expect(oversizeItem.api.cancel).toHaveBeenCalledTimes(1);
            expect(eligibleItem.api.cancel).toHaveBeenCalledTimes(1);
            expect(onCancel).toHaveBeenCalledTimes(1);
            expect(onCancel).toHaveBeenCalledWith([oversizeItem, eligibleItem]);
            expect(instance.itemIdsRef.current['large.txt']).toBeUndefined();
            expect(instance.itemIdsRef.current['small.txt']).toBeUndefined();
            expect(wrapper.state('items')).toEqual([]);
            expect(wrapper.state('isLargeFileWarningModalOpen')).toBe(false);
        });
    });
});
