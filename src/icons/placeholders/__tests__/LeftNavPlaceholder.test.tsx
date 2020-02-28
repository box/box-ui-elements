import React from 'react';
import { shallow } from 'enzyme';
import LeftNavPlaceholder from '../LeftNavPlaceholder';

describe('icons/illustrations/LeftNavPlaceholder', () => {
    const getWrapper = (props = {}) => shallow(<LeftNavPlaceholder {...props} />);

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
