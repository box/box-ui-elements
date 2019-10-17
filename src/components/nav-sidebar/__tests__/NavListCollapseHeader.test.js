import React from 'react';

import NavListCollapseHeader from '../NavListCollapseHeader';

describe('components/nav-sidebar/NavListCollapseHeader', () => {
    test('should render collapsible header', () => {
        const heading = 'text heading';
        const handler = () => 0;
        const header = shallow(<NavListCollapseHeader onToggleCollapse={handler}>{heading}</NavListCollapseHeader>);

        expect(header).toMatchSnapshot();
    });

    test('should properly render any container properties', () => {
        const heading = 'heading w/ containerProps';
        const cp = {
            a: 1,
            'snake-case': 2,
        };
        const handler = () => 0;
        const header = shallow(
            <NavListCollapseHeader containerProps={cp} onToggleCollapse={handler}>
                {heading}
            </NavListCollapseHeader>,
        );

        expect(header).toMatchSnapshot();
    });
});
