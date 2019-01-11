import React from 'react';
import noop from 'lodash/noop';
import { shallow } from 'enzyme';
import UploadInput from '../UploadInput';

describe('elements/content-uploader/UploadInput', () => {
    const getWrapper = props => shallow(<UploadInput handleChange={noop} {...props} />);

    test('should render correctly when inputLabel is available', () => {
        const wrapper = getWrapper({
            inputLabelClass: 'inputLabelClass',
            inputLabel: 'yo',
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly when inputLabel is not available', () => {
        const wrapper = getWrapper({});

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly when isFolderUpload is true', () => {
        const wrapper = getWrapper({
            inputLabel: 'yo',
            isFolderUpload: true,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
