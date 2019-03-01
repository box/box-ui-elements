import React from 'react';

import SuggestedPillsRow from '../SuggestedPillsRow';

describe('components/pill-selector-dropdown/SuggestedPillsRow', () => {
    const getWrapper = (params = {}) => shallow(<SuggestedPillsRow onSuggestedPillAdd={jest.fn()} {...params} />);

    describe('render()', () => {
        const collabID1 = 123;
        const collab1 = {
            id: collabID1,
            email: 'foo@box.com',
            name: 'Foo',
        };

        const collabID2 = 987;
        const collab2 = {
            ...collab1,
            id: collabID2,
        };

        const collabID3 = 456;
        const collab3 = {
            ...collab1,
            id: collabID3,
        };

        test('should render the SuggestedCollabPill', () => {
            const wrapper = getWrapper({
                suggestedCollaborators: [
                    {
                        id: 123,
                        email: 'foo@box.com',
                        name: 'Foo',
                    },
                ],
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should not render anything when suggested collabs are empty', () => {
            const wrapper = getWrapper({
                suggestedCollaborators: [],
            });

            expect(wrapper.html()).toBe(null);
        });

        test('should not render anything when all suggestedCollabs are selected', () => {
            const wrapper = getWrapper({
                selectedPillsValues: [collabID1, collabID2, collabID3],
                suggestedPillsData: [collab1, collab2, collab3],
            });

            expect(wrapper.html()).toBe(null);
        });

        test('should not render suggesteCollabs that have been filtered', () => {
            const wrapper = getWrapper({
                selectedPillsValues: [collabID1],
                suggestedPillsData: [collab1, collab2, collab3],
            });

            expect(wrapper.find('SuggestedPill').length).toBe(2);
        });
    });
});
