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

    beforeEach(() => {
        libDom.useIsContentOverflowed.mockReturnValue(false);
    });

    test('matches snapshot', () => {
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

    test('should show custom content when content is passed', () => {
        const testContent = 'Custom Content';
        const wrapper = getWrapper(
            {
                className: 'foo',
                content: <div className="custom-div">{testContent}</div>,
                icon: 'bold',
                text: 'bar',
            },
            { isScrolling: false },
        );

        expect(wrapper.find('.custom-div')).toHaveLength(1);
        expect(wrapper.find('.custom-div').text()).toBe(testContent);
        expect(wrapper.find('span.bdl-CollapsibleSidebar-menuItemLabel')).toHaveLength(1);
    });

    test('should allow tooltip if text is overflowing and not scrolling', () => {
        libDom.useIsContentOverflowed.mockReturnValue(true);

        const wrapper = getWrapper({ text: 'bar', icon: 'bold' }, { isScrolling: false });

        expect(wrapper.find('.bdl-CollapsibleSidebar-menuItemTooltip').length).toBe(1);
        expect(wrapper.find(Tooltip).prop('isShown')).toBe(undefined); // can show on hover
        expect(wrapper.find(Tooltip).prop('isDisabled')).toBe(false);
    });

    test('should not render visible tooltip if text is overflowing and scrolling', () => {
        libDom.useIsContentOverflowed.mockReturnValue(true);

        const wrapper = getWrapper({ text: 'bar', icon: 'bold' }, { isScrolling: true });

        expect(wrapper.find('.bdl-CollapsibleSidebar-menuItemTooltip').length).toBe(0);
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
        expect(classNameTarget.prop('className')).toBe('bdl-CollapsibleSidebar-menuItem foo');
    });

    test('should not show overflow action container', () => {
        const wrapper = getWrapper({
            className: 'foo',
            text: 'bar',
            icon: 'bold',
        });
        expect(wrapper.find('.bdl-CollapsibleSidebar-menuItemActionContainer').length).toBe(0);
    });

    test('should show overflow action by default', () => {
        const wrapper = getWrapper({
            className: 'foo',
            text: 'bar',
            icon: 'bold',
            overflowAction: <div>Hi</div>,
        });
        expect(wrapper.find('.show-overflowAction').length).toBe(2);
        expect(wrapper.find('.bdl-CollapsibleSidebar-menuItemActionContainer').length).toBe(1);
    });

    test('should show overflow action on hover if showAction is set to hover', () => {
        const wrapper = getWrapper({
            className: 'foo',
            text: 'bar',
            icon: 'bold',
            overflowAction: <div>Hi</div>,
            showOverflowAction: 'hover',
        });
        expect(wrapper.find('.show-overflowAction').length).toBe(0);
        expect(wrapper.find('.bdl-CollapsibleSidebar-menuItemActionContainer').length).toBe(1);
    });

    test('should show link class name when it is set', () => {
        const wrapper = getWrapper({
            className: 'foo',
            text: 'bar',
            icon: 'bold',
            linkClassName: 'is-currentPage',
        });
        expect(wrapper.find('CollapsibleSidebarMenuItem__StyledLink.is-currentPage').length).toBe(1);
    });
});
