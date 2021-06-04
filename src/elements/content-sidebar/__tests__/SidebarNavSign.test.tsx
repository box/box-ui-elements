import React from 'react';
import { shallow } from 'enzyme';
import BoxSign28 from '../../../icon/logo/BoxSign28';
import PlainButton from '../../../components/plain-button';
import SidebarNavSign from '../SidebarNavSign';
import Tooltip from '../../../components/tooltip';

describe('elements/content-sidebar/SidebarNavSign', () => {
    const getWrapper = (props = {}) => shallow(<SidebarNavSign {...props} />).dive();

    test.each`
        status       | label
        ${undefined} | ${'Request Signature'}
        ${'random'}  | ${'Request Signature'}
        ${'active'}  | ${'Sign'}
    `('should show the correct label based on the current signature status', ({ label, status }) => {
        const wrapper = getWrapper({ status });

        expect(wrapper.find(Tooltip).prop('text')).toBe(label);
        expect(wrapper.find(PlainButton).prop('aria-label')).toBe(label);
        expect(wrapper.exists(BoxSign28)).toBe(true);
    });
});
