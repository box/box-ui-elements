import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Tooltip as BPTooltip } from '@box/blueprint-web';
import collaboratorList from '../__mocks__/collaborators';
// @ts-ignore flow import
import PresenceAvatar from '../PresenceAvatar';
import Tooltip from '../../../components/tooltip';
import { PresenceAvatarListComponent as PresenceAvatarList } from '../PresenceAvatarList';

describe('features/presence/PresenceAvatarList', () => {
    const getDefaults = () => ({
        collaborators: collaboratorList,
    });

    const getWrapper = (props = {}): ShallowWrapper => shallow(<PresenceAvatarList {...getDefaults()} {...props} />);

    describe('render()', () => {
        test('should correctly render empty state', () => {
            const wrapper = getWrapper({ collaborators: [] });

            expect(wrapper.exists('.bdl-PresenceAvatarList')).toBe(false);
        });

        describe.each([true, false])('when isPreviewModernizationEnabled is %s', isPreviewModernizationEnabled => {
            test('should correctly render collaborators without additional count when number of collaborators is less than or equal to maxDisplayedAvatars', () => {
                const maxDisplayedAvatars = 3;
                const wrapper = getWrapper({
                    collaborators: collaboratorList.slice(0, maxDisplayedAvatars),
                    maxDisplayedAvatars,
                    isPreviewModernizationEnabled,
                });

                expect(wrapper.find(PresenceAvatar).length).toBe(maxDisplayedAvatars);
                expect(wrapper.exists('.bdl-PresenceAvatarList-count')).toBe(false);
            });

            test('should correctly render collaborators with additional count when number of collaborators is greater than maxDisplayedAvatars', () => {
                const maxDisplayedAvatars = 3;
                const wrapper = getWrapper({
                    maxDisplayedAvatars,
                    isPreviewModernizationEnabled,
                });

                expect(wrapper.find(PresenceAvatar).length).toBe(maxDisplayedAvatars);
                expect(wrapper.exists('.bdl-PresenceAvatarList-count')).toBe(true);
            });

            test('should hide additional count if hideAdditionalCount is specified', () => {
                const maxDisplayedAvatars = 3;
                const wrapper = getWrapper({
                    hideAdditionalCount: true,
                    maxDisplayedAvatars,
                    isPreviewModernizationEnabled,
                });

                expect(wrapper.exists('.bdl-PresenceAvatarList')).toBe(true);
                expect(wrapper.find(PresenceAvatar).length).toBe(maxDisplayedAvatars);
                expect(wrapper.exists('.bdl-PresenceAvatarList-count')).toBe(false);
            });

            test('should hide tooltips when hideTooltips is true ', () => {
                const wrapper = getWrapper({
                    hideTooltips: true,
                    isPreviewModernizationEnabled,
                });

                expect(wrapper.find(PresenceAvatar).length).toBeGreaterThan(0);
                expect(wrapper.find(BPTooltip).length).toBe(0);
            });

            test.each(['focus', 'mouseenter'])(
                'should show tooltip when corresponding avatar encounters %s event',
                event => {
                    const onAvatarMouseEnter = jest.fn();
                    const wrapper = getWrapper({
                        onAvatarMouseEnter,
                        isPreviewModernizationEnabled,
                    });

                    if (isPreviewModernizationEnabled) {
                        // Blueprint tooltip doesn't use isShown prop, just verify it exists
                        expect(wrapper.find(BPTooltip).length).toBeGreaterThan(0);
                    } else {
                        expect(wrapper.find(Tooltip).first().prop('isShown')).toBe(false);
                    }

                    // Trigger event on the first avatar
                    wrapper.find(PresenceAvatar).first().simulate(event);

                    expect(onAvatarMouseEnter).toHaveBeenCalledWith('1');
                    if (!isPreviewModernizationEnabled) {
                        expect(wrapper.find(Tooltip).first().prop('isShown')).toBe(true);
                    }
                },
            );

            test.each(['blur', 'mouseleave'])(
                'should hide tooltip when correponding avatar encounters %s event',
                event => {
                    const onAvatarMouseLeave = jest.fn();
                    const wrapper = getWrapper({
                        onAvatarMouseLeave,
                        isPreviewModernizationEnabled,
                    });

                    // Cause the tooltip to show
                    wrapper.find(PresenceAvatar).first().simulate('focus');

                    if (!isPreviewModernizationEnabled) {
                        expect(wrapper.find(Tooltip).first().prop('isShown')).toBe(true);
                    }

                    // Trigger event on the first avatar
                    wrapper.find(PresenceAvatar).first().simulate(event);

                    expect(onAvatarMouseLeave).toHaveBeenCalled();
                    if (!isPreviewModernizationEnabled) {
                        expect(wrapper.find(Tooltip).first().prop('isShown')).toBe(false);
                    }
                },
            );

            test('should pass through additional attributes when specified', () => {
                const avatarAttr = { 'data-resin-target': 'avatar' };
                const wrapper = getWrapper({
                    avatarAttributes: avatarAttr,
                    'data-resin-feature': 'presence',
                    isPreviewModernizationEnabled,
                });

                expect(wrapper.find('.bdl-PresenceAvatarList').prop('data-resin-feature')).toEqual('presence');
                expect(wrapper.find(PresenceAvatar).first().prop('data-resin-target')).toEqual('avatar');
            });

            test('should correctly render collaborators with additional count when number of collaborators is greater than maxAddionalCollaboratorsNum + maxDisplayedAvatars', () => {
                const maxDisplayedAvatars = 2;
                const maxAdditionalCollaborators = 1;
                const wrapper = getWrapper({
                    maxAdditionalCollaborators,
                    maxDisplayedAvatars,
                    isPreviewModernizationEnabled,
                });

                expect(wrapper.find(PresenceAvatar).length).toBe(maxDisplayedAvatars);
                expect(wrapper.find('.bdl-PresenceAvatarList-count').text()).toBe('1+');
            });

            test('should correctly render collaborators with additional count when number of collaborators is less than maxAddionalCollaboratorsNum + maxDisplayedAvatars', () => {
                const maxDisplayedAvatars = 2;
                const maxAdditionalCollaborators = 10;
                const wrapper = getWrapper({
                    maxAdditionalCollaborators,
                    maxDisplayedAvatars,
                    isPreviewModernizationEnabled,
                });

                expect(wrapper.find(PresenceAvatar).length).toBe(maxDisplayedAvatars);
                expect(wrapper.find('.bdl-PresenceAvatarList-count').text()).toBe('+3');
            });
        });
    });
});
