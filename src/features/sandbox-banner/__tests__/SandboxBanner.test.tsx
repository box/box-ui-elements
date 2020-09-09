import React from 'react';
import { shallow } from 'enzyme';
import SandboxBanner from '../SandboxBanner';

describe('features/sandbox-banner/SandboxBanner', () => {
    test('should correctly render default element', () => {
        const children = 'foo';

        const wrapper = shallow(<SandboxBanner>{children}</SandboxBanner>);

        expect(wrapper).toMatchSnapshot();
    });
});
