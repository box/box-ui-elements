import React from 'react';

import Badgeable from '../Badgeable';

describe('components/badgeable/Badgeable', () => {
    test('should correctly render children in a badgeable wrapper without badges', () => {
        const children = <div id="render">Some text to render</div>;
        const wrapper = shallow(<Badgeable>{children}</Badgeable>);

        expect(wrapper).toMatchSnapshot();
    });

    test('should pass down props to children when it is an element', () => {
        const wrapper = shallow(
            <Badgeable foo="bar">
                <div id="render">Some text to render</div>
            </Badgeable>,
        );
        expect(
            wrapper
                .find('#render')
                .first()
                .prop('foo'),
        ).toEqual('bar');
    });

    test('should throw an error when there are multiple children', () => {
        expect(() =>
            shallow(
                <Badgeable foo="bar">
                    <div id="render" />
                    <span />
                </Badgeable>,
            ),
        ).toThrow();
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
