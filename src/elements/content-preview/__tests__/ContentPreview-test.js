import React from 'react';
import noop from 'lodash/noop';
import { shallow } from 'enzyme';
import * as TokenService from '../../../utils/TokenService';
import { PREVIEW_FIELDS_TO_FETCH } from '../../../utils/fields';
import { ContentPreviewComponent as ContentPreview } from '../ContentPreview';
import PreviewLoading from '../PreviewLoading';
import SidebarUtils from '../../content-sidebar/SidebarUtils';

jest.mock('../../common/Internationalize', () => 'mock-internationalize');

describe('elements/content-preview/ContentPreview', () => {
    const getWrapper = (props = {}) =>
        shallow(<ContentPreview logger={{ onReadyMetric: jest.fn(), onPreviewMetric: jest.fn() }} {...props} />);

    const PERFORMANCE_TIME = 100;
    let props;
    let file;

    beforeEach(() => {
        global.Box = {};
        global.Box.Preview = function Preview() {
            this.updateFileCache = jest.fn();
            this.show = jest.fn();
            this.updateToken = jest.fn();
            this.addListener = jest.fn();
        };
        global.performance = {
            now: jest.fn().mockReturnValue(PERFORMANCE_TIME),
        };
    });

    afterEach(() => {
        delete global.Box;
    });

    describe('constructor()', () => {
        let onReadyMetric;
        beforeEach(() => {
            const wrapper = getWrapper();
            ({ onReadyMetric } = wrapper.instance().props.logger);
        });

        test('should emit when js loaded', () => {
            expect(onReadyMetric).toHaveBeenCalledWith({
                endMarkName: expect.any(String),
            });
        });
    });

    describe('componentDidUpdate()', () => {
        test('should not reload preview if component updates but we should not load preview', async () => {
            file = { id: '123' };

            props = {
                hasSidebar: true,
                token: 'token',
                fileId: file.id,
            };
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            instance.shouldLoadPreview = jest.fn().mockReturnValue(false);
            instance.loadPreview = jest.fn();

            wrapper.setProps({
                hasSidebar: false,
            });

            expect(instance.loadPreview).toHaveBeenCalledTimes(0);
        });
    });

    describe('shouldLoadPreview()', () => {
        let wrapper;
        let instance;

        beforeEach(() => {
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            file = { id: '123', file_version: { id: '1' } };
            wrapper.setState({
                file,
            });
            instance.preview = new global.Box.Preview();
        });

        test('should return true if file version ID has changed', () => {
            const oldFile = { id: '123', file_version: { id: '1234' } };
            expect(instance.shouldLoadPreview({ file: oldFile })).toBe(true);
        });

        test('should return true if file object has newly been populated', () => {
            wrapper.setState({ file: { id: '123' } });
            expect(instance.shouldLoadPreview({ file: undefined })).toBeTruthy();
        });

        test('should return false if file has not changed', () => {
            expect(instance.shouldLoadPreview({ file })).toBe(false);
        });

        test('should return true if the currently-selected version ID has changed', () => {
            expect(instance.shouldLoadPreview({ selectedVersionId: '12345' })).toBe(true);
        });
    });

    describe('canDownload()', () => {
        let wrapper;
        let instance;

        beforeEach(() => {
            file = {
                id: '123',
                permissions: {
                    can_download: true,
                },
                is_download_available: true,
            };
        });

        test('should return true when all conditions are met', () => {
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            wrapper.setState({ file });
            expect(instance.canDownload()).toBeTruthy();
        });

        test('should return false if canDownload is false', () => {
            props.canDownload = false;
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            wrapper.setState({ file });
            expect(instance.canDownload()).toBeFalsy();
        });

        test('should return false if can_download is false', () => {
            props.canDownload = true;
            file.permissions.can_download = false;
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            wrapper.setState({ file });
            expect(instance.canDownload()).toBeFalsy();
        });

        test('should return false if is_download_available is false', () => {
            props.canDownload = true;
            file.is_download_available = false;
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            wrapper.setState({ file });
            expect(instance.canDownload()).toBeFalsy();
        });
    });

    describe('loadPreview()', () => {
        beforeEach(() => {
            // Fresh global preview object
            global.Box = {};
            global.Box.Preview = function Preview() {
                this.addListener = jest.fn();
                this.updateFileCache = jest.fn();
                this.show = jest.fn();
                this.removeAllListeners = jest.fn();
                this.destroy = jest.fn();
            };

            file = { id: '123' };
        });

        test('should get read token for preview', async () => {
            props = {
                token: 'token',
                fileId: file.id,
            };
            const origGetReadToken = TokenService.default.getReadToken;
            TokenService.default.getReadToken = jest.fn().mockReturnValueOnce(Promise.resolve(props.token));
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            await instance.loadPreview();
            expect(TokenService.default.getReadToken).toHaveBeenCalledWith('file_123', props.token);
            TokenService.default.getReadToken = origGetReadToken;
        });

        test('should bind onPreviewError prop to preview "preview_error" event', async () => {
            props = {
                onError: jest.fn(),
                token: 'token',
                fileId: file.id,
            };
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            instance.onPreviewError = jest.fn();
            await instance.loadPreview();
            expect(instance.preview.addListener).toHaveBeenCalledWith('preview_error', instance.onPreviewError);
        });

        test('should bind onPreviewMetric prop to preview "preview_metric" event', async () => {
            props = {
                onMetric: jest.fn(),
                token: 'token',
                fileId: file.id,
            };
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            instance.onPreviewMetric = jest.fn();
            await instance.loadPreview();
            expect(instance.preview.addListener).toHaveBeenCalledWith('preview_metric', instance.onPreviewMetric);
        });

        test('should bind onPreviewLoad method to preview "load" event', async () => {
            props = {
                onMetric: jest.fn(),
                token: 'token',
                fileId: file.id,
            };
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            await instance.loadPreview();
            expect(instance.preview.addListener).toHaveBeenCalledWith('load', instance.onPreviewLoad);
        });

        test('should call preview show with correct params', async () => {
            props = {
                onMetric: jest.fn(),
                token: 'token',
                fileId: file.id,
            };
            TokenService.getReadToken = jest.fn().mockReturnValueOnce(Promise.resolve(props.token));
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            await instance.loadPreview();
            expect(instance.preview.show).toHaveBeenCalledWith(
                file.id,
                props.token,
                expect.objectContaining({
                    showDownload: false,
                    skipServerUpdate: true,
                    header: 'none',
                    useHotkeys: false,
                    container: expect.stringContaining('.bcpr-content'),
                }),
            );
        });

        test('should call preview show with file version params if provided', async () => {
            props = {
                onMetric: jest.fn(),
                token: 'token',
                fileId: file.id,
            };
            TokenService.getReadToken = jest.fn().mockReturnValueOnce(Promise.resolve(props.token));
            const wrapper = getWrapper(props);
            wrapper.setState({ file, selectedVersionId: '12345' });
            const instance = wrapper.instance();
            await instance.loadPreview();
            expect(instance.preview.show).toHaveBeenCalledWith(
                file.id,
                props.token,
                expect.objectContaining({
                    container: expect.stringContaining('.bcpr-content'),
                    header: 'none',
                    showDownload: false,
                    skipServerUpdate: true,
                    useHotkeys: false,
                    fileOptions: {
                        [file.id]: {
                            fileVersionId: '12345',
                        },
                    },
                }),
            );
        });
    });

    describe('fetchFile()', () => {
        let getFileStub;
        let instance;

        beforeEach(() => {
            file = { id: '123' };
            props = {
                token: 'token',
                fileId: file.id,
                contentSidebarProps: {
                    hasSkills: true,
                },
            };
            const wrapper = getWrapper(props);
            instance = wrapper.instance();
            getFileStub = jest.fn();
            instance.api = {
                getFileAPI: () => ({
                    getFile: getFileStub,
                }),
            };
        });

        test('should fetch the file with provided success and error callbacks', () => {
            const success = jest.fn();
            const error = jest.fn();
            SidebarUtils.canHaveSidebar = jest.fn().mockReturnValueOnce(true);
            instance.fetchFile(file.id, success, error, {
                forceFetch: false,
                refreshCache: true,
            });
            expect(getFileStub).toBeCalledWith(file.id, success, error, {
                forceFetch: false,
                refreshCache: true,
                fields: PREVIEW_FIELDS_TO_FETCH,
            });
        });

        test('should fetch the file with default success and error callback', () => {
            instance.fetchFileSuccessCallback = jest.fn();
            instance.fetchFileErrorCallback = jest.fn();
            SidebarUtils.canHaveSidebar = jest.fn().mockReturnValueOnce(true);
            instance.fetchFile(file.id);
            expect(getFileStub).toBeCalledWith(
                file.id,
                instance.fetchFileSuccessCallback,
                instance.fetchFileErrorCallback,
                {
                    fields: PREVIEW_FIELDS_TO_FETCH,
                },
            );
        });

        test('should fetch the file without sidebar fields', () => {
            instance.fetchFileSuccessCallback = jest.fn();
            instance.fetchFileErrorCallback = jest.fn();
            SidebarUtils.canHaveSidebar = jest.fn().mockReturnValueOnce(false);
            instance.fetchFile(file.id);
            expect(getFileStub).toBeCalledWith(
                file.id,
                instance.fetchFileSuccessCallback,
                instance.fetchFileErrorCallback,
                {
                    fields: PREVIEW_FIELDS_TO_FETCH,
                },
            );
        });

        test('should short circuit if there is no fileId', () => {
            instance.fetchFile(null);
            expect(getFileStub).not.toBeCalled();
        });
    });

    describe('fetchFileSuccessCallback()', () => {
        let instance;

        beforeEach(() => {
            const wrapper = getWrapper(props);
            instance = wrapper.instance();
        });

        test('should set state to the new file', () => {
            instance.fetchFileSuccessCallback(file);
            expect(instance.state.file).toEqual(file);
            expect(instance.state.isFileError).toEqual(false);
            expect(instance.state.isReloadNotificationVisible).toEqual(false);
        });

        test('should set the state to new file if watermarked', () => {
            const newFile = { ...file };
            newFile.watermark_info = { is_watermarked: true };
            instance.setState({ file });
            instance.fetchFileSuccessCallback(newFile);

            expect(instance.state.file).toEqual(newFile);
            expect(instance.state.isFileError).toEqual(false);
            expect(instance.state.isReloadNotificationVisible).toEqual(false);
        });

        test('should not set new file in state if sha1 matches', () => {
            const newFile = { ...file };
            newFile.file_version = { sha1: 'sha' };
            file.file_version = { sha1: 'sha' };
            instance.setState({
                file,
            });
            instance.fetchFileSuccessCallback(newFile);

            expect(instance.state.file).toEqual(file);
        });

        test('should not set new file in state but show notification if sha1 changes', () => {
            const newFile = { ...file };
            newFile.file_version = { sha1: 'sha1' };
            file.file_version = { sha1: 'sha2' };
            instance.setState({
                file,
                isFileError: true,
                isReloadNotificationVisible: true,
            });
            instance.fetchFileSuccessCallback(newFile);

            expect(instance.stagedFile).toEqual(newFile);
            expect(instance.state.file).toEqual(file);
            expect(instance.state.isFileError).toBeFalsy();
            expect(instance.state.isReloadNotificationVisible).toBeTruthy();
        });
    });

    describe('fetchFileErrorCallback()', () => {
        let instance;
        let error;
        let onError;

        beforeEach(() => {
            onError = jest.fn();
            const wrapper = getWrapper({
                ...props,
                onError,
            });
            instance = wrapper.instance();
            instance.fetchFile = jest.fn();
            error = new Error('foo');
        });

        test('should set the file error state', () => {
            instance.fetchFileErrorCallback(error);
            expect(instance.state.isFileError).toEqual(true);
            expect(instance.fetchFile).not.toBeCalled();
            expect(onError).toHaveBeenCalled();
        });
    });

    describe('getTotalFileFetchTime()', () => {
        let instance;
        const startTime = 1.23;
        const endTime = 5.46;

        beforeEach(() => {
            props = {
                token: 'token',
                fileId: file.id,
            };
            const wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.fetchFileStartTime = startTime;
            instance.fetchFileEndTime = endTime;
        });

        test('should return the default if no start time', () => {
            instance.fetchFileStartTime = null;
            const totalMetrics = instance.getTotalFileFetchTime();
            expect(totalMetrics).toEqual(0);
        });

        test('should return the default if no end time', () => {
            instance.fetchFileEndTime = null;
            const totalMetrics = instance.getTotalFileFetchTime();
            expect(totalMetrics).toEqual(0);
        });

        test('should return the total fetching time', () => {
            const total = instance.getTotalFileFetchTime();
            expect(total).toEqual(4);
        });
    });

    describe('addFetchFileTimeToPreviewMetrics()', () => {
        let instance;
        const metrics = {
            conversion: 0,
            rendering: 100,
            total: 100,
        };
        const FETCHING_TIME = 200;

        beforeEach(() => {
            props = {
                token: 'token',
                fileId: file.id,
            };
            const wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.getTotalFileFetchTime = jest.fn().mockReturnValue(FETCHING_TIME);
        });

        test('should add the total file fetching time to rendering if the file was converted', () => {
            const totalMetrics = instance.addFetchFileTimeToPreviewMetrics(metrics);
            const { conversion, rendering } = metrics;
            const totalRendering = rendering + FETCHING_TIME;

            expect(instance.getTotalFileFetchTime).toBeCalled();
            expect(totalMetrics).toEqual({
                conversion,
                rendering: totalRendering,
                total: conversion + totalRendering,
                preload: undefined,
            });
        });

        test('should add the total file fetching time to conversion if the file was not converted', () => {
            const CONVERSION_TIME = 50;
            const totalMetrics = instance.addFetchFileTimeToPreviewMetrics({
                ...metrics,
                conversion: CONVERSION_TIME,
            });

            const { rendering } = metrics;
            const totalConversion = CONVERSION_TIME + FETCHING_TIME;

            expect(instance.getTotalFileFetchTime).toBeCalled();
            expect(totalMetrics).toEqual({
                conversion: totalConversion,
                rendering,
                total: rendering + totalConversion,
                preload: undefined,
            });
        });

        test('should add the total file fetching time to preload if it exists', () => {
            const PRELOAD_TIME = 20;
            const totalMetrics = instance.addFetchFileTimeToPreviewMetrics({
                ...metrics,
                preload: PRELOAD_TIME,
            });
            const { conversion, rendering } = metrics;
            const totalRendering = rendering + FETCHING_TIME;

            expect(instance.getTotalFileFetchTime).toBeCalled();
            expect(totalMetrics).toEqual({
                conversion,
                rendering: totalRendering,
                total: conversion + totalRendering,
                preload: PRELOAD_TIME + FETCHING_TIME,
            });
        });
    });

    describe('onPreviewLoad()', () => {
        let instance;
        const data = {
            foo: 'bar',
            metrics: {
                time: {
                    conversion: 5,
                    rendering: 50,
                    total: 150,
                },
            },
        };
        const totalTimeMetrics = {
            conversion: 100,
            rendering: 50,
            total: 150,
        };

        beforeEach(() => {
            props = {
                token: 'token',
                fileId: file.id,
                onLoad: jest.fn(),
            };
            const wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.focus = jest.fn();
            instance.prefetch = jest.fn();
            instance.getFileIndex = jest.fn().mockReturnValue(0);
            instance.addFetchFileTimeToPreviewMetrics = jest.fn().mockReturnValue(totalTimeMetrics);
        });

        test('should modify the timing metrics to add in the total file fetching time', () => {
            instance.onPreviewLoad(data);
            expect(instance.addFetchFileTimeToPreviewMetrics).toBeCalledWith(data.metrics.time);
            expect(props.onLoad).toBeCalledWith({
                ...data,
                metrics: {
                    time: totalTimeMetrics,
                },
            });
        });
    });

    describe('onPreviewMetric()', () => {
        let wrapper;
        let instance;
        let onPreviewMetric;
        const data = {
            foo: 'bar',
            file_info_time: 0,
            convert_time: 0,
            download_response_time: 20,
            full_document_load_time: 20,
            value: 40,
        };
        const FETCHING_TIME = 20;

        beforeEach(() => {
            props = {
                token: 'token',
                fileId: '123',
            };
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.getTotalFileFetchTime = jest.fn().mockReturnValue(FETCHING_TIME);
            ({ onPreviewMetric } = instance.props.logger);
        });

        test('should add in the total file fetching time to load events', () => {
            data.event_name = 'load';
            instance.onPreviewMetric(data);
            expect(onPreviewMetric).toBeCalledWith({
                ...data,
                file_info_time: FETCHING_TIME,
                value: data.value + FETCHING_TIME,
            });
        });

        test('should not emit a load time related metric if invalid load time is present', () => {
            data.event_name = 'load';
            data.value = 0;
            instance.getTotalFileFetchTime = jest.fn().mockReturnValue(0);
            instance.onPreviewMetric(data);
            expect(onPreviewMetric).not.toBeCalled();
        });
    });

    describe('render()', () => {
        test('should render PreviewLoading if there is no file', () => {
            const wrapper = getWrapper(props);
            expect(wrapper.find(PreviewLoading).exists()).toBe(true);
        });

        test('should render nothing if there is no fileId', () => {
            const wrapper = getWrapper({
                fileId: null,
            });
            expect(wrapper.getElement()).toBe(null);
        });
    });

    describe('loadFileFromStage()', () => {
        test('should set new file in state if it exists', () => {
            const wrapper = getWrapper(props);
            const instance = wrapper.instance();
            instance.setState({
                isReloadNotificationVisible: true,
                isFileError: true,
            });
            file = { id: '123' };
            instance.stagedFile = file;
            instance.loadFileFromStage();
            expect(instance.state.file).toEqual(file);
            expect(instance.stagedFile).toBeUndefined();
            expect(instance.state.isReloadNotificationVisible).toBeFalsy();
            expect(instance.state.isFileError).toBeFalsy();
        });
    });

    describe('closeReloadNotification()', () => {
        test('should set new file in state if it exists', () => {
            const wrapper = getWrapper(props);
            const instance = wrapper.instance();
            instance.setState({
                isReloadNotificationVisible: true,
            });
            instance.closeReloadNotification();
            expect(instance.state.isReloadNotificationVisible).toBeFalsy();
        });
    });

    describe('prefetch()', () => {
        test('should prefetch files', async () => {
            props.token = jest.fn();
            const wrapper = getWrapper(props);
            const instance = wrapper.instance();
            const options = {
                refreshCache: false,
            };

            instance.fetchFile = jest.fn();
            TokenService.default.cacheTokens = jest.fn().mockReturnValueOnce(Promise.resolve());
            await instance.prefetch(['1', '2', '3']);

            expect(TokenService.default.cacheTokens).toHaveBeenCalledWith(['file_1', 'file_2', 'file_3'], props.token);
            expect(instance.fetchFile).toHaveBeenCalledTimes(3);
            expect(instance.fetchFile).toHaveBeenNthCalledWith(1, '1', noop, noop, options);
            expect(instance.fetchFile).toHaveBeenNthCalledWith(2, '2', noop, noop, options);
            expect(instance.fetchFile).toHaveBeenNthCalledWith(3, '3', noop, noop, options);
        });
    });

    describe('updatePreviewToken()', () => {
        let instance;
        const token = 'token';
        beforeEach(() => {
            const wrapper = getWrapper({
                token,
                fileId: 'foo',
            });
            instance = wrapper.instance();
        });

        test('should update the preview token and not reload', () => {
            instance.preview = new global.Box.Preview();
            instance.updatePreviewToken();

            expect(instance.preview.updateToken).toBeCalledWith(token, false);
        });
    });

    describe('componentDidUpdate()', () => {
        let wrapper;
        let instance;
        const token = 'token';
        beforeEach(() => {
            wrapper = getWrapper({
                token,
                fileId: 'foo',
            });
            instance = wrapper.instance();
            instance.fetchFile = jest.fn();
            instance.destroyPreview = jest.fn();
            instance.shouldLoadPreview = jest.fn();
            instance.updatePreviewToken = jest.fn();
            instance.loadPreview = jest.fn();
        });

        // Test fails in enzyme@3.9.0 due to regression
        // https://github.com/airbnb/enzyme/issues/2020
        test('should destroy preview and load the file if file id changed', () => {
            wrapper.setProps({
                fileId: 'bar',
            });
            expect(instance.destroyPreview).toBeCalledTimes(1);
            expect(instance.fetchFile).toBeCalledTimes(1);
        });

        test('should load preview if fileId hasnt changed and shouldLoadPreview returns ture', () => {
            instance.shouldLoadPreview = jest.fn().mockReturnValue(true);
            wrapper.setProps({
                foo: 'bar',
            });
            expect(instance.loadPreview).toBeCalledTimes(1);
        });

        test('should update the preview with the new token if it changes', () => {
            wrapper.setProps({
                token: 'bar',
            });
            expect(instance.updatePreviewToken).toBeCalledTimes(1);
        });
    });

    describe('getDerivedStateFromProps()', () => {
        let wrapper;
        const token = 'token';
        const initialFileId = 'foo';
        const newFileId = 'bar';
        const currentFileId = 'currentFileId';
        const prevFileIdProp = 'prevFileIdProp';

        beforeEach(() => {
            wrapper = getWrapper({
                token,
                fileId: initialFileId,
            });
            expect(wrapper.state(currentFileId)).toBe(initialFileId);
        });
        test('should update the currentFileId in state if the fileId prop changes', () => {
            wrapper.setProps({
                fileId: newFileId,
            });
            expect(wrapper.state(currentFileId)).toBe(newFileId);
        });

        test('should not update the currentFileId in state if the fileId prop stays the same', () => {
            wrapper.setState({
                currentFileId: newFileId,
            });
            expect(wrapper.state(currentFileId)).toBe(newFileId);
            wrapper.setProps({
                fileId: initialFileId,
                foo: 'baz',
            });
            expect(wrapper.state(currentFileId)).toBe(newFileId);
        });

        test('should update preview if navigation occurs then browser back clicked', () => {
            // navigation
            wrapper.setState({
                currentFileId: newFileId,
            });
            expect(wrapper.state(prevFileIdProp)).toBe(initialFileId);
            expect(wrapper.state(currentFileId)).toBe(newFileId);

            // URL update
            wrapper.setProps({
                fileId: newFileId,
                foo: 'baz',
            });
            expect(wrapper.state(currentFileId)).toBe(newFileId);
            expect(wrapper.state(prevFileIdProp)).toBe(newFileId);

            // browser back
            wrapper.setProps({
                fileId: initialFileId,
                foo: 'baz',
            });
            expect(wrapper.state(prevFileIdProp)).toBe(initialFileId);
            expect(wrapper.state(currentFileId)).toBe(initialFileId);
        });

        test('should have the correct state when navigation and props update', () => {
            // navigation
            wrapper.setState({
                currentFileId: newFileId,
            });
            expect(wrapper.state(prevFileIdProp)).toBe(initialFileId);
            expect(wrapper.state(currentFileId)).toBe(newFileId);

            // URL update
            wrapper.setProps({
                fileId: newFileId,
            });
            expect(wrapper.state(currentFileId)).toBe(newFileId);
            expect(wrapper.state(prevFileIdProp)).toBe(newFileId);

            // browser back
            wrapper.setProps({
                fileId: initialFileId,
            });
            expect(wrapper.state(prevFileIdProp)).toBe(initialFileId);
            expect(wrapper.state(currentFileId)).toBe(initialFileId);

            // browser forward
            wrapper.setProps({
                fileId: newFileId,
            });
            expect(wrapper.state(prevFileIdProp)).toBe(newFileId);
            expect(wrapper.state(currentFileId)).toBe(newFileId);

            // browser back
            wrapper.setProps({
                fileId: initialFileId,
            });
            expect(wrapper.state(prevFileIdProp)).toBe(initialFileId);
            expect(wrapper.state(currentFileId)).toBe(initialFileId);

            // navigation
            wrapper.setState({
                currentFileId: newFileId,
            });
            expect(wrapper.state(prevFileIdProp)).toBe(initialFileId);
            expect(wrapper.state(currentFileId)).toBe(newFileId);

            // URL update
            wrapper.setProps({
                fileId: newFileId,
            });
            expect(wrapper.state(currentFileId)).toBe(newFileId);
            expect(wrapper.state(prevFileIdProp)).toBe(newFileId);
        });
    });

    describe('canAnnotate()', () => {
        let wrapper;
        let instance;

        beforeEach(() => {
            file = {
                id: '123',
                permissions: {
                    can_annotate: true,
                },
            };
        });

        test('should return true if showAnnotations prop is true and there are annotations edit permissions', () => {
            wrapper = getWrapper({ ...props, showAnnotations: true });
            instance = wrapper.instance();
            wrapper.setState({ file });
            expect(instance.canAnnotate()).toBeTruthy();
        });

        test('should return false if showAnnotations prop is false (default is false)', () => {
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            wrapper.setState({ file });
            expect(instance.canAnnotate()).toBeFalsy();
        });

        test('should return false if can_annotate permission is false', () => {
            wrapper = getWrapper({ ...props, showAnnotations: true });
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            file.permissions.can_annotate = false;
            wrapper.setState({ file });
            expect(instance.canAnnotate()).toBeFalsy();
        });
    });

    describe('canViewAnnotations()', () => {
        let wrapper;
        let instance;

        beforeEach(() => {
            props.showAnnotations = true;
            file = {
                id: '123',
                permissions: {
                    can_annotate: true,
                    can_view_annotations_all: false,
                    can_view_annotations_self: false,
                },
            };
        });

        test('should return true if showAnnotations prop is true and has can_annotate permission', () => {
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.canAnnotate = jest.fn().mockReturnValue(true);
            wrapper.setState({ file });
            expect(instance.canViewAnnotations()).toBeTruthy();
        });

        test('should return true if showAnnotations prop is true and has can view all annotations', () => {
            file.permissions = {
                can_annotate: false,
                can_view_annotations_all: true,
                can_view_annotations_self: false,
            };
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            wrapper.setState({ file });
            expect(instance.canViewAnnotations()).toBeTruthy();
        });

        test('should return true if showAnnotations prop is true and has can view self annotations', () => {
            file.permissions = {
                can_annotate: false,
                can_view_annotations_all: false,
                can_view_annotations_self: true,
            };
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            wrapper.setState({ file });
            expect(instance.canViewAnnotations()).toBeTruthy();
        });

        test('should return false if showAnnotations prop is false', () => {
            props.showAnnotations = false;
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            wrapper.setState({ file });
            expect(instance.canViewAnnotations()).toBeFalsy();
        });

        test('should return false if there are no view or edit permissions', () => {
            wrapper = getWrapper(props);
            props.showAnnotations = true;

            file.permissions = {
                can_annotate: false,
                can_view_annotations_all: false,
                can_view_annotations_self: false,
            };

            instance = wrapper.instance();
            wrapper.setState({ file });
            expect(instance.canViewAnnotations()).toBeFalsy();
        });
    });

    describe('componentWillUnmount()', () => {
        let wrapper;
        let instance;

        beforeEach(() => {
            wrapper = getWrapper(props, {
                disableLifecycleMethods: true,
            });
            instance = wrapper.instance();
            instance.api = {
                destroy: jest.fn(),
            };
            instance.destroyPreview = jest.fn();
        });

        test('shoud destroy the API and preview', () => {
            instance.componentWillUnmount();
            expect(instance.api.destroy).toHaveBeenCalledWith(false);
            expect(instance.destroyPreview).toHaveBeenCalled();
        });
    });
});
