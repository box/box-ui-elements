// @flow
import * as React from 'react';
import { mount } from 'enzyme';
import GuideTooltip from '../GuideTooltip';
import FolderShared32 from '../../../icon/content/FolderShared32';

describe('components/guide-tooltip/GuideTooltip', () => {
    const title = <div>title</div>;
    const body = <div>body</div>;
    const icon = <FolderShared32 />;
    const image = <img alt="test" src="test" />;
    const steps = [1, 3];
    const primaryButtonProps = { children: 'Next' };
    const secondaryButtonProps = { children: 'Previous' };

    const getWrapper = props =>
        mount(
            <GuideTooltip {...props}>
                <div />
            </GuideTooltip>,
        );

    test('should render with title and body', () => {
        const wrapper = getWrapper({ body, title });

        // hidden elements
        expect(wrapper.find('.bdl-GuideTooltip-icon').length).toEqual(0);
        expect(wrapper.find('.bdl-GuideTooltip-image').length).toEqual(0);
        expect(wrapper.find('.bdl-GuideTooltip-previousButton').length).toEqual(0);
        expect(wrapper.find('.bdl-GuideTooltip-nextButton').length).toEqual(0);
        expect(wrapper.find('.bdl-GuideTooltip-steps').length).toEqual(0);
        // visible elements
        expect(wrapper.find('.bdl-GuideTooltip-title').length).toEqual(1);
        expect(wrapper.find('.bdl-GuideTooltip-title').text()).toEqual('title');
        expect(wrapper.find('.bdl-GuideTooltip-body').length).toEqual(1);
        expect(wrapper.find('.bdl-GuideTooltip-body').text()).toEqual('body');
    });

    test('should render with just body', () => {
        const wrapper = getWrapper({ body });

        // hidden elements
        expect(wrapper.find('.bdl-GuideTooltip-title').length).toEqual(0);
        expect(wrapper.find('.bdl-GuideTooltip-icon').length).toEqual(0);
        expect(wrapper.find('.bdl-GuideTooltip-image').length).toEqual(0);
        expect(wrapper.find('.bdl-GuideTooltip-previousButton').length).toEqual(0);
        expect(wrapper.find('.bdl-GuideTooltip-nextButton').length).toEqual(0);
        expect(wrapper.find('.bdl-GuideTooltip-steps').length).toEqual(0);
        // visible elements
        expect(wrapper.find('.bdl-GuideTooltip-body').length).toEqual(1);
        expect(wrapper.find('.bdl-GuideTooltip-body').text()).toEqual('body');
    });

    test('should render with all options but icon', () => {
        const wrapper = getWrapper({ body, title, image, primaryButtonProps, secondaryButtonProps, steps });

        // hidden elements
        expect(wrapper.find('.bdl-GuideTooltip-icon').length).toEqual(0);
        // visible elements
        expect(wrapper.find('.bdl-GuideTooltip-title').length).toEqual(1);
        expect(wrapper.find('.bdl-GuideTooltip-title').text()).toEqual('title');
        expect(wrapper.find('.bdl-GuideTooltip-image img').length).toEqual(1);
        expect(wrapper.find('.bdl-GuideTooltip-body').length).toEqual(1);
        expect(wrapper.find('.bdl-GuideTooltip-body').text()).toEqual('body');
        expect(wrapper.find('Button.bdl-GuideTooltip-previousButton').length).toEqual(1);
        expect(wrapper.find('Button.bdl-GuideTooltip-nextButton').length).toEqual(1);
        expect(wrapper.find('.bdl-GuideTooltip-steps').length).toEqual(1);
    });

    test('should render with all options but image', () => {
        const wrapper = getWrapper({ body, title, icon, image, primaryButtonProps, secondaryButtonProps, steps });

        // hidden elements
        expect(wrapper.find('.bdl-GuideTooltip-image').length).toEqual(0);
        // visible elements
        expect(wrapper.find('.bdl-GuideTooltip-title').length).toEqual(1);
        expect(wrapper.find('.bdl-GuideTooltip-title').text()).toEqual('title');
        expect(wrapper.find('.bdl-GuideTooltip-icon FolderShared32').length).toEqual(1);
        expect(wrapper.find('.bdl-GuideTooltip-body').length).toEqual(1);
        expect(wrapper.find('.bdl-GuideTooltip-body').text()).toEqual('body');
        expect(wrapper.find('Button.bdl-GuideTooltip-previousButton').length).toEqual(1);
        expect(wrapper.find('Button.bdl-GuideTooltip-nextButton').length).toEqual(1);
        expect(wrapper.find('.bdl-GuideTooltip-steps').length).toEqual(1);
    });
});
