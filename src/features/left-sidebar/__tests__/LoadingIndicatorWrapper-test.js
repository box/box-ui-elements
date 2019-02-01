// @flow
import * as React from 'react';

import LeftSidebarDropWrapper from '../LeftSidebarDropWrapper';

describe('features/left-sidebar/LeftSidebarDropWrapper', () => {
    test('should render with default properties intact', () => {
        const child = <div>child</div>;
        const wrapper = shallow(<LeftSidebarDropWrapper isDragging="false">{child}</LeftSidebarDropWrapper>);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render dragging veil properly when specificed', () => {
        const child = <div>child</div>;
        const wrapper = shallow(<LeftSidebarDropWrapper isDragging="true">{child}</LeftSidebarDropWrapper>);

        expect(wrapper).toMatchSnapshot();
    });

    test('should allow custom classnames on wrapper', () => {
        const child = <div>child</div>;
        const wrapper = shallow(
            <LeftSidebarDropWrapper className="test-name" isDragging="true">
                {child}
            </LeftSidebarDropWrapper>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should pass thru any rest properties', () => {
        const child = <div>child</div>;
        const wrapper = shallow(
            <LeftSidebarDropWrapper className="test-name" data-resin-target="test" isDragging="true">
                {child}
            </LeftSidebarDropWrapper>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should not render drag target when specificed', () => {
        const child = <div>child</div>;
        const wrapper = shallow(<LeftSidebarDropWrapper isDragging="false">{child}</LeftSidebarDropWrapper>);

        expect(wrapper).toMatchSnapshot();
    });

    test('should not render drag target or drag text when specificed', () => {
        const child = <div>child</div>;
        const wrapper = shallow(
            <LeftSidebarDropWrapper isDragging="false" message="dragging to me">
                {child}
            </LeftSidebarDropWrapper>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should render drag target and message when specificed', () => {
        const child = <div>child</div>;
        const wrapper = shallow(
            <LeftSidebarDropWrapper isDragging="true" message="dragging to me">
                {child}
            </LeftSidebarDropWrapper>,
        );

        expect(wrapper).toMatchSnapshot();
    });
});
