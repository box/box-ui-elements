import * as React from 'react';

import CollaboratorList from '../CollaboratorList';

describe('features/collaborator-avatars/CollaboratorList', () => {
    const collaborators = [
        {
            collabID: 1,
            userID: 1,
            type: 'user',
            name: 'test a',
            email: 'testa@example.com',
            hasCustomAvatar: false,
        },
        {
            collabID: 2,
            userID: 2,
            type: 'user',
            name: 'test b',
            email: 'testb@example.com',
        },
        {
            collabID: 3,
            userID: 3,
            type: 'user',
            name: 'test c',
            email: 'testc@example.com',
            profileUrl: 'http://foo.bar.profile',
            hasCustomAvatar: true,
            imageUrl: 'https://foo.bar',
        },
    ];
    collaborators.size = collaborators.length;
    const item = {
        id: '111',
        name: 'test file',
        type: 'file',
        hideCollaborators: false,
    };
    const getWrapper = (props = {}) =>
        shallow(
            <CollaboratorList collaborators={collaborators} item={item} name="test" trackingProps={{}} {...props} />,
        );

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        test('should call onDoneClick() when done button is clicked', () => {
            const onDoneClickMock = jest.fn();
            const wrapper = getWrapper({
                onDoneClick: onDoneClickMock,
            });

            const doneBtn = wrapper.find('Button');
            expect(doneBtn.length).toBe(1);
            doneBtn.simulate('click');

            expect(onDoneClickMock).toHaveBeenCalled();
        });

        test('should render extra row with View additional people if list.size > maxCollaboratorListSize', () => {
            const wrapper = getWrapper({
                maxCollaboratorListSize: 2,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render component when canRemoveCollaborators prop is true', () => {
            const onRemoveCollaboratorClickMock = jest.fn();
            const wrapper = getWrapper({
                canRemoveCollaborators: true,
                onRemoveCollaboratorClick: onRemoveCollaboratorClickMock,
            });

            expect(wrapper.find('CollaboratorListItem')).toHaveLength(collaborators.length);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
