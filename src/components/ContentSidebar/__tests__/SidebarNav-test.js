import React from 'react';
import { shallow } from 'enzyme';
import IconMagicWand from 'box-react-ui/lib/icons/general/IconMagicWand';
import IconMetadataThick from 'box-react-ui/lib/icons/general/IconMetadataThick';
import IconDocInfo from 'box-react-ui/lib/icons/general/IconDocInfo';
import IconChatRound from 'box-react-ui/lib/icons/general/IconChatRound';
import SidebarNavButton from '../SidebarNavButton';
import SidebarNav from '../SidebarNav';

describe('components/ContentSidebar/SidebarNav', () => {
    const getWrapper = (props) => shallow(<SidebarNav {...props} />);

    test('should render skills tab', () => {
        const props = {
            hasSkills: true
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
            hasDetails: true
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
            hasActivity: true
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
            hasMetadata: true
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
            hasActivity: true,
            hasMetadata: true,
            selectedView: 'activity'
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
                .at(1)
                .prop('isSelected')
        ).toBeTruthy();
        expect(wrapper).toMatchSnapshot();
    });
});
