import React from 'react';
import { shallow } from 'enzyme';
import BoxSign28 from '../../../icon/logo/BoxSign28';
import PlainButton from '../../../components/plain-button';
import SidebarNavSign from '../SidebarNavSign';
// @ts-ignore Module is written in Flow
import TargetedClickThroughGuideTooltip from '../../../features/targeting/TargetedClickThroughGuideTooltip';
import Tooltip from '../../../components/tooltip';

describe('elements/content-sidebar/SidebarNavSign', () => {
    const getWrapper = (props = {}) => shallow(<SidebarNavSign {...props} />).dive();

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
        targetingApi          | isFtuxVisible | isTooltipVisible
        ${{ canShow: true }}  | ${true}       | ${false}
        ${{ canShow: false }} | ${false}      | ${true}
        ${undefined}          | ${false}      | ${true}
    `(
        'should render the ftux and main tooltip based on the targeting api',
        ({ isFtuxVisible, isTooltipVisible, targetingApi }) => {
            const wrapper = getWrapper({ targetingApi });

            expect(wrapper.find(Tooltip).prop('isDisabled')).toBe(!isTooltipVisible);
            expect(wrapper.exists(TargetedClickThroughGuideTooltip)).toBe(isFtuxVisible);
            expect(wrapper.exists(BoxSign28)).toBe(true); // Child components should always be rendered
        },
    );

    test.each`
        blockedReason        | isDisabled | tooltipMessage
        ${'shield-download'} | ${true}    | ${'This action is unavailable due to a security policy.'}
        ${'shared-link'}     | ${true}    | ${'This action is unavailable due to a security policy.'}
        ${'watermark'}       | ${true}    | ${'This action is unavailable, because the file is watermarked.'}
        ${''}                | ${false}   | ${'Request Signature'}
    `(
        'should render the correct main tooltip and ftux tooltip based on the blockedReason',
        ({ blockedReason, isDisabled, tooltipMessage }) => {
            const wrapper = getWrapper({ blockedReason, targetingApi: { canShow: true } });

            expect(wrapper.find(Tooltip).prop('text')).toBe(tooltipMessage);
            expect(wrapper.exists(BoxSign28)).toBe(true);
            expect(wrapper.find(PlainButton).prop('isDisabled')).toBe(isDisabled);
            expect(wrapper.exists(TargetedClickThroughGuideTooltip)).toBe(!isDisabled);
        },
    );
});
