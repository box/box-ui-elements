import React from 'react';
import { shallow } from 'enzyme';

import AdditionalTabFtuxTooltip from '../AdditionalTabFtuxTooltip';

describe('elements/content-sidebar/additional-tabs/AdditionalTabFtuxTooltip', () => {
    const getWrapper = (props, children) =>
        shallow(<AdditionalTabFtuxTooltip {...props}>{children}</AdditionalTabFtuxTooltip>);

    test('should render the tooltip', () => {
        const children = <div>Child content</div>;
        const targetingApi = () => {};
        const text = 'FTUX Text';

        const wrapper = getWrapper({ targetingApi, text }, children);

        expect(wrapper).toMatchSnapshot();
    });
});
