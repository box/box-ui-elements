import React from 'react';
import { shallow } from 'enzyme';

import IconTrackPrevious from '../IconTrackPrevious';

describe('icons/general/IconTrackPrevious', () => {
    const getWrapper = (props = {}) => shallow(<IconTrackPrevious {...props} />);

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
