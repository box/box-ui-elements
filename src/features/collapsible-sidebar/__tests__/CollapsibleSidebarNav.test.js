import React from 'react';
import Scrollbar from 'react-scrollbars-custom';
import { mountConnected } from '../../../test-utils/enzyme';

import { getScrollShadowClassName } from '../utils/scrollShadow';
import CollapsibleSidebarNav from '../CollapsibleSidebarNav';
import CollapsibleSidebarContext from '../CollapsibleSidebarContext';

jest.mock('../CollapsibleSidebarContext', () => ({
    Provider: jest.fn(),
}));

jest.mock('../utils/scrollShadow', () => ({
    getScrollShadowClassName: jest.fn(),
}));

describe('components/core/collapsible-sidebar/CollapsibleSidebarNav', () => {
    const getWrapper = (props = {}) => {
        // Mounting to since we rely on ref values.
        return mountConnected(<CollapsibleSidebarNav {...props} />);
    };

    beforeEach(() => {
        CollapsibleSidebarContext.Provider.mockImplementation(({ children }) => children);
        getScrollShadowClassName.mockImplementation(() => 'foobar');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('render', () => {
        const sidebar = getWrapper({
            children: [<span key="1">abc</span>, <span key="2">def</span>],
            expanded: true,
            className: 'foo',
        });

        expect(sidebar).toMatchSnapshot();
    });

    test('scroll states are set when Scollbar component is scrolled', () => {
        const sidebar = getWrapper({
            children: [<span key="1">abc</span>, <span key="2">def</span>],
            expanded: true,
            className: 'foo',
        });

        sidebar.find(Scrollbar).prop('onScroll')();

        expect(sidebar.state().isScrolling).toBe(true);
        expect(sidebar.state().scrollShadowClassName).toBe('foobar');
    });

    test('should set shadowClassName based on shadowClass', () => {
        const sidebar = getWrapper({
            children: [<span key="1">abc</span>, <span key="2">def</span>],
            expanded: true,
            className: 'foo',
        });

        sidebar.setState({ scrollShadowClassName: 'baz' });

        sidebar.instance().setScrollShadowState();

        expect(sidebar.state().scrollShadowClassName).toBe('foobar');
    });
});
