import React from 'react';

import IconUploadSolid from '../IconUploadSolid';

describe('icons/general/IconUploadSolid', () => {
    const getWrapper = (props = {}) => shallow(<IconUploadSolid {...props} />);

    test('should correctly render icon with default values', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with all props specified', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#987654',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
