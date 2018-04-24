import React from 'react';
import { shallow } from 'enzyme';
import { ContentPreviewComponent as ContentPreview } from '../ContentPreview';
import * as TokenService from '../../../util/TokenService';

jest.mock('../../Internationalize', () => 'mock-internationalize');

const getWrapper = (props) => shallow(<ContentPreview {...props} />);
let props;
let file;

describe('components/ContentPreview/ContentPreview', () => {
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
    });
});
