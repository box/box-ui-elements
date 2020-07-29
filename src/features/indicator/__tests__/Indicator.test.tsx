import React from 'react';
import { shallow } from 'enzyme';
import Indicator from '../Indicator';

describe('components/indicator/Indicator', () => {
    test('should correctly render default element', () => {
        const children = 'foo';

        const wrapper = shallow(<Indicator>{children}</Indicator>);

        expect(wrapper).toMatchSnapshot();
    });
});
