import React from 'react';
import { shallow } from 'enzyme';
import SidebarSection from '../SidebarSection';
import messages from '../../messages';

describe('components/ContentSidebar/SidebarSection', () => {
    const getWrapper = (props) =>
        shallow(
            <SidebarSection {...props}>
                <div className='foo'>foo</div>
            </SidebarSection>
        );

    test('should render a title and content when there is a title', () => {
        const props = {
            hasCustomBranding: false,
            title: 'foo'
        };
        const wrapper = getWrapper(props);

        expect(wrapper).toMatchSnapshot();
    });

    test('should only render content when there is not a title', () => {
        const props = {
            hasCustomBranding: false
        };
        const wrapper = getWrapper(props);

        expect(wrapper).toMatchSnapshot();
    });

    test('should add a class when open', () => {
        const props = {
            hasCustomBranding: false
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find('.bcs-section-has-custom-branding').exists()).toBe(false);
        expect(wrapper.find('.bcs-section-open').exists()).toBe(true);
    });

    test('should add a class there is custom branding', () => {
        const props = {
            hasCustomBranding: true,
            isOpen: false
        };
        const wrapper = getWrapper(props);

        expect(wrapper.find('.bcs-section-has-custom-branding').exists()).toBe(true);
        expect(wrapper.find('.bcs-section-open').exists()).toBe(false);
    });

    test('should render the content when no title and not open', () => {
        const props = {
            hasCustomBranding: false,
            isOpen: false
        };
        const wrapper = getWrapper(props);

        expect(wrapper).toMatchSnapshot();
    });

    test('should toggle the isOpen state', () => {
        const props = {
            hasCustomBranding: false,
            isOpen: false
        };
        const wrapper = getWrapper(props);
        expect(wrapper.state('isOpen')).toBe(false);
        wrapper.instance().toggleVisibility();
        expect(wrapper.state('isOpen')).toBe(true);
        wrapper.instance().toggleVisibility();
        expect(wrapper.state('isOpen')).toBe(false);
    });

    test('should return the correct message', () => {
        const { caretOpen, caretClosed } = messages;

        const props = {
            hasCustomBranding: false,
            isOpen: false
        };
        const wrapper = getWrapper(props);

        const openMessage = wrapper.instance().getCaretMessage(true);
        expect(openMessage).toEqual(caretOpen);

        const closeMessage = wrapper.instance().getCaretMessage(false);
        expect(closeMessage).toEqual(caretClosed);
    });
});
