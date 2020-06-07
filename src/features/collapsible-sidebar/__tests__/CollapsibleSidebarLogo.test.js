import React from 'react';
import { mountConnected } from '../../../test-utils/enzyme';

import CollapsibleSidebarLogo from '../CollapsibleSidebarLogo';

describe('components/core/collapsible-sidebar/CollapsibleSidebar', () => {
    const getWrapper = (props = {}) => mountConnected(<CollapsibleSidebarLogo {...props} />);

    test('render', () => {
        const sidebar = getWrapper({
            collapsedElement: (
                <span key="1" className="collapsed">
                    abc
                </span>
            ),
            expandedElement: (
                <span key="1" className="expanded">
                    abc
                </span>
            ),
            expanded: true,
            className: 'foo',
        });

        expect(sidebar).toMatchSnapshot();
    });

    test('render', () => {
        const sidebar = getWrapper({
            canEndTrial: true,
        });

        expect(sidebar).toMatchSnapshot();
    });

    test('render toggle button with buttonProps thats passed', () => {
        const someValue = 'someValue';
        const sidebar = getWrapper({
            buttonProps: {
                'data-resin-target': someValue,
            },
            expanded: true,
        });

        const componentProp = sidebar.find('CollapsibleSidebarItem');
        expect(componentProp.find('PlainButton').prop('data-resin-target')).toBe(someValue);
    });

    test('render LinkBase element with linkUrl thats passed', () => {
        const someUrl = '/some/url';
        const sidebar = getWrapper({
            expanded: true,
            linkProps: {
                href: someUrl,
            },
        });

        const componentProp = sidebar.find('CollapsibleSidebarItem');
        expect(componentProp.find('LinkBase').prop('href')).toBe(someUrl);
    });

    test('render LinkBase element with linkHtmlAttributes thats passed', () => {
        const someValue = 'someValue';
        const sidebar = getWrapper({
            expanded: true,
            linkProps: { someprop: someValue },
        });

        const componentProp = sidebar.find('CollapsibleSidebarItem');
        expect(componentProp.find('LinkBase').prop('someprop')).toBe(someValue);
    });
});
