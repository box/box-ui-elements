import * as React from 'react';

import CollaboratorListItem from '../CollaboratorListItem';

describe('features/collaborator-avatars/CollaboratorListItem', () => {
    const collaborator = {
        name: 'test c',
        email: 'testc@example.com',
        profileUrl: 'http://foo.bar.profile',
        hasCustomAvatar: true,
        imageUrl: 'https://foo.bar',
        expiration: {
            expiresAt: 'Jan 1, 1966',
        },
    };

    const getWrapper = (props = {}) =>
        shallow(
            <CollaboratorListItem
                collaborator={collaborator}
                id="111"
                index={1}
                trackingProps={{
                    usernameProps: undefined,
                    emailProps: undefined,
                }}
                {...props}
            />,
        );

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render pending collaborator', () => {
            const wrapper = getWrapper({
                collaborator: {
                    name: 'test c',
                    email: 'testc@example.com',
                    profileUrl: 'http://foo.bar.profile',
                    hasCustomAvatar: true,
                    imageUrl: 'https://foo.bar',
                    expiration: {
                        expiresAt: 'Jan 1, 1966',
                    },
                    type: 'pending',
                },
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should render group collaborator', () => {
            const wrapper = getWrapper({
                collaborator: {
                    name: 'test c',
                    email: 'testc@example.com',
                    profileUrl: 'http://foo.bar.profile',
                    hasCustomAvatar: true,
                    imageUrl: 'https://foo.bar',
                    expiration: {
                        expiresAt: 'Jan 1, 1966',
                    },
                    type: 'group',
                },
            });

            expect(wrapper).toMatchSnapshot();
        });
    });
});
