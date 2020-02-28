import React from 'react';
import { shallow } from 'enzyme';
import FolderCircleIllustration from '../FolderCircleIllustration';

describe('icons/illustrations/FolderCircleIllustration', () => {
    const getWrapper = (props = {}) => shallow(<FolderCircleIllustration {...props} />);

    test('should correctly render default component', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render component with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            height: 400,
            title: 'title',
            width: 400,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
