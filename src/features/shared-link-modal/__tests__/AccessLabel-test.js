import React from 'react';

import AccessLabel from '../AccessLabel';
import { PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from '../constants';

describe('features/shared-link-modal/AccessLabel', () => {
    const getWrapper = (props = {}) =>
        shallow(<AccessLabel accessLevel={PEOPLE_WITH_LINK} itemType="folder" {...props} />);

    describe('render()', () => {
        [
            // People with Link
            {
                accessLevel: PEOPLE_WITH_LINK,
                enterpriseName: undefined,
                itemType: 'folder',
            },
            // people in enterprise name
            {
                accessLevel: PEOPLE_IN_COMPANY,
                enterpriseName: 'Box',
                itemType: 'folder',
            },
            // people in company
            {
                accessLevel: PEOPLE_IN_COMPANY,
                enterpriseName: undefined,
                itemType: 'folder',
            },
            // people in folder
            {
                accessLevel: PEOPLE_IN_ITEM,
                enterpriseName: undefined,
                itemType: 'foulder',
            },
            // people in file
            {
                accessLevel: PEOPLE_IN_ITEM,
                enterpriseName: undefined,
                itemType: 'file',
            },
        ].forEach(({ accessLevel, enterpriseName, itemType }) => {
            test('should render correctly', () => {
                const wrapper = getWrapper({
                    accessLevel,
                    enterpriseName,
                    itemType,
                });

                expect(wrapper).toMatchSnapshot();
            });
        });

        test('should return null when accessLevel is not recognized', () => {
            const wrapper = getWrapper({
                accessLevel: 'blah',
            });

            expect(wrapper.type()).toBeNull();
        });
    });
});
