import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import AdditionalTabPlaceholder from '../additional-tabs/AdditionalTabPlaceholder';
import AdditionalTabs from '../additional-tabs';
import AdditionalTabsLoading from '../additional-tabs/AdditionalTabsLoading';
import IconChatRound from '../../../icons/general/IconChatRound';
import IconDocInfo from '../../../icons/general/IconDocInfo';
import IconMagicWand from '../../../icons/general/IconMagicWand';
import IconMetadataThick from '../../../icons/general/IconMetadataThick';
import SidebarNav from '../SidebarNav';
import SidebarNavButton from '../SidebarNavButton';

describe('elements/content-sidebar/SidebarNav', () => {
    const getWrapper = (props, active = '') =>
        mount(
            <MemoryRouter initialEntries={[`/${active}`]}>
                <SidebarNav {...props} />
            </MemoryRouter>,
        )
            .find('SidebarNav')
            .at(1);

    test('should render skills tab', () => {
        const props = {
            hasSkills: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(IconMagicWand)).toHaveLength(1);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
    });

    test('should render details tab', () => {
        const props = {
            hasDetails: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(1);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
    });

    test('should render activity tab', () => {
        const props = {
            hasActivity: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(1);
    });

    test('should render metadata tab', () => {
        const props = {
            hasMetadata: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(1);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
    });

    test('should have multiple tabs', () => {
        const props = {
            hasActivity: true,
            hasMetadata: true,
            hasSkills: true,
        };
        const wrapper = getWrapper(props, 'activity');
        expect(wrapper.find(IconMagicWand)).toHaveLength(1);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(1);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(1);
        expect(wrapper.find(SidebarNavButton)).toHaveLength(3);
    });

    test('should render the additional tabs loading state', () => {
        const props = {
            additionalTabs: [],
            hasAdditionalTabs: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(AdditionalTabs)).toHaveLength(1);
        expect(wrapper.find(AdditionalTabsLoading)).toHaveLength(1);
        expect(wrapper.find(AdditionalTabPlaceholder)).toHaveLength(5);
    });
});
