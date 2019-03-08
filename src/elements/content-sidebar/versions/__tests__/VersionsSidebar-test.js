import * as React from 'react';
import { shallow } from 'enzyme/build';
import { VersionsSidebarComponent as VersionsSidebar } from '..';

describe('elements/content-sidebar/versions/VersionsSidebar', () => {
    const getWrapper = (props = {}) => shallow(<VersionsSidebar {...props} />);

    describe('render', () => {
        test.each`
            versions
            ${undefined}
            ${[]}
            ${[{ id: 12345 }]}
        `('should match its snapshot', ({ versions }) => {
            const wrapper = getWrapper({ versions });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
