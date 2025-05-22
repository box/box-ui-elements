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

        test('should render component when canRemoveCollaborators prop is true and collaborator is not removable', () => {
            const wrapper = getWrapper({ canRemoveCollaborators: true, collaborator });

            expect(wrapper.find('.role').exists()).toBe(true);
            expect(wrapper.find('PlainButton')).toHaveLength(0);
            expect(wrapper).toMatchSnapshot();
        });

        test('should render component when canRemoveCollaborators prop is true and collaborator is removable', () => {
            const wrapper = getWrapper({
                canRemoveCollaborators: true,
                collaborator: { ...collaborator, isRemovable: true },
            });

            expect(wrapper.find('.role').exists()).toBe(true);
            expect(wrapper.find('PlainButton').exists()).toBe(true);
            expect(wrapper.find('Tooltip').exists()).toBe(true);
            expect(wrapper).toMatchSnapshot();
        });

        test('should call onRemoveCollaborator when onRemoveCollaborator prop is passed', () => {
            const onRemoveCollaboratorMock = jest.fn();
            const wrapper = getWrapper({
                canRemoveCollaborators: true,
                onRemoveCollaborator: onRemoveCollaboratorMock,
                collaborator: { ...collaborator, isRemovable: true },
            });

            const removeButton = wrapper.find('PlainButton');
            removeButton.simulate('click');

            expect(onRemoveCollaboratorMock).toHaveBeenCalledWith({ ...collaborator, isRemovable: true });
            expect(wrapper).toMatchSnapshot();
        });

        test('should not call onRemoveCollaborator when onRemoveCollaborator prop is undefined', () => {
            const onRemoveCollaboratorMock = jest.fn();

            const wrapper = getWrapper({
                canRemoveCollaborators: true,
                onRemoveCollaborator: undefined,
                collaborator: { ...collaborator, isRemovable: true },
            });

            const removeButton = wrapper.find('PlainButton');
            removeButton.simulate('click');

            expect(onRemoveCollaboratorMock).not.toHaveBeenCalled();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
