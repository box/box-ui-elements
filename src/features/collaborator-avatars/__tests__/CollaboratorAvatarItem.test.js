import * as React from 'react';

import CollaboratorAvatarItem from '../CollaboratorAvatarItem';

describe('features/collaborator-avatars/CollaboratorAvatarItem', () => {
    const getWrapper = (props = {}) => shallow(<CollaboratorAvatarItem id={1} name="foo bar" {...props} />);

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render custom avatar', () => {
            const wrapper = getWrapper({
                hasCustomAvatar: true,
                avatarUrl: 'http://foo.bar',
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render avatar with expiration if we allow badging', () => {
            const wrapper = getWrapper({
                allowBadging: true,
                expiration: {
                    executeAt: 'January 1, 2009',
                },
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should not render badges with expiration, but badging not allowed', () => {
            const wrapper = getWrapper({
                allowBadging: false,
                expiration: {
                    executeAt: 'January 1, 2009',
                },
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should not render badges with expiration lacking an execution date value', () => {
            const wrapper = getWrapper({
                allowBadging: true,
                expiration: {
                    executeAt: null,
                },
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should render avatar with external collab if all preconditions are met', () => {
            const wrapper = getWrapper({
                allowBadging: true,
                isExternalCollab: true,
                email: 'test@example.org',
                expiration: {
                    executeAt: null,
                },
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should not render avatar if badges are disabled', () => {
            const wrapper = getWrapper({
                allowBadging: false,
                isExternalCollab: true,
                email: 'test@example.org',
                expiration: {
                    executeAt: null,
                },
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should not render if external collab is disabled', () => {
            const wrapper = getWrapper({
                allowBadging: true,
                isExternalCollab: false,
                email: 'test@example.org',
                expiration: {
                    executeAt: null,
                },
            });

            expect(wrapper).toMatchSnapshot();
        });
    });
});
