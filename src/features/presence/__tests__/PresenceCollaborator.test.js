import React from 'react';
import { createIntl } from 'react-intl';
import { PresenceCollaboratorComponent as PresenceCollaborator, renderTimestampMessage } from '../PresenceCollaborator';

const collaborator = {
    avatarUrl: '',
    id: '1',
    isActive: false,
    interactedAt: 999,
    interactionType: 'user.item_preview',
    name: 'Pooh Bear',
};

const intl = createIntl({});

describe('features/presence/PresenceCollaborator', () => {
    const getWrapper = (props = {}) =>
        shallow(<PresenceCollaborator collaborator={collaborator} intl={intl} {...props} />);

    describe('renderTimestampMessage()', () => {
        test('should return null when interactionType is an unkown type', () => {
            const res = renderTimestampMessage(123, 'test1234', intl);
            expect(res).toEqual(null);
        });

        test('should not return null when interactionType is a known type', () => {
            const res = renderTimestampMessage(123, 'user.item_preview', intl);
            expect(res).not.toEqual(null);
        });
    });

    describe('render()', () => {
        test('should correctly render a collaborator', () => {
            const wrapper = getWrapper();

            expect(wrapper.find('.bdl-PresenceCollaborator').length).toBe(1);
        });

        test('should have the correct title prop for the default browser tooltip', () => {
            const wrapper = getWrapper();
            const userInfo = wrapper.find('.bdl-PresenceCollaborator-info-name');

            expect(userInfo.prop('title')).toEqual('Pooh Bear');
        });
    });
});
