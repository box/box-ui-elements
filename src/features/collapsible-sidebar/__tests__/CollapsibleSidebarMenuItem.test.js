import * as React from 'react';
import Tooltip from '../../../components/tooltip';
import { mountConnected } from '../../../test-utils/enzyme';

import * as libDom from '../../../utils/dom';

import CollapsibleSidebarMenuItem from '../CollapsibleSidebarMenuItem';
import CollapsibleSidebarContext from '../CollapsibleSidebarContext';

jest.mock('../../../utils/dom', () => ({ useIsContentOverflowed: jest.fn() }));

describe('components/core/collapsible-sidebar/__tests__/CollapsibleSidebarMenuItem', () => {
    const getWrapper = (props, { isScrolling = false } = {}) => {
        return mountConnected(
            <CollapsibleSidebarContext.Provider value={{ isScrolling }}>
                <CollapsibleSidebarMenuItem {...props} />
            </CollapsibleSidebarContext.Provider>,
        );
    };

    test('matches snapshot', () => {
        libDom.useIsContentOverflowed.mockReturnValue(false);

        const wrapper = getWrapper(
            {
                className: 'foo',
                text: 'bar',
                icon: 'bold',
            },
            { isScrolling: false },
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should allow tooltip if text is overflowing and not scrolling', () => {
        libDom.useIsContentOverflowed.mockReturnValue(true);

        const wrapper = getWrapper({ text: 'bar', icon: 'bold' }, { isScrolling: false });

        expect(wrapper.find('.bdl-CollapsibleSidebar-menuItemToolTip').length).toBe(1);
        expect(wrapper.find(Tooltip).prop('isShown')).toBe(undefined); // can show on hover
        expect(wrapper.find(Tooltip).prop('isDisabled')).toBe(false);
    });

    test('should not render visible tooltip if text is overflowing and scrolling', () => {
        libDom.useIsContentOverflowed.mockReturnValue(true);

        const wrapper = getWrapper({ text: 'bar', icon: 'bold' }, { isScrolling: true });

        expect(wrapper.find('.bdl-CollapsibleSidebar-menuItemToolTip').length).toBe(0);
    });

    test('should spread props to inner element', () => {
        const mouseEvent = jest.fn();

        const wrapper = getWrapper({
            className: 'foo',
            text: 'bar',
            icon: 'bold',
            onMouseOver: mouseEvent,
        });

        const classNameTarget = wrapper.find('CollapsibleSidebarMenuItem__StyledMenuItem');
        const restTarget = wrapper.find('a');
        expect(restTarget.prop('onMouseOver')).toBe(mouseEvent);
        expect(classNameTarget.prop('className')).toBe('foo');
    });

    test('should not show overflow action container', () => {
        libDom.useIsContentOverflowed.mockReturnValue(false);

        const wrapper = getWrapper({
            className: 'foo',
            text: 'bar',
            icon: 'bold',
        });
        expect(wrapper.find('.bdl-CollapsibleSidebar-menuItemActionContainer').length).toBe(0);
    });

    test('should show overflow action by default', () => {
        libDom.useIsContentOverflowed.mockReturnValue(false);

        const wrapper = getWrapper({
            className: 'foo',
            text: 'bar',
            icon: 'bold',
            overflowAction: <div>Hi</div>,
        });
        expect(wrapper.find('.show-action').length).toBe(2);
        expect(wrapper.find('.bdl-CollapsibleSidebar-menuItemActionContainer').length).toBe(1);
    });

    test('should show overflow action on hover if showAction is set to hover', () => {
        libDom.useIsContentOverflowed.mockReturnValue(false);

        const wrapper = getWrapper({
            className: 'foo',
            text: 'bar',
            icon: 'bold',
            overflowAction: <div>Hi</div>,
            showAction: 'hover',
        });
        expect(wrapper.find('.show-action').length).toBe(0);
        expect(wrapper.find('.bdl-CollapsibleSidebar-menuItemActionContainer').length).toBe(1);
    });
});
