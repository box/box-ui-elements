import React from 'react';
import { shallow } from 'enzyme';
import ContentUploader from '../../content-uploader';
import UploadDialog from '../upload-dialog';

describe('elements/common/upload-dialog/UploadDialog', () => {
    const getWrapper = props => shallow(<UploadDialog {...props} />);

    describe('render()', () => {
        test('should render UploadDialog with contentUploaderProps', () => {
            const contentUploaderProps = {
                apiHost: 'https://api.box.com',
                chunked: false,
            };
            const wrapper = getWrapper({ contentUploaderProps });
            const contentUploaderElement = wrapper.find(ContentUploader);
            console.log('wrapper', wrapper);
            console.log('content uploader', contentUploaderElement);
            expect(contentUploaderElement.length).toBe(1);
            expect(contentUploaderElement.prop('contentUploaderProps')).toEqual(contentUploaderProps);
        });
    });
});
