import React from 'react';
import { shallow } from 'enzyme';

import IconDownloadSolid from '../IconDownloadSolid';

describe('icons/general/IconDownloadSolid', () => {
    const getWrapper = (props = {}) => shallow(<IconDownloadSolid {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '123',
            height: 150,
            title: 'title',
            width: 160,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
