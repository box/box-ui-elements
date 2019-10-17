import React from 'react';
import { shallow } from 'enzyme';
import IconName from '../IconName';
import { STATUS_ERROR, STATUS_IN_PROGRESS } from '../../../constants';

describe('elements/content-uploader/IconName', () => {
    const getWrapper = props => shallow(<IconName extension="pdf" name="hi" {...props} />);

    test('should render file IconName correctly', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render folder IconName correctly', () => {
        const wrapper = getWrapper({ isFolder: true });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render file IconName with alert badge correctly', () => {
        const wrapper = getWrapper({ isResumableUploadsEnabled: true, status: STATUS_ERROR });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render folder IconName with alert badge correctly', () => {
        const wrapper = getWrapper({ isFolder: true, isResumableUploadsEnabled: true, status: STATUS_ERROR });

        expect(wrapper).toMatchSnapshot();
    });

    test('should not render alert badge on file IconName when not in error state', () => {
        const wrapper = getWrapper({ isResumableUploadsEnabled: true, status: STATUS_IN_PROGRESS });

        expect(wrapper).toMatchSnapshot();
    });

    test('should not render alert badge on folder IconName when not in error state', () => {
        const wrapper = getWrapper({ isFolder: true, isResumableUploadsEnabled: true, status: STATUS_IN_PROGRESS });

        expect(wrapper).toMatchSnapshot();
    });
});
