import React from 'react';
import { shallow } from 'enzyme';
import AcrossDevicesIllustration from '../AcrossDevicesIllustration';

describe('icons/illustrations/AcrossDevicesIllustration', () => {
    const getWrapper = (props = {}) => shallow(<AcrossDevicesIllustration {...props} />);

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
