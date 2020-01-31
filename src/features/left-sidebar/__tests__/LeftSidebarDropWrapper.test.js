// @flow
import React from 'react';

import LeftSidebarDropWrapper from '../LeftSidebarDropWrapper';

describe('feature/left-sidebar/LeftSidebarDropWrapper', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <LeftSidebarDropWrapper {...props}>
                <div />
            </LeftSidebarDropWrapper>,
        );

    describe('render', () => {
        test('should render a LeftSidebarDropWrapper component', () => {
            const wrapper = getWrapper();

            expect(wrapper).toMatchSnapshot();
        });

        test('should not render drop zone if it is not hovered and showDropZoneOnHover is true ', () => {
            const wrapper = getWrapper({
                showDropZoneOnHover: true,
                isDragging: true,
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should render drop zone if it is hovered and showDropZoneOnHover is true ', () => {
            const wrapper = getWrapper({
                showDropZoneOnHover: true,
                isDragging: true,
            });
            wrapper.setState({ dropZoneHover: true });

            expect(wrapper).toMatchSnapshot();
        });

        test('should set dropZoneHover on mouse enter', () => {
            const wrapper = getWrapper({
                showDropZoneOnHover: true,
                isDragging: true,
            });
            const previousDropZoneHover = wrapper.state().dropZoneHover;
            const dropZone = wrapper.find('.left-sidebar-drop-wrapper');

            dropZone.simulate('mouseEnter');

            expect(previousDropZoneHover).toBe(false);
            expect(wrapper.state().dropZoneHover).toBe(true);
        });

        test('should set dropZoneHover to false on mouse leave', () => {
            const wrapper = getWrapper({
                showDropZoneOnHover: true,
                isDragging: true,
            });
            const dropZone = wrapper.find('.left-sidebar-drop-wrapper');

            wrapper.setState({ dropZoneHover: true });
            dropZone.simulate('mouseLeave');

            expect(wrapper.state().dropZoneHover).toBe(false);
        });
    });

    describe('componentDidUpdate', () => {
        test('should set dropZoneHover state to false when dragging stops without mouseleave', () => {
            const wrapper = getWrapper({
                showDropZoneOnHover: true,
                isDragging: true,
            });
            wrapper.setState({ dropZoneHover: true });
            wrapper.setProps({ isDragging: false });

            expect(wrapper.state().dropZoneHover).toBe(false);
        });
    });
});
