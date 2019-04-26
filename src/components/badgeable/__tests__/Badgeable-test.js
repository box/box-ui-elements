import React from 'react';

import Badgeable from '../Badgeable';

describe('components/badgeable/Badgeable', () => {
    test('should correctly render children in a badgeable wrapper without badges', () => {
        const children = 'some text to render';
        const wrapper = shallow(<Badgeable>{children}</Badgeable>);

        expect(wrapper).toMatchSnapshot();
    });

    test('should pass down props to children when it is an element', () => {
        const children = <div id="render">Some text to render</div>;
        const wrapper = shallow(<Badgeable foo="bar">{children}</Badgeable>);
        // console.log(wrapper.prop("foo"));
        expect(
            wrapper
                .find('#render')
                .first()
                .prop('foo'),
        ).toEqual('bar');
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
