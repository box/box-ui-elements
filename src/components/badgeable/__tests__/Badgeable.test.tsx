import React from 'react';
import { shallow } from 'enzyme';

import Badgeable from '../Badgeable';

describe('components/badgeable/Badgeable', () => {
    test('should correctly render children in a badgeable wrapper without badges', () => {
        const children = 'some text to render';
        const wrapper = shallow(<Badgeable>{children}</Badgeable>);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render badges to any corner when given an element', () => {
        const wrapper = shallow(
            <Badgeable
                bottomLeft={<p>bottom left</p>}
                bottomRight={<p>bottom right</p>}
                className="custom-class"
                topLeft={<p>top left</p>}
                topRight={<p>top right</p>}
            >
                <div>Test</div>
            </Badgeable>,
        );

        expect(wrapper).toMatchSnapshot();
    });
});
