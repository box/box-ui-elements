import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import PresenceAvatarList from '../PresenceAvatarList';
import collaboratorList from '../__mocks__/collaborators';
// @ts-ignore flow import
import PresenceAvatar from '../PresenceAvatar';
import Tooltip from '../../../components/tooltip';

describe('features/presence/PresenceAvatarList', () => {
    const getDefaults = () => ({
        collaborators: collaboratorList,
    });

    const getWrapper = (props = {}): ShallowWrapper => {
        const defaultProps = getDefaults();
        return shallow(<PresenceAvatarList {...defaultProps} {...props} />);
    };

    describe('render()', () => {
        test('should correctly render empty state', () => {
            const wrapper = getWrapper({ collaborators: [] });

            expect(wrapper.exists('.bdl-PresenceAvatarList')).toBe(false);
        });

        test('should correctly render collaborators without additional count when number of collaborators is less than or equal to maxDisplayedAvatars', () => {
            const maxDisplayedAvatars = 3;
            const wrapper = getWrapper({
                collaborators: collaboratorList.slice(0, maxDisplayedAvatars),
                maxDisplayedAvatars,
            });

            expect(wrapper.find(PresenceAvatar).length).toBe(maxDisplayedAvatars);
            expect(wrapper.exists('.bdl-PresenceAvatarList-count')).toBe(false);
        });

        test('should correctly render collaborators with additional count when number of collaborators is greater than maxDisplayedAvatars', () => {
            const maxDisplayedAvatars = 3;
            const wrapper = getWrapper({
                maxDisplayedAvatars,
            });

            expect(wrapper.find(PresenceAvatar).length).toBe(maxDisplayedAvatars);
            expect(wrapper.exists('.bdl-PresenceAvatarList-count')).toBe(true);
        });

        test('should hide additional count if hideAdditionalCount is specified', () => {
            const maxDisplayedAvatars = 3;
            const wrapper = getWrapper({
                hideAdditionalCount: true,
                maxDisplayedAvatars,
            });

            expect(wrapper.exists('.bdl-PresenceAvatarList')).toBe(true);
            expect(wrapper.find(PresenceAvatar).length).toBe(maxDisplayedAvatars);
            expect(wrapper.exists('.bdl-PresenceAvatarList-count')).toBe(false);
        });

        test.each(['focus', 'mouseenter'])(
            'should show tooltip when correponding avatar encounters %s event',
            event => {
                const onAvatarMouseEnter = jest.fn();
                const wrapper = getWrapper({
                    onAvatarMouseEnter,
                });

                expect(wrapper.find(Tooltip).first().prop('isShown')).toBe(false);

                // Trigger event on the first avatar
                wrapper.find(PresenceAvatar).first().simulate(event);

                expect(onAvatarMouseEnter).toHaveBeenCalledWith('1');
                expect(wrapper.find(Tooltip).first().prop('isShown')).toBe(true);
            },
        );

        test.each(['blur', 'mouseleave'])('should hide tooltip when correponding avatar encounters %s event', event => {
            const onAvatarMouseLeave = jest.fn();
            const wrapper = getWrapper({
                onAvatarMouseLeave,
            });

            // Cause the tooltip to show
            wrapper.find(PresenceAvatar).first().simulate('focus');

            expect(wrapper.find(Tooltip).first().prop('isShown')).toBe(true);

            // Trigger event on the first avatar
            wrapper.find(PresenceAvatar).first().simulate(event);

            expect(onAvatarMouseLeave).toHaveBeenCalled();
            expect(wrapper.find(Tooltip).first().prop('isShown')).toBe(false);
        });

        test('should pass through additional attributes when specified', () => {
            const avatarAttr = { 'data-resin-target': 'avatar' };
            const wrapper = getWrapper({
                avatarAttributes: avatarAttr,
                'data-resin-feature': 'presence',
            });

            expect(wrapper.find('.bdl-PresenceAvatarList').prop('data-resin-feature')).toEqual('presence');
            expect(wrapper.find(PresenceAvatar).first().prop('data-resin-target')).toEqual('avatar');
        });

        test('should correctly render collaborators with additional count when number of collaborators is greater than maxAddionalCollaboratorsNum + maxDisplayedAvatars', () => {
            const maxDisplayedAvatars = 2;
            const maxAdditionalCollaborators = 1;
            const wrapper = getWrapper({ maxAdditionalCollaborators, maxDisplayedAvatars });

            expect(wrapper.find(PresenceAvatar).length).toBe(maxDisplayedAvatars);
            expect(wrapper.find('.bdl-PresenceAvatarList-count').text()).toBe('1+');
        });

        test('should correctly render collaborators with additional count when number of collaborators is less than maxAddionalCollaboratorsNum + maxDisplayedAvatars', () => {
            const maxDisplayedAvatars = 2;
            const maxAdditionalCollaborators = 10;
            const wrapper = getWrapper({ maxAdditionalCollaborators, maxDisplayedAvatars });

            expect(wrapper.find(PresenceAvatar).length).toBe(maxDisplayedAvatars);
            expect(wrapper.find('.bdl-PresenceAvatarList-count').text()).toBe('+3');
        });
    });
});
