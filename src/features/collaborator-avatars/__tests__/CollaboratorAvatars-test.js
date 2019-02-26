import * as React from 'react';

import CollaboratorAvatars from '../CollaboratorAvatars';

describe('features/collaborator-avatars/CollaboratorAvatars', () => {
    const defaultCollaborators = [
        {
            collabID: 1,
            name: 'test a',
            hasCustomAvatar: false,
        },
        {
            collabID: 2,
            name: 'test b',
        },
        {
            collabID: 3,
            name: 'test c',
            hasCustomAvatar: true,
            imageUrl: 'https://foo.bar',
        },
    ];

    const maxDisplayedCollaboratorsList = [
        ...defaultCollaborators,
        {
            collabID: 4,
            name: 'test d',
            hasCustomAvatar: false,
        },
        {
            collabID: 5,
            name: 'test e',
            hasCustomAvatar: false,
        },
        {
            collabID: 6,
            name: 'test f',
            hasCustomAvatar: false,
        },
    ];

    const emptyCollabList = [];

    const getWrapper = (props = {}) => shallow(<CollaboratorAvatars collaborators={defaultCollaborators} {...props} />);

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render component if collaborators.length > maxDisplayedUserAvatars', () => {
            const wrapper = getWrapper({
                collaborators: maxDisplayedCollaboratorsList,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render component if collaborators.length - maxDisplayedUserAvatars > maxAdditionalCollaboratorsNum', () => {
            const wrapper = getWrapper({
                collaborators: maxDisplayedCollaboratorsList,
                maxDisplayedUserAvatars: 2,
                maxAdditionalCollaboratorsNum: 3,
            });
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('isVisible()', () => {
        test('should return true if the component has collaborators', () => {
            const wrapper = getWrapper();

            expect(wrapper.instance().isVisible()).toBe(true);
        });

        test('should return false if the component has no collaborators passed in', () => {
            const wrapper = getWrapper({
                collaborators: emptyCollabList,
            });

            expect(wrapper.instance().isVisible()).toBe(false);
        });
    });

    describe('hasAdditionalCollaborators()', () => {
        test('should return false when there are no collaborators in the list', () => {
            const wrapper = getWrapper({
                collaborators: emptyCollabList,
            });

            expect(wrapper.instance().hasAdditionalCollaborators()).toBe(false);
        });

        test('should return false when the number of collabs is less than the maximum we want to display', () => {
            const wrapper = getWrapper();

            expect(wrapper.instance().hasAdditionalCollaborators()).toBe(false);
        });

        test('should return true when the number of collabs is more than the maximum we want to display', () => {
            const wrapper = getWrapper({
                collaborators: maxDisplayedCollaboratorsList,
            });

            expect(wrapper.instance().hasAdditionalCollaborators()).toBe(true);
        });
    });

    describe('collaboratorsOverMaxCount()', () => {
        test('should return false if we have no collaborators', () => {
            const wrapper = getWrapper({
                collaborators: emptyCollabList,
            });

            expect(wrapper.instance().collaboratorsOverMaxCount()).toBe(false);
        });

        test('should return false if we have some collaborators, but at the default threshold', () => {
            const wrapper = getWrapper();

            expect(wrapper.instance().collaboratorsOverMaxCount()).toBe(false);
        });

        test('should return false if we can show the plus icon, but have fewer collaborators than the default threshold', () => {
            const wrapper = getWrapper({
                collaborators: maxDisplayedCollaboratorsList,
            });

            expect(wrapper.instance().collaboratorsOverMaxCount()).toBe(false);
        });

        test('should return true if we have more collaborators than a user-defined maximum', () => {
            const wrapper = getWrapper({
                collaborators: maxDisplayedCollaboratorsList,
                maxAdditionalCollaboratorsNum: 2,
            });

            expect(wrapper.instance().collaboratorsOverMaxCount()).toBe(true);
        });
    });

    describe('formatAdditionalCollaboratorCount()', () => {
        test('should return a format like +x when the collab count is between the max list size and the maximum avatar count', () => {
            const wrapper = getWrapper({
                collaborators: maxDisplayedCollaboratorsList, // 6 collabs total
                maxAdditionalCollaboratorsNum: 7,
                maxDisplayedCollaboratorsList: 3,
            });

            expect(wrapper.instance().formatAdditionalCollaboratorCount()).toEqual('+3');
        });

        test('should return a format like x+ when the collab count is greater than the max additional collab count', () => {
            const wrapper = getWrapper({
                collaborators: maxDisplayedCollaboratorsList, // 6 collabs total
                maxAdditionalCollaboratorsNum: 2,
                maxDisplayedUserAvatars: 3,
            });

            expect(wrapper.instance().formatAdditionalCollaboratorCount()).toEqual('2+');
        });

        test('should display +99 when the collaborator list size is at 102', () => {
            const megaCollaboratorList = [
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList, // exactly 102 collaborators
            ];

            const wrapper = getWrapper({
                collaborators: megaCollaboratorList,
            });

            expect(wrapper.instance().formatAdditionalCollaboratorCount()).toEqual('+99');
        });

        test('should display 99+ when the collaborator list size is over 102', () => {
            const megaCollaboratorList = [
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList,
                ...maxDisplayedCollaboratorsList, // exactly 102 collaborators
                ...maxDisplayedCollaboratorsList,
            ];

            const wrapper = getWrapper({
                collaborators: megaCollaboratorList,
            });

            expect(wrapper.instance().formatAdditionalCollaboratorCount()).toEqual('99+');
        });
    });
});
