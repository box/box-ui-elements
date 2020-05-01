import React from 'react';
import { shallow } from 'enzyme';

import CollapsibleSidebar from '../CollapsibleSidebar';

describe('components/core/collapsible-sidebar/CollapsibleSidebar', () => {
    const getWrapper = (props = {}) => shallow(<CollapsibleSidebar {...props} />);

    test('render', () => {
        const sidebar = getWrapper({
            children: [<span key="1">abc</span>, <span key="2">def</span>],
            expanded: true,
            className: 'foo',
        });

        expect(sidebar).toMatchSnapshot();
    });
});
