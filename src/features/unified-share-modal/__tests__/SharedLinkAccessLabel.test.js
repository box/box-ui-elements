import React from 'react';

import * as constants from '../constants';
import SharedLinkAccessLabel from '../SharedLinkAccessLabel';

describe('features/unified-share-modal/SharedLinkAccessLabel', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <SharedLinkAccessLabel
                enterpriseName="ABC, Inc."
                isDownloadAllowed
                isEditAllowed
                isPreviewAllowed
                {...props}
            />,
        );

    test('should render the component with default prop values', () => {
        expect(getWrapper()).toMatchSnapshot();
    });

    [
        {
            accessLevel: constants.ANYONE_IN_COMPANY,
        },
        {
            accessLevel: constants.ANYONE_WITH_LINK,
        },
        {
            accessLevel: constants.PEOPLE_IN_ITEM,
        },
    ].forEach(({ accessLevel }) => {
        test('should respect the access level when a description is applied', () => {
            const wrapper = getWrapper({
                accessLevel,
                itemType: 'file',
                hasDescription: true,
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should respect the access level when there is no description applied', () => {
            const wrapper = getWrapper({
                accessLevel,
                itemType: 'file',
                hasDescription: false,
            });

            expect(wrapper).toMatchSnapshot();
        });
    });

    test('should render without enterprise name when handling people in company', () => {
        const wrapper = getWrapper({
            accessLevel: constants.ANYONE_IN_COMPANY,
            itemType: 'file',
            enterpriseName: '',
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render with enterprise name when handling people in company', () => {
        const wrapper = getWrapper({
            accessLevel: constants.ANYONE_IN_COMPANY,
            itemType: 'file',
            enterpriseName: 'Box',
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should respect item type folder when handling people in the file', () => {
        const wrapper = getWrapper({
            accessLevel: constants.PEOPLE_IN_ITEM,
            itemType: 'file',
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should respect item type folder when handling people in the folder', () => {
        const wrapper = getWrapper({
            accessLevel: constants.PEOPLE_IN_ITEM,
            itemType: 'folder',
        });

        expect(wrapper).toMatchSnapshot();
    });
});
