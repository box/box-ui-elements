import * as React from 'react';
import noop from 'lodash/noop';
import { shallow } from 'enzyme';
import * as TokenService from '../../../utils/TokenService';
import PreviewMask from '../PreviewMask';
import SidebarUtils from '../../content-sidebar/SidebarUtils';
import { ContentPreviewComponent as ContentPreview } from '../ContentPreview';
import { PREVIEW_FIELDS_TO_FETCH } from '../../../utils/fields';

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
            this.updateExperiences = jest.fn();
            this.getThumbnail = jest.fn();
            this.updateContentInsightsOptions = jest.fn();
        };
        jest.spyOn(global, 'performance', 'get').mockReturnValue({
            now: jest.fn().mockReturnValue(PERFORMANCE_TIME),
        });
    });

    afterEach(() => {
        delete global.Box;
        jest.restoreAllMocks();
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

        test('should destroy preview before attempting to load it', () => {
            file = { id: '123' };

            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.destroyPreview = jest.fn();
            instance.shouldLoadPreview = jest.fn().mockReturnValue(true);
            instance.loadPreview = jest.fn();

            wrapper.setState({ file });

            expect(instance.destroyPreview).toHaveBeenCalledWith(false);
            expect(instance.loadPreview).toHaveBeenCalledTimes(1);
        });

        test('should destroy preview and reset selectedVersion state on new fileId', () => {
            file = { id: '123' };

            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.destroyPreview = jest.fn();
            instance.fetchFile = jest.fn();

            wrapper.setProps({ fileId: '456' });

            expect(instance.destroyPreview).toHaveBeenCalledWith();
            expect(wrapper.state('selectedVersion')).toBe(undefined);
            expect(instance.fetchFile).toHaveBeenCalledWith('456');
        });

        test('should update content insights options if the isActive prop changed', () => {
            file = { id: '123' };

            props = {
                features: {
                    advancedContentInsights: {
                        isActive: false,
                    },
                },
            };

            const wrapper = getWrapper(props);
            const instance = wrapper.instance();
            instance.preview = new global.Box.Preview();

            instance.destroyPreview = jest.fn();
            instance.fetchFile = jest.fn();

            const updatedContentInsightsOptions = { isActive: true };

            wrapper.setProps({ features: { advancedContentInsights: updatedContentInsightsOptions } });

            expect(instance.preview.updateContentInsightsOptions).toHaveBeenCalledWith(updatedContentInsightsOptions);
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
            expect(instance.shouldLoadPreview({ selectedVersion: { id: '12345' } })).toBe(true);
        });

        test('should return true if the selected version is missing and the previous selection was an old version', () => {
            wrapper.setState({ selectedVersion: { id: undefined } });

            expect(instance.shouldLoadPreview({ selectedVersion: { id: '12345' } })).toBe(true);
        });

        test('should return false if the selected version is missing but the previous selection was the current version', () => {
            wrapper.setState({ selectedVersion: { id: undefined } });

            expect(instance.shouldLoadPreview({ selectedVersion: { id: '1' } })).toBe(false);
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

    describe('handleCanPrint()', () => {
        beforeEach(() => {
            file = {
                id: '123',
                permissions: {
                    can_download: true,
                },
                is_download_available: true,
            };
        });
        test.each([
            [true, true],
            [false, false],
        ])('should set canPrint to %s when ability to print is %s', (expected, value) => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const canPrintMock = jest.fn().mockReturnValue(value);

            wrapper.setState({ file });
            instance.preview = {
                canPrint: canPrintMock,
            };

            instance.handleCanPrint();

            expect(canPrintMock).toBeCalled();
            expect(wrapper.state('canPrint')).toEqual(expected);
        });

        it('should show print icon if printCheck is not available', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.preview = {};
            instance.destroyPreview = jest.fn();
            wrapper.setState({ file });
            instance.handleCanPrint();

            expect(wrapper.state('canPrint')).toEqual(true);
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
                this.pageTracker = {
                    addListener: jest.fn(),
                };
            };

            file = { id: '123' };
            props = {
                onMetric: jest.fn(),
                token: 'token',
                fileId: file.id,
            };
        });

        test('should bind onPreviewError prop to preview "preview_error" event', async () => {
            const wrapper = getWrapper({ ...props, onError: jest.fn() });
            wrapper.setState({ file });
            const instance = wrapper.instance();
            instance.onPreviewError = jest.fn();
            await instance.loadPreview();
            expect(instance.preview.addListener).toHaveBeenCalledWith('preview_error', instance.onPreviewError);
        });

        test('should bind onPreviewMetric prop to preview "preview_metric" event', async () => {
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            instance.onPreviewMetric = jest.fn();
            await instance.loadPreview();
            expect(instance.preview.addListener).toHaveBeenCalledWith('preview_metric', instance.onPreviewMetric);
        });

        test('should bind onPreviewLoad method to preview "load" event', async () => {
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            await instance.loadPreview();
            expect(instance.preview.addListener).toHaveBeenCalledWith('load', instance.onPreviewLoad);
        });

        test('should call preview show with correct params', async () => {
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            await instance.loadPreview();
            expect(instance.preview.show).toHaveBeenCalledWith(
                file.id,
                expect.any(Function),
                expect.objectContaining({
                    container: expect.stringContaining('.bcpr-content'),
                    header: 'none',
                    showDownload: false,
                    showLoading: false,
                    showProgress: false,
                    skipServerUpdate: true,
                    useHotkeys: false,
                }),
            );
        });

        test('should call preview show with file version params if provided', async () => {
            const wrapper = getWrapper(props);
            wrapper.setState({
                file: { ...file, file_version: { id: '67890' } },
                selectedVersion: {
                    id: '12345',
                },
            });
            const instance = wrapper.instance();
            await instance.loadPreview();
            expect(instance.preview.show).toHaveBeenCalledWith(
                file.id,
                expect.any(Function),
                expect.objectContaining({
                    container: expect.stringContaining('.bcpr-content'),
                    fileOptions: {
                        [file.id]: {
                            fileVersionId: '12345',
                            currentFileVersionId: '67890',
                        },
                    },
                    header: 'none',
                    showDownload: false,
                    showLoading: false,
                    showProgress: false,
                    skipServerUpdate: true,
                    useHotkeys: false,
                }),
            );
        });

        test('should call preview show with activeAnnotationId if provided', async () => {
            const wrapper = getWrapper({ ...props, annotatorState: { activeAnnotationId: '123' } });
            wrapper.setState({ file });
            const instance = wrapper.instance();
            await instance.loadPreview();
            expect(instance.preview.show).toHaveBeenCalledWith(
                file.id,
                expect.any(Function),
                expect.objectContaining({
                    fileOptions: {
                        [file.id]: {
                            annotations: {
                                activeId: '123',
                            },
                        },
                    },
                }),
            );
        });

        test('should call preview show with startAt params if provided', async () => {
            const wrapper = getWrapper(props);
            wrapper.setState({
                file,
                startAt: {
                    unit: 'pages',
                    value: 3,
                },
            });
            const instance = wrapper.instance();
            await instance.loadPreview();
            expect(instance.preview.show).toHaveBeenCalledWith(
                file.id,
                expect.any(Function),
                expect.objectContaining({
                    container: expect.stringContaining('.bcpr-content'),
                    header: 'none',
                    showDownload: false,
                    skipServerUpdate: true,
                    useHotkeys: false,
                    fileOptions: {
                        [file.id]: {
                            startAt: {
                                unit: 'pages',
                                value: 3,
                            },
                        },
                    },
                }),
            );
        });

        test('should use boxAnnotations instance if provided', async () => {
            const boxAnnotations = jest.fn();
            const wrapper = getWrapper({ ...props, boxAnnotations });

            wrapper.setState({ file });

            const instance = wrapper.instance();

            await instance.loadPreview();

            expect(instance.preview.show).toHaveBeenCalledWith(
                file.id,
                expect.any(Function),
                expect.objectContaining({
                    boxAnnotations,
                }),
            );
        });

        test.each`
            called   | showAnnotationsControls
            ${true}  | ${true}
            ${false} | ${false}
        `(
            'should call onAnnotationCreate $called if showAnnotationsControls is $showAnnotationsControls',
            async ({ called, showAnnotationsControls }) => {
                const onAnnotator = jest.fn();
                const wrapper = getWrapper({ ...props, showAnnotationsControls, onAnnotator });

                wrapper.setState({ file });

                const instance = wrapper.instance();

                await instance.loadPreview();

                if (called) {
                    expect(instance.preview.addListener).toHaveBeenCalledWith('annotator_create', onAnnotator);
                } else {
                    expect(instance.preview.addListener).not.toHaveBeenCalledWith('annotator_create', onAnnotator);
                }
            },
        );

        test.each`
            called   | advancedContentInsights
            ${true}  | ${{}}
            ${false} | ${undefined}
        `(
            'should call onContentInsightsEventReport $called if advancedContentInsights is $advancedContentInsights',
            async ({ called, advancedContentInsights }) => {
                const onContentInsightsEventReport = jest.fn();
                const wrapper = getWrapper({
                    ...props,
                    advancedContentInsights,
                    onContentInsightsEventReport,
                });

                wrapper.setState({ file });

                const instance = wrapper.instance();

                await instance.loadPreview();

                if (called) {
                    expect(instance.preview.addListener).toHaveBeenCalledWith(
                        'advanced_insights_report',
                        onContentInsightsEventReport,
                    );
                } else {
                    expect(instance.preview.addListener).not.toHaveBeenCalledWith(
                        'advanced_insights_report',
                        onContentInsightsEventReport,
                    );
                }
            },
        );
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
            expect(instance.state.error).toBeUndefined();
            expect(instance.state.isReloadNotificationVisible).toEqual(false);
        });

        test('should set the state to new file if watermarked', () => {
            const newFile = { ...file };
            newFile.watermark_info = { is_watermarked: true };
            instance.setState({ file });
            instance.fetchFileSuccessCallback(newFile);

            expect(instance.state.file).toEqual(newFile);
            expect(instance.state.error).toBeUndefined();
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
            expect(instance.state.error).toBeUndefined();
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

        test('should set the error state from the error object', () => {
            instance.fetchFileErrorCallback(error, 'code');
            expect(instance.state.error).toEqual({ code: 'code', message: 'foo' });
            expect(instance.fetchFile).not.toBeCalled();
            expect(instance.file).toBeUndefined();
            expect(onError).toHaveBeenCalled();
        });

        test('should use the code from response if it exists', () => {
            instance.fetchFileErrorCallback({ code: 'specialCode', message: 'specialMessage' }, 'code');
            expect(instance.state.error).toEqual({ code: 'specialCode', message: 'specialMessage' });
            expect(instance.fetchFile).not.toBeCalled();
            expect(instance.file).toBeUndefined();
            expect(onError).toHaveBeenCalled();
        });

        test('should set isLoading to false', () => {
            instance.setState({ isLoading: true });
            instance.fetchFileErrorCallback({ code: 'specialCode', message: 'specialMessage' }, 'code');
            expect(instance.state.isLoading).toBe(false);
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
                collection: [{}, {}],
                fileId: 123,
                onLoad: jest.fn(),
                token: 'token',
            };
            const wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.preview = {};
            instance.focusPreview = jest.fn();
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

        test('should call prefetch if filesToPrefetch is not empty', () => {
            instance.onPreviewLoad(data);
            expect(instance.prefetch).toBeCalled();
        });

        test('should set isLoading to false', () => {
            instance.onPreviewLoad(data);
            expect(instance.state.isLoading).toBe(false);
        });

        test('should call dynamicOnPreviewLoadAction if it is defined', () => {
            instance.dynamicOnPreviewLoadAction = jest.fn();
            instance.onPreviewLoad(data);
            expect(instance.dynamicOnPreviewLoadAction).toBeCalled();
        });

        test('should not call dynamicOnPreviewLoadAction if it is not defined', () => {
            expect(() => instance.onPreviewLoad(data)).not.toThrow();
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
        test('should render PreviewMask', () => {
            const wrapper = getWrapper(props);
            expect(wrapper.find(PreviewMask).exists()).toBe(true);
        });

        test('should render PreviewMask with the current file extension if available', () => {
            const fileId = '123';
            const wrapper = getWrapper({ fileId });

            wrapper.setState({ file: { extension: 'pdf', id: fileId } });

            expect(wrapper.find(PreviewMask).prop('extension')).toBe('pdf');
        });

        test('should render PreviewMask with no extension if the file id recently changed', () => {
            const fileId = '123';
            const wrapper = getWrapper({ fileId });

            wrapper.setState({ file: { extension: 'pdf', id: fileId } });
            wrapper.setProps({ fileId: '456' }); // New file id means the internal file state is stale

            expect(wrapper.find(PreviewMask).prop('extension')).toBe('');
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
            expect(instance.state.error).toBeUndefined();
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

        test('should destroy preview and load the file if fileId changed', () => {
            wrapper.setProps({
                fileId: 'bar',
            });
            expect(instance.destroyPreview).toBeCalledTimes(1);
            expect(instance.fetchFile).toBeCalledTimes(1);
        });

        test('should update the loading state if fileId changes', () => {
            wrapper.setState({ isLoading: false }); // Simulate existing preview
            wrapper.setProps({ fileId: 'bar' });

            expect(wrapper.state('isLoading')).toBe(true);
        });

        test("should load preview if fileId hasn't changed and shouldLoadPreview returns true", () => {
            instance.shouldLoadPreview = jest.fn().mockReturnValue(true);
            wrapper.setProps({
                foo: 'bar',
            });
            expect(instance.loadPreview).toBeCalledTimes(1);
        });

        test("should update the loading state if fileId hasn't changed and shouldLoadPreview returns true", () => {
            instance.shouldLoadPreview = jest.fn().mockReturnValue(true);
            wrapper.setState({ isLoading: false }); // Simulate existing preview
            wrapper.setProps({ fileId: 'bar' });

            expect(wrapper.state('isLoading')).toBe(true);
        });

        test('should update the preview with the new token if it changes', () => {
            wrapper.setProps({
                token: 'bar',
            });
            expect(instance.updatePreviewToken).toBeCalledTimes(1);
        });

        test('should update experiences in preview when previewExperiences changes', async () => {
            instance.preview = new global.Box.Preview();
            wrapper.setProps({
                previewExperiences: {},
            });

            expect(instance.preview.updateExperiences).toBeCalledTimes(1);
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

    describe('handleAnnotationSelect', () => {
        test.each`
            annotationFileVersionId | selectedVersionId | locationType | setStateCount
            ${'123'}                | ${'124'}          | ${'page'}    | ${1}
            ${'124'}                | ${'124'}          | ${'page'}    | ${0}
            ${'123'}                | ${'124'}          | ${'frame'}   | ${0}
            ${'123'}                | ${'124'}          | ${''}        | ${0}
            ${undefined}            | ${'124'}          | ${'page'}    | ${0}
        `(
            'should call onVersionChange $onVersionChangeCount times and setState $setStateCount times',
            ({ annotationFileVersionId, selectedVersionId, locationType, setStateCount }) => {
                const annotation = {
                    id: '123',
                    file_version: {
                        id: annotationFileVersionId,
                    },
                    target: {
                        location: {
                            type: locationType,
                        },
                    },
                };

                const emit = jest.fn();
                const wrapper = getWrapper();
                const instance = wrapper.instance();

                jest.spyOn(instance, 'getViewer').mockReturnValue({ emit });

                wrapper.setState({ selectedVersion: { id: selectedVersionId } });
                instance.setState = jest.fn();

                instance.handleAnnotationSelect(annotation);

                expect(instance.setState).toHaveBeenCalledTimes(setStateCount);
                expect(emit).toBeCalledWith('scrolltoannotation', { id: annotation.id, target: annotation.target });
            },
        );

        test.each`
            annotationFileVersionId | selectedVersionId | locationType | deferScrollToOnload
            ${'123'}                | ${'124'}          | ${'frame'}   | ${true}
            ${'123'}                | ${'124'}          | ${'page'}    | ${false}
        `(
            'should not call emit scrolltoannotation if deferScrollToOnload is $deferScrollToOnload',
            ({ annotationFileVersionId, selectedVersionId, locationType, deferScrollToOnload }) => {
                const annotation = {
                    id: '123',
                    file_version: { id: annotationFileVersionId },
                    target: { location: { type: locationType } },
                };
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                wrapper.setState({ selectedVersion: { id: selectedVersionId } });
                const emit = jest.fn();
                jest.spyOn(instance, 'getViewer').mockReturnValue({ emit });
                instance.setState = jest.fn();

                instance.handleAnnotationSelect(annotation, deferScrollToOnload);
                if (deferScrollToOnload) {
                    expect(emit).not.toBeCalled();
                    expect(instance.dynamicOnPreviewLoadAction).toBeDefined();
                } else {
                    expect(emit).toBeCalledWith('scrolltoannotation', { id: annotation.id, target: annotation.target });
                    expect(instance.dynamicOnPreviewLoadAction).not.toBeDefined();
                }
            },
        );
        test('should set dynamicOnPreviewLoadAction and call srollToAnnotation properly if deferScrollToOnload is true', () => {
            const annotation = {
                id: '123',
                file_version: { id: '123' },
                target: { location: { type: 'frame' } },
            };
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            wrapper.setState({ selectedVersion: { id: 123 } });
            const emit = jest.fn();
            jest.spyOn(instance, 'getViewer').mockReturnValue({ emit });
            instance.setState = jest.fn();
            instance.handleAnnotationSelect(annotation, true);
            expect(instance.dynamicOnPreviewLoadAction).toBeDefined();
            let handleLoadedData;
            const mockAddEventListener = jest.fn().mockImplementation((listener, callback) => {
                expect(listener).toBe('loadeddata');
                expect(callback).toBeDefined();
                handleLoadedData = callback;
            });
            const mockRemoveEventListener = jest.fn().mockImplementation((listener, callback) => {
                expect(listener).toBe('loadeddata');
                expect(callback).toEqual(handleLoadedData);
                handleLoadedData = null;
            });
            jest.spyOn(document, 'querySelector').mockReturnValue({
                addEventListener: mockAddEventListener,
                removeEventListener: mockRemoveEventListener,
            });
            instance.dynamicOnPreviewLoadAction();
            expect(mockAddEventListener).toBeCalledWith('loadeddata', handleLoadedData);
            handleLoadedData();
            expect(emit).toBeCalledWith('scrolltoannotation', { id: annotation.id, target: annotation.target });
            expect(instance.dynamicOnPreviewLoadAction).toBeNull();
            expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
        });

        test('dynamicOnPreviewLoadAction should return if video player does not exist', () => {
            const annotation = {
                id: '123',
                file_version: { id: '123' },
                target: { location: { type: 'frame' } },
            };
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            wrapper.setState({ selectedVersion: { id: 123 } });
            const emit = jest.fn();
            jest.spyOn(instance, 'getViewer').mockReturnValue({ emit });
            instance.setState = jest.fn();
            jest.spyOn(document, 'querySelector').mockReturnValue(null);
            instance.handleAnnotationSelect(annotation, true);
            instance.dynamicOnPreviewLoadAction();
            expect(instance.dynamicOnPreviewLoadAction).toBeNull();
            expect(emit).not.toBeCalled();
        });

        test('dynamicOnPreviewLoadAction should still call emit scrolltoannotation if target location type is not frame', () => {
            const annotation = {
                id: '123',
                file_version: { id: '123' },
                target: { location: { type: 'page' } },
            };
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            wrapper.setState({ selectedVersion: { id: 123 } });
            const emit = jest.fn();
            jest.spyOn(instance, 'getViewer').mockReturnValue({ emit });
            const scrollToFrameAnnotation = jest.fn();
            jest.spyOn(instance, 'scrollToFrameAnnotation').mockReturnValue(scrollToFrameAnnotation);
            instance.setState = jest.fn();
            instance.handleAnnotationSelect(annotation, true);
            instance.dynamicOnPreviewLoadAction();
            expect(scrollToFrameAnnotation).not.toBeCalled();
            expect(emit).toBeCalledWith('scrolltoannotation', { id: annotation.id, target: annotation.target });
            expect(instance.dynamicOnPreviewLoadAction).toBeNull();
        });
    });

    describe('getThumbnail()', () => {
        let instance;
        let wrapper;
        const pageNumber = 1;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            file = {
                id: '123',
            };
        });

        test('should call the preview getThumbnail function', () => {
            const getThumbnailStub = jest.fn();
            wrapper.setState({ file });
            instance.preview = new global.Box.Preview();
            instance.preview.viewer = {
                getThumbnail: getThumbnailStub,
            };
            const pageThumbnail = instance.getThumbnail(pageNumber);
            expect(pageThumbnail).not.toBeNull();
            expect(getThumbnailStub).toBeCalledWith(pageNumber);
        });

        test('should return null if the preview viewer does not exists', () => {
            wrapper.setState({ file });
            const pageThumbnail = instance.getThumbnail(pageNumber);

            expect(pageThumbnail).toBeNull();
        });
    });

    describe('scrollToFrameAnnotation()', () => {
        let annotation;
        let addEventListener;
        let removeEventListener;
        let mockVideoPlayer;
        beforeEach(() => {
            addEventListener = jest.fn();
            removeEventListener = jest.fn();
            mockVideoPlayer = {
                addEventListener,
                removeEventListener,
                readyState: 0,
            };

            annotation = {
                id: '123',
                file_version: { id: '123' },
                target: { location: { type: 'frame' } },
            };

            jest.spyOn(document, 'querySelector').mockImplementation(selector => {
                expect(selector).toBe('.bp-media-container video');
                return mockVideoPlayer;
            });
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        test('should emit scrolltoannotation immediately if video player is ready to seek and not set video event listener', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            jest.spyOn(instance, 'getViewer').mockReturnValue(null);
            mockVideoPlayer.readyState = 4;
            instance.scrollToFrameAnnotation(annotation.id, annotation.target);
            expect(mockVideoPlayer.addEventListener).not.toBeCalled();
            expect(mockVideoPlayer.removeEventListener).not.toBeCalled();
        });

        test('should not emit scrolltoannotation immediately if video player is ready to seek and the viewer is not found', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            jest.spyOn(instance, 'getViewer').mockReturnValue(null);
            mockVideoPlayer.readyState = 4;
            instance.scrollToFrameAnnotation(annotation.id, annotation.target);
            expect(mockVideoPlayer.addEventListener).not.toBeCalled();
            expect(mockVideoPlayer.removeEventListener).not.toBeCalled();
        });

        test('should add event listener to video player if video player is not ready to seek', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            wrapper.setState({ selectedVersion: { id: 123 } });
            const emit = jest.fn();
            jest.spyOn(instance, 'getViewer').mockReturnValue({ emit });
            mockVideoPlayer.readyState = 0;
            instance.scrollToFrameAnnotation(annotation.id, annotation.target);
            expect(emit).not.toBeCalled();
            expect(addEventListener).toBeCalled();
        });
    });
});
