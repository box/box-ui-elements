import React from 'react';
import { shallow } from 'enzyme';
import IconName from '../IconName';

describe('components/ContentUploader/IconName', () => {
    const getWrapper = props =>
        shallow(<IconName name="hi" extension="pdf" {...props} />);

    test('should render file IconName correctly', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render folder IconName correctly', () => {
        const wrapper = getWrapper({ isFolder: true });

        expect(wrapper).toMatchSnapshot();
    });
});
