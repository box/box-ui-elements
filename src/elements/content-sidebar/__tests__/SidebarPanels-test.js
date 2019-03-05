import React from 'react';
import { shallow } from 'enzyme/build';
import SidebarPanels from '../SidebarPanels';

describe('elements/content-sidebar/SidebarPanels', () => {
    const getWrapper = props => shallow(<SidebarPanels file={{ id: '' }} isOpen {...props} />);

    describe('render', () => {
        test('should render no sidebar', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render skills sidebar', () => {
            const wrapper = getWrapper({ hasSkills: true });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render activity sidebar', () => {
            const wrapper = getWrapper({ hasActivityFeed: true });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render details sidebar', () => {
            const wrapper = getWrapper({ hasDetails: true });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render metadata sidebar', () => {
            const wrapper = getWrapper({ hasMetadata: true });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
