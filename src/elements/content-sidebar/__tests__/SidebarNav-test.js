import React from 'react';
import { shallow } from 'enzyme';
import IconMagicWand from '../../../icons/general/IconMagicWand';
import IconMetadataThick from '../../../icons/general/IconMetadataThick';
import IconDocInfo from '../../../icons/general/IconDocInfo';
import IconChatRound from '../../../icons/general/IconChatRound';
import SidebarNavButton from '../SidebarNavButton';
import SidebarNav from '../SidebarNav';

describe('elements/content-sidebar/SidebarNav', () => {
    const getWrapper = props => shallow(<SidebarNav {...props} />);

    test('should render skills tab', () => {
        const props = {
            hasSkills: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(IconMagicWand)).toHaveLength(1);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
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
        expect(wrapper).toMatchSnapshot();
    });

    test('should render activity tab', () => {
        const props = {
            hasActivityFeed: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
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
        expect(wrapper).toMatchSnapshot();
    });

    test('should select activity tab', () => {
        const props = {
            hasSkills: true,
            hasActivityFeed: true,
            hasMetadata: true,
            selectedView: 'activity',
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(IconMagicWand)).toHaveLength(1);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(1);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(1);
        expect(wrapper.find(SidebarNavButton)).toHaveLength(3);
        expect(
            wrapper
                .find(SidebarNavButton)
                .at(0)
                .prop('isSelected'),
        ).toBeTruthy();
        expect(wrapper).toMatchSnapshot();
    });
});
