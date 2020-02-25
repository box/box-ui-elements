import React from 'react';
import { shallow } from 'enzyme';

import IconMetadataColored from '../IconMetadataColored';

describe('icons/general/IconMetadataColored', () => {
    const getWrapper = (props = {}) => shallow(<IconMetadataColored {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            title: 'title',
            width: 160,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with type cascade', () => {
        const wrapper = getWrapper({
            className: 'test',
            title: 'title',
            type: 'cascade',
            width: 160,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with type default', () => {
        const wrapper = getWrapper({
            className: 'test',
            title: 'title',
            type: 'default',
            width: 160,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with custom color', () => {
        const wrapper = getWrapper({
            color: '#00FF00',
            className: 'test',
            title: 'title',
            type: 'default',
            width: 160,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
