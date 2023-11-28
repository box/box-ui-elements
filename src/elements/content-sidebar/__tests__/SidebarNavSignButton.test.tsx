import React from 'react';
import { mount } from 'enzyme';
import BoxSign28 from '../../../icon/logo/BoxSign28';
import PlainButton from '../../../components/plain-button';
import SidebarNavSignButton from '../SidebarNavSignButton';
// @ts-ignore Module is written in Flow
import TargetedClickThroughGuideTooltip from '../../../features/targeting/TargetedClickThroughGuideTooltip';
import Tooltip from '../../../components/tooltip';

const mockTargetingApi = {
    onClose: jest.fn(),
    onComplete: jest.fn(),
    onShow: jest.fn(),
};

describe('elements/content-sidebar/SidebarNavSignButton', () => {
    const getWrapper = (props = {}) => mount(<SidebarNavSignButton {...props} />);

    test.each`
        status       | label
        ${undefined} | ${'Request Signature'}
        ${'random'}  | ${'Request Signature'}
        ${'active'}  | ${'Sign'}
    `('should render the correct label based on the current signature status', ({ label, status }) => {
        const wrapper = getWrapper({ status });

        expect(wrapper.find(Tooltip).prop('text')).toBe(label);
        expect(wrapper.find(PlainButton).prop('aria-label')).toBe(label);
        expect(wrapper.exists(BoxSign28)).toBe(true);
    });

    test.each`
        targetingApi                               | isFtuxVisible | isTooltipVisible
        ${{ ...mockTargetingApi, canShow: true }}  | ${true}       | ${false}
        ${{ ...mockTargetingApi, canShow: false }} | ${false}      | ${true}
        ${undefined}                               | ${false}      | ${true}
    `(
        'should render the ftux and main tooltip based on the targeting api',
        ({ isFtuxVisible, isTooltipVisible, targetingApi }) => {
            const wrapper = getWrapper({ targetingApi });

            expect(
                wrapper
                    .find(Tooltip)
                    .at(targetingApi?.canShow ? 1 : 0)
                    .prop('isDisabled'),
            ).toBe(!isTooltipVisible);
            expect(wrapper.exists(TargetedClickThroughGuideTooltip)).toBe(isFtuxVisible);
            expect(wrapper.exists(BoxSign28)).toBe(true); // Child components should always be rendered
        },
    );

    test.each`
        blockedReason        | isDisabled | tooltipMessage
        ${'shield-download'} | ${true}    | ${'This action is unavailable due to a security policy.'}
        ${'shared-link'}     | ${true}    | ${'This action is unavailable due to a security policy.'}
        ${'shield-sign'}     | ${true}    | ${'This action is unavailable due to a security policy.'}
        ${'watermark'}       | ${true}    | ${'This action is unavailable, because the file is watermarked.'}
        ${''}                | ${false}   | ${'Request Signature'}
    `(
        'should render the correct main tooltip and ftux tooltip based on the blockedReason',
        ({ blockedReason, isDisabled, tooltipMessage }) => {
            const wrapper = getWrapper({ blockedReason, targetingApi: { ...mockTargetingApi, canShow: true } });

            expect(
                wrapper
                    .find(Tooltip)
                    .at(blockedReason ? 0 : 1)
                    .prop('text'),
            ).toBe(tooltipMessage);
            expect(wrapper.exists(BoxSign28)).toBe(true);
            expect(
                wrapper
                    .find(PlainButton)
                    .at(0)
                    .prop('isDisabled'),
            ).toBe(isDisabled);
            expect(wrapper.exists(TargetedClickThroughGuideTooltip)).toBe(!isDisabled);
        },
    );

    test('should correctly render a custom ftux tooltip component', () => {
        const CustomFtuxTooltip = jest.fn().mockImplementation(({ renderAnchor }) => {
            return renderAnchor();
        });
        const wrapper = getWrapper({ CustomFtuxTooltip });

        expect(wrapper.find(CustomFtuxTooltip).prop('body')).toBeTruthy();
        expect(wrapper.find(CustomFtuxTooltip).prop('disabled')).toBe(false);
        expect(wrapper.find(CustomFtuxTooltip).prop('title')).toBeTruthy();
        expect(wrapper.find(PlainButton).exists()).toBe(true);
    });
});
