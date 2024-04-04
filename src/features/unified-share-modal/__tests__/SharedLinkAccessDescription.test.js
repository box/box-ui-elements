import React from 'react';
import { shallow } from 'enzyme';

import { ANYONE_WITH_LINK, ANYONE_IN_COMPANY, PEOPLE_IN_ITEM } from '../constants';
import SharedLinkAccessDescription from '../SharedLinkAccessDescription';

describe('features/unified-share-modal/SharedLinkAccessDescription', () => {
    describe('people with link', () => {
        [
            {
                itemType: 'file',
            },
            {
                itemType: 'folder',
            },
            {
                itemType: 'hub',
            },
        ].forEach(({ itemType }) => {
            test('should render correct description', () => {
                const wrapper = shallow(
                    <SharedLinkAccessDescription
                        accessLevel={ANYONE_WITH_LINK}
                        enterpriseName="Box"
                        itemType={itemType}
                    />,
                );

                expect(wrapper).toMatchSnapshot();
            });
        });
    });

    describe('people in company', () => {
        [
            {
                itemType: 'file',
                name: '',
            },
            {
                itemType: 'file',
                name: 'Box',
            },
            {
                itemType: 'folder',
                name: '',
            },
            {
                itemType: 'folder',
                name: 'Box',
            },
            {
                itemType: 'hub',
                name: '',
            },
            {
                itemType: 'hub',
                name: 'Box',
            },
        ].forEach(({ itemType, name }) => {
            test('should render correct description', () => {
                const wrapper = shallow(
                    <SharedLinkAccessDescription
                        accessLevel={ANYONE_IN_COMPANY}
                        enterpriseName={name}
                        itemType={itemType}
                    />,
                );

                expect(wrapper).toMatchSnapshot();
            });
        });
    });

    describe('people in item', () => {
        [
            {
                itemType: 'file',
            },
            {
                itemType: 'folder',
            },
            {
                itemType: 'hub',
            },
        ].forEach(({ itemType }) => {
            test('should render correct description', () => {
                const wrapper = shallow(
                    <SharedLinkAccessDescription
                        accessLevel={PEOPLE_IN_ITEM}
                        enterpriseName="Box"
                        itemType={itemType}
                    />,
                );

                expect(wrapper).toMatchSnapshot();
            });
        });
    });
});
