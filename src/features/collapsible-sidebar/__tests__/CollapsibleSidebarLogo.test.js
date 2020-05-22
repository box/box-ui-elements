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

    test('render logo element with linkUrl thats passed', () => {
        const someUrl = '/some/url';
        const sidebar = getWrapper({
            linkUrl: someUrl,
        });

        const componentProp = sidebar.find('CollapsibleSidebarItem').prop('expandedElement');
        expect(componentProp.props.children[1].props.href).toBe(someUrl);
    });

    test('render logo element with linkHtmlAttributes thats passed', () => {
        const someValue = 'someValue';
        const sidebar = getWrapper({
            linkHtmlAttributes: { someProp: someValue },
        });

        const componentProp = sidebar.find('CollapsibleSidebarItem').prop('expandedElement');
        expect(componentProp.props.children[1].props.someProp).toBe(someValue);
    });
});
