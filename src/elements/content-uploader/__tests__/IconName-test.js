import React from 'react';
import { shallow } from 'enzyme';
import IconName from '../IconName';

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
});
