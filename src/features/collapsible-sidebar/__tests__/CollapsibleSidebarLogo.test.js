import React from 'react';
import { shallow } from 'enzyme';

import CollapsibleSidebarLogo from '../CollapsibleSidebarLogo';

describe('components/core/collapsible-sidebar/CollapsibleSidebar', () => {
    const getWrapper = (props = {}) => shallow(<CollapsibleSidebarLogo {...props} />);

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
});
