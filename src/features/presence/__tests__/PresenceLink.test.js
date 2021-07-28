import React from 'react';
import defaultCollaborators from '../__mocks__/collaborators';
import PresenceLink from '../PresenceLink';

const collaboratorList = [
    ...defaultCollaborators,
    {
        avatarUrl: '',
        id: '6',
        interactedAt: 999,
        isActive: true,
        interactionType: 'user.item_preview',
        name: 'f',
    },
];

describe('features/presence/PresenceLink', () => {
    describe('render()', () => {
        test('should correctly render empty state', () => {
            const collaborators = [];

            const wrapper = shallow(<PresenceLink collaborators={collaborators}>Others</PresenceLink>);
            expect(wrapper.find('.presence-link-container').length).toBe(0);
            expect(wrapper.find('.PresenceCollaboratorsList').length).toBe(0);
            expect(wrapper).toMatchSnapshot();
        });

        test('should correctly render collaborators when number of collaborators is greater or equal to 1', () => {
            const wrapper = shallow(<PresenceLink collaborators={collaboratorList}>Others</PresenceLink>);

            expect(wrapper.find('.presence-link-container').length).toBe(1);
            expect(wrapper.find('PresenceCollaboratorsList').length).toBe(1);
            expect(wrapper).toMatchSnapshot();
        });

        test('should pass through additional attributes when specified', () => {
            const containerAttr = { 'data-resin-feature': 'presence' };
            const wrapper = shallow(
                <PresenceLink collaborators={collaboratorList} containerAttributes={containerAttr}>
                    Others
                </PresenceLink>,
            );

            expect(wrapper.find('.presence-link-container').prop('data-resin-feature')).toEqual('presence');
            expect(wrapper.find('PresenceCollaboratorsList').length).toBe(1);
            expect(wrapper).toMatchSnapshot();
        });

        test('should change the flyoutPosition', () => {
            const containerAttr = { 'data-resin-feature': 'presence' };
            const wrapper = shallow(
                <PresenceLink
                    collaborators={collaboratorList}
                    containerAttributes={containerAttr}
                    flyoutPosition="bottom-right"
                >
                    Others
                </PresenceLink>,
            );
            expect(wrapper.find('.presence-link-container').prop('data-resin-feature')).toEqual('presence');
            expect(wrapper.find('PresenceCollaboratorsList').length).toBe(1);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
