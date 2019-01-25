import React from 'react';

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
                className="custom-class"
                topRight={<p>top right</p>}
                topLeft={<p>top left</p>}
                bottomRight={<p>bottom right</p>}
                bottomLeft={<p>bottom left</p>}
            >
                <div>Test</div>
            </Badgeable>,
        );

        expect(wrapper).toMatchSnapshot();
    });
});
