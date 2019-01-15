import React from 'react';
import { shallow } from 'enzyme';
import UploadStateContent from '../UploadStateContent';

describe('elements/content-uploader/UploadStateContent', () => {
    const getWrapper = props =>
        shallow(<UploadStateContent fileInputLabel="file" folderInputLabel="folder" {...props} />);

    test('should render correctly when both folder and file inputs are available', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly when only file input is available', () => {
        const wrapper = getWrapper({
            folderInputLabel: undefined,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
