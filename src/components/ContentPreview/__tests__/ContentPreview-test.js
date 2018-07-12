import React from 'react';
import { shallow } from 'enzyme';
import { ContentPreviewComponent as ContentPreview } from '../ContentPreview';
import * as TokenService from '../../../util/TokenService';

jest.mock('../../Internationalize', () => 'mock-internationalize');

const getWrapper = (props) => shallow(<ContentPreview {...props} />);
let props;
let file;

describe('components/ContentPreview/ContentPreview', () => {
    describe('componentDidUpdate()', () => {
        test('should not reload preview if component updates but we should not load preview', async () => {
            global.Box = {};
            global.Box.Preview = function Preview() {
                this.updateFileCache = jest.fn();
                this.show = jest.fn();
            };

            file = { id: '123' };

            props = {
                hasSidebar: true,
                token: 'token',
                fileId: file.id
            };
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            instance.shouldLoadPreview = jest.fn().mockReturnValue(false);
            instance.loadPreview = jest.fn();

            wrapper.setProps({
                hasSidebar: false
            });

            expect(instance.loadPreview).toHaveBeenCalledTimes(0);
        });
    });

    describe('shouldLoadPreview()', () => {
        test('should return true if file version ID has changed', () => {
            const wrapper = getWrapper(props);
            const instance = wrapper.instance();

            const oldFile = { id: '123', file_version: { id: '1234' } };
            const newFile = { id: '123', file_version: { id: '2345' } };
            wrapper.setState({ file: newFile });
            expect(instance.shouldLoadPreview({}, { file: oldFile })).toBeTruthy();
        });

        test('should return true if file object has newly been populated', () => {
            const wrapper = getWrapper(props);
            const instance = wrapper.instance();

            wrapper.setState({ file: { id: '123' } });
            expect(instance.shouldLoadPreview({}, { file: undefined })).toBeTruthy();
        });

        test('should return false if file has not changed', () => {
            file = { id: '123' };
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();

            expect(instance.shouldLoadPreview({}, { file })).toBeFalsy();
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
            };

            file = { id: '123' };
        });

        test('should get read token for preview', async () => {
            props = {
                token: 'token',
                fileId: file.id
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

        test('should bind onError prop to preview "preview_error" event', async () => {
            props = {
                onError: jest.fn(),
                token: 'token',
                fileId: file.id
            };
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            await instance.loadPreview();
            expect(instance.preview.addListener).toHaveBeenCalledWith('preview_error', props.onError);
        });

        test('should bind onError prop to preview "preview_metric" event', async () => {
            props = {
                onMetric: jest.fn(),
                token: 'token',
                fileId: file.id
            };
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            await instance.loadPreview();
            expect(instance.preview.addListener).toHaveBeenCalledWith('preview_metric', props.onMetric);
        });

        test('should bind onPreviewLoad method to preview "load" event', async () => {
            props = {
                onMetric: jest.fn(),
                token: 'token',
                fileId: file.id
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
                fileId: file.id
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
                    container: expect.stringContaining('.bcpr-content')
                })
            );
        });

        test('should use existing preview instance if set in props', async () => {
            const preview = new global.Box.Preview();
            props = {
                token: 'token',
                fileId: file.id,
                previewInstance: preview
            };
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();

            await instance.loadPreview();

            expect(instance.preview).toBe(preview);
        });

        test('should not add preview listeners again if previewInstance prop is passed in', async () => {
            const preview = new global.Box.Preview();
            props = {
                token: 'token',
                fileId: file.id,
                previewInstance: preview
            };
            const wrapper = getWrapper(props);
            wrapper.setState({ file });
            const instance = wrapper.instance();
            instance.addPreviewListeners = jest.fn();

            await instance.loadPreview();

            expect(instance.addPreviewListeners).toHaveBeenCalledTimes(0);
        });
    });
});
