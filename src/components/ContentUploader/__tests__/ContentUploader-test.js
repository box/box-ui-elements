import React from 'react';
import { shallow } from 'enzyme';
import { ContentUploaderComponent } from '../ContentUploader';
import * as UploaderUtils from '../../../util/uploads';

describe('components/ContentUploader/ContentUploader', () => {
    const getWrapper = (props = {}) =>
        shallow(<ContentUploaderComponent {...props} />);

    describe('getUploadAPI()', () => {
        const CHUNKED_UPLOAD_MIN_SIZE_BYTES = 52428800; // 50MB
        let wrapper;
        let instance;
        let getPlainUploadAPI;
        let getChunkedUploadAPI;

        const file = {
            size: CHUNKED_UPLOAD_MIN_SIZE_BYTES + 1,
        };

        beforeEach(() => {
            jest.spyOn(global.console, 'warn').mockImplementation();
            wrapper = getWrapper();
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
            jest.spyOn(UploaderUtils, 'isMultiputSupported').mockImplementation(
                () => true,
            );
            instance.getUploadAPI(file);
            expect(instance.createAPIFactory).toBeCalled();
            expect(getChunkedUploadAPI).toBeCalled();
        });

        test('should use the regular upload api if the file <= 50MB', () => {
            jest.spyOn(UploaderUtils, 'isMultiputSupported').mockImplementation(
                () => true,
            );
            instance.getUploadAPI({
                ...file,
                size: CHUNKED_UPLOAD_MIN_SIZE_BYTES,
            });
            expect(getPlainUploadAPI).toBeCalled();
        });

        test('should use the regular upload api if multiput not supported', () => {
            jest.spyOn(UploaderUtils, 'isMultiputSupported').mockImplementation(
                () => false,
            );
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
            jest.spyOn(UploaderUtils, 'isMultiputSupported').mockImplementation(
                () => true,
            );
            instance.getUploadAPI(file);
            expect(getPlainUploadAPI).toBeCalled();
        });
    });
});
