import React from 'react';

import PresenceAvatar from '../PresenceAvatar';

describe('features/presence/PresenceAvatar', () => {
    describe('render()', () => {
        test('should correctly render an inactive collaborator', () => {
            const inactiveCollaborator = {
                avatarUrl: '',
                id: '5',
                isActive: false,
                name: 'a',
            };
            const wrapper = shallow(<PresenceAvatar {...inactiveCollaborator} />);

            expect(wrapper.find('.presence-avatar').length).toBe(1);
            expect(wrapper.find('.presence-avatar.is-active').length).toBe(0);
        });

        test('should correctly render an active collaborator', () => {
            const activeCollaborator = {
                avatarUrl: '',
                id: '5',
                isActive: true,
                name: 'a',
            };
            const wrapper = shallow(<PresenceAvatar {...activeCollaborator} />);

            expect(wrapper.find('.presence-avatar').length).toBe(1);
            expect(wrapper.find('.presence-avatar.is-active').length).toBe(1);
        });

        test('should pass through additional attributes when specified', () => {
            const avatarAttr = { 'data-resin-target': 'avatar' };
            const activeCollaborator = {
                avatarUrl: '',
                id: '5',
                isActive: true,
                name: 'a',
            };
            const wrapper = shallow(<PresenceAvatar {...avatarAttr} {...activeCollaborator} />);

            expect(wrapper.find('.presence-avatar').prop('data-resin-target')).toEqual('avatar');
        });
    });
});
