import React from 'react';
import { shallow } from 'enzyme';

import IconChatRound from '../IconChatRound';

describe('icons/general/IconChatRound', () => {
    const getWrapper = (props = {}) => shallow(<IconChatRound {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
