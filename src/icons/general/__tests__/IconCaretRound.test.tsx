import React from 'react';
import { shallow } from 'enzyme';

import IconCaretRound from '../IconCaretRound';

describe('icons/general/IconCaretRound', () => {
    const getWrapper = (props = {}) => shallow(<IconCaretRound {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#444',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
