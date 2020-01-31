import * as React from 'react';

import ScrollWrapper from '../ScrollWrapper';

describe('components/scroll-wrapper/ScrollWrapper', () => {
    test('should render with default properties intact', () => {
        const wrapper = shallow(<ScrollWrapper />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should respect custom class names passed in', () => {
        const wrapper = shallow(<ScrollWrapper className="test-classname" />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render children as specified', () => {
        const wrapper = mount(
            <ScrollWrapper>
                <p>lorem ipsum dolor sit amet</p>
            </ScrollWrapper>,
        );

        expect(wrapper).toMatchSnapshot();
    });
});
