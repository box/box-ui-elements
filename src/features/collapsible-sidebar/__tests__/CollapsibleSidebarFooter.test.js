import React from 'react';
import { shallow } from 'enzyme';

import CollapsibleSidebarFooter from '../CollapsibleSidebarFooter';

describe('components/core/collapsible-sidebar/CollapsibleSidebarFooter', () => {
    const getWrapper = (props = {}) => shallow(<CollapsibleSidebarFooter {...props} />);

    test('render', () => {
        const footer = getWrapper({
            className: 'foo',
            children: [<span key="1">abc</span>, <span key="2">def</span>],
        });

        expect(footer).toMatchSnapshot();
    });
});
