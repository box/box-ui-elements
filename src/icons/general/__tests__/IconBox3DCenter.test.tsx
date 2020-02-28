import React from 'react';
import { shallow } from 'enzyme';

import IconBox3DCenter from '../IconBox3DCenter';

describe('icons/general/IconBox3DCenter', () => {
    const getWrapper = (props = {}) => shallow(<IconBox3DCenter {...props} />);

    it('should correctly render icon with default values', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    it('should correctly render icon with all props specified', () => {
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
