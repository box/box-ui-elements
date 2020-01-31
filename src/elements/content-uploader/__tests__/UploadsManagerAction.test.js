import React from 'react';
import { shallow } from 'enzyme';
import UploadsManagerAction from '../UploadsManagerAction';

describe('elements/content-uploader/UploadsManagerAction', () => {
    const getWrapper = props => shallow(<UploadsManagerAction {...props} />);

    test('should render correctly with hasMultipleFailedUploads as true', () => {
        const wrapper = getWrapper({
            hasMultipleFailedUploads: true,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly with hasMultipleFailedUploads as false', () => {
        const wrapper = getWrapper({
            hasMultipleFailedUploads: false,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
