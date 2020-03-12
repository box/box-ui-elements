import React from 'react';
import { shallow } from 'enzyme';
import IconDownloadFile from '../IconDownloadFile';

describe('icons/general/IconDownloadFile', () => {
    const getWrapper = (props = {}) => shallow(<IconDownloadFile {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#222',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
