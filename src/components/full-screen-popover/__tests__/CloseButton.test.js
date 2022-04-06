import React from 'react';

import CloseButton from '../CloseButton';

describe('components/full-screen-popover/CloseButton', () => {
    test('should correctly render button', () => {
        const wrapper = shallow(<CloseButton />);

        expect(wrapper).toMatchSnapshot();
    });
});
