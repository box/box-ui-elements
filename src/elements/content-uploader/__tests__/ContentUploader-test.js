import React from 'react';
import { shallow } from 'enzyme';
import * as UploaderUtils from '../../../utils/uploads';
import { ContentUploaderComponent, CHUNKED_UPLOAD_MIN_SIZE_BYTES } from '../ContentUploader';
import Footer from '../Footer';
import {
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
    STATUS_COMPLETE,
    VIEW_UPLOAD_SUCCESS,
} from '../../../constants';

const EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD = 5;

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
        const onBeforeUpload = jest.fn();
        const wrapper = getWrapper({
            onBeforeUpload,
        });

        wrapper.instance().addFilesToUploadQueue([{ name: 'yoyo', size: 1000 }], jest.fn(), false);

        expect(onBeforeUpload).toBeCalled();
    });

    describe('updateViewAndCollection()', () => {
        test('should set itemIds to be an empty when method is called with an empty array', () => {
            const onComplete = jest.fn();
            const useUploadsManager = false;
            const wrapper = getWrapper({
                onComplete,
                useUploadsManager,
            });

            wrapper.instance().updateViewAndCollection([], null);

            expect(wrapper.state().itemIds).toEqual({});
        });
    });

    describe('addFilesToUploadQueue()', () => {
        test('should overwrite itemIds if they already exist', () => {
            const wrapper = getWrapper();
            wrapper.setState({ itemIds: { yoyo: false } });

            wrapper.instance().addFilesToUploadQueue([{ name: 'yoyo', size: 1000 }], jest.fn(), false);

            const expected = { yoyo: true };
            expect(wrapper.state().itemIds).toMatchObject(expected);
        });
    });

    describe('removeFileFromUploadQueue()', () => {
        test('should cancel and remove item from uploading queue', () => {
            const wrapper = getWrapper();
            const item = {
                api: {
                    cancel: jest.fn(),
                },
                status: STATUS_IN_PROGRESS,
            };
            wrapper.setState({
                items: [item],
            });
            const instance = wrapper.instance();
            instance.upload = jest.fn();

            instance.removeFileFromUploadQueue(item);

            expect(item.api.cancel).toBeCalled();
            expect(wrapper.state().items.length).toBe(0);
            expect(instance.upload).toBeCalled();
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

            instance.isAutoExpanded = true;

            instance.handleUploadSuccess(items[0]);

            // Verify expanded is true after one file upload succeeds
            expectAutoExpandStateToBe(true);

            items.slice(1).forEach(item => instance.handleUploadSuccess(item));

            expect(wrapper.state().view).toBe(VIEW_UPLOAD_SUCCESS);
            expectAutoExpandStateToBe(false);
        });
    });
});
