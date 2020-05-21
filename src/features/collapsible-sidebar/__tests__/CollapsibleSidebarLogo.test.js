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

    test('render logo element with url thats passed', () => {
        const sidebar = getWrapper({
            url: '/some/url',
        });

        expect(sidebar).toMatchSnapshot();
    });

    test('render logo element with htmlAttributes thats passed', () => {
        const sidebar = getWrapper({
            htmlAttributes: { someProp: 'someValue' },
        });

        expect(sidebar).toMatchSnapshot();
    });
});
